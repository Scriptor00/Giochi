using GiochiPreferiti.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Serilog;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configura Serilog per il logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.File("C:\\LogsGiochi\\app-log-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .MinimumLevel.Debug()
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Host.UseSerilog();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Aggiungi i controller per la Web API
builder.Services.AddControllers();

// 3. Configura Swagger/OpenAPI per la documentazione API (utile in sviluppo)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Configurazione CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            // Per lo sviluppo, specifica l'origine esatta del tuo frontend React.
            // NON USARE AllowAnyOrigin() insieme a AllowCredentials()!
            // L'URL predefinito di Vite (React) è http://localhost:5173.
            // Se il tuo frontend gira su una porta diversa, CAMBIALA QUI!
            policy.WithOrigins("http://localhost:5173") // <-- Controlla la porta del tuo React dev server!
                  .AllowAnyHeader()    // Permette qualsiasi header nelle richieste
                  .AllowAnyMethod()    // Permette qualsiasi metodo HTTP (GET, POST, PUT, DELETE)
                  .AllowCredentials(); // Permette l'invio di credenziali (es. cookies, header di autorizzazione)

            // Se in futuro avrai bisogno di altre origini (es. per produzione), aggiungile qui:
            // policy.WithOrigins("https://tuodominiofrontend.com", "https://altrodominio.com")
            //       .AllowAnyHeader()
            //       .AllowAnyMethod()
            //       .AllowCredentials();

            // Rimuovi o commenta questo blocco, altrimenti genera l'errore se AllowCredentials() è presente.
            // if (builder.Environment.IsDevelopment())
            // {
            //     policy.AllowAnyOrigin() // Questo è il problema se AllowCredentials() è abilitato
            //           .AllowAnyHeader()
            //           .AllowAnyMethod();
            // }
            // else
            // {
            //     // In produzione, Sii SEMPRE SPECIFICO con le origini per sicurezza!
            //     // Esempio per produzione, se con credenziali:
            //     // policy.WithOrigins("https://tuodominiofrontend.com")
            //     //       .AllowAnyHeader()
            //     //       .AllowAnyMethod()
            //     //       .AllowCredentials();
            // }
        });
});


var app = builder.Build();

// Configura il pipeline di richieste HTTP.

// 1. Configurazione Swagger UI per l'ambiente di sviluppo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Reindirizzamento HTTPS (buona pratica)
app.UseHttpsRedirection();

// 3. Abilita il routing per far corrispondere le richieste agli endpoint
app.UseRouting();

// 4. Abilita CORS. Deve essere DOPO UseRouting() e PRIMA di UseAuthorization() e MapControllers().
app.UseCors(); // Applica la DefaultPolicy definita sopra

// 5. Abilita l'autorizzazione (se userai l'autenticazione/autorizzazione)
app.UseAuthorization();

// 6. Mappa i controller alle richieste HTTP
app.MapControllers();

// Avvia l'applicazione
app.Run();
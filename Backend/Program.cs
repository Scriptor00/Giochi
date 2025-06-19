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
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()    // Permette qualsiasi header nelle richieste
                  .AllowAnyMethod()    // Permette qualsiasi metodo HTTP (GET, POST, PUT, DELETE)
                  .AllowCredentials(); // Permette l'invio di credenziali (es. cookies, header di autorizzazione)

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

 app.MapGet("/", () => Results.Content(
        "<html><body><h1>Benvenuto nel Backend!</h1><p>Questa pagina racchiude le API per la mia collezione di giochi.</p><p>Consulta la documentazione API a <a href=\"/swagger\">/swagger</a></p></body></html>", 
        "text/html"));

// 6. Mappa i controller alle richieste HTTP
app.MapControllers();

// Avvia l'applicazione
app.Run();


using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks; 
using GiochiPreferiti.Models; 
using GiochiPreferiti.Data;  
using Microsoft.EntityFrameworkCore; 
using System.Linq; 
using Microsoft.Extensions.Logging; 

[ApiController]
[Route("[controller]")] 
public class GiochiController : ControllerBase
{
    private readonly ApplicationDbContext _context; 
    private readonly ILogger<GiochiController> _logger; 

    public GiochiController(ApplicationDbContext context, ILogger<GiochiController> logger)
    {
        _context = context;
        _logger = logger; 
    }

    // GET: /giochi
    // Questo metodo accetta parametri per completamento, lista desideri, ricerca generica, anno e ordinamento.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Gioco>>> GetGiochi(
        [FromQuery] bool? completato = null,
        [FromQuery] bool? inListaDesideri = null,
        [FromQuery] string? searchTerm = null,  
        [FromQuery] int? filterYear = null,     
        [FromQuery] string? sortField = "Nome", 
        [FromQuery] string? sortOrder = "asc")  
    {
        _logger.LogInformation("Richiesta GET per Giochi. Filtri: Completato={Completato}, InListaDesideri={InListaDesideri}, SearchTerm='{SearchTerm}', FilterYear={FilterYear}, SortField='{SortField}', SortOrder='{SortOrder}'.",
            completato, inListaDesideri, searchTerm, filterYear, sortField, sortOrder);

        IQueryable<Gioco> query = _context.Giochi;

        // --- APPLICAZIONE DEI FILTRI ---

        if (completato.HasValue)
        {
            query = query.Where(g => g.Completato == completato.Value);
            _logger.LogDebug("Filtro applicato: Completato={Completato}.", completato.Value);
        }

        if (inListaDesideri.HasValue)
        {
            query = query.Where(g => g.InListaDesideri == inListaDesideri.Value);
            _logger.LogDebug("Filtro applicato: InListaDesideri={InListaDesideri}.", inListaDesideri.Value);
        }

        // Filtro per ricerca testuale (searchTerm)
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            string lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(g =>
                (g.Nome != null && g.Nome.ToLower().Contains(lowerSearchTerm)) ||
                (g.Genere != null && g.Genere.ToLower().Contains(lowerSearchTerm)) ||
                (g.Trama != null && g.Trama.ToLower().Contains(lowerSearchTerm)) ||
                (g.Piattaforma != null && g.Piattaforma.ToLower().Contains(lowerSearchTerm))
            );
            _logger.LogDebug("Filtro di ricerca testuale applicato: '{SearchTerm}'.", searchTerm);
        }

        // Filtro per anno di pubblicazione
        if (filterYear.HasValue && filterYear.Value > 0)
        {
            query = query.Where(g => g.DataPubblicazione.Year == filterYear.Value);
            _logger.LogDebug("Filtro per anno di pubblicazione applicato: {FilterYear}.", filterYear.Value);
        }

        // --- APPLICAZIONE DELL'ORDINAMENTO ---

        string effectiveSortField = sortField?.ToLower() ?? "nome";
        string effectiveSortOrder = sortOrder?.ToLower() ?? "asc";

        switch (effectiveSortField) 
        {
            case "datarelease": 
            case "datapubblicazione":
                query = (effectiveSortOrder == "desc") ? 
                        query.OrderByDescending(g => g.DataPubblicazione) : 
                        query.OrderBy(g => g.DataPubblicazione);
                _logger.LogDebug("Ordinamento applicato per DataPubblicazione: {SortOrder}.", effectiveSortOrder);
                break;
            case "votopersonale":
                query = (effectiveSortOrder == "desc") ? 
                        query.OrderByDescending(g => g.VotoPersonale) : 
                        query.OrderBy(g => g.VotoPersonale);
                _logger.LogDebug("Ordinamento applicato per VotoPersonale: {SortOrder}.", effectiveSortOrder);
                break;
            case "nome": 
            default:
                query = (effectiveSortOrder == "desc") ? 
                        query.OrderByDescending(g => g.Nome) : 
                        query.OrderBy(g => g.Nome);
                _logger.LogDebug("Ordinamento applicato per Nome: {SortOrder}.", effectiveSortOrder);
                break;
        }

        var giochiQueryResult = await query.AsNoTracking().ToListAsync();
        _logger.LogInformation("Restituiti {Count} giochi.", giochiQueryResult.Count);
        return giochiQueryResult;
    }

    // GET: /giochi/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Gioco>> GetGioco(int id) 
    {
        _logger.LogInformation("Richiesta GET per Gioco con ID: {GiocoId}.", id);
        var gioco = await _context.Giochi.FindAsync(id);
        if (gioco == null)
        {
            _logger.LogWarning("Gioco con ID: {GiocoId} non trovato.", id);
            return NotFound();
        }
        _logger.LogInformation("Gioco '{NomeGioco}' (ID: {GiocoId}) trovato e restituito.", gioco.Nome, gioco.Id);
        return gioco;
    }

    [HttpPost]
    public async Task<ActionResult<Gioco>> PostGioco(Gioco gioco)
    {
        _logger.LogInformation("Richiesta POST per aggiungere un nuovo gioco: '{NomeGioco}'.", gioco.Nome);
        if (!ModelState.IsValid)
        {
            _logger.LogWarning("Tentativo di aggiungere un gioco non valido. Errore ModelState: {ModelStateErrors}", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(ModelState);
        }

        try
        {
            _context.Giochi.Add(gioco);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Gioco '{NomeGioco}' (ID: {GiocoId}) aggiunto con successo.", gioco.Nome, gioco.Id);
            return CreatedAtAction(nameof(GetGioco), new { id = gioco.Id }, gioco);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore critico durante l'aggiunta del gioco '{NomeGioco}'.", gioco.Nome);
            return StatusCode(500, "Errore interno del server durante l'aggiunta del gioco.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutGioco(int id, Gioco gioco)
    {
        _logger.LogInformation("Richiesta PUT per aggiornare Gioco con ID: {GiocoId}.", id);

        if (id != gioco.Id)
        {
            _logger.LogWarning("ID non corrispondente tra URL ({UrlId}) e corpo della richiesta ({BodyId}) per l'aggiornamento del gioco.", id, gioco.Id);
            return BadRequest("ID del gioco non corrisponde all'oggetto fornito."); 
        }

        // Il metodo FindAsync recupera l'entità dal contesto di tracciamento o dal database.
        var existingGioco = await _context.Giochi.FindAsync(id);
        if (existingGioco == null)
        {
            _logger.LogWarning("Gioco con ID {GiocoId} non trovato per l'aggiornamento.", id);
            return NotFound();
        }

        existingGioco.Nome = gioco.Nome;
        existingGioco.DataPubblicazione = gioco.DataPubblicazione;
        existingGioco.UrlImmagine = gioco.UrlImmagine;
        existingGioco.Trama = gioco.Trama;
        existingGioco.Genere = gioco.Genere;
        existingGioco.Piattaforma = gioco.Piattaforma;
        existingGioco.Completato = gioco.Completato;
        existingGioco.VotoPersonale = gioco.VotoPersonale;
        existingGioco.InListaDesideri = gioco.InListaDesideri;
        existingGioco.CommentoPersonale = gioco.CommentoPersonale; 

        _context.Entry(existingGioco).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Gioco '{NomeGioco}' (ID: {GiocoId}) aggiornato con successo.", existingGioco.Nome, existingGioco.Id);
            return NoContent();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            if (!GiocoExists(id)) 
            {
                _logger.LogWarning(ex, "DbUpdateConcurrencyException: Gioco con ID {GiocoId} non trovato dopo l'eccezione di concorrenza (potrebbe essere stato eliminato).", id);
                return NotFound();
            }
            else
            {
                _logger.LogError(ex, "Errore di concorrenza durante l'aggiornamento del gioco '{NomeGioco}' (ID: {GiocoId}).", existingGioco.Nome, existingGioco.Id);
                throw; 
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore critico durante l'aggiornamento del gioco '{NomeGioco}' (ID: {GiocoId}).", existingGioco.Nome, existingGioco.Id);
            return StatusCode(500, "Errore interno del server durante l'aggiornamento del gioco.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGioco(int id)
    {
        _logger.LogInformation("Richiesta DELETE per Gioco con ID: {GiocoId}.", id);
        var gioco = await _context.Giochi.FindAsync(id);
        if (gioco == null)
        {
            _logger.LogWarning("Tentativo di eliminare gioco con ID {GiocoId} non trovato.", id);
            return NotFound();
        }

        try
        {
            _context.Giochi.Remove(gioco);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Gioco '{NomeGioco}' (ID: {GiocoId}) eliminato con successo.", gioco.Nome, gioco.Id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Errore critico durante l'eliminazione del gioco '{NomeGioco}' (ID: {GiocoId}).", gioco.Nome, gioco.Id);
            return StatusCode(500, "Errore interno del server durante l'eliminazione del gioco.");
        }
    }

    private bool GiocoExists(int id)
    {
        return _context.Giochi.Any(e => e.Id == id);
    }
}

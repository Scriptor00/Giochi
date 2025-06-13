using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks; 
using GiochiPreferiti.Models; 
using GiochiPreferiti.Data;  
using Microsoft.EntityFrameworkCore; 
using System.Linq; 

[ApiController]
[Route("[controller]")] 
public class GiochiController : ControllerBase
{
    private readonly ApplicationDbContext _context; 

    public GiochiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /giochi
    // Questo metodo accetta parametri per completamento, lista desideri, ricerca generica, anno e ordinamento.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Gioco>>> GetGiochi(
        [FromQuery] bool? completato = null,
        [FromQuery] bool? inListaDesideri = null,
        [FromQuery] string? searchTerm = null,  //  parametro per la ricerca testuale
        [FromQuery] int? filterYear = null,     //  parametro per l'anno di pubblicazione
        [FromQuery] string? sortField = "Nome", //  campo per l'ordinamento, default "Nome"
        [FromQuery] string? sortOrder = "asc")  //  direzione dell'ordinamento, default "asc"
    {
        IQueryable<Gioco> query = _context.Giochi;

        // --- APPLICAZIONE DEI FILTRI ---

        if (completato.HasValue)
        {
            query = query.Where(g => g.Completato == completato.Value);
        }

        if (inListaDesideri.HasValue)
        {
            query = query.Where(g => g.InListaDesideri == inListaDesideri.Value);
        }

        // Filtro per ricerca testuale (searchTerm)
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            // La ricerca è case-insensitive
            string lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(g =>
                (g.Nome != null && g.Nome.ToLower().Contains(lowerSearchTerm)) ||
                (g.Genere != null && g.Genere.ToLower().Contains(lowerSearchTerm)) ||
                (g.Trama != null && g.Trama.ToLower().Contains(lowerSearchTerm)) ||
                (g.Piattaforma != null && g.Piattaforma.ToLower().Contains(lowerSearchTerm))
            );
        }

        // Filtro per anno di pubblicazione
        if (filterYear.HasValue && filterYear.Value > 0)
        {
            query = query.Where(g => g.DataPubblicazione.Year == filterYear.Value);
        }

        // --- APPLICAZIONE DELL'ORDINAMENTO ---

        // Valuta il campo di ordinamento e la direzione
        switch (sortField?.ToLower()) 
        {
            case "datarelease": 
            case "datapubblicazione":
                query = (sortOrder?.ToLower() == "desc") ? 
                        query.OrderByDescending(g => g.DataPubblicazione) : 
                        query.OrderBy(g => g.DataPubblicazione);
                break;
            case "votopersonale":
                query = (sortOrder?.ToLower() == "desc") ? 
                        query.OrderByDescending(g => g.VotoPersonale) : 
                        query.OrderBy(g => g.VotoPersonale);
                break;
            case "nome": // Default: ordina per nome
            default:
                query = (sortOrder?.ToLower() == "desc") ? 
                        query.OrderByDescending(g => g.Nome) : 
                        query.OrderBy(g => g.Nome);
                break;
        }

        return await query.AsNoTracking().ToListAsync();
    }

    // GET: /giochi/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Gioco>> GetGioco(int id) 
    {
        var gioco = await _context.Giochi.FindAsync(id);
        if (gioco == null)
        {
            return NotFound();
        }
        return gioco;
    }

    [HttpPost]
    public async Task<ActionResult<Gioco>> PostGioco(Gioco gioco)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Giochi.Add(gioco);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGioco), new { id = gioco.Id }, gioco);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutGioco(int id, Gioco gioco)
    {
        if (id != gioco.Id)
        {
            return BadRequest("ID del gioco non corrisponde all'oggetto fornito."); 
        }

        _context.Entry(gioco).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!GiocoExists(id)) 
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGioco(int id)
    {
        var gioco = await _context.Giochi.FindAsync(id);
        if (gioco == null)
        {
            return NotFound();
        }

        _context.Giochi.Remove(gioco);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool GiocoExists(int id)
    {
        return _context.Giochi.Any(e => e.Id == id);
    }
}

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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Gioco>>> GetGiochi(
        [FromQuery] bool? completato = null,
        [FromQuery] bool? inListaDesideri = null)
    {
        IQueryable<Gioco> query = _context.Giochi;

        // Filtra i giochi in base alla proprietà Completato se il parametro è fornito
        // Se completato è null, non applica il filtro
        if (completato.HasValue)
        {
            query = query.Where(g => g.Completato == completato.Value);
        }

        // Filtra i giochi in base alla proprietà InListaDesideri se il parametro è fornito
        // Se inListaDesideri è null, non applica il filtro
        if (inListaDesideri.HasValue)
        {
            query = query.Where(g => g.InListaDesideri == inListaDesideri.Value);
        }

        return await query.AsNoTracking().ToListAsync();
    }

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

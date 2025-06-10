using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks; 
using GiochiPreferiti.Models; // <-- AGGIUNGI QUESTA RIGA per la classe Gioco
using GiochiPreferiti.Data;   // <-- AGGIUNGI QUESTA RIGA per ApplicationDbContext
using Microsoft.EntityFrameworkCore; // <-- AGGIUNGI QUESTA RIGA per EntityState e DbUpdateConcurrencyException
using System.Linq; // <-- AGGIUNGI QUESTA RIGA per il metodo Any()

[ApiController]
[Route("[controller]")] // Questo mapperà il controller a /giochi
public class GiochiController : ControllerBase
{
    private readonly ApplicationDbContext _context; 

    public GiochiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /giochi
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Gioco>>> GetGiochi()
    {
        return await _context.Giochi.ToListAsync();
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
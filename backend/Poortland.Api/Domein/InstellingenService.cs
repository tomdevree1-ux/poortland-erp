using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

public class InstellingenService(PoortlandDbContext db)
{
    public async Task<int> Getal(string sleutel, int standaard)
    {
        var rij = await db.Instellingen.AsNoTracking().FirstOrDefaultAsync(i => i.Sleutel == sleutel);
        if (rij is null) return standaard;
        return JsonSerializer.Deserialize<int?>(rij.Waarde) ?? standaard;
    }

    public async Task<string?> Tekst(string sleutel)
    {
        var rij = await db.Instellingen.AsNoTracking().FirstOrDefaultAsync(i => i.Sleutel == sleutel);
        if (rij is null) return null;
        try { return JsonSerializer.Deserialize<string>(rij.Waarde); }
        catch { return rij.Waarde; }
    }
}

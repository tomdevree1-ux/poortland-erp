using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// TS-07 Productie en stuklijst: het digitale productiedossier. De stuklijst
// heeft versiebeheer (1 actieve per project), onderdelen volgen de
// behandelingsketen en tekeningen zijn PDF's in een private bucket.
[ApiController]
[Route("api/v1")]
[Authorize]
public class ProductieController(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag) : ControllerBase
{
    const string BucketTekeningen = "tekeningen";
    const long MaxTekeningBytes = 25 * 1024 * 1024;

    public record OnderdeelInvoer(string Productcode, string? Omschrijving, string? Afmetingen, string? Materiaal,
        bool? VoorbehandelingVanToepassing, bool? LakwerkVanToepassing,
        Guid? LeverancierVoorbehandelingId, Guid? LeverancierLakwerkId,
        string? LakwerkRal, DateOnly? EtaVoorbehandeling, DateOnly? EtaLakwerk);
    public record StatusInvoer(OnderdeelStatus Status);
    public record LeverancierInvoer(string Naam, LeverancierType Type, string? Email, string? Telefoon, bool? IsActief);

    // De productiestatus per dossier is afgeleid uit de onderdelen (TS-07 sectie 4).
    static string ProductieStatus(List<Productieonderdeel> onderdelen)
    {
        if (onderdelen.Count == 0) return "inVoorbereiding";
        if (onderdelen.All(o => o.Status == OnderdeelStatus.Gemonteerd)) return "afgerond";
        if (onderdelen.All(o => o.Status is OnderdeelStatus.KlaarVoorMontage or OnderdeelStatus.Gemonteerd)) return "klaarVoorMontage";
        if (onderdelen.Any(o => o.Status is OnderdeelStatus.Voorbehandeling or OnderdeelStatus.Lakwerk)) return "externInBehandeling";
        return "inUitvoering";
    }

    [HttpGet("projecten/{projectId:guid}/productie")]
    public async Task<IActionResult> Dossier(Guid projectId)
    {
        var stuklijst = await db.Stuklijsten.AsNoTracking()
            .Include(s => s.Onderdelen.Where(o => o.VerwijderdOp == null).OrderBy(o => o.AangemaaktOp))
            .Where(s => s.ProjectId == projectId && s.VerwijderdOp == null && s.IsActief)
            .FirstOrDefaultAsync();
        var vorigeVersies = await db.Stuklijsten.AsNoTracking()
            .Where(s => s.ProjectId == projectId && s.VerwijderdOp == null && !s.IsActief)
            .OrderByDescending(s => s.VersieStuklijst)
            .Select(s => new { s.Id, s.VersieStuklijst, s.DatumOpmaak })
            .ToListAsync();
        var tekeningen = await db.Tekeningen.AsNoTracking()
            .Where(t => t.ProjectId == projectId && t.VerwijderdOp == null)
            .OrderByDescending(t => t.TekeningVersie).ThenByDescending(t => t.AangemaaktOp)
            .ToListAsync();
        var auteurs = await db.Medewerkers.AsNoTracking()
            .Where(m => tekeningen.Select(t => t.AuteurId).Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, m => ($"{m.Voornaam} {m.Naam}").Trim());
        var tekeningLijst = new List<object>();
        foreach (var t in tekeningen)
        {
            string? url = null;
            try { url = await opslag.SignedUrl(BucketTekeningen, t.BestandPad, 600); } catch { }
            tekeningLijst.Add(new { t.Id, t.TekeningVersie, t.Datum, t.Bestandsnaam,
                auteur = t.AuteurId is { } a && auteurs.TryGetValue(a, out var naam) ? naam : null, url });
        }
        var leveranciers = await db.Leveranciers.AsNoTracking()
            .Where(l => l.VerwijderdOp == null && l.IsActief).OrderBy(l => l.Naam).ToListAsync();
        return Ok(new
        {
            stuklijst = stuklijst is null ? null : new { stuklijst.Id, stuklijst.VersieStuklijst, stuklijst.DatumOpmaak },
            onderdelen = stuklijst?.Onderdelen ?? [],
            productieStatus = ProductieStatus(stuklijst?.Onderdelen ?? []),
            vorigeVersies,
            tekeningen = tekeningLijst,
            leveranciers = leveranciers.Select(l => new { l.Id, l.Naam, l.Type, l.Email, l.Telefoon })
        });
    }

    [HttpPost("projecten/{projectId:guid}/stuklijst")]
    [VereistRol("productie")]
    public async Task<IActionResult> MaakStuklijst(Guid projectId)
    {
        var bestaat = await db.Stuklijsten.AnyAsync(s => s.ProjectId == projectId && s.IsActief && s.VerwijderdOp == null);
        if (bestaat) return BadRequest(new { fout = "Dit dossier heeft al een actieve stuklijst." });
        var stuklijst = new Stuklijst
        {
            ProjectId = projectId, VersieStuklijst = 1, IsActief = true,
            DatumOpmaak = DateOnly.FromDateTime(DateTime.Today), AangemaaktDoor = claims.MedewerkerId
        };
        db.Stuklijsten.Add(stuklijst);
        await db.SaveChangesAsync();
        return Ok(new { stuklijst.Id, stuklijst.VersieStuklijst });
    }

    // Nieuwe versie: kopieert de onderdelen en zet de oude versie inactief (TS-01).
    [HttpPost("stuklijsten/{id:guid}/nieuwe-versie")]
    [VereistRol("productie")]
    public async Task<IActionResult> NieuweVersie(Guid id)
    {
        var oud = await db.Stuklijsten
            .Include(s => s.Onderdelen.Where(o => o.VerwijderdOp == null))
            .FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null)
            ?? throw new DomeinFout("Stuklijst niet gevonden.");
        if (!oud.IsActief) return BadRequest(new { fout = "Enkel de actieve stuklijst kan een nieuwe versie krijgen." });

        await using var transactie = await db.Database.BeginTransactionAsync();
        oud.IsActief = false;
        await db.SaveChangesAsync();

        var nieuw = new Stuklijst
        {
            ProjectId = oud.ProjectId, VersieStuklijst = oud.VersieStuklijst + 1, IsActief = true,
            DatumOpmaak = DateOnly.FromDateTime(DateTime.Today), AangemaaktDoor = claims.MedewerkerId
        };
        db.Stuklijsten.Add(nieuw);
        await db.SaveChangesAsync();

        foreach (var o in oud.Onderdelen)
            db.Productieonderdelen.Add(new Productieonderdeel
            {
                StuklijstId = nieuw.Id, Productcode = o.Productcode, Omschrijving = o.Omschrijving,
                Afmetingen = o.Afmetingen, Materiaal = o.Materiaal, Status = o.Status,
                VoorbehandelingVanToepassing = o.VoorbehandelingVanToepassing, LakwerkVanToepassing = o.LakwerkVanToepassing,
                LeverancierVoorbehandelingId = o.LeverancierVoorbehandelingId, LeverancierLakwerkId = o.LeverancierLakwerkId,
                LakwerkRal = o.LakwerkRal, EtaVoorbehandeling = o.EtaVoorbehandeling, EtaLakwerk = o.EtaLakwerk,
                AangemaaktDoor = claims.MedewerkerId
            });
        await db.SaveChangesAsync();
        await transactie.CommitAsync();
        return Ok(new { nieuw.Id, nieuw.VersieStuklijst });
    }

    [HttpPost("stuklijsten/{id:guid}/onderdelen")]
    [VereistRol("productie")]
    public async Task<IActionResult> MaakOnderdeel(Guid id, OnderdeelInvoer invoer)
    {
        var stuklijst = await db.Stuklijsten.FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null)
            ?? throw new DomeinFout("Stuklijst niet gevonden.");
        if (!stuklijst.IsActief) return BadRequest(new { fout = "Onderdelen horen bij de actieve stuklijst." });
        var onderdeel = new Productieonderdeel
        {
            StuklijstId = stuklijst.Id, Productcode = invoer.Productcode,
            Omschrijving = invoer.Omschrijving, Afmetingen = invoer.Afmetingen, Materiaal = invoer.Materiaal,
            VoorbehandelingVanToepassing = invoer.VoorbehandelingVanToepassing ?? true,
            LakwerkVanToepassing = invoer.LakwerkVanToepassing ?? true,
            LeverancierVoorbehandelingId = invoer.LeverancierVoorbehandelingId,
            LeverancierLakwerkId = invoer.LeverancierLakwerkId,
            LakwerkRal = invoer.LakwerkRal,
            EtaVoorbehandeling = invoer.EtaVoorbehandeling, EtaLakwerk = invoer.EtaLakwerk,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Productieonderdelen.Add(onderdeel);
        await db.SaveChangesAsync();
        return Ok(onderdeel);
    }

    [HttpPatch("onderdelen/{id:guid}")]
    [VereistRol("productie")]
    public async Task<IActionResult> WijzigOnderdeel(Guid id, OnderdeelInvoer invoer)
    {
        var onderdeel = await db.Productieonderdelen.FirstOrDefaultAsync(o => o.Id == id && o.VerwijderdOp == null);
        if (onderdeel is null) return NotFound();
        onderdeel.Productcode = invoer.Productcode;
        onderdeel.Omschrijving = invoer.Omschrijving;
        onderdeel.Afmetingen = invoer.Afmetingen;
        onderdeel.Materiaal = invoer.Materiaal;
        if (invoer.VoorbehandelingVanToepassing is { } v) onderdeel.VoorbehandelingVanToepassing = v;
        if (invoer.LakwerkVanToepassing is { } l) onderdeel.LakwerkVanToepassing = l;
        onderdeel.LeverancierVoorbehandelingId = invoer.LeverancierVoorbehandelingId;
        onderdeel.LeverancierLakwerkId = invoer.LeverancierLakwerkId;
        onderdeel.LakwerkRal = invoer.LakwerkRal;
        onderdeel.EtaVoorbehandeling = invoer.EtaVoorbehandeling;
        onderdeel.EtaLakwerk = invoer.EtaLakwerk;
        await db.SaveChangesAsync();
        return Ok(onderdeel);
    }

    // FR-008: de databank bewaakt de overgang; bij klaar voor montage van het
    // hele dossier volgt de gereedmelding naar de planners (TS-07 sectie 4).
    [HttpPost("onderdelen/{id:guid}/status")]
    [VereistRol("productie", "montage")]
    public async Task<IActionResult> ZetStatus(Guid id, StatusInvoer invoer)
    {
        var onderdeel = await db.Productieonderdelen.FirstOrDefaultAsync(o => o.Id == id && o.VerwijderdOp == null);
        if (onderdeel is null) return NotFound();
        onderdeel.Status = invoer.Status;
        await db.SaveChangesAsync();

        var stuklijst = await db.Stuklijsten.AsNoTracking()
            .Include(s => s.Onderdelen.Where(o => o.VerwijderdOp == null))
            .FirstAsync(s => s.Id == onderdeel.StuklijstId);
        var status = ProductieStatus(stuklijst.Onderdelen);
        if (status == "klaarVoorMontage")
        {
            var project = await db.Projecten.AsNoTracking().Include(p => p.Klant)
                .FirstAsync(p => p.Id == stuklijst.ProjectId);
            var planners = await db.MedewerkerRollen.AsNoTracking()
                .Where(r => r.Rol == Rol.Planning)
                .Select(r => r.MedewerkerId).Distinct().ToListAsync();
            var alGemeld = await db.Notificaties.AnyAsync(n =>
                n.EntiteitType == "project" && n.EntiteitId == project.Id && n.Type == "klaar_voor_montage");
            if (!alGemeld)
            {
                foreach (var planner in planners)
                    db.Notificaties.Add(new Notificatie
                    {
                        MedewerkerId = planner, Type = "klaar_voor_montage",
                        Titel = $"Dossier {project.Nummer} klaar voor montage",
                        Boodschap = $"Alle onderdelen van {project.Werfadres} zijn klaar voor montage. Plan de plaatsing in.",
                        EntiteitType = "project", EntiteitId = project.Id,
                        AangemaaktDoor = claims.MedewerkerId
                    });
                await db.SaveChangesAsync();
            }
        }
        return Ok(new { onderdeel.Id, onderdeel.Status, productieStatus = status });
    }

    [HttpDelete("onderdelen/{id:guid}")]
    [VereistRol("productie")]
    public async Task<IActionResult> VerwijderOnderdeel(Guid id)
    {
        var onderdeel = await db.Productieonderdelen.FirstOrDefaultAsync(o => o.Id == id && o.VerwijderdOp == null);
        if (onderdeel is null) return NotFound();
        onderdeel.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { onderdeel.Id, verwijderd = true });
    }

    [HttpGet("leveranciers")]
    public async Task<IActionResult> Leveranciers() =>
        Ok(await db.Leveranciers.AsNoTracking()
            .Where(l => l.VerwijderdOp == null).OrderBy(l => l.Naam).ToListAsync());

    [HttpPost("leveranciers")]
    [VereistRol("productie")]
    public async Task<IActionResult> MaakLeverancier(LeverancierInvoer invoer)
    {
        var leverancier = new Leverancier
        {
            Naam = invoer.Naam, Type = invoer.Type, Email = invoer.Email, Telefoon = invoer.Telefoon,
            IsActief = invoer.IsActief ?? true, AangemaaktDoor = claims.MedewerkerId
        };
        db.Leveranciers.Add(leverancier);
        await db.SaveChangesAsync();
        return Ok(leverancier);
    }

    // FR-007: PDF tekening met metadata, privaat bewaard met signed urls.
    [HttpPost("projecten/{projectId:guid}/tekeningen")]
    [VereistRol("productie", "verkoop")]
    [RequestSizeLimit(30 * 1024 * 1024)]
    public async Task<IActionResult> UploadTekening(Guid projectId, [FromForm] IFormFile bestand, [FromForm] int? versie)
    {
        if (bestand.ContentType != "application/pdf")
            return BadRequest(new { fout = "Tekeningen zijn PDF bestanden." });
        if (bestand.Length == 0 || bestand.Length > MaxTekeningBytes)
            return BadRequest(new { fout = "Maximaal 25 MB per tekening." });

        var hoogste = await db.Tekeningen
            .Where(t => t.ProjectId == projectId && t.VerwijderdOp == null)
            .MaxAsync(t => (int?)t.TekeningVersie) ?? 0;
        var tekening = new Tekening
        {
            Id = Guid.NewGuid(), ProjectId = projectId,
            TekeningVersie = versie ?? hoogste + 1,
            Datum = DateOnly.FromDateTime(DateTime.Today),
            AuteurId = claims.MedewerkerId,
            Bestandsnaam = bestand.FileName,
            AangemaaktDoor = claims.MedewerkerId
        };
        tekening.BestandPad = $"{projectId}/{tekening.Id}.pdf";

        using var geheugen = new MemoryStream();
        await bestand.CopyToAsync(geheugen);
        var bytes = geheugen.ToArray();
        // Inhoud controleren, niet de header (audit sectie 7): echt een PDF of niets.
        if (!Poortland.Api.Domein.Bestandsvalidatie.IsGeldigePdf(bytes))
            return BadRequest(new { fout = "Dit bestand is geen geldige PDF." });
        await opslag.Upload(BucketTekeningen, tekening.BestandPad, bytes, "application/pdf");

        db.Tekeningen.Add(tekening);
        await db.SaveChangesAsync();
        return Ok(new { tekening.Id, tekening.TekeningVersie, tekening.Bestandsnaam });
    }

    [HttpDelete("tekeningen/{id:guid}")]
    [VereistRol("productie")]
    public async Task<IActionResult> VerwijderTekening(Guid id)
    {
        var tekening = await db.Tekeningen.FirstOrDefaultAsync(t => t.Id == id && t.VerwijderdOp == null);
        if (tekening is null) return NotFound();
        tekening.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { tekening.Id, verwijderd = true });
    }
}

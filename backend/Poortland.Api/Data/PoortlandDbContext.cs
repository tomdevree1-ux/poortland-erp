using Microsoft.EntityFrameworkCore;
using Npgsql;

// Bouwmarker om de Docker-laagcache te doorbreken: v14 koopjes en vacatures op de website (2026-10-15).
namespace Poortland.Api.Data;

public class PoortlandDbContext(DbContextOptions<PoortlandDbContext> opties) : DbContext(opties)
{
    public DbSet<Medewerker> Medewerkers => Set<Medewerker>();
    public DbSet<MedewerkerRol> MedewerkerRollen => Set<MedewerkerRol>();
    public DbSet<Klant> Klanten => Set<Klant>();
    public DbSet<Contactpersoon> Contactpersonen => Set<Contactpersoon>();
    public DbSet<Contactmoment> Contactmomenten => Set<Contactmoment>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadBijlage> LeadBijlagen => Set<LeadBijlage>();
    public DbSet<Fotobericht> Fotoberichten => Set<Fotobericht>();
    public DbSet<Koopje> Koopjes => Set<Koopje>();
    public DbSet<KoopjeFoto> KoopjeFotos => Set<KoopjeFoto>();
    public DbSet<Vacature> Vacatures => Set<Vacature>();
    public DbSet<FotoberichtBijlage> FotoberichtBijlagen => Set<FotoberichtBijlage>();
    public DbSet<Project> Projecten => Set<Project>();
    public DbSet<Artikel> Artikelen => Set<Artikel>();
    public DbSet<Offerte> Offertes => Set<Offerte>();
    public DbSet<Offerteregel> Offerteregels => Set<Offerteregel>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Opvolgtaak> Opvolgtaken => Set<Opvolgtaak>();
    public DbSet<Communicatie> Communicaties => Set<Communicatie>();
    public DbSet<Notificatie> Notificaties => Set<Notificatie>();
    public DbSet<WebsiteMedia> WebsiteMedias => Set<WebsiteMedia>();
    public DbSet<WebsitePopup> WebsitePopups => Set<WebsitePopup>();
    public DbSet<Instelling> Instellingen => Set<Instelling>();
    public DbSet<Leverancier> Leveranciers => Set<Leverancier>();
    public DbSet<Stuklijst> Stuklijsten => Set<Stuklijst>();
    public DbSet<Productieonderdeel> Productieonderdelen => Set<Productieonderdeel>();
    public DbSet<Tekening> Tekeningen => Set<Tekening>();
    public DbSet<Ploeg> Ploegen => Set<Ploeg>();
    public DbSet<PloegLid> PloegLeden => Set<PloegLid>();
    public DbSet<Planningsitem> Planningsitems => Set<Planningsitem>();
    public DbSet<Werkbon> Werkbonnen => Set<Werkbon>();
    public DbSet<Werkbonregel> Werkbonregels => Set<Werkbonregel>();
    public DbSet<Werkbonfoto> Werkbonfotos => Set<Werkbonfoto>();
    public DbSet<Servicedossier> Servicedossiers => Set<Servicedossier>();
    public DbSet<Factuurvoorstel> Factuurvoorstellen => Set<Factuurvoorstel>();
    public DbSet<Factuurvoorstelregel> Factuurvoorstelregels => Set<Factuurvoorstelregel>();

    // Identiteit (request.jwt.claims) TRANSACTIONEEL op de schrijfverbinding zetten,
    // vlak voor ELKE save. We openen desnoods een eigen transactie zodat set_config
    // (LOCAL) gegarandeerd op exact de verbinding en transactie van de save staat.
    // Zonder dit kan een pooled verbinding de eerder gezette identiteit kwijt zijn en
    // weigert RLS de actie (42501, "onvoldoende rechten"), ook al kloppen de rechten.
    // De ClaimsContext is dezelfde instantie die de middleware invult, dus we hebben
    // de HttpContext hier niet nodig (die is bij het schrijven niet altijd beschikbaar).
    // De middleware zet hier de identiteit (request.jwt.claims-JSON) rechtstreeks op
    // DEZE context-instantie. Middleware en controller delen dezelfde scoped context,
    // dus dit is met zekerheid beschikbaar bij het schrijven. Geen omweg via DI of
    // HttpContext, die bij het schrijven een lege waarde konden geven.
    public string? IdentiteitJson { get; set; }

    // Primair de ambient waarde (stroomt mee met het verzoek), anders de contextwaarde.
    string? HuidigeIdentiteit => Poortland.Api.Auth.Identiteit.Json.Value ?? IdentiteitJson;

    public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken ct = default)
    {
        var json = HuidigeIdentiteit;
        if (string.IsNullOrEmpty(json)) return await base.SaveChangesAsync(acceptAllChangesOnSuccess, ct);
        var eigenTx = Database.CurrentTransaction is null ? await Database.BeginTransactionAsync(ct) : null;
        try
        {
            await Database.ExecuteSqlAsync(
                $"select set_config('request.jwt.claims', {json}, true)", ct);
            var aantal = await base.SaveChangesAsync(acceptAllChangesOnSuccess, ct);
            if (eigenTx is not null) await eigenTx.CommitAsync(ct);
            return aantal;
        }
        finally { if (eigenTx is not null) await eigenTx.DisposeAsync(); }
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        var json = HuidigeIdentiteit;
        if (string.IsNullOrEmpty(json)) return base.SaveChanges(acceptAllChangesOnSuccess);
        var eigenTx = Database.CurrentTransaction is null ? Database.BeginTransaction() : null;
        try
        {
            Database.ExecuteSql($"select set_config('request.jwt.claims', {json}, true)");
            var aantal = base.SaveChanges(acceptAllChangesOnSuccess);
            eigenTx?.Commit();
            return aantal;
        }
        finally { eigenTx?.Dispose(); }
    }

    public static NpgsqlDataSource MaakDataSource(string connectionString)
    {
        var b = new NpgsqlDataSourceBuilder(connectionString);
        b.MapEnum<Rol>("rol");
        b.MapEnum<KlantType>("klant_type");
        b.MapEnum<Taal>("taal");
        b.MapEnum<LeadKanaal>("lead_kanaal");
        b.MapEnum<LeadStatus>("lead_status");
        b.MapEnum<OfferteStatus>("offerte_status");
        b.MapEnum<OfferteSoort>("offerte_soort");
        b.MapEnum<FotoberichtStatus>("fotobericht_status");
        b.MapEnum<KoopjeStatus>("koopje_status");
        b.MapEnum<VacatureStatus>("vacature_status");
        b.MapEnum<OrderStatus>("order_status");
        b.MapEnum<BtwTarief>("btw_tarief");
        b.MapEnum<OpvolgtaakStatus>("opvolgtaak_status");
        b.MapEnum<OpvolgtaakType>("opvolgtaak_type");
        b.MapEnum<WebsiteContentStatus>("website_content_status");
        b.MapEnum<ArtikelEenheid>("artikel_eenheid");
        b.MapEnum<CommunicatieStatus>("communicatie_status");
        b.MapEnum<OnderdeelStatus>("onderdeel_status");
        b.MapEnum<LeverancierType>("leverancier_type");
        b.MapEnum<Projectfase>("projectfase");
        b.MapEnum<WerkbonStatus>("werkbon_status");
        b.MapEnum<WerkbonType>("werkbon_type");
        b.MapEnum<ServicedossierStatus>("servicedossier_status");
        b.MapEnum<FactuurStatus>("factuur_status");
        b.MapEnum<FactuurSoort>("factuur_soort");
        b.MapEnum<FactuurregelBron>("factuurregel_bron");
        return b.Build();
    }

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.HasPostgresEnum<Rol>("rol");
        model.HasPostgresEnum<KlantType>("klant_type");
        model.HasPostgresEnum<Taal>("taal");
        model.HasPostgresEnum<LeadKanaal>("lead_kanaal");
        model.HasPostgresEnum<LeadStatus>("lead_status");
        model.HasPostgresEnum<OfferteStatus>("offerte_status");
        model.HasPostgresEnum<OfferteSoort>("offerte_soort");
        model.HasPostgresEnum<FotoberichtStatus>("fotobericht_status");
        model.HasPostgresEnum<KoopjeStatus>("koopje_status");
        model.HasPostgresEnum<VacatureStatus>("vacature_status");
        model.HasPostgresEnum<OrderStatus>("order_status");
        model.HasPostgresEnum<BtwTarief>("btw_tarief");
        model.HasPostgresEnum<OpvolgtaakStatus>("opvolgtaak_status");
        model.HasPostgresEnum<OpvolgtaakType>("opvolgtaak_type");
        model.HasPostgresEnum<WebsiteContentStatus>("website_content_status");
        model.HasPostgresEnum<ArtikelEenheid>("artikel_eenheid");
        model.HasPostgresEnum<CommunicatieStatus>("communicatie_status");
        model.HasPostgresEnum<OnderdeelStatus>("onderdeel_status");
        model.HasPostgresEnum<LeverancierType>("leverancier_type");
        model.HasPostgresEnum<Projectfase>("projectfase");
        model.HasPostgresEnum<WerkbonStatus>("werkbon_status");
        model.HasPostgresEnum<WerkbonType>("werkbon_type");
        model.HasPostgresEnum<ServicedossierStatus>("servicedossier_status");
        model.HasPostgresEnum<FactuurStatus>("factuur_status");
        model.HasPostgresEnum<FactuurSoort>("factuur_soort");
        model.HasPostgresEnum<FactuurregelBron>("factuurregel_bron");

        model.Entity<Medewerker>().ToTable("medewerker");
        model.Entity<Medewerker>().HasMany(m => m.Rollen).WithOne().HasForeignKey(r => r.MedewerkerId);
        model.Entity<MedewerkerRol>().ToTable("medewerker_rol").HasKey(r => new { r.MedewerkerId, r.Rol });
        model.Entity<Klant>().ToTable("klant");
        model.Entity<Klant>().HasMany(k => k.Contactpersonen).WithOne().HasForeignKey(c => c.KlantId);
        model.Entity<Contactpersoon>().ToTable("contactpersoon");
        model.Entity<Contactmoment>().ToTable("contactmoment");
        model.Entity<Lead>().ToTable("lead");
        model.Entity<Lead>().Property(l => l.WizardGegevens).HasColumnType("jsonb");
        model.Entity<Lead>().HasMany(l => l.Bijlagen).WithOne().HasForeignKey(b => b.LeadId);
        model.Entity<LeadBijlage>().ToTable("lead_bijlage");
        model.Entity<Fotobericht>().ToTable("fotobericht");
        model.Entity<Fotobericht>().HasMany(f => f.Bijlagen).WithOne().HasForeignKey(b => b.FotoberichtId);
        model.Entity<FotoberichtBijlage>().ToTable("fotobericht_bijlage");
        model.Entity<Koopje>().ToTable("koopje");
        model.Entity<Koopje>().HasMany(k => k.Fotos).WithOne().HasForeignKey(f => f.KoopjeId);
        model.Entity<KoopjeFoto>().ToTable("koopje_foto");
        model.Entity<Vacature>().ToTable("vacature");
        model.Entity<Vacature>().Property(v => v.Blokken).HasColumnType("jsonb");
        model.Entity<Project>().ToTable("project");
        model.Entity<Project>().HasOne(p => p.Klant).WithMany().HasForeignKey(p => p.KlantId);
        model.Entity<Project>().Property(p => p.Nummer).ValueGeneratedOnAdd();
        model.Entity<Project>().HasMany(p => p.Offertes).WithOne(o => o.Project).HasForeignKey(o => o.ProjectId);
        model.Entity<Artikel>().ToTable("artikel");
        // De kolomnamen uit migratie 0048 expliciet vastleggen. De snake case
        // conventie weet niet wat ze met een cijfer in Categorie1 moet doen, en
        // StdMaten zou std_maten of stdmaten kunnen worden.
        model.Entity<Artikel>().Property(a => a.Categorie1).HasColumnName("categorie1");
        model.Entity<Artikel>().Property(a => a.Categorie2).HasColumnName("categorie2");
        model.Entity<Artikel>().Property(a => a.StdMaten).HasColumnName("std_maten");
        model.Entity<Artikel>().Property(a => a.LeverancierNummer).HasColumnName("leverancier_nummer");
        model.Entity<Artikel>().Property(a => a.PoortlandId).HasColumnName("poortland_id");
        model.Entity<Artikel>().Property(a => a.PrijsOntbreekt).HasColumnName("prijs_ontbreekt");
        model.Entity<Offerte>().ToTable("offerte");
        model.Entity<Offerte>().HasMany(o => o.Regels).WithOne().HasForeignKey(r => r.OfferteId);
        model.Entity<Offerteregel>().ToTable("offerteregel");
        model.Entity<Order>().ToTable("order");
        model.Entity<Order>().HasOne(o => o.Offerte).WithMany().HasForeignKey(o => o.OfferteId);
        model.Entity<Opvolgtaak>().ToTable("opvolgtaak");
        model.Entity<Communicatie>().ToTable("communicatie");
        model.Entity<Notificatie>().ToTable("notificatie");
        model.Entity<WebsiteMedia>().ToTable("website_media");
        model.Entity<WebsitePopup>().ToTable("website_popup");
        model.Entity<Instelling>().ToTable("instelling").HasKey(i => i.Sleutel);
        model.Entity<Instelling>().Property(i => i.Waarde).HasColumnType("jsonb");
        model.Entity<Leverancier>().ToTable("leverancier");
        model.Entity<Stuklijst>().ToTable("stuklijst");
        model.Entity<Stuklijst>().HasMany(s => s.Onderdelen).WithOne().HasForeignKey(o => o.StuklijstId);
        model.Entity<Productieonderdeel>().ToTable("productieonderdeel");
        model.Entity<Tekening>().ToTable("tekening");
        model.Entity<Tekening>().Property(t => t.Metadata).HasColumnType("jsonb");
        model.Entity<Ploeg>().ToTable("ploeg");
        model.Entity<Ploeg>().HasMany(p => p.Leden).WithOne().HasForeignKey(l => l.PloegId);
        model.Entity<PloegLid>().ToTable("ploeg_lid").HasKey(l => new { l.PloegId, l.MedewerkerId });
        model.Entity<Planningsitem>().ToTable("planningsitem");
        model.Entity<Planningsitem>().HasOne(p => p.Project).WithMany().HasForeignKey(p => p.ProjectId);
        model.Entity<Werkbon>().ToTable("werkbon");
        model.Entity<Werkbon>().HasOne(w => w.Project).WithMany().HasForeignKey(w => w.ProjectId);
        model.Entity<Werkbon>().HasMany(w => w.Regels).WithOne().HasForeignKey(r => r.WerkbonId);
        model.Entity<Werkbon>().HasMany(w => w.Fotos).WithOne().HasForeignKey(f => f.WerkbonId);
        model.Entity<Werkbonregel>().ToTable("werkbonregel");
        model.Entity<Werkbonfoto>().ToTable("werkbonfoto");
        model.Entity<Servicedossier>().ToTable("servicedossier");
        model.Entity<Servicedossier>().HasOne(s => s.Klant).WithMany().HasForeignKey(s => s.KlantId);
        model.Entity<Servicedossier>().HasOne(s => s.Project).WithMany().HasForeignKey(s => s.ProjectId);
        model.Entity<Factuurvoorstel>().ToTable("factuurvoorstel");
        model.Entity<Factuurvoorstel>().HasOne(f => f.Project).WithMany().HasForeignKey(f => f.ProjectId);
        model.Entity<Factuurvoorstel>().HasMany(f => f.Regels).WithOne().HasForeignKey(r => r.FactuurvoorstelId);
        model.Entity<Factuurvoorstelregel>().ToTable("factuurvoorstelregel");

        // Kolommen die de databank beheert.
        foreach (var e in model.Model.GetEntityTypes())
        {
            var p1 = e.FindProperty("AangemaaktOp"); if (p1 is not null) p1.ValueGenerated = Microsoft.EntityFrameworkCore.Metadata.ValueGenerated.OnAdd;
        }
    }
}

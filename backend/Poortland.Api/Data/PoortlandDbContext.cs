using Microsoft.EntityFrameworkCore;
using Npgsql;

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

    public static NpgsqlDataSource MaakDataSource(string connectionString)
    {
        var b = new NpgsqlDataSourceBuilder(connectionString);
        b.MapEnum<Rol>("rol");
        b.MapEnum<KlantType>("klant_type");
        b.MapEnum<Taal>("taal");
        b.MapEnum<LeadKanaal>("lead_kanaal");
        b.MapEnum<LeadStatus>("lead_status");
        b.MapEnum<OfferteStatus>("offerte_status");
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
        model.Entity<Project>().ToTable("project");
        model.Entity<Project>().HasOne(p => p.Klant).WithMany().HasForeignKey(p => p.KlantId);
        model.Entity<Project>().Property(p => p.Nummer).ValueGeneratedOnAdd();
        model.Entity<Project>().HasMany(p => p.Offertes).WithOne(o => o.Project).HasForeignKey(o => o.ProjectId);
        model.Entity<Artikel>().ToTable("artikel");
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

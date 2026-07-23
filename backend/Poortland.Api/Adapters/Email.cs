using System.Text;
using System.Text.Json;

namespace Poortland.Api.Adapters;

// TS-13: adapters met een duidelijke interface zodat de aanbieder vervangbaar is.
public interface IEmailVerzender
{
    Task Verzend(string naar, string onderwerp, string tekst, (byte[] inhoud, string naam)? bijlage = null);
}

// Dev modus: logt naar de console, verstuurt niets (bouwspec 6.4).
public class ConsoleEmailVerzender(ILogger<ConsoleEmailVerzender> log) : IEmailVerzender
{
    public Task Verzend(string naar, string onderwerp, string tekst, (byte[] inhoud, string naam)? bijlage = null)
    {
        // Adres gemaskeerd zodat er geen PII in de logs belandt (audit privacy 7).
        log.LogInformation("EMAIL (console modus) naar {Naar}: {Onderwerp} | bijlage: {Bijlage}",
            Maskeer(naar), onderwerp, bijlage?.naam ?? "geen");
        return Task.CompletedTask;
    }

    public static string Maskeer(string email)
    {
        var at = email.IndexOf('@');
        if (at <= 1) return "***";
        return $"{email[0]}***{email[at..]}";
    }
}

// Brevo (EU) conform TBD-3. Actief via Email:Modus = brevo plus een api sleutel.
public class BrevoEmailVerzender(IHttpClientFactory httpFactory, IConfiguration config) : IEmailVerzender
{
    public async Task Verzend(string naar, string onderwerp, string tekst, (byte[] inhoud, string naam)? bijlage = null)
    {
        var sleutel = config["Email:BrevoApiKey"]
            ?? throw new InvalidOperationException("Email:BrevoApiKey ontbreekt");
        var afzender = config["Email:Afzender"] ?? "offerte@poortland.be";
        var http = httpFactory.CreateClient();
        http.DefaultRequestHeaders.Add("api-key", sleutel);
        var body = new Dictionary<string, object?>
        {
            ["sender"] = new { email = afzender, name = "Poortland" },
            ["to"] = new[] { new { email = naar } },
            ["subject"] = onderwerp,
            ["textContent"] = tekst
        };
        if (bijlage is { } b)
            body["attachment"] = new[] { new { content = Convert.ToBase64String(b.inhoud), name = b.naam } };
        var antwoord = await http.PostAsync("https://api.brevo.com/v3/smtp/email",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));
        antwoord.EnsureSuccessStatusCode();
    }
}

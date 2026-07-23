using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Poortland.Api.Adapters;

// Supabase Storage via de service sleutel. Enkel in de backend (TS-02 sectie 2.5).
public class SupabaseOpslag(HttpClient http, IConfiguration config)
{
    string Url => (config["Supabase:Url"] ?? "").TrimEnd('/');
    string Sleutel => config["Supabase:ServiceKey"] ?? "";

    void ZetHeaders(HttpRequestMessage r)
    {
        r.Headers.Add("apikey", Sleutel);
        r.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Sleutel);
    }

    public async Task Upload(string bucket, string pad, byte[] inhoud, string contentType, string? cacheControl = null)
    {
        var r = new HttpRequestMessage(HttpMethod.Post, $"{Url}/storage/v1/object/{bucket}/{pad}")
        { Content = new ByteArrayContent(inhoud) };
        r.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        r.Headers.Add("x-upsert", "true");
        // Cache control is een algemene header en hoort dus op het verzoek zelf.
        // Op Content.Headers gooit .NET een InvalidOperationException en precies
        // dat brak de allereerste publicatie (content.json bleef uit).
        if (cacheControl is not null) r.Headers.TryAddWithoutValidation("cache-control", cacheControl);
        ZetHeaders(r);
        var antwoord = await http.SendAsync(r);
        if (!antwoord.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Opslag weigerde {bucket}/{pad}: {(int)antwoord.StatusCode} {await antwoord.Content.ReadAsStringAsync()}");
    }

    public async Task Verwijder(string bucket, params string[] paden)
    {
        var r = new HttpRequestMessage(HttpMethod.Delete, $"{Url}/storage/v1/object/{bucket}")
        {
            Content = new StringContent(JsonSerializer.Serialize(new { prefixes = paden }), Encoding.UTF8, "application/json")
        };
        ZetHeaders(r);
        await http.SendAsync(r); // opruimen is best effort
    }

    public async Task<byte[]> Download(string bucket, string pad)
    {
        var r = new HttpRequestMessage(HttpMethod.Get, $"{Url}/storage/v1/object/{bucket}/{pad}");
        ZetHeaders(r);
        var antwoord = await http.SendAsync(r);
        antwoord.EnsureSuccessStatusCode();
        return await antwoord.Content.ReadAsByteArrayAsync();
    }

    public async Task<string> SignedUrl(string bucket, string pad, int geldigSeconden = 300)
    {
        var r = new HttpRequestMessage(HttpMethod.Post, $"{Url}/storage/v1/object/sign/{bucket}/{pad}")
        {
            Content = new StringContent(JsonSerializer.Serialize(new { expiresIn = geldigSeconden }), Encoding.UTF8, "application/json")
        };
        ZetHeaders(r);
        var antwoord = await http.SendAsync(r);
        antwoord.EnsureSuccessStatusCode();
        var json = JsonDocument.Parse(await antwoord.Content.ReadAsStringAsync());
        return $"{Url}/storage/v1{json.RootElement.GetProperty("signedURL").GetString()}";
    }

    public string PubliekeUrl(string bucket, string pad) => $"{Url}/storage/v1/object/public/{bucket}/{pad}";
}

// Supabase Auth admin: uitnodigen van medewerkers (geen open registratie, TS-02).
public class SupabaseAdmin(HttpClient http, IConfiguration config)
{
    string Url => (config["Supabase:Url"] ?? "").TrimEnd('/');
    string Sleutel => config["Supabase:ServiceKey"] ?? "";

    public async Task NodigUit(string email, string naam)
    {
        var r = new HttpRequestMessage(HttpMethod.Post, $"{Url}/auth/v1/invite")
        {
            Content = new StringContent(JsonSerializer.Serialize(new { email, data = new { naam } }),
                Encoding.UTF8, "application/json")
        };
        r.Headers.Add("apikey", Sleutel);
        r.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Sleutel);
        var antwoord = await http.SendAsync(r);
        if (!antwoord.IsSuccessStatusCode)
        {
            var detail = await antwoord.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Uitnodiging mislukt: {antwoord.StatusCode} {detail}");
        }
    }
}

// Cloudflare Turnstile op het publieke leadformulier (TS-04 sectie 2).
public class TurnstileValidator(HttpClient http, IConfiguration config)
{
    public async Task<bool> Valideer(string? token, string? ip)
    {
        var secret = config["Turnstile:Secret"];
        if (string.IsNullOrWhiteSpace(secret))
            // Geen Turnstile geheim ingesteld: doorlaten zodat het contactformulier en
            // de offertewizard werken. De snelheidslimiet op /webformulier (5 per minuut
            // per IP) blijft de basisbescherming. Stel Turnstile:Secret in voor volwaardige
            // botbescherming in productie.
            return true;
        if (string.IsNullOrWhiteSpace(token)) return false;
        var velden = new Dictionary<string, string> { ["secret"] = secret, ["response"] = token };
        if (ip is not null) velden["remoteip"] = ip;
        var antwoord = await http.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify",
            new FormUrlEncodedContent(velden));
        if (!antwoord.IsSuccessStatusCode) return false;
        var json = JsonDocument.Parse(await antwoord.Content.ReadAsStringAsync());
        return json.RootElement.TryGetProperty("success", out var ok) && ok.GetBoolean();
    }
}

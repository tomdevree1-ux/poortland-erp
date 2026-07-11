using System.Security.Claims;
using System.Text.Json;

namespace Poortland.Api.Auth;

// Per verzoek: de identiteit die naar de databank gaat als request.jwt.claims
// zodat RLS en de triggers dezelfde waarheid zien als de API (TS-02 sectie 3).
public class ClaimsContext
{
    public Guid? AuthUserId { get; private set; }
    public Guid? MedewerkerId { get; private set; }
    public string? Email { get; private set; }
    public IReadOnlyList<string> Rollen { get; private set; } = [];

    public void VulUit(ClaimsPrincipal gebruiker)
    {
        var sub = gebruiker.FindFirstValue(ClaimTypes.NameIdentifier) ?? gebruiker.FindFirstValue("sub");
        if (Guid.TryParse(sub, out var authId)) AuthUserId = authId;
        Email = gebruiker.FindFirstValue(ClaimTypes.Email) ?? gebruiker.FindFirstValue("email");
        var mid = gebruiker.FindFirstValue("medewerker_id");
        if (Guid.TryParse(mid, out var m)) MedewerkerId = m;
        Rollen = gebruiker.FindAll("rollen").Select(c => c.Value).ToList();
    }

    public void VulAlsSysteem() => Rollen = ["systeem"];

    public void VulMedewerkerAan(Guid medewerkerId, IEnumerable<string> rollen)
    {
        MedewerkerId = medewerkerId;
        Rollen = rollen.ToList();
    }

    public bool Heeft(params string[] rollen) =>
        Rollen.Contains("beheerder") || rollen.Any(r => Rollen.Contains(r));

    public string NaarJwtClaimsJson()
    {
        var claims = new Dictionary<string, object?>
        {
            ["sub"] = AuthUserId?.ToString(),
            ["email"] = Email,
            ["role"] = "authenticated",
            ["rollen"] = Rollen,
            ["medewerker_id"] = MedewerkerId?.ToString()
        };
        return JsonSerializer.Serialize(claims);
    }
}

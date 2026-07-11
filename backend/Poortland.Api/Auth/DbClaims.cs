using Microsoft.EntityFrameworkCore;
using Poortland.Api.Data;

namespace Poortland.Api.Auth;

// Zet de identiteit als request.jwt.claims op de databankverbinding zodat
// RLS, mag() en de triggers dezelfde context zien (TS-02, verdediging in de diepte).
public static class DbClaims
{
    public static async Task ZetClaims(PoortlandDbContext db, ClaimsContext claims, CancellationToken ct = default)
    {
        await db.Database.OpenConnectionAsync(ct);
        var json = claims.NaarJwtClaimsJson();
        await db.Database.ExecuteSqlAsync($"select set_config('request.jwt.claims', {json}, false)", ct);
    }

    // De databank is de bron van waarheid voor rollen (terugval zonder token hook).
    public static async Task<(Guid? medewerkerId, string[] rollen)> LeesIdentiteit(PoortlandDbContext db, CancellationToken ct = default)
    {
        var conn = db.Database.GetDbConnection();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select huidige_medewerker_id()::text, huidige_rollen()::text[]";
        await using var lezer = await cmd.ExecuteReaderAsync(ct);
        if (await lezer.ReadAsync(ct))
        {
            Guid? id = lezer.IsDBNull(0) ? null : Guid.Parse(lezer.GetString(0));
            var rollen = lezer.IsDBNull(1) ? [] : (string[])lezer.GetValue(1);
            return (id, rollen);
        }
        return (null, []);
    }
}

public class ClaimsMiddleware(RequestDelegate volgende)
{
    public async Task InvokeAsync(HttpContext http, ClaimsContext claims, PoortlandDbContext db)
    {
        if (http.User.Identity?.IsAuthenticated == true)
        {
            claims.VulUit(http.User);
            await DbClaims.ZetClaims(db, claims, http.RequestAborted);
            var (medewerkerId, rollen) = await DbClaims.LeesIdentiteit(db, http.RequestAborted);
            if (medewerkerId is null || rollen.Length == 0)
            {
                // Geen actieve medewerker of geen rollen: geen toegang (LOGIN-03).
                http.Response.StatusCode = StatusCodes.Status403Forbidden;
                await http.Response.WriteAsJsonAsync(new { fout = "Geen actieve medewerker met rollen. Vraag de beheerder om toegang." });
                return;
            }
            claims.VulMedewerkerAan(medewerkerId.Value, rollen);
            // De volledige claims opnieuw zetten zodat de rollen ook in de databanksessie staan.
            await DbClaims.ZetClaims(db, claims, http.RequestAborted);
        }
        await volgende(http);
    }
}

// Rol guard per endpoint (TS-02 sectie 3, eerste verdedigingslaag).
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class VereistRolAttribute(params string[] rollen) : Attribute, Microsoft.AspNetCore.Mvc.Filters.IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(
        Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context,
        Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate volgende)
    {
        var claims = context.HttpContext.RequestServices.GetRequiredService<ClaimsContext>();
        if (!claims.Heeft(rollen))
        {
            context.Result = new Microsoft.AspNetCore.Mvc.ObjectResult(new { fout = "Onvoldoende rechten voor deze actie." })
            { StatusCode = StatusCodes.Status403Forbidden };
            return;
        }
        await volgende();
    }
}

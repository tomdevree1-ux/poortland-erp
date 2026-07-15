using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Poortland.Api.Auth;

// Zet de identiteit (request.jwt.claims) op ELKE databankverbinding die de context
// opent, gelezen uit het LOPENDE verzoek via de HttpContext. Zo dragen lezen en
// schrijven altijd dezelfde rollen, ook als ze op verschillende verbindingen
// belanden. Zonder dit zag de schrijfverbinding geen beheerder en weigerde RLS
// (TS-02, verdediging in de diepte).
public class ClaimsInterceptor(IHttpContextAccessor httpAccessor) : DbConnectionInterceptor
{
    public override async Task ConnectionOpenedAsync(DbConnection connection,
        ConnectionEndEventData eventData, CancellationToken cancellationToken = default)
        => await ZetClaims(connection, cancellationToken);

    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
        => ZetClaims(connection, CancellationToken.None).GetAwaiter().GetResult();

    async Task ZetClaims(DbConnection connection, CancellationToken ct)
    {
        // De identiteit van het huidige verzoek (nooit een vastgezette oude waarde).
        var claims = httpAccessor.HttpContext?.RequestServices.GetService<ClaimsContext>();
        if (claims is null) return;
        // Anonieme paden zonder identiteit laten we ongemoeid.
        if (claims.AuthUserId is null && claims.MedewerkerId is null && claims.Rollen.Count == 0) return;
        using var cmd = connection.CreateCommand();
        cmd.CommandText = "select set_config('request.jwt.claims', @claims, false)";
        var p = cmd.CreateParameter();
        p.ParameterName = "claims";
        p.Value = claims.NaarJwtClaimsJson();
        cmd.Parameters.Add(p);
        await cmd.ExecuteNonQueryAsync(ct);
    }
}

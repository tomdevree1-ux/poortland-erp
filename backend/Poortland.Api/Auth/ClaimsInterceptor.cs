using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Poortland.Api.Auth;

// Zet de identiteit (request.jwt.claims) op ELKE databankverbinding die de context
// opent. Zonder dit kunnen lezen en schrijven op verschillende verbindingen belanden
// waardoor de schrijfverbinding geen rollen draagt en RLS, mag() en de triggers de
// gebruiker niet als beheerder zien (TS-02, verdediging in de diepte).
public class ClaimsInterceptor(ClaimsContext claims) : DbConnectionInterceptor
{
    public override async Task ConnectionOpenedAsync(DbConnection connection,
        ConnectionEndEventData eventData, CancellationToken cancellationToken = default)
        => await ZetClaims(connection, cancellationToken);

    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
        => ZetClaims(connection, CancellationToken.None).GetAwaiter().GetResult();

    async Task ZetClaims(DbConnection connection, CancellationToken ct)
    {
        // Enkel wanneer er een identiteit is (ingelogd of als systeem gezet). Anonieme
        // paden zonder identiteit laten we ongemoeid.
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

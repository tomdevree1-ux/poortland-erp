using Microsoft.AspNetCore.Mvc.Filters;
using Poortland.Api.Domein;

namespace Poortland.Api;

// Domeinfouten en databankweigeringen worden nette antwoorden in mensentaal
// (huisstijlgids: foutmeldingen zijn concreet en zonder schuld).
public class FoutFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        var (status, boodschap) = context.Exception switch
        {
            DomeinFout d => (400, d.Message),
            Npgsql.PostgresException p when p.SqlState == "42501" => (403, "De databank weigerde deze actie: onvoldoende rechten."),
            Npgsql.PostgresException p when p.SqlState == "P0001" => (409, p.MessageText),
            Npgsql.PostgresException p when p.SqlState == "23505" => (409, "Dit bestaat al of botst met een unieke regel."),
            Npgsql.PostgresException p when p.SqlState == "23514" => (400, "De invoer voldoet niet aan de validatieregels."),
            Microsoft.EntityFrameworkCore.DbUpdateException u when u.InnerException is Npgsql.PostgresException pi =>
                pi.SqlState switch
                {
                    "42501" => (403, "De databank weigerde deze actie: onvoldoende rechten."),
                    "P0001" => (409, pi.MessageText),
                    "23505" => (409, "Dit bestaat al of botst met een unieke regel."),
                    _ => (500, "Er ging iets mis bij het bewaren.")
                },
            _ => (500, "Er ging onverwacht iets mis.")
        };
        context.Result = new Microsoft.AspNetCore.Mvc.ObjectResult(new { fout = boodschap }) { StatusCode = status };
        context.ExceptionHandled = status < 500;
    }
}

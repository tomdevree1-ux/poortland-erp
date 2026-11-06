using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

[ApiController]
[Route("gezond")]
public class GezondheidController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult Gezond() => Ok(new { status = "gezond", tijd = DateTimeOffset.UtcNow });
}

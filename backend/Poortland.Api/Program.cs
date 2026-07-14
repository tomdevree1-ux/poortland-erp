using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Poortland.Api.Achtergrond;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;
using QuestPDF.Infrastructure;

QuestPDF.Settings.License = LicenseType.Community;
var fontMap = Path.Combine(AppContext.BaseDirectory, "Fonts");
if (Directory.Exists(fontMap))
    foreach (var fontPad in Directory.GetFiles(fontMap, "*.ttf"))
        QuestPDF.Drawing.FontManager.RegisterFont(File.OpenRead(fontPad));

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Datalaag: erp_app verbinding, enum mapping en snake_case (TS-01 conventies).
var connectionString = config.GetConnectionString("Poortland")
    ?? throw new InvalidOperationException("ConnectionStrings:Poortland ontbreekt");
var dataSource = PoortlandDbContext.MaakDataSource(connectionString);
builder.Services.AddScoped<ClaimsInterceptor>();
builder.Services.AddDbContext<PoortlandDbContext>((sp, o) =>
    o.UseNpgsql(dataSource).UseSnakeCaseNamingConvention()
     .AddInterceptors(sp.GetRequiredService<ClaimsInterceptor>()));

// Authenticatie: Supabase Auth JWT (BS-01). HS256 met JwtSecret of anders JWKS.
var supabaseUrl = (config["Supabase:Url"] ?? "").TrimEnd('/');
var uitgever = $"{supabaseUrl}/auth/v1";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.MapInboundClaims = false;
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = uitgever,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
        var jwtSecret = config["Supabase:JwtSecret"];
        if (!string.IsNullOrWhiteSpace(jwtSecret))
        {
            parameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        }
        else if (!string.IsNullOrWhiteSpace(supabaseUrl))
        {
            using var http = new HttpClient();
            var jwksJson = http.GetStringAsync($"{uitgever}/.well-known/jwks.json").GetAwaiter().GetResult();
            parameters.IssuerSigningKeys = new JsonWebKeySet(jwksJson).GetSigningKeys();
        }
        o.TokenValidationParameters = parameters;
    });
builder.Services.AddAuthorization();

builder.Services.AddScoped<ClaimsContext>();
builder.Services.AddScoped<InstellingenService>();
builder.Services.AddScoped<OfferteService>();
builder.Services.AddScoped<LeadService>();
builder.Services.AddScoped<WebsiteContentService>();
builder.Services.AddSingleton<OffertePdfService>();
builder.Services.AddHttpClient<SupabaseOpslag>();
builder.Services.AddHttpClient<SupabaseAdmin>();
builder.Services.AddHttpClient<TurnstileValidator>();
builder.Services.AddSingleton<IEmailVerzender>(sp =>
{
    var modus = config["Email:Modus"] ?? "console";
    return modus == "brevo"
        ? new BrevoEmailVerzender(sp.GetRequiredService<IHttpClientFactory>(), config)
        : new ConsoleEmailVerzender(sp.GetRequiredService<ILogger<ConsoleEmailVerzender>>());
});
builder.Services.AddHttpClient();
builder.Services.AddHostedService<DagelijkseTaken>();

builder.Services.AddControllers(o => o.Filters.Add<Poortland.Api.FoutFilter>())
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(
        new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase)));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var corsOrigins = config.GetSection("Cors:Origins").Get<string[]>();
if (corsOrigins is null or [] )
    corsOrigins = [config["Frontend:Origin"] ?? "http://localhost:5173"];
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(corsOrigins)
    .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ClaimsMiddleware>();
app.MapControllers();

app.Run();

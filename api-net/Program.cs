using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using JediApi.Contracts;
using JediApi.Domain.Entities;
using JediApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDb>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("StarwarsAcademy"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("StarwarsAcademy"))));

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();
app.MapOpenApi("/openapi/v1.json");
app.MapScalarApiReference("/scalar");

app.MapGet("/jedi", async (AppDb db) =>
{
    return await db.Jedis
        .AsNoTracking()
        .OrderBy(jedi => jedi.JediId)
        .Select(jedi => new Dto(jedi.JediId, jedi.Name, jedi.JediTypeId))
        .ToListAsync();
});

app.MapGet("/jedi/{id:int}", async (int id, AppDb db) =>
{
    var jedi = await db.Jedis.FindAsync(id);

    return jedi is null
        ? Results.NotFound()
        : Results.Ok(new Dto(jedi.JediId, jedi.Name, jedi.JediTypeId));
});

app.MapPost("/jedi", async (Input input, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(input.Name)
        || input.Name.Trim().Length > 200
        || input.JediTypeId is < 1 or > 3)
    {
        return Results.BadRequest();
    }

    var jedi = new Jedi
    {
        Name = input.Name.Trim(),
        JediTypeId = input.JediTypeId
    };

    db.Add(jedi);
    await db.SaveChangesAsync();

    return Results.Created($"/jedi/{jedi.JediId}", new Dto(
        jedi.JediId, jedi.Name, jedi.JediTypeId));
});

app.MapPost("/jedi/search", async (Search search, AppDb db) =>
{
    if (search.PageIndex < 0 || search.PageIndex > 1_000_000
        || search.PageSize < 1 || search.PageSize > 100)
    {
        return Results.BadRequest();
    }

    var word = search.SearchTerm?.Trim() ?? string.Empty;
    var total = await db.Jedis.CountAsync(jedi =>
        word == string.Empty || EF.Functions.Like(jedi.Name, $"%{word}%"));

    var rows = await db.Database
        .SqlQueryRaw<JediRow>("CALL Jedi_Search({0},{1},{2})",
            word == string.Empty ? null : word,
            search.PageIndex,
            search.PageSize)
        .ToListAsync();

    return Results.Ok(new
    {
        items = rows.Select(row => new Dto(
            row.JediId, row.Name, row.JediTypeId)),
        pageIndex = search.PageIndex,
        pageSize = search.PageSize,
        totalCount = total,
        totalPages = (int)Math.Ceiling(total / (double)search.PageSize)
    });
});

app.MapGet("/health", async (AppDb db) =>
{
    try
    {
        await db.Database.ExecuteSqlRawAsync("SELECT 1");
        return Results.Ok(new { status = "ok" });
    }
    catch
    {
        return Results.StatusCode(503);
    }
});

app.Run();

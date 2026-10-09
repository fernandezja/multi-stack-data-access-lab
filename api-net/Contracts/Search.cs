namespace JediApi.Contracts;

public record Search(string? SearchTerm, int PageIndex = 0, int PageSize = 10);

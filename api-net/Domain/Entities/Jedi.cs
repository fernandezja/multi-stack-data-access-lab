namespace JediApi.Domain.Entities;

public class Jedi
{
    public int JediId { get; set; }
    public string Name { get; set; } = null!;
    public int JediTypeId { get; set; }
}

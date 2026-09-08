namespace com.nerdyweirdwords.backend.WritingDomain;

public class Attribute
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public Guid BlockId { get; set; }
    public Block Block { get; set; } = null!;
}
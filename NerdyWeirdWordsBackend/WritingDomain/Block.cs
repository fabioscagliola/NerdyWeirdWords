namespace com.nerdyweirdwords.backend.WritingDomain;

public class Block
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WritingId { get; set; }
    public Writing Writing { get; set; } = null!;
    public int Index { get; set; }
    public List<Attribute> Attributes { get; set; } = [];
}
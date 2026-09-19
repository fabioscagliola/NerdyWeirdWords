using com.nerdyweirdwords.backend.PersonDomain;

namespace com.nerdyweirdwords.backend.WritingDomain;

public class Writing
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid OwnerId { get; set; }
    public Person Owner { get; set; } = null!;
    public List<Block> Blocks { get; set; } = [];
}
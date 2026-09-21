namespace com.nerdyweirdwords.backend.WritingDomain.ListWriting;

public class ListWritingItemOutgoing
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime DateUploaded { get; init; }
}

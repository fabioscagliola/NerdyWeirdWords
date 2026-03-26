namespace com.nerdyweirdwords.backend.WritingDomain;

public class Heading : Block
{
    public string Text { get; set; } = string.Empty;
    public int Level { get; set; }
}
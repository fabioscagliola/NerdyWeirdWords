using com.nerdyweirdwords.backend.WritingDomain;
using NUnit.Framework;

namespace NerdyWeirdWordsBackend.Tests;

[TestFixture]
public class MarkdownParserTests
{
    private const string Document = """
        # The quick brown fox jumps over the lazy dog

        *The quick brown fox jumps over the lazy dog* is an English-language pangram.

        A **pangram** is a sentence that contains all the letters of the alphabet.

        """;

    [Test]
    public void Parse_SampleDocument_ReturnsCorrectNumberOfBlocks()
    {
        var result = MarkdownParser.Parse(Document);

    Assert.That(result.Blocks, Has.Count.EqualTo(3));
    }

    [Test]
    public void Parse_SampleDocument_FirstBlockIsHeading()
    {
        var result = MarkdownParser.Parse(Document);

        var heading = result.Blocks[0] as Heading;
        Assert.That(heading, Is.Not.Null);
        Assert.That(heading!.Level, Is.EqualTo(1));
        Assert.That(heading.Text, Is.EqualTo("The quick brown fox jumps over the lazy dog"));
    }

    [Test]
    public void Parse_SampleDocument_SecondBlockIsParagraph()
    {
        var result = MarkdownParser.Parse(Document);

        var paragraph = result.Blocks[1] as Paragraph;
        Assert.That(paragraph, Is.Not.Null);
        Assert.That(paragraph!.Text, Is.EqualTo("*The quick brown fox jumps over the lazy dog* is an English-language pangram."));
    }

    [Test]
    public void Parse_SampleDocument_ThirdBlockIsParagraph()
    {
        var result = MarkdownParser.Parse(Document);

        var paragraph = result.Blocks[2] as Paragraph;
        Assert.That(paragraph, Is.Not.Null);
        Assert.That(paragraph!.Text, Is.EqualTo("A **pangram** is a sentence that contains all the letters of the alphabet."));
    }
}
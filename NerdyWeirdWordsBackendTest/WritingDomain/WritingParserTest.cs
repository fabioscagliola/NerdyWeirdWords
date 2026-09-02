using com.nerdyweirdwords.backend.WritingDomain;
using NUnit.Framework;

namespace com.nerdyweirdwords.backend.test.WritingDomain;

public class WritingParserTest
{
    [Test]
    public void GivenMarkdownDocument_WhenDoIsCalled_ThenWritingObjectModelIsReturned()
    {
        const string markdown = """
# The quick brown fox jumps over the lazy dog

*The quick brown fox jumps over the lazy dog* is an English-language pangram.

A **pangram** is a sentence that contains all the letters of the alphabet.
""";

        var writing = new WritingParser().Do(markdown);

        Assert.That(writing, Is.Not.Null);
        Assert.That(writing.Attributes, Is.Empty);
        Assert.That(writing.Blocks, Has.Count.EqualTo(3));

        var heading = (Heading)writing.Blocks[0];
        Assert.That(heading.Level, Is.EqualTo(1));
        Assert.That(heading.Text, Is.EqualTo("The quick brown fox jumps over the lazy dog"));
        Assert.That(heading.Attributes, Is.Empty);

        var paragraph1 = (Paragraph)writing.Blocks[1];
        Assert.That(paragraph1.Text, Is.EqualTo("The quick brown fox jumps over the lazy dog is an English-language pangram."));
        Assert.That(paragraph1.Attributes, Has.Count.EqualTo(1));
        Assert.That(paragraph1.Attributes[0].Key, Is.EqualTo("Italic"));
        Assert.That(paragraph1.Attributes[0].Value, Is.EqualTo("0-43"));

        var paragraph2 = (Paragraph)writing.Blocks[2];
        Assert.That(paragraph2.Text, Is.EqualTo("A pangram is a sentence that contains all the letters of the alphabet."));
        Assert.That(paragraph2.Attributes, Has.Count.EqualTo(1));
        Assert.That(paragraph2.Attributes[0].Key, Is.EqualTo("Bold"));
        Assert.That(paragraph2.Attributes[0].Value, Is.EqualTo("2-9"));
    }
}
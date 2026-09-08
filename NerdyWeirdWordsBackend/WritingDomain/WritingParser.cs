using Markdig;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using System.Text;

namespace com.nerdyweirdwords.backend.WritingDomain;

public class WritingParser
{
    public Writing Do(string markdown)
    {
        var document = Markdown.Parse(markdown);
        var writing = new Writing();

        foreach (var markdownBlock in document)
        {
            switch (markdownBlock)
            {
                case HeadingBlock headingBlock:
                    writing.Blocks.Add(new Heading
                    {
                        Level = headingBlock.Level,
                        Text = Flatten(headingBlock.Inline).Text,
                    });
                    break;
                case ParagraphBlock paragraphBlock:
                    var paragraph = Flatten(paragraphBlock.Inline);
                    writing.Blocks.Add(new Paragraph
                    {
                        Attributes = paragraph.Attributes,
                        Text = paragraph.Text,
                    });
                    break;
            }
        }

        return writing;
    }

    private static FlattenedInline Flatten(ContainerInline? containerInline)
    {
        var text = new StringBuilder();
        var attributes = new List<Attribute>();

        if (containerInline is not null)
        {
            AppendInlines(containerInline, text, attributes);
        }

        return new FlattenedInline(text.ToString(), attributes);
    }

    private static void AppendInlines(ContainerInline containerInline, StringBuilder text, List<Attribute> attributes)
    {
        foreach (var inline in containerInline)
        {
            switch (inline)
            {
                case LiteralInline literalInline:
                    text.Append(literalInline.Content);
                    break;
                case EmphasisInline emphasisInline:
                    var startIndex = text.Length;
                    AppendInlines(emphasisInline, text, attributes);
                    var endIndex = text.Length;

                    if (startIndex != endIndex)
                    {
                        attributes.Add(new Attribute
                        {
                            Key = emphasisInline.DelimiterCount >= 2 ? "Bold" : "Italic",
                            Value = $"{startIndex}-{endIndex}",
                        });
                    }

                    break;
            }
        }
    }

    private sealed record FlattenedInline(string Text, List<Attribute> Attributes);
}
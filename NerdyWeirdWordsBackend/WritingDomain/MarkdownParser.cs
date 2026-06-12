using Markdig;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;

namespace com.nerdyweirdwords.backend.WritingDomain;

public static class MarkdownParser
{
    public static Writing Parse(string markdown)
    {
        var document = Markdown.Parse(markdown);
        var blocks = new List<Block>();

        foreach (var block in document)
        {
            if (block is Markdig.Syntax.HeadingBlock headingBlock)
            {
                blocks.Add(new Heading
                {
                    Level = headingBlock.Level,
                    Text = headingBlock.Inline?.FirstChild?.ToString() ?? string.Empty
                });
            }
            else if (block is Markdig.Syntax.ParagraphBlock paragraphBlock)
            {
                blocks.Add(new Paragraph
                {
                    Text = markdown.Substring(paragraphBlock.Span.Start, paragraphBlock.Span.Length)
                });
            }
        }

        return new Writing
        {
            Attributes = [],
            Blocks = blocks
        };
    }
}


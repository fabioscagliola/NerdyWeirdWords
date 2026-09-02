# Refined backlog item

Backlog item: GitHub issue #11 - Parse a Markdown document into an object model representing its contents

Source: https://github.com/fabioscagliola/NerdyWeirdWords/issues/11

## Description

Implement Markdown parsing for writings in the NerdyWeirdWords backend. The parser must convert a Markdown document into the existing `WritingDomain` object model introduced by PR #9:

- `Writing`
- `Block`
- `Heading`
- `Paragraph`
- `Attribute`

The first supported Markdown subset is intentionally small and must follow CommonMark 0.31.2 for these content types:

- ATX headings
- Paragraphs
- Emphasis
- Strong emphasis

Other Markdown content types are out of scope for this backlog item and should be ignored for now.

The implementation should add an NUnit-based unit test that parses the sample document from the original issue and verifies the resulting object model.

The issue comment defines how inline emphasis is represented in the object model: italic and bold spans are represented as block attributes. An italic span uses `Key = "Italic"`; a bold span uses `Key = "Bold"`. The attribute value encodes the affected character range relative to the associated `Text` value, using a zero-based inclusive start index and an exclusive end index, formatted as `start-end`.

Sample document:

```markdown
# The quick brown fox jumps over the lazy dog

*The quick brown fox jumps over the lazy dog* is an English-language pangram.

A **pangram** is a sentence that contains all the letters of the alphabet.
```

Suggested Markdown processor: Markdig.

## Constraints

- Preserve the intent of the existing `WritingDomain` model unless an explicit model gap prevents representing the parsed document.
- Use CommonMark 0.31.2 as the behavior reference for the supported Markdown subset.
- Use NUnit for unit tests.
- Ignore unsupported Markdown block and inline content types for this backlog item.
- Keep the parser focused on headings, paragraphs, emphasis, and strong emphasis only.
- Represent emphasis and strong emphasis as block attributes using the key/value convention from the GitHub issue comment.
- Add a new NUnit test project named `NerdyWeirdWordsBackendTest`.
- Honor the existing lowercase namespace style.
- Do not modify the source GitHub issue.

## Assumptions

- The parser belongs in the backend, near `NerdyWeirdWordsBackend/WritingDomain`, unless implementation planning identifies a better existing boundary.
- Because the repository currently has no test project, this work may need to introduce a backend test project configured for NUnit.
- Markdig may be added as a backend dependency if it is used to parse Markdown.
- The sample document should produce one `Writing` containing three blocks: one level-1 heading and two paragraphs.
- Plain text content should be preserved in reading order.
- Markdown emphasis delimiters should not appear in `Text`; formatting is represented by attributes.
- Unsupported Markdown constructs should be ignored rather than converted into placeholder model objects or treated as errors.

## Acceptance criteria

- A Markdown parser exists for the backend writing domain and exposes a clear API that accepts Markdown text and returns a `Writing` object.
- The parser recognizes ATX headings and maps them to `Heading` blocks with the correct heading level and text.
- The parser recognizes paragraphs and maps them to `Paragraph` blocks with the expected text.
- The parser maps emphasis spans to `Attribute` objects with `Key` set to `Italic` and `Value` set to the span range using `start-end` format.
- The parser maps strong emphasis spans to `Attribute` objects with `Key` set to `Bold` and `Value` set to the span range using `start-end` format.
- Unsupported content types are ignored and do not prevent supported headings and paragraphs from being parsed from a document.
- A new NUnit test project named `NerdyWeirdWordsBackendTest` exists and contains the parser tests.
- An NUnit unit test parses the sample document from the original issue and asserts the resulting object model.
- The test verifies the document contains exactly three blocks in order: heading, paragraph, paragraph.
- The test verifies the heading level is `1` and its text is `The quick brown fox jumps over the lazy dog`.
- The test verifies the first paragraph text is `The quick brown fox jumps over the lazy dog is an English-language pangram.` and has one `Italic` attribute with value `0-43`.
- The test verifies the second paragraph text is `A pangram is a sentence that contains all the letters of the alphabet.` and has one `Bold` attribute with value `2-9`.
- The relevant .NET test command passes locally.

## Questions

- None.
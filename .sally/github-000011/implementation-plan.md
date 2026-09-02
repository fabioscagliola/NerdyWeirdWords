# Implementation plan

Refined backlog item: `.sally/github-000011/refined-backlog-item.md`

## Affected components

- `NerdyWeirdWordsBackend/WritingDomain`
  - Add the Markdown parser class for the writing domain.
  - Use the existing `Writing`, `Block`, `Heading`, `Paragraph`, and `Attribute` model classes as the parser output.
- `NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj`
  - Add a Markdig package reference if the parser uses Markdig.
- `NerdyWeirdWordsBackendTest`
  - Add a new NUnit test project named exactly `NerdyWeirdWordsBackendTest`.
  - Reference `NerdyWeirdWordsBackend` from the test project.
  - Add parser tests for the approved sample document.

## Implementation approach

Add a focused backend-domain parser that accepts Markdown text and returns a populated `Writing` object. Place it near the existing writing model as `WritingParser` in `NerdyWeirdWordsBackend/WritingDomain`, using the existing lowercase namespace style.

Use Markdig to parse CommonMark Markdown into an AST, then translate only the supported subset into the current object model:

- Convert ATX headings to `Heading` blocks.
- Convert paragraphs to `Paragraph` blocks.
- Flatten supported inline content into each block's `Text`, excluding Markdown delimiters.
- Convert emphasis spans to `Attribute` objects with `Key = "Italic"` and `Value = "start-end"`.
- Convert strong emphasis spans to `Attribute` objects with `Key = "Bold"` and `Value = "start-end"`.

The parser should initialize collection properties on created objects, including `Writing.Attributes`, `Writing.Blocks`, and block-level `Attributes`, so consumers and tests do not have to handle null collections for parser output.

Unsupported Markdown block and inline constructs should be ignored. Supported headings and paragraphs should still be parsed when unsupported constructs appear elsewhere in the document.

Do not wire the parser into upload or controller behavior as part of this backlog item. The approved refined item only requires the parser API and NUnit coverage.

## Implementation steps

1. Add Markdig to `NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj`.
2. Create a parser class named `WritingParser` in `NerdyWeirdWordsBackend/WritingDomain` using the existing namespace style, for example `com.nerdyweirdwords.backend.WritingDomain`.
3. Expose the parser API as `Do(string markdown): Writing`.
4. In the parser, create a `Writing` with empty document attributes and an ordered block list.
5. Iterate through the Markdig document blocks and translate only supported block types.
6. For heading blocks, set `Heading.Level`, flatten inline content to `Heading.Text`, and initialize `Heading.Attributes`.
7. For paragraph blocks, flatten inline content to `Paragraph.Text`, initialize `Paragraph.Attributes`, and add attributes for supported emphasis and strong emphasis spans.
8. Calculate attribute ranges from the flattened text positions using zero-based inclusive start indexes and exclusive end indexes.
9. Ignore unsupported blocks and unsupported inline nodes rather than creating placeholder objects or throwing validation errors.
10. Add the `NerdyWeirdWordsBackendTest` NUnit project targeting `net9.0` and reference the backend project.
11. Add a unit test that parses the approved sample document and asserts the exact block order, text, heading level, and emphasis attributes from the refined backlog item.
12. Run the relevant .NET test command and fix any parser/test issues within this scope.

## Tests

Create `NerdyWeirdWordsBackendTest` with NUnit, `NUnit3TestAdapter`, and `Microsoft.NET.Test.Sdk` package references.

Use Given-When-Then style test names.

Add a parser test for the sample Markdown document that verifies:

- The parser returns a non-null `Writing` object.
- `Writing.Attributes` is empty.
- `Writing.Blocks` contains exactly three blocks.
- The first block is a `Heading` with `Level = 1`, `Text = "The quick brown fox jumps over the lazy dog"`, and no attributes.
- The second block is a `Paragraph` with `Text = "The quick brown fox jumps over the lazy dog is an English-language pangram."`.
- The second block has exactly one attribute with `Key = "Italic"` and `Value = "0-43"`.
- The third block is a `Paragraph` with `Text = "A pangram is a sentence that contains all the letters of the alphabet."`.
- The third block has exactly one attribute with `Key = "Bold"` and `Value = "2-9"`.

Recommended validation command:

```bash
dotnet test NerdyWeirdWordsBackendTest/NerdyWeirdWordsBackendTest.csproj
```

If a solution file is introduced during implementation, also consider validating through the solution-level test command, but that is not required by the refined backlog item.

## Risks and technical considerations

- Markdig inline emphasis nodes can be nested or overlapping. The required sample only needs one italic span and one bold span, but the range calculation should not assume emphasis is always the entire paragraph.
- Strong emphasis may be represented differently from regular emphasis in Markdig's inline AST. Implementation should distinguish `**...**` from `*...*` and map them to `Bold` and `Italic` respectively.
- The existing model has nullable-enabled projects but non-null collection properties without initializers. This plan avoids changing the model unless implementation discovers a compile-time or testability issue that requires initializing those properties.
- Project references from an NUnit project to the existing Web SDK backend project should be validated with `dotnet test`; if that causes build friction, keep any project-file adjustment limited to making the backend reference testable.
- The parser should remain a domain utility for now. Upload/API integration is a later workflow decision and is outside this backlog item's acceptance criteria.

## Open Questions

- None.
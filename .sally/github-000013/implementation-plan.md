# Implementation plan

Refined backlog item: `.sally/github-000013/refined-backlog-item.md`

## Affected components

- `NerdyWeirdWordsBackend/WritingDomain`
  - Add the authenticated upload controller/action under the existing `[controller]/[action]` routing convention.
  - Add an upload feature folder containing the incoming DTO and its FluentValidation validator, following the existing `PersonDomain/SendSignInLink/SendSignInLinkIncoming.cs` convention.
  - Reuse `WritingParser` as the only Markdown parser.
- `NerdyWeirdWordsBackend/WritingDomain/Writing.cs`
  - Extend the existing `Writing` class with persistence/application properties: identity, title, optional description, owner relationship, and relational block/attribute navigations.
- `NerdyWeirdWordsBackend/WritingDomain/Block.cs`, `Heading.cs`, and `Paragraph.cs`
  - Extend the existing block hierarchy with stable identity, containing-writing relationship, explicit order, and relational attribute navigation. Preserve `Heading` and `Paragraph` as concrete TPH kinds while leaving the hierarchy open to future block types such as images or tables.
- `NerdyWeirdWordsBackend/WritingDomain/Attribute.cs`
  - Extend the existing attribute model with identity and its optional relationship to either a writing or a block, matching whether the attribute is document-level or block-level.
- `NerdyWeirdWordsBackend/NerdyWeirdDatabase.cs`
  - Add relational `DbSet`s and configure the extended writing object model, TPH block inheritance, writing/block ordering, attribute ownership, and required owner relationship to `Person` so `Database.EnsureCreated()` creates the model.
- `NerdyWeirdWordsBackend/Program.cs`
  - Register FluentValidation's validators, preserve the existing JWT configuration, and enable authentication in the request pipeline before authorization.
- `NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj`
  - Add FluentValidation and its dependency-injection integration package; writing persistence uses only relational EF Core mappings.
- `NerdyWeirdWords/NerdyWeirdWords/app/routes/upload-writing.tsx`
  - Read the existing `jsonWebToken` cookie and add `Authorization: Bearer <token>` to the existing multipart `fetch` request without changing field names or submission behavior.
- `NerdyWeirdWordsBackendTest`
  - Add endpoint, validation, authentication, relational persistence, inheritance, ordering, and no-persistence-on-failure tests, plus a narrowly scoped EF test provider/support dependency needed to exercise the model without requiring a live database.

## Implementation approach

Implement `POST /Writing/Upload` as an `[Authorize]` action in a writing-domain controller. Bind the existing multipart fields exactly as `writing`, `title`, and `description` to a feature-local `UploadWritingIncoming` class, located and named consistently with `PersonDomain/SendSignInLink/SendSignInLinkIncoming.cs`. The DTO should expose the uploaded `IFormFile` and the title/description fields needed by the existing form contract. Let the configured JWT bearer handler reject absent or invalid credentials before the action runs.

Use FluentValidation for all request-level validation. Register the validator through the existing application service configuration and invoke `IValidator<UploadWritingIncoming>` for the bound multipart DTO before parsing or persistence. Return the validation failures as a clear plain-text `400` body rather than the framework's structured validation-problem response, preserving the frontend's existing `response.text()` handling. The validator should independently enforce:

- reject a missing or zero-length `IFormFile` with a plain-text `400`;
- accept only a filename whose extension is `.md`, case-insensitive;
- reject a null, empty, or whitespace-only title with a plain-text `400`;
- accept an omitted or empty description;

Keep authentication/identity checks outside the DTO validator: resolve the `Person` using the authenticated principal's `sub` claim parsed as a `Guid`, and return a non-success response (use `401` for an unresolved authenticated identity) without creating an orphan row when it cannot be resolved.

Read the uploaded file as text and pass it to `WritingParser.Do`. Convert parser/read failures into clear plain-text `400` responses. Attach the parsed `Writing` graph to the resolved owner, assign its title and optional description, and save it once with the related blocks and attributes. This ordering guarantees that rejected files, invalid metadata, parser failures, and unresolved owners cannot persist a writing.

Use the existing `Writing`, `Block`, `Heading`, `Paragraph`, and `Attribute` classes as EF Core entities rather than introducing parallel persistence DTOs/entities. Map `Block` with straightforward table-per-hierarchy inheritance so the concrete `Heading` and `Paragraph` kinds are preserved in a discriminator column and future block kinds can join the same hierarchy. Add a stable key to every `Block`, a required `WritingId` relationship, and an explicit `Order` property so block order is persisted independently of database row order. Do not introduce TPT or a separate paragraph persistence model.

Model document-level and block-level attributes relationally using the existing `Attribute` class. Give each attribute its own identity and nullable foreign keys/navigation properties for its containing `Writing` or `Block`, with EF relationships configured so an attribute belongs to the appropriate owner. Preserve the parser's document `Writing.Attributes` and each block's `Block.Attributes` as related rows. Keep the future comment shape in mind without implementing it: a later `Comment` entity can require an author `PersonId` and a `WritingId`, then optionally reference a starting `Block`, `FromIndex`, `ToIndex`, and ending `Block`. That supports comments on an entire writing, any concrete block, a range within one block, or a range spanning multiple blocks.

Keep the successful response a normal `2xx` response with no new frontend-specific response contract; the existing page already treats any `response.ok` result as success and reads failure bodies with `response.text()`.

## Implementation steps

1. Add an `UploadWritingIncoming` DTO under a writing upload feature folder, following the existing `SendSignInLinkIncoming` naming/location convention and preserving the `writing`, `title`, and `description` form names.
2. Add an `UploadWritingIncomingValidator` using FluentValidation. Cover file presence/nonzero length, case-insensitive `.md` extension, and nonblank title; allow null or empty description.
3. Register FluentValidation and the feature validator in `Program.cs`/the backend project, while keeping action-level control of the response body so validation failures are plain-text `400` responses.
4. Extend `Writing` with a generated identity, title, optional description, required `Person` owner relationship, and relational `Blocks`/`Attributes` navigations. Extend `Block` with a generated identity, `Writing` relationship, explicit order, and attribute navigation; retain `Heading` and `Paragraph` as derived classes. Extend `Attribute` with its identity and writing/block ownership relationships.
5. Configure `NerdyWeirdDatabase` with relational `DbSet`s, TPH inheritance for `Block`/`Heading`/`Paragraph`, foreign keys, cascade behavior appropriate for a writing aggregate, and the block order column. Keep database creation on `EnsureCreated()` without migrations.
6. Add the writing controller/action at `POST /Writing/Upload`, decorate it with `[Authorize]`, bind the DTO with `[FromForm]`, invoke its FluentValidation validator, and return clear plain-text validation failures.
7. Read the validated upload and invoke `WritingParser.Do`; handle parser/read failures as plain-text `400` responses before attaching or saving the entity graph.
8. Extract and validate the JWT `sub` claim, load the corresponding `Person`, and reject malformed or unresolved identities without persisting data.
9. Assign application metadata and explicit block order to the parsed graph, attach it to the owner, and save the relational writing/block/attribute graph in one unit of work.
10. Ensure the request pipeline calls `UseAuthentication()` before `UseAuthorization()` so the existing JWT bearer handler actually establishes the authenticated principal used by `[Authorize]` and the `sub` lookup.
11. Update `upload-writing.tsx` to read `jsonWebToken` from `document.cookie` and send it as an `Authorization` bearer header alongside the unchanged `FormData` body and endpoint URL.
12. Add focused automated tests for the DTO validator, parser failure, authorization, owner lookup, successful relational persistence, TPH discriminator mapping, block ordering, stable block identity, attribute relationships, and no-persistence-on-failure.
13. Run the backend test project and the frontend type/build check used by the repository, then fix only issues within this upload-support scope.

## Tests

Use NUnit tests in `NerdyWeirdWordsBackendTest`, adding the minimal EF test infrastructure needed to construct the database and controller without depending on a production MySQL instance. Use Given-When-Then names and assert both validator/action results and relational database state.

Cover at least:

- missing file and zero-length file return plain-text `400` and leave no writing row;
- non-`.md` and case-insensitive `.MD` extension behavior;
- missing, empty, and whitespace-only titles return plain-text `400` and do not persist;
- omitted and empty descriptions are accepted;
- the feature-local `UploadWritingIncoming` DTO binds the unchanged multipart names and its FluentValidation validator produces failures for invalid file/title data while allowing an empty description;
- malformed Markdown/parser failure returns plain-text `400` and does not persist;
- missing bearer credentials and invalid tokens return `401` before persistence;
- a valid token whose `sub` is malformed or does not resolve to a `Person` returns a non-success response and creates no orphan row;
- a valid authenticated upload creates exactly one relational `Writing` with title, description, and the `Person` identified by `sub`;
- persisted blocks retain their concrete `Heading`/`Paragraph` types, text, heading levels, writing relationship, and explicit source order;
- every persisted block, including headings and paragraphs, has a stable non-default identity and can be loaded through the writing relationship for future comment targeting;
- the relational shape leaves a future comment able to require a writing, optionally reference a starting and ending block, and optionally store `FromIndex` and `ToIndex` without changing the block inheritance model;
- document-level attributes and block-level attributes persist through their intended relational relationships;
- the frontend upload request retains `writing`, `title`, and `description` and supplies the cookie token as `Authorization: Bearer <token>` (using the frontend test/type-check mechanism already present, or a focused source-level test if no frontend test runner exists).

Recommended validation commands:

```bash
dotnet test NerdyWeirdWordsBackendTest/NerdyWeirdWordsBackendTest.csproj
```

Run the frontend's existing package-script type/build validation from `NerdyWeirdWords/NerdyWeirdWords` as available in `package.json`.

## Risks and technical considerations

- EF Core inheritance mapping must preserve the concrete `Heading` and `Paragraph` types while allowing future comments to target any block through its inherited stable key; table-per-hierarchy is the simplest expected mapping and leaves room for future block types.
- `Attribute` currently has no owner identity, so the implementation must add the minimum nullable writing/block foreign keys and configure the two ownership relationships without introducing a parallel attribute entity. A model constraint or application invariant may be needed to ensure each attribute has exactly one owner.
- The explicit block order is part of the persistence contract; loading blocks for display or future comments must order by the persisted `Order` value rather than relying on database retrieval order.
- Future comment range semantics must not be encoded into this upload model: comments are out of scope, but stable block keys and explicit order must support a required writing, optional start/end blocks, and optional `FromIndex`/`ToIndex` later.
- `Program.cs` currently configures JWT bearer authentication and calls `UseAuthorization()` but does not call `UseAuthentication()`; the implementation must add the middleware call before authorization.
- The configured MySQL provider must support the selected relational inheritance and relationship mapping.
- Authentication middleware currently validates JWTs but lifetime validation is disabled. The upload action should rely on the existing mechanism and should not introduce unrelated token-policy changes.
- The upload page reads cookies in the browser, so the bearer header must be added without setting a manual multipart `Content-Type`; the browser must continue generating the boundary for `FormData`.
- Controller tests need to distinguish authentication failures handled by the ASP.NET pipeline from action-level owner lookup failures, while asserting that neither path writes a row.
- FluentValidation's automatic MVC integration may produce structured validation responses, so the plan deliberately favors explicit `IValidator<UploadWritingIncoming>` invocation or an equivalent configured plain-text failure path.
- Reusing the domain classes as EF entities requires clear relationship properties and collection initialization while preserving the parser's object construction behavior.

## Questions

1. None currently. The existing classes create one implementation detail to resolve during coding, not a product question: `Attribute` needs a relational owner representation because it currently has no writing/block foreign key. The plan chooses the minimal nullable writing/block relationships and an ownership invariant; no separate persistence class is required.


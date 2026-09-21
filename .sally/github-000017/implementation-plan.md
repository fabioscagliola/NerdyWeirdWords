# Implementation plan

Refined backlog item: `.sally/github-000017/refined-backlog-item.md`

## Affected components

- `NerdyWeirdWordsBackend/WritingDomain/Writing.cs`
  - Add the persisted `DateUploaded` property as a UTC `DateTimeOffset`.
- `NerdyWeirdWordsBackend/WritingDomain/WritingController.cs`
  - Assign the server timestamp during upload.
  - Add the authenticated `GET Writing/List` action that projects the current user's writings and orders them newest-first.
- `NerdyWeirdWordsBackend/NerdyWeirdWordsBackend.csproj`
  - No package change is expected; the existing ASP.NET Core, EF Core, and authentication dependencies are sufficient.
- `NerdyWeirdWordsBackendTest/WritingDomain/UploadWritingTests.cs`
  - Extend the existing SQLite-backed controller coverage for timestamp assignment.
  - Add list endpoint coverage for ownership filtering, ordering, response fields, empty results, and unauthorized access as appropriate to the existing test style.
- `NerdyWeirdWords/NerdyWeirdWords/app/routes/main.tsx`
  - Fetch the authenticated user's writings from `GET /Writing/List`.
  - Render the My writings list, localized upload timestamp, nullable description, and placeholder action links while retaining the upload link and existing auth redirect.
- `NerdyWeirdWords/NerdyWeirdWords/app/routes.ts`
  - No route registration is required for the placeholder action destinations because they intentionally do not need to exist in this backlog item.

## Implementation approach

Keep the change within the existing controller/entity boundary and reuse the current JWT and owner-identification convention. Add `DateUploaded` to `Writing` as a required `DateTimeOffset`, set it from `DateTimeOffset.UtcNow` in the successful upload path immediately before persistence, and do not add it to `UploadWritingIncoming`.

Add an `[Authorize]` `List` action to `WritingController`. Resolve the current user's identifier from `ClaimTypes.NameIdentifier` or the `sub` claim as the upload action does; return `Unauthorized` when it cannot be parsed. Query `database.Writings` for that `OwnerId`, order by `DateUploaded` descending, and project only the writing identifier, title, nullable description, and timestamp. Let ASP.NET Core serialize the `DateTimeOffset` as ISO 8601 JSON.

In `main.tsx`, preserve the existing authorization check and redirect behavior, then fetch the list endpoint with the JWT cookie as a Bearer token. Track loading/error/list state sufficiently to avoid rendering invalid data. Render an empty state for no writings and one item per response with the required metadata and links. Use browser locale formatting via `toLocaleString()` for the timestamp and construct the three placeholder paths from the returned writing identifier.

The database uses `Database.EnsureCreated()` and the refined item explicitly permits a reset database, so no migration or schema-history change is needed.

## Implementation steps

1. Add `public DateTimeOffset DateUploaded { get; set; }` to `Writing`, keeping the model's existing naming and initializer style.
2. In `WritingController.Upload`, assign `DateTimeOffset.UtcNow` to `DateUploaded` after the parsed writing has been populated with upload metadata and before calling `database.Writings.Add`/`SaveChangesAsync`.
3. Add an authenticated `List` action with route `GET /Writing/List`.
4. Reuse the upload action's claim parsing and unauthorized behavior for the list action.
5. Query only the authenticated owner's writings, sort descending by `DateUploaded`, and project the required response fields without exposing blocks or owner details.
6. Extend the existing upload integration-style test to assert the persisted timestamp is populated and represents a UTC offset.
7. Add controller tests using the existing SQLite in-memory setup for two owners, verifying the list excludes the other owner and returns the current owner's writings newest-first with nullable descriptions and identifiers intact.
8. Add an unauthorized list test for a missing or invalid subject claim, matching the existing controller result conventions.
9. Update `main.tsx` to request the list with the cookie JWT, handle non-success responses consistently with existing frontend fetch code, and render the required My writings fields and links.
10. Keep the upload-writing link and existing authentication redirect available on the main page; render a deterministic empty state when the endpoint returns no items.
11. Run the focused backend tests, then run the frontend typecheck and production build.

## Tests

Backend:

- Run `dotnet test NerdyWeirdWordsBackendTest/NerdyWeirdWordsBackendTest.csproj`.
- Extend `GivenValidUpload_WhenSubmitted_ThenWritingGraphIsPersistedRelationally` or add a Given-When-Then test to verify a successful upload stores a non-default UTC `DateUploaded` value.
- Add a list test that creates writings for two owners with distinct `DateUploaded` values, calls `List` as one owner, and verifies only that owner's records are returned in descending `DateUploaded` order with the expected identifier, title, description, and timestamp values.
- Add a list test for an owner with no writings and verify an empty successful result.
- Add a list test with no parseable identity and verify `Unauthorized`.

Frontend:

- Run `npm run typecheck` from `NerdyWeirdWords`.
- Run `npm run build` from `NerdyWeirdWords`.
- During review, verify the rendered list uses the three required placeholder paths, formats timestamps with the browser locale, tolerates `null` descriptions, and preserves the upload link. No new frontend test framework is currently configured, so these behavior checks should be covered by the type/build validation and manual browser verification against the backend response.

## Questions

1. None. The response field set is fixed by the refined backlog item; the implementation may choose a private response DTO or an equivalent projection without changing the wire contract.

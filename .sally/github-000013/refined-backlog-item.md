# Refined backlog item

Backlog item: [Issue #13](https://github.com/fabioscagliola/NerdyWeirdWords/issues/13) - Implement backend support for the existing writing upload page

## Description

Implement authenticated writing upload support for the existing `upload-writing.tsx` page.

Add a `POST /Writing/Upload` endpoint in the writing domain. The endpoint must accept the existing multipart form contract without renaming fields:

- `writing`: uploaded Markdown file;
- `title`: writing title;
- `description`: optional description.

The endpoint must independently validate the request, parse the Markdown with the existing `WritingParser`, and persist a successfully parsed writing. Persisted data must include the title, optional description, parsed `Writing` data serialized as JSON, and a reference to the authenticated `Person` owner.

The request must be authenticated using the existing JWT mechanism. The owner is the `Person` whose ID is present in the JWT `sub` claim. Missing or invalid bearer credentials must be rejected with `401`.

Update the existing upload page only as needed to send the JWT stored in its existing `jsonWebToken` cookie as an `Authorization: Bearer <token>` header. The multipart field names and submission behavior remain unchanged.

## Constraints

- Accept only non-empty uploaded files whose extension is `.md`, case-insensitive.
- Require a title that is not null, empty, or whitespace-only.
- Allow the description to be omitted or empty.
- Perform all validation on the server independently of frontend validation.
- Parse uploaded Markdown through the existing `WritingParser`; do not replace it with a second parser.
- Return validation and parsing failures as clear plain-text `400` responses compatible with the existing frontend, which reads `response.text()`.
- Do not persist a writing when validation or parsing fails.
- Protect the endpoint with the existing ASP.NET Core JWT authorization mechanism.
- Persist the owner relationship using the authenticated JWT `sub` claim and the existing `Person` entity.
- Store enough JSON data to reconstruct the parsed `Writing` object, including its blocks, block attributes, and document attributes.
- Follow the current database convention by extending the EF Core model used with `Database.EnsureCreated()`; do not introduce a separate migration system in this item.
- Preserve the existing frontend multipart field names and endpoint URL.

## Assumptions

- The existing JWT `sub` claim is the canonical authenticated user identity because `PersonController` creates it from `Person.Id`.
- The existing frontend cookie is available to the upload request and can be read by the upload page to construct the bearer header.
- A JSON column is supported by the configured MySQL provider and is sufficient for the initial persistence model.
- Existing `Person` rows are the source of truth for ownership; an authenticated token whose `sub` does not resolve to a persisted person is handled as a non-success request and must not create an orphan writing.
- The current parser's supported Markdown model (`Writing`, `Heading`, `Paragraph`, `Block`, and `Attribute`) is the serialization scope for this item.

## Acceptance criteria

1. `POST /Writing/Upload` accepts multipart form data with fields named `writing`, `title`, and `description`.
2. The existing upload page sends the JWT from its `jsonWebToken` cookie as a bearer token while preserving the current multipart submission contract.
3. Requests without a bearer token, with an invalid token, or with an otherwise unauthenticated identity receive `401` and do not persist data.
4. A missing or zero-length file receives a clear plain-text `400` response.
5. A file with no `.md` extension, or an extension other than `.md` ignoring case, receives a clear plain-text `400` response.
6. A missing or whitespace-only title receives a clear plain-text `400` response.
7. A missing or empty description is accepted.
8. Server-side validation is performed regardless of whether the frontend validation ran or passed.
9. The uploaded file is read and parsed using the existing `WritingParser`.
10. A parsing failure receives a clear plain-text `400` response and no writing row is persisted.
11. A successful request creates one persisted writing containing the submitted title, optional description, serialized parsed `Writing` data, and the authenticated `Person` owner.
12. The serialized data can be deserialized to reconstruct the parsed `Writing` object, including block types, text, levels, and attributes.
13. The writing entity and its owner relationship are included in the existing EF Core model and are created through the project's `EnsureCreated()` database setup.
14. The endpoint returns a success response for a valid authenticated upload that the existing frontend treats as successful.
15. Automated tests cover missing/empty files, extension validation, blank titles, optional descriptions, parser failure, successful persistence, JSON reconstruction, owner mapping from JWT `sub`, unauthenticated access, and the no-persistence-on-failure guarantee.

## Questions

1. None currently. The Software Engineer confirmed that frontend bearer-header wiring, plain-text `400` failures, JSON storage, the existing `EnsureCreated()` convention, and explicit JWT-owner/`401` tests are in scope.


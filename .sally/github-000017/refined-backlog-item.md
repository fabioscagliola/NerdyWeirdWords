# Refined backlog item

Backlog item: GitHub issue #17 - Add upload date and My writings list

Source: https://github.com/fabioscagliola/NerdyWeirdWords/issues/17

## Description

Track when each writing is uploaded and display the authenticated user's writings on the main page.

The backend already stores writings with `Title`, `Description`, and `OwnerId`, and the existing upload flow creates writings from authenticated requests. Extend that flow with a server-assigned UTC upload timestamp and add an authenticated endpoint for retrieving only the current user's writings.

Update `NerdyWeirdWords/app/routes/main.tsx` to fetch and display a **My writings** list. Each item must show:

- Title
- Description
- Upload date/time
- An Edit action
- An Invite action
- A Read action

The actions are placeholders and their destination routes do not need to exist in this backlog item. Use these paths, including the writing identifier:

- Edit: `/writings/:id/edit`
- Invite: `/writings/:id/invite`
- Read: `/writings/:id/read`

## Constraints

- Add `UploadDateTime` to the `Writing` entity as a UTC `DateTimeOffset`.
- Set `UploadDateTime` on the server when a writing is created; it must not be accepted from the client upload request.
- Use an authenticated `GET Writing/List` backend endpoint for the current user's writings.
- Determine the current user from the authenticated identity, using the same subject/identifier convention as the existing upload action.
- The list endpoint must return only writings owned by the authenticated user.
- Sort results by `UploadDateTime` descending, with the most recently uploaded writing first.
- Return the data needed by the frontend: writing identifier, title, description, and upload timestamp. The timestamp should be serialized as an ISO 8601 value suitable for browser locale formatting.
- Display the upload timestamp in a locale-formatted representation in the My writings list.
- Preserve the existing authentication and upload behavior.
- No database migration is required; the database will be reset during development/deployment.
- Do not implement the Edit, Invite, or Read destination pages or their backend workflows.
- Keep changes limited to the backend entity/API and the authenticated main-page list.

## Assumptions

- `DateTimeOffset.UtcNow` is the source of the server-assigned upload timestamp.
- `GET Writing/List` returns an empty JSON array when the authenticated user has no writings.
- Invalid or missing authentication follows the backend's existing unauthorized response behavior.
- The frontend can obtain the JWT from the existing `jsonWebToken` cookie and send it as a Bearer token, consistent with the current authorization checks.
- The main page should retain the existing upload-writing action.
- The list does not need pagination, filtering, editing, inviting, or reading behavior yet.
- A writing's `Description` may be null and should render without causing a frontend error.
- The backend endpoint may use an internal response DTO or an anonymous projection; the wire contract is the required set of fields, not a new persisted entity.

## Acceptance criteria

- `Writing` has an `UploadDateTime` property of type `DateTimeOffset`.
- A successful upload assigns the server's current UTC time to `UploadDateTime` before persistence.
- An upload request cannot override the assigned upload timestamp.
- An authenticated `GET /Writing/List` endpoint exists.
- The endpoint returns only writings whose `OwnerId` matches the authenticated user's subject/identifier.
- The endpoint returns the writing identifier, title, nullable description, and upload timestamp for each matching writing.
- The endpoint orders results by upload timestamp descending.
- An unauthenticated request to the list endpoint is rejected according to the existing API authorization behavior.
- The main page requests the current user's writings from the list endpoint using the existing JWT cookie as a Bearer token.
- The main page renders a **My writings** list containing the title, description, locale-formatted upload date/time, Edit link, Invite link, and Read link for each returned writing.
- The three action links use `/writings/{id}/edit`, `/writings/{id}/invite`, and `/writings/{id}/read` respectively.
- The existing Upload writing link remains available on the main page.
- The empty-list state renders without errors and does not display a fabricated writing.
- The relevant backend and frontend checks pass locally, including a backend test of timestamp assignment/list ownership and a frontend type/build check.

## Questions

- None.

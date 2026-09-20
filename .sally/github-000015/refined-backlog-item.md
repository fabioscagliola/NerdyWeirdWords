# Refined backlog item

Backlog item: GitHub issue #15 - Fix frontend authentication token persistence

Source: https://github.com/fabioscagliola/NerdyWeirdWords/issues/15

## Description

Fix the frontend authentication flow so that a valid JSON Web Token received through the sign-in URL is persisted in the existing `jsonWebToken` cookie and can be read by subsequent frontend routes and authenticated API requests.

The current sign-in flow writes the cookie without a root path, which limits the cookie's visibility to the sign-in route. The backend authentication endpoint and authenticated API behavior are considered working and are out of scope for this item.

After a valid token is accepted from the URL, the frontend must store it as a persistent cookie that expires 30 days after creation and is scoped to the frontend application root, then navigate to `/main`. Existing flows that read, validate, and clear the cookie must continue to work.

## Constraints

- Preserve the existing cookie-based authentication mechanism and the cookie name `jsonWebToken`.
- The cookie must expire 30 days after it is created.
- The cookie must be scoped with `path=/` so it is available across frontend routes.
- Do not change backend authentication, token generation, token validation, or API endpoint behavior.
- Do not change the token format or add a second token-storage mechanism.
- Preserve the existing behavior for invalid URL tokens and invalid stored tokens: they must not grant access, and invalid stored tokens must be cleared.
- Do not modify the original GitHub issue.

## Assumptions

- The token in the optional `/signin/:jsonWebToken?` route parameter is the token to persist after successful authorization.
- Subsequent authenticated requests obtain the token by reading `document.cookie` and send it as a Bearer token, as in the existing authorization helper.
- Users should remain signed in for up to 30 days after successful sign-in, subject to token validity and browser cookie behavior.
- The existing frontend project has no automated test runner, so validation may use the existing typecheck/build commands and a focused browser or manual flow check.
- Cookie attributes beyond `path=/` are outside this issue's scope.

## Acceptance criteria

- When a valid JSON Web Token is supplied through the sign-in URL, the frontend validates it before persistence.
- After successful validation, the frontend creates or updates the `jsonWebToken` cookie with `path=/` and an expiry 30 days after creation.
- After persistence, the frontend navigates to `/main` as it does today.
- On `/main` and other frontend routes, the stored token can be retrieved from `document.cookie` using the existing cookie name.
- An authenticated frontend request made after sign-in can use the retrieved token as a Bearer token and is accepted by the existing backend endpoint.
- A valid token already present in the root-scoped cookie continues to authorize navigation from `/signin` to `/main`.
- An invalid token supplied through the URL is not persisted and does not authorize navigation.
- An invalid token already stored in the cookie is cleared using the root path and does not authorize access.
- The frontend typecheck command passes: `npm run typecheck`.
- The frontend production build passes: `npm run build`.
- A focused verification demonstrates the complete flow: valid URL token, root-scoped cookie, navigation to `/main`, and a subsequent authenticated request carrying that token.

## Questions

1. None. The 30-day cookie lifetime and required cookie scope were confirmed during refinement.

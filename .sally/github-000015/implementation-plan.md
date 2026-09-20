# Implementation plan

Refined backlog item: `.sally/github-000015/refined-backlog-item.md`

## Affected components

- `NerdyWeirdWords/app/user/signIn.tsx`
  - Update persistence of a validated URL token so the `jsonWebToken` cookie is root-scoped and expires 30 days after creation.
  - Preserve the existing cookie lookup, token validation, navigation, and invalid-cookie cleanup behavior.
- `NerdyWeirdWords/app/util.ts`
  - No implementation change expected. Continue using the existing `isAuthorized` helper to validate tokens and issue authenticated requests.
- `NerdyWeirdWords/app/routes.ts`
  - No change expected. The existing optional `signin/:jsonWebToken?` route already supplies the token to the sign-in component.
- `NerdyWeirdWords/package.json`
  - Use the existing `typecheck` and `build` scripts for validation; no dependency or script changes are expected.

## Implementation approach

In the successful URL-token branch of `SignIn`, keep authorization as the gate before persistence, then write the existing `jsonWebToken` cookie with:

- `path=/`, so it is available on `/main` and other frontend routes;
- an explicit expiry 30 days from the time the cookie is created, so it persists beyond the browser session;
- no additional storage mechanism or backend changes.

The expiry should be calculated at the time the validated token is stored and serialized in the cookie assignment. Keep the existing root-path deletion behavior for invalid stored tokens. Do not change the behavior for invalid URL tokens.

The implementation should remain local to the sign-in authentication flow unless a small helper is needed to keep cookie creation and deletion consistent. Avoid changing route configuration, token validation, API contracts, or unrelated upload behavior.

## Implementation steps

1. Update `NerdyWeirdWords/app/user/signIn.tsx` in the validated URL-token branch.
2. Calculate an expiry date 30 days after the current time.
3. Assign `jsonWebToken` with the validated URL token, `expires=<calculated date>`, and `path=/`.
4. Preserve navigation to `/main` after the cookie is written.
5. Verify that the existing cookie read path can retrieve the root-scoped cookie and that invalid stored tokens are still deleted with `path=/`.
6. Run the frontend typecheck command: `npm run typecheck` from `NerdyWeirdWords`.
7. Run the frontend production build: `npm run build` from `NerdyWeirdWords`.
8. Perform a focused browser or manual verification with a valid token: open the sign-in route with the token, confirm navigation to `/main`, inspect that the cookie has root path and an approximately 30-day expiry, and confirm a subsequent authenticated request uses the stored token.
9. Verify invalid URL tokens are not persisted and invalid stored tokens are cleared without granting access.

## Tests

The frontend package does not currently define an automated test script or test framework. Validation should therefore combine static/build checks with focused authentication-flow verification:

- `npm run typecheck` must pass.
- `npm run build` must pass.
- A browser or manual flow check must confirm:
  - a valid URL token is validated before storage;
  - the resulting `jsonWebToken` cookie has `path=/`;
  - the cookie has an expiry 30 days after creation rather than being a session cookie;
  - navigation reaches `/main`;
  - the token remains readable after navigating away from `/signin` and can be used in the existing Bearer-token authorization request;
  - invalid URL tokens are not stored;
  - invalid stored tokens are cleared and do not authorize navigation.

No backend tests or backend changes are required because the approved backlog item treats backend authentication and affected API endpoints as working and out of scope.

## Questions

1. None. The cookie lifetime, root path, storage mechanism, and validation scope were confirmed in the approved refined backlog item.

## Risks and technical considerations

- The expiry must be calculated when the token is persisted, not once at module load time, so each successful sign-in receives a full 30-day lifetime.
- Cookie deletion must continue to use the same `path=/` scope as the persisted cookie; otherwise an invalid root-scoped cookie may remain present.
- The token must not be persisted before `isAuthorized` succeeds.
- Cookie attributes beyond `path=/` and the 30-day expiry are outside scope, including `Secure`, `HttpOnly`, and an explicit `SameSite` policy.

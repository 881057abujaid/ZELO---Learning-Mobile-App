# ZELO 2.0 — Authentication, Authorisation & Account Security Specification

**Document ID:** ZELO-SEC-025
**Filename:** `AUTH_SECURITY_SPEC.md`
**Version:** 2.5
**Status:** Draft
**Priority:** MVP — Must Have
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

Define how ZELO identifies users, protects accounts, manages sessions and prevents unauthorised access to personal data and learning resources.

The implementation must remain simple enough for an MVP while establishing security boundaries that will continue to work as the product grows.

## 2. Core Security Principles

1. **Server-side authority:** The backend determines the authenticated user and their permissions.
2. **Least privilege:** Each user receives only the access necessary for their role.
3. **User-data isolation:** One learner must never access another learner’s private data.
4. **Secure by default:** Protected resources require authentication unless explicitly public.
5. **No secret exposure:** Credentials, session tokens and private keys must not appear in client code or logs.
6. **Minimal complexity:** Use a well-maintained authentication solution rather than building a custom authentication system unnecessarily.

## 3. Authentication vs Authorisation

* **Authentication:** Verifies who the user is.
* **Authorisation:** Determines what that authenticated user is allowed to do.

Example: A learner may read a published HTML lesson and save their progress, but cannot publish a new curriculum lesson or modify another learner’s XP.

## 4. Authentication Scope

### 4.1 MVP account flows

* Register an account.
* Sign in.
* Sign out.
* Restore a valid session when reopening the app, according to the selected session policy.
* Handle expired or revoked sessions.
* Display clear validation and authentication errors.
* Support password recovery and email verification if required by the selected authentication provider and account model.

### 4.2 Authentication provider

**Decision: Open.**

Select the authentication provider after confirming the mobile/web platform, backend architecture and deployment requirements.

Prefer an established provider or framework integration. Avoid implementing custom password storage, token rotation or recovery mechanisms unless there is a clear requirement.

The interface should be provider-independent where practical so authentication implementation details do not spread throughout the application.

## 5. Session and Credential Security

### 5.1 Session lifecycle

A session must support:

1. Secure creation after successful authentication.
2. Expiration according to the configured policy.
3. Validation on protected requests.
4. Renewal only through an approved, secure mechanism.
5. Invalidation or revocation on sign-out where supported.
6. Clear handling of expired sessions without losing unrelated unsaved work unnecessarily.

Exact access-token and refresh-token lifetimes depend on the selected provider and platform.

### 5.2 Credential handling

* Never store passwords in plaintext.
* If ZELO manages passwords directly, use a modern, approved password-hashing algorithm and a secure password-reset flow.
* Never embed API secrets, private keys or administrative credentials in the mobile app or browser bundle.
* Keep server secrets in environment-specific secret management.
* Never log passwords, access tokens, refresh tokens or password-reset tokens.
* Use HTTPS for production authentication and protected API traffic.

### 5.3 Platform-specific handling

**Mobile application**

* Store persistent credentials only through an appropriate secure-storage mechanism.
* Do not store sensitive tokens in ordinary application preferences or unencrypted files.
* Define what happens to sessions when the app is uninstalled or its local data is cleared.

**Web application, if included**

* Prefer secure session handling appropriate to the chosen framework.
* If cookie-based authentication is used, configure `HttpOnly`, `Secure` and an appropriate `SameSite` policy.
* Implement CSRF protection where the chosen cookie/session architecture requires it.

The exact implementation depends on the final platform and authentication design.

## 6. Authorisation Rules

### 6.1 Roles

| Role                    | Access                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Unauthenticated visitor | Public content and permitted authentication endpoints                                   |
| Authenticated learner   | Own profile, settings, progress, drafts, submissions, rewards and quest progress        |
| Content administrator   | Content-management permissions only if an authorised publishing interface is introduced |

An administrator role is not required for the initial learner-facing MVP unless administrative functionality is included in the release scope.

### 6.2 Protected resources

The backend must enforce access control for:

* User profile and personal settings.
* Lesson and curriculum progress.
* Coding challenge drafts and submissions.
* XP reward ledger and quest progress.
* Any future private learning history or account data.

Published curriculum content may be publicly readable or available to authenticated learners according to the product decision. Unpublished content must not be exposed through learner-facing APIs.

### 6.3 User identity validation

Never trust a client-supplied `userId` as proof of ownership.

For example, if a request attempts to retrieve progress for another user, the backend must reject it unless an explicit permission allows that access.

The authenticated identity must be derived from the validated session or token. Ownership checks must be performed server-side for every relevant operation.

## 7. API Security Requirements

All protected endpoints under `/api/v1` must validate authentication and authorisation before returning or modifying private data.

Security requirements:

* Validate request parameters and payloads on the server.
* Reject malformed or invalid credentials.
* Apply rate limits to login, registration, recovery and other abuse-prone endpoints.
* Use consistent error-response structures.
* Avoid revealing whether an email address exists when doing so would enable account enumeration.
* Prevent users from changing protected fields such as roles, reward balances or ownership through ordinary profile-update requests.
* Apply appropriate request-size limits.
* Do not expose internal stack traces or sensitive infrastructure details to clients.

**Illustrative error response:**

```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Please sign in to continue."
  }
}
```

The response format must remain consistent with the API contract defined in `BACKEND_API_SPEC.md`.

## 8. Account and Personal Data Protection

* Collect only information required to operate ZELO.
* Allow users to update permitted personal details.
* Do not expose email addresses or private account information through public curriculum endpoints.
* Define an account-deletion process before public release.
* Establish what happens to learning history, coding submissions and reward records when an account is deleted.
* Apply the applicable privacy and data-retention requirements.
* Keep security logs limited to the information needed for troubleshooting and incident investigation.

Account deletion must not be implemented as an unrestricted database cascade without reviewing its effects on related records and audit requirements.

## 9. Authentication State in the UI

The application should provide clear states for:

* Signed out.
* Signing in.
* Registration in progress.
* Authentication successful.
* Invalid credentials.
* Network or service failure.
* Session expired.
* Session revoked.
* Password recovery in progress, if supported.
* Account verification pending, if required.

If a protected API returns an unauthenticated response, the application should restore or renew the session where appropriate, or return the user to sign-in.

Do not automatically treat every network error as an expired session.

## 10. Security Acceptance Criteria

The authentication implementation is acceptable only when the following tests pass.

* [ ] A user can register and sign in using the selected authentication flow.
* [ ] Invalid credentials do not create a session.
* [ ] Signing out invalidates the session according to the selected policy.
* [ ] Expired or revoked sessions cannot access protected endpoints.
* [ ] User A cannot read or modify User B’s progress by changing IDs in a request.
* [ ] Users cannot modify their role, XP ledger or protected fields through normal profile endpoints.
* [ ] Unauthenticated requests cannot access private drafts or submissions.
* [ ] Rate limits are applied to relevant authentication endpoints.
* [ ] Passwords and tokens never appear in application logs.
* [ ] Secrets are not embedded in client-side code.
* [ ] Recovery and verification flows, if included, reject invalid or expired tokens.
* [ ] Production traffic uses HTTPS.
* [ ] Authentication and authorisation failures produce safe, consistent responses.

## 11. MVP Boundaries

### Included

* One selected authentication method.
* Registration and sign-in.
* Sign-out and session-expiry handling.
* Protected backend endpoints.
* Server-side ownership checks.
* Secure secret management.
* Rate limiting and basic security logging.
* Essential authentication error states.
* Account recovery and verification where required by the chosen provider.

### Out of scope unless a requirement emerges

* Multiple social-login providers.
* Complex account linking.
* Enterprise single sign-on.
* Custom multi-factor authentication implementation.
* A sophisticated fraud-detection system.
* A complex role and permission-management dashboard.

Security-critical protections must not be excluded merely to simplify the MVP.

## 12. Dependencies

This specification depends on:

* `BACKEND_API_SPEC.md`
* `DATABASE_SCHEMA.md`
* `NAVIGATION_FLOW.md`
* `LOGIN_SIGNUP_SPEC.md`
* `PERSONAL_DETAILS_SPEC.md`
* The final mobile/web platform decision.

## 13. Open Decisions

Before implementation, decide:

1. Authentication provider and sign-in methods.
2. Whether the first release supports mobile only or mobile and web.
3. Session persistence, expiration and revocation policy.
4. Whether email verification is required.
5. Whether password recovery is applicable to the selected provider.
6. Account deletion and retention rules.
7. Whether an administrative content-publishing interface is part of the MVP.

These decisions should be documented before authentication code is implemented.

## 14. Definition of Done

This specification is ready for implementation when the authentication provider and session model are selected, protected resources are mapped to ownership rules, account lifecycle decisions are documented, and the security acceptance tests are included in the project test plan.

**End of Document — ZELO-SEC-025**

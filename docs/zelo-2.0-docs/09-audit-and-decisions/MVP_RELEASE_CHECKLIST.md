# ZELO 2.0 — MVP Release Checklist

**Filename:** `MVP_RELEASE_CHECKLIST.md`
**Document:** 46
**Version:** 4.6
**Status:** Draft — Proposed
**Project:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Purpose

This checklist defines the release-readiness requirements for the ZELO 2.0 Minimum Viable Product (MVP).

It is intended for use before:

* Internal testing.
* Staging release.
* Public beta.
* Initial production launch.

A feature being implemented does not automatically mean it is release-ready. Each release-critical feature must be tested, its known limitations documented, and its acceptance criteria verified.

## 2. Release Principles

1. **Learning comes first:** Users must be able to learn, practise, receive feedback, and track progress.
2. **Real functionality only:** Do not present mocked evaluation or unsaved progress as successful functionality.
3. **Security before release:** Secrets, user data, authentication, and code execution must be protected.
4. **Reliable recovery:** Errors must be understandable, and recoverable failures must not destroy progress.
5. **Controlled scope:** Features outside the approved MVP must not delay the core learning journey unless they affect safety or reliability.
6. **Evidence-based approval:** Release decisions must be based on tests and observable results, not assumptions.

## 3. Release-Critical User Journey

The following journey is the primary MVP acceptance test:

**Sign in → Explore HTML → Open a lesson → Complete activities → Pass a coding challenge → View results → Save progress → Return and resume.**

* [ ] A new user can register and sign in.
* [ ] An existing user can sign in again after closing and reopening the app.
* [ ] The user can discover the HTML learning path.
* [ ] Worlds, modules, and lessons display valid content.
* [ ] A lesson opens in the correct state.
* [ ] Supported activities render and accept input.
* [ ] Correct and incorrect answers receive appropriate feedback.
* [ ] Coding challenges execute through the approved isolated runner.
* [ ] Challenge results reflect actual evaluation.
* [ ] Lesson completion is accepted only when its requirements are satisfied.
* [ ] Results display accurate completion and reward information.
* [ ] Progress persists on the server.
* [ ] Retrying or repeating a completed request does not duplicate rewards.
* [ ] The user can leave and return without losing valid saved progress.
* [ ] Errors during the journey are handled without corrupting progress.

**Release gate:** Any unresolved defect that prevents this journey from working reliably blocks the release.

## 4. Authentication and Account Security

* [ ] Registration validates required fields.
* [ ] Login and logout work as expected.
* [ ] Authentication failures do not reveal sensitive information.
* [ ] Protected API endpoints reject unauthenticated requests.
* [ ] Users cannot access another user's profile, progress, or private data.
* [ ] Session or token handling follows the approved authentication design.
* [ ] Secrets are stored in approved server-side configuration.
* [ ] Production credentials are separate from development credentials.
* [ ] Rate limiting and abuse protection are applied where required.
* [ ] Password handling, recovery, and account deletion follow the approved scope and security requirements.

Do not launch with placeholder authentication, hard-coded credentials, or authorization checks enforced only by the client.

## 5. Curriculum and Lesson Content

* [ ] HTML MVP lessons have been reviewed for correctness.
* [ ] Lesson instructions are understandable to complete beginners.
* [ ] Examples and expected outputs are correct.
* [ ] Every activity uses a supported activity type.
* [ ] Required activity fields and answer formats validate correctly.
* [ ] Lesson identifiers and curriculum references are unique and valid.
* [ ] Content validation passes for all published lessons.
* [ ] Answer keys and hidden grading information are excluded from learner-facing responses.
* [ ] Published content has a recorded version.
* [ ] Incomplete or unpublished lessons are not accidentally presented as ready.
* [ ] Empty content, missing images, and malformed examples have graceful fallbacks.

CSS, JavaScript, and React content should be released when each curriculum stage is actually ready, rather than displaying incomplete lessons simply to fill the curriculum.

## 6. Learning Experience and UI

* [ ] Onboarding explains the basic learning experience.
* [ ] Home and Explore screens provide clear next actions.
* [ ] The learning path communicates lesson order and progress.
* [ ] The lesson player supports all approved activity types.
* [ ] The interface clearly distinguishes correct, incorrect, loading, and disabled states.
* [ ] Users can retry supported activities.
* [ ] Lesson completion and result screens communicate what was achieved.
* [ ] Navigation works consistently across the core journey.
* [ ] Profile and essential settings behave correctly.
* [ ] Loading, empty, error, and offline states are implemented where required.
* [ ] Interactive elements have clear labels and touch targets.
* [ ] Text remains readable on supported screen sizes.
* [ ] Reduced-motion preferences are respected where applicable.
* [ ] Animations do not block essential interaction.
* [ ] The visual design remains consistent with ZELO's approved design system.

## 7. Coding Challenge Evaluation

Coding challenges are a release-critical feature, not a simulated demonstration.

* [ ] The execution environment is isolated from the main application server.
* [ ] Supported languages and challenge types are documented.
* [ ] Execution time, CPU, memory, and output are limited.
* [ ] Network and filesystem access are appropriately restricted.
* [ ] User submissions are validated.
* [ ] Public examples and hidden tests are handled separately.
* [ ] Evaluation results accurately reflect the configured tests.
* [ ] Compile errors, runtime errors, timeouts, and failed tests produce understandable feedback.
* [ ] Repeated submissions do not corrupt challenge or lesson state.
* [ ] Runner failures do not incorrectly award completion or XP.
* [ ] Temporary execution resources are cleaned up.
* [ ] The runner can handle expected MVP usage without exposing other users' workloads.

If the approved runner is unavailable, disable the affected coding challenge or block release. Do not claim that code passed when it was not actually evaluated.

## 8. Progress, XP, and Rewards

* [ ] Progress is associated with the correct authenticated user.
* [ ] Activity attempts are recorded according to the approved policy.
* [ ] Completion requirements are enforced server-side.
* [ ] XP calculations follow the approved reward rules.
* [ ] Duplicate completion requests cannot award duplicate rewards.
* [ ] Failed requests do not leave progress in an inconsistent state.
* [ ] Retrying a network request is safe where idempotency is required.
* [ ] Home, Explore, Profile, and results screens display consistent progress.
* [ ] The application handles delayed synchronization and temporary network failures.
* [ ] Progress can be retrieved after signing in on a new session or supported device.

## 9. Backend and Database

* [ ] API contracts match the implemented endpoints.
* [ ] Request validation is implemented for relevant endpoints.
* [ ] Authentication and authorization are checked server-side.
* [ ] Error responses use a consistent documented structure.
* [ ] Database migrations have been reviewed and tested.
* [ ] Seed scripts work in development without unintended side effects.
* [ ] Production data is not overwritten by development seeding.
* [ ] Database constraints protect important relationships and unique records.
* [ ] Critical operations handle transaction boundaries appropriately.
* [ ] Database credentials use least-privilege access where practical.
* [ ] Health checks return the documented response.
* [ ] Sensitive data and internal exceptions are not exposed in public API responses.
* [ ] Pagination and request limits are applied where necessary.

## 10. Testing and Quality Gates

* [ ] Unit tests pass.
* [ ] API integration tests pass.
* [ ] Authentication and authorization tests pass.
* [ ] Database migration checks pass.
* [ ] Lesson schema and content validation pass.
* [ ] Activity grading tests pass.
* [ ] Lesson completion and reward idempotency tests pass.
* [ ] Coding challenge evaluation tests pass.
* [ ] Critical mobile navigation and UI tests pass.
* [ ] Loading, empty, error, and offline scenarios have been tested.
* [ ] Type checking passes where applicable.
* [ ] Linting passes according to project rules.
* [ ] Production build completes successfully.
* [ ] Critical defects have been fixed or explicitly assessed by the release owner.

A successful build alone is insufficient evidence of release readiness.

## 11. Privacy and Operational Security

* [ ] No secrets are committed to the repository.
* [ ] Production environment variables are configured securely.
* [ ] Client applications do not contain backend-only credentials.
* [ ] Logs avoid passwords, tokens, and unnecessary personal information.
* [ ] User data collection is limited to the approved product requirements.
* [ ] Privacy disclosures and applicable legal requirements have been reviewed.
* [ ] Dependency vulnerabilities have been assessed.
* [ ] API abuse and resource-exhaustion risks have been considered.
* [ ] Code execution limits have been verified.
* [ ] Access to production infrastructure is restricted to authorized personnel.

## 12. Deployment and Recovery

* [ ] Staging deployment has completed successfully.
* [ ] Production build and configuration have been verified.
* [ ] API base URLs and environment configuration point to the correct environment.
* [ ] Database migrations have an approved production procedure.
* [ ] Database backup and restoration procedures are documented and tested.
* [ ] Health checks and essential monitoring are available.
* [ ] Critical failures can be identified from logs or alerts.
* [ ] Rollback or recovery procedures are documented.
* [ ] Deployment does not expose development endpoints or test credentials.
* [ ] The team knows how to disable an unhealthy feature or release if necessary.
* [ ] A post-release verification plan exists.

## 13. Staging Acceptance Test

Before production approval, a tester should complete the following scenario using a staging account:

1. Register or sign in.
2. Open the HTML learning path.
3. Start the first published lesson.
4. Complete each required activity, including an incorrect answer and retry.
5. Submit a coding challenge that should pass.
6. Submit a coding challenge that should fail, where supported by the lesson.
7. Confirm the displayed result matches the actual evaluation.
8. Complete the lesson and verify XP and progress.
9. Repeat a completion request and confirm rewards are not duplicated.
10. Restart the application and verify persisted progress.
11. Test a temporary API or network failure and confirm appropriate recovery.
12. Confirm the user's data is not accessible from a different account.

**Acceptance result:** All release-critical steps pass, and no unresolved critical security, data-integrity, or code-execution issue remains.

## 14. Release Severity and Decision Rules

| Severity | Example                                                                                  | Release action                                       |
| -------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Critical | Authentication bypass, cross-user data access, unsafe code execution, corrupted progress | Block release                                        |
| High     | Core learning journey fails, completion is incorrectly awarded, major data loss          | Block release until resolved or explicitly re-scoped |
| Medium   | Significant secondary feature malfunction with a safe workaround                         | Assess impact and document decision                  |
| Low      | Minor visual defect with no meaningful usability or security impact                      | May defer with an owner and follow-up issue          |

Severity should be assigned based on actual user impact, security implications, and data integrity—not merely how easy a defect is to fix.

## 15. Release Approval Record

Complete this section for each release.

* **Release version:** To be assigned
* **Target environment:** Staging / Production
* **Release owner:** To be assigned
* **Build identifier or commit:** To be recorded
* **Test execution date:** To be recorded
* **Open defects:** To be listed
* **Known limitations:** To be listed
* **Rollback plan:** To be linked
* **Decision:** Approved / Rejected / Deferred
* **Approver and approval date:** To be recorded

### Approval conditions

A release may proceed only when:

1. All release-critical acceptance criteria pass.
2. No unresolved critical security or data-integrity issue remains.
3. The code execution environment meets its security requirements.
4. Deployment and recovery procedures are ready.
5. Remaining defects and limitations have been explicitly assessed.
6. The designated release owner approves the release.

## 16. Post-Release Verification

After deployment:

* [ ] Confirm the application starts and users can sign in.
* [ ] Verify the core learning journey in the production environment.
* [ ] Confirm the API and database are healthy.
* [ ] Verify a real coding challenge is evaluated correctly.
* [ ] Confirm progress and rewards persist correctly.
* [ ] Monitor error rates, latency, and code-runner failures.
* [ ] Review user-reported problems and critical logs.
* [ ] Trigger the documented recovery procedure if a release-critical regression appears.

Monitoring should be proportional to the MVP's scale and should avoid collecting unnecessary personal information.

---

**End of Document 46 — MVP Release Checklist**

**Next document:** Document 47 — `ZELO_DOCUMENTATION_INDEX.md`

Purpose: Create a central index of the ZELO 2.0 documentation, its versions, status, dependencies, and recommended reading order.

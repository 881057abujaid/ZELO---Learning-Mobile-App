# ZELO 2.0 — Deployment, Environments & Release Strategy

**Document ID:** ZELO-DEP-029
**Filename:** `DEPLOYMENT_RELEASE_SPEC.md`
**Version:** 2.9
**Status:** Draft
**Priority:** MVP — Must Have

---

## 1. Purpose

Define how ZELO 2.0 moves from local development to testing, staging and production.

The deployment process must provide:

* Reproducible builds.
* Safe environment configuration.
* Controlled database migrations.
* Reliable application releases.
* A clear recovery process when deployment fails.
* Minimal operational complexity for the initial release.

## 2. Deployment Principles

1. **Separate environments:** Development, testing, staging and production must not share unrestricted access to the same data or secrets.
2. **Reproducible builds:** The same source revision and dependency configuration should produce a predictable build.
3. **Automated checks:** Critical tests must pass before a release is promoted.
4. **Safe migrations:** Database changes must be reviewed and tested before production deployment.
5. **Secret isolation:** Production credentials must never be committed to the repository.
6. **Recoverability:** The team must know how to respond to a failed release.
7. **No premature infrastructure:** Use the simplest architecture that meets the product's actual requirements.

## 3. Environments

### 3.1 Local Development

Purpose: Build and test individual features.

Requirements:

* Local application configuration.
* Development database or isolated development database instance.
* Non-production credentials.
* Seed data for reproducible development.
* Fast feedback through linting, tests and builds.
* Clear setup instructions for a new development environment.

Developers must not use production secrets or run destructive experiments against production data.

### 3.2 Automated Test Environment

Purpose: Run repeatable automated checks.

Requirements:

* Isolated test data.
* Predictable database state.
* Automated setup and cleanup where practical.
* No dependency on real learner accounts.
* No accidental production notifications or payments.

### 3.3 Staging

Purpose: Verify a release candidate before production.

Requirements:

* Production-like configuration where practical.
* Separate staging database and credentials.
* Authentication and protected API verification.
* End-to-end testing of critical learning journeys.
* Migration validation.
* Code-execution security checks if the coding engine is included.

Staging must not be assumed safe for real production user data.

### 3.4 Production

Purpose: Deliver the application to real learners.

Requirements:

* Production-only secrets.
* Restricted database and administrative access.
* HTTPS for production traffic.
* Monitoring for availability and critical failures.
* Database backups and a documented recovery approach.
* Controlled migrations and releases.
* A documented way to disable or roll back a problematic feature where feasible.

## 4. High-Level Release Flow

<CodeBlock language="mermaid" model_previewable>
flowchart TD
    A["Feature implementation"] --> B["Local verification"]
    B --> C["Automated tests and build"]
    C --> D{"Quality gates pass?"}
    D -- No --> E["Fix issues"]
    E --> B
    D -- Yes --> F["Deploy to staging"]
    F --> G["Staging verification"]
    G --> H{"Release approved?"}
    H -- No --> E
    H -- Yes --> I["Production release"]
    I --> J["Smoke tests and monitoring"]
    J --> K{"Release healthy?"}
    K -- No --> L["Mitigate or roll back"]
    K -- Yes --> M["Release complete"]
</CodeBlock>

The diagram describes the intended workflow. It does not imply that deployment automation or any hosting provider has already been configured.

## 5. Build and Version Management

* Keep application code in version control.
* Commit dependency lockfiles.
* Pin or constrain dependencies using the selected package manager's supported conventions.
* Use a consistent runtime version across development and deployment.
* Record the source commit associated with each release.
* Use semantic versioning where it fits the release model, or another consistent version scheme.
* Avoid manually editing production build artifacts.

Each production release should be traceable to a source revision and its associated migration history.

## 6. Environment Variables and Secrets

Maintain separate configuration for each environment.

Typical configuration categories may include:

* Database connection details.
* Authentication provider configuration.
* Session or token verification settings.
* Backend API base URL.
* Code-execution service configuration.
* File-storage credentials, if required.
* Analytics credentials, if an analytics provider is selected.
* Logging and monitoring configuration.

Rules:

* Do not commit `.env` files containing real secrets.
* Maintain a `.env.example` with variable names and safe placeholders.
* Validate required configuration at application startup.
* Fail clearly when required server configuration is missing.
* Never expose server-only secrets through public client environment variables.
* Rotate credentials when exposure is suspected.
* Give each environment only the permissions it requires.

Exact variable names must be documented after the technology stack and hosting provider are finalised.

## 7. Database Migration Strategy

Database changes must be managed through version-controlled migrations.

### Before deployment

1. Review the schema change.
2. Generate or write the migration using the selected database tooling.
3. Apply it to a disposable or test database.
4. Run integration tests against the updated schema.
5. Verify how the migration affects existing data.
6. Confirm that a recovery strategy exists for risky changes.

### During deployment

* Apply migrations through a controlled deployment step.
* Avoid allowing every application instance to run migrations independently at startup.
* Confirm migration success before directing traffic to code that depends on the new schema.
* Monitor for database errors after deployment.

### Compatibility rule

Prefer backward-compatible schema changes where possible.

For example, when renaming a field, consider adding the replacement, migrating data, updating application code and removing the old field in a later release instead of performing a breaking change in one step.

A database rollback is not always safe. Recovery may require a forward fix or restoration from a verified backup.

## 8. Release Procedure

Every production release should follow this checklist.

### Pre-release

* [ ] Intended changes are committed and reviewed.
* [ ] Critical tests pass.
* [ ] Production build succeeds.
* [ ] Environment variables are verified.
* [ ] Database migrations are reviewed and tested.
* [ ] Authentication and data-isolation checks pass.
* [ ] Coding engine security checks pass if applicable.
* [ ] Backup and recovery considerations are reviewed for risky changes.
* [ ] Release notes identify important changes and known limitations.

### Deployment

* [ ] Deploy the intended source revision.
* [ ] Apply required migrations through the approved process.
* [ ] Verify service health.
* [ ] Run smoke tests.
* [ ] Check critical logs and error rates.
* [ ] Confirm the main learning flow works.

### Post-release

* [ ] Verify sign-in and session handling.
* [ ] Open a published lesson.
* [ ] Complete a test learning activity.
* [ ] Verify progress persistence.
* [ ] Verify coding challenge evaluation if released.
* [ ] Check for duplicate reward or progress records where relevant.
* [ ] Document the release and any issues found.

Use a dedicated test account and non-destructive checks where possible.

## 9. Smoke Tests

Smoke tests are a small set of high-value checks run immediately after deployment.

Minimum checks:

1. The application loads.
2. The backend health endpoint responds, if one is provided.
3. Authentication works.
4. Published curriculum content can be retrieved.
5. An authenticated learner can access their own progress.
6. A lesson activity can be completed and persisted.
7. The coding evaluation service responds correctly if included in the release.

A successful deployment command is not sufficient evidence that the product is healthy.

## 10. Rollback and Recovery

### Application failure

If the new application version fails:

1. Identify the affected functionality.
2. Stop further promotion of the release.
3. Roll back to the previous compatible application version when safe.
4. Disable the affected feature if a reliable feature flag or configuration switch exists.
5. Verify critical learner flows.
6. Record the incident and corrective action.

### Database migration failure

* Do not blindly reverse a migration that may have modified or removed data.
* Determine whether the migration is partially applied.
* Use a reviewed corrective migration, a compatible application version or a verified restoration procedure as appropriate.
* Confirm data integrity before reopening affected functionality.

### Data loss or corruption

Use verified backups and a documented recovery procedure. Define acceptable recovery point and recovery time objectives before public release according to the product's risk and available infrastructure.

**Important:** A backup is useful only if restoration has been tested.

## 11. Monitoring and Operational Signals

For the MVP, monitor a focused set of signals:

* Application availability.
* Backend error rate.
* Authentication failures and unusual abuse patterns.
* Database connectivity and migration failures.
* Coding execution failures and timeouts.
* Unexpected spikes in lesson-completion or reward errors.
* Storage or resource limits where applicable.

Logs should be useful for diagnosing issues without containing passwords, tokens, private source code or unnecessary personal data.

A sophisticated observability platform is not required initially. Use the basic capabilities of the selected hosting provider if they meet the requirements.

## 12. Deployment Acceptance Criteria

* [ ] Development, test, staging and production configurations are separated.
* [ ] Production secrets are not committed to source control.
* [ ] Required environment variables are documented.
* [ ] Database migrations are version-controlled and tested.
* [ ] Critical automated checks run before release.
* [ ] The release can be traced to a source revision.
* [ ] Post-deployment smoke tests are documented.
* [ ] A failed application release has a recovery procedure.
* [ ] Database restoration has been considered and tested before public launch.
* [ ] Critical application errors can be identified after release.

## 13. MVP Boundaries

### Included

* Local development workflow.
* Isolated automated testing.
* At least one pre-production verification process appropriate to the deployment setup.
* Production configuration and secret management.
* Controlled database migrations.
* Basic smoke tests and operational monitoring.
* Documented recovery steps.

### Out of scope unless required

* Multi-region deployments.
* Complex Kubernetes infrastructure.
* Microservices deployment orchestration.
* Sophisticated canary-release automation.
* Multi-cloud disaster recovery.
* A custom deployment dashboard.

Do not introduce these systems unless real scale, reliability or operational needs justify them.

## 14. Open Decisions

1. Final mobile and web deployment targets.
2. Backend hosting provider.
3. Database hosting and backup capabilities.
4. CI/CD provider and release automation.
5. Whether staging is a persistent environment or a temporary deployment.
6. Code-execution infrastructure and isolation model.
7. Monitoring and error-reporting provider.
8. Required backup frequency and recovery objectives.
9. Whether a feature-flag mechanism is needed for the MVP.

These decisions depend on the final architecture and budget.

## 15. Definition of Done

The deployment strategy is ready when environment boundaries are documented, secrets are handled securely, database migrations follow a controlled process, critical checks run before release, and the team has a verified method to diagnose and recover from a failed deployment.

**End of Document — ZELO-DEP-029**

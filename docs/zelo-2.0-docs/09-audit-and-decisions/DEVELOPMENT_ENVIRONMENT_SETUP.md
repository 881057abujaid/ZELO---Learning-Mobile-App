# ZELO 2.0 — Development Environment Setup

**Filename:** `DEVELOPMENT_ENVIRONMENT_SETUP.md`
**Document:** 45
**Version:** 4.5
**Status:** Draft — Proposed
**Project:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Purpose

This document defines the proposed process for setting up a consistent local development environment for ZELO 2.0.

The goals are to:

* Make onboarding and setup repeatable.
* Keep development, testing, staging, and production environments separate.
* Prevent secrets and credentials from entering Git.
* Standardize database initialization and content validation.
* Make testing and debugging easier.
* Support the feature-by-feature development workflow.

**Important:** The technology stack and repository structure have not yet been formally approved. The commands below are illustrative proposals, not guaranteed working project scripts.

## 2. Proposed Technology Baseline

| Area               | Proposed technology        | Status             |
| ------------------ | -------------------------- | ------------------ |
| Mobile application | React Native + Expo        | Pending approval   |
| Language           | TypeScript                 | Pending approval   |
| Backend API        | Node.js + Express          | Pending approval   |
| Database           | PostgreSQL                 | Pending approval   |
| ORM                | Prisma                     | Pending approval   |
| Lesson content     | Version-controlled JSON    | Proposed           |
| Code execution     | Isolated execution service | Provider undecided |
| Version control    | Git + GitHub               | Proposed           |
| CI/CD              | Automated checks in CI     | Provider undecided |

Do not install or configure every proposed service before the stack and platform decisions are approved.

## 3. Prerequisites

Install the tools required by the approved stack:

* Git
* Node.js, using the version specified by the project
* The selected package manager
* A code editor such as Visual Studio Code
* PostgreSQL locally or access to an approved development database
* Expo-compatible mobile testing tools if the mobile platform is selected
* API testing software or an equivalent HTTP client

Optional tools may include Docker, a database GUI, and Android Studio. Their necessity depends on the final development workflow.

### Version policy

1. Select and document the supported Node.js version.
2. Pin the package manager version where practical.
3. Commit the package-manager lockfile.
4. Use the same runtime versions in local development and CI.
5. Avoid upgrading major dependencies without checking compatibility and running the test suite.

A `.nvmrc` file and package metadata such as `engines` may be used to communicate the required versions.

## 4. Repository Setup

The final repository structure must follow `REPOSITORY_STRUCTURE_AND_CODING_CONVENTIONS.md` after architecture approval.

A possible monorepo structure is:

```text
zelo/
├── apps/
│   └── mobile/
├── services/
│   └── api/
├── packages/
│   └── shared/
├── content/
│   ├── curriculum.json
│   └── worlds/
├── docs/
├── .gitignore
├── README.md
└── package.json
```

This structure is illustrative. A monorepo, separate repositories, and the use of shared packages remain architectural decisions.

### Initial setup workflow

1. Clone the approved repository.
2. Check out the documented development branch.
3. Install dependencies using the committed lockfile.
4. Create local environment files from the documented examples.
5. Configure the development database.
6. Apply approved migrations and seed development data.
7. Start the required services.
8. Run health checks and automated tests.

Example:

```bash
git clone <approved-repository-url>
cd <repository-directory>

git status
```

Use the actual repository URL and directory name once established.

## 5. Dependency Installation

The package manager must be selected before installation instructions are finalized.

Illustrative npm commands:

```bash
npm ci
```

Run this in the relevant application or workspace directory according to the final repository structure.

Rules:

* Prefer reproducible installation from the lockfile.
* Do not mix package managers in the same package.
* Commit intentional dependency changes and the corresponding lockfile.
* Avoid adding packages when existing project utilities already solve the problem.
* Review dependency maintenance, compatibility, and security before adoption.

## 6. Environment Variables and Secrets

Environment-specific configuration must not be hard-coded into source files.

### Proposed environment files

```text
.env.example
.env.local
```

Use separate files or configuration mechanisms for the mobile application and backend where appropriate. Follow the selected framework's environment-variable conventions.

Illustrative backend configuration:

```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL=
AUTH_SECRET=
CODE_RUNNER_URL=
```

These names are examples only. The final variable names and required values must be defined by the approved authentication, database, and code-execution designs.

### Security rules

* Commit `.env.example` with placeholder values only.
* Add real environment files to `.gitignore`.
* Never commit database passwords, authentication secrets, API keys, signing keys, or production credentials.
* Never expose backend-only secrets through client-side environment variables.
* Use separate credentials for development, staging, and production.
* Rotate any secret accidentally committed or disclosed.
* Do not copy production data into development without explicit authorization and appropriate sanitization.

For a mobile application, assume bundled client configuration can be inspected by users. A value embedded in the application must not be treated as a secret.

## 7. Database Setup

If PostgreSQL and Prisma are approved, local database initialization should follow the database schema and migration policy.

### Proposed sequence

1. Create a dedicated development database.
2. Configure its connection string locally.
3. Install backend dependencies.
4. Apply committed development migrations.
5. Seed the database with safe sample data.
6. Verify the schema and essential records.
7. Start the backend and check its database connectivity.

Illustrative commands:

```bash
# Proposed only — confirm scripts and Prisma version first
npx prisma migrate dev
npx prisma db seed
```

These commands may require additional configuration depending on the approved Prisma version and project scripts.

### Database safety

* Use migrations to track schema changes.
* Commit migration files with the feature that requires them.
* Keep seed data deterministic and repeatable.
* Use fictional accounts and sample learning content.
* Never run development reset commands against production.
* Review the target database before executing destructive operations.
* Do not manually edit a shared database schema without recording the change.

Database restoration and reset procedures must be documented before the team begins relying on persistent development data.

## 8. Running the Application

The exact scripts will be finalized after the repository structure and package manager are approved.

Illustrative commands:

```bash
# Mobile application — proposed
npx expo start

# Backend API — proposed
npm run dev
```

Run commands from the correct application directory. If the project uses a workspace or root-level task runner, the final scripts may differ.

### Startup order

1. Start the development database.
2. Start any required local infrastructure.
3. Start the backend API.
4. Verify backend health and database connectivity.
5. Start the mobile application.
6. Test the critical learning journey.

The app must display a useful error when the API is unreachable rather than silently presenting stale or fabricated progress.

## 9. API Health Check

The backend should expose a lightweight health endpoint, such as:

```http
GET /api/v1/health
```

The final path must match the API contract.

The endpoint should report whether the service is running. If dependency health is included, its meaning must be explicit. Do not expose database credentials, secrets, internal stack traces, or sensitive infrastructure details.

Example local request:

```bash
curl http://localhost:5000/api/v1/health
```

The expected response must be documented once the endpoint contract is implemented.

## 10. Lesson Content Validation

Lesson content must be validated before it is used in the application or published.

The proposed validation process should check:

* JSON syntax and schema.
* Unique world, module, lesson, and step identifiers.
* Valid activity types and required fields.
* Correct references between curriculum entities.
* Valid answer formats and grading configuration.
* Required coding challenge instructions and test metadata.
* Content version compatibility.
* Missing text, malformed examples, and unsupported activity types.

Illustrative command:

```bash
npm run content:validate
```

This command is a proposed script name. It must not be treated as available until implemented.

Answer keys, private test cases, and other grading secrets must remain on the trusted server side. Learner-facing content responses must not expose them.

## 11. Code Runner Development Safety

Code execution is a security-sensitive component of ZELO 2.0.

Development must not rely on unrestricted execution inside the main API process.

The approved code runner must enforce appropriate controls, including:

* Isolation from the host and other users' workloads.
* CPU, memory, execution-time, and output limits.
* Restricted filesystem and network access.
* Input validation and controlled language/runtime support.
* Cleanup of temporary execution resources.
* Protection against malicious or intentionally expensive submissions.

Use harmless test programs during development. Do not execute untrusted submissions on a developer's host machine or inside the main API process as a shortcut.

HTML/CSS preview, JavaScript evaluation, and constrained React challenges may require different execution strategies. Their supported capabilities must be documented before implementation.

## 12. Testing and Quality Checks

The approved scripts should provide repeatable checks for each change.

Proposed command categories:

```bash
# Unit and integration tests
npm test

# Static type checking
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build
```

These commands are examples. Script names and tooling must be confirmed for each workspace.

Where applicable, automated checks should include:

* Unit tests.
* API integration tests.
* Database and migration checks.
* Lesson schema/content validation.
* Mobile UI and navigation tests.
* Authentication and authorization tests.
* Progress persistence and duplicate-reward tests.
* Code challenge evaluation tests.
* Accessibility and error-state checks.

Run the checks relevant to the changed feature before committing.

## 13. Git Workflow

ZELO 2.0 should follow a small, reviewable feature workflow.

1. Start from the agreed development branch.
2. Create a focused feature or fix branch.
3. Implement one meaningful feature.
4. Test the change and review the diff.
5. Run the relevant type, lint, and test checks.
6. Commit the completed change.
7. Push the branch and use the agreed review process.

Illustrative branch names:

```text
feat/lesson-activities
fix/progress-sync
docs/development-setup
```

Illustrative commit messages:

```text
feat(lesson): add single-choice activity
fix(progress): prevent duplicate lesson rewards
docs(setup): document local environment
```

The exact branching and review policy can be finalized with the repository workflow.

Avoid unrelated formatting changes, oversized commits, committed secrets, and mixing unfinished features into a release-ready branch.

## 14. Troubleshooting Guide

| Problem                           | Initial checks                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| Dependency installation fails     | Confirm Node.js and package-manager versions; inspect lockfile and network errors.   |
| Port is already in use            | Identify the process or configure an approved alternative port.                      |
| API is unreachable from the app   | Verify API startup, device networking, base URL, and firewall settings.              |
| Database connection fails         | Check database status, connection string, credentials, and network access.           |
| Migration fails                   | Read the complete error, confirm the target database, and inspect migration history. |
| Seed data is missing              | Confirm the seed command, environment, and database target.                          |
| Lesson content fails validation   | Inspect schema errors, required fields, IDs, and content references.                 |
| Coding challenge times out        | Check execution limits, runner health, queue status, and test configuration.         |
| Type checking fails               | Review compiler output and types introduced by the latest change.                    |
| Tests pass locally but fail in CI | Compare runtime versions, environment variables, lockfile, and test assumptions.     |

Never solve an environment issue by disabling security checks or applying an unreviewed destructive database command.

## 15. Definition of Done for Local Setup

The development environment is ready when:

* [ ] Required runtime and package-manager versions are documented.
* [ ] The approved repository can be cloned and dependencies installed.
* [ ] Environment configuration is documented without exposing secrets.
* [ ] The development database can be initialized safely.
* [ ] Migrations and seed data run successfully.
* [ ] The backend starts and its health endpoint responds.
* [ ] The client can connect to the development API.
* [ ] Lesson content validation works.
* [ ] Required automated quality checks can run.
* [ ] Code execution uses the approved isolated runner.
* [ ] A new developer can follow the setup guide without undocumented steps.

## 16. Decisions Required Before Finalizing This Guide

The following must be resolved:

1. Mobile-only application or mobile plus web.
2. Monorepo or separate repositories.
3. Node.js and package-manager versions.
4. Local database approach and development database provisioning.
5. Authentication provider and local configuration.
6. Code execution provider and its local development workflow.
7. Exact scripts for installation, validation, testing, and deployment.
8. CI/CD provider and required checks.
9. Approved branch, pull request, and commit conventions.

Until these decisions are approved, this document remains a setup proposal rather than an executable, verified runbook.

---

**End of Document 45 — Development Environment Setup**

**Next document:** Document 46 — `MVP_RELEASE_CHECKLIST.md`
Purpose: Verify the complete MVP, critical user journey, security, testing, deployment readiness, and release approval before launch.

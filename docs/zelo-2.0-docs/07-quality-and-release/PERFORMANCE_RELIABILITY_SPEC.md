# ZELO 2.0 — Performance & Reliability Requirements

**Document ID:** ZELO-PERF-030
**Filename:** `PERFORMANCE_RELIABILITY_SPEC.md`
**Version:** 3.0
**Status:** Draft
**Priority:** MVP — Must Have

---

## 1. Purpose

Define how ZELO 2.0 should perform under normal usage, slow network conditions and recoverable failures.

The application should feel responsive during learning, preserve completed work and provide clear feedback when an operation takes longer than expected.

## 2. Core Principles

1. **Perceived responsiveness:** Show immediate feedback when a learner interacts with the UI.
2. **Measured performance:** Use real measurements instead of assumptions.
3. **Graceful degradation:** A failed optional service should not unnecessarily break the entire app.
4. **Data integrity:** Slow requests and retries must not duplicate progress or rewards.
5. **Resource limits:** Code execution must have strict time and resource limits.
6. **Mobile-first optimisation:** Prioritise practical performance on typical mobile devices and networks.
7. **No premature optimisation:** Fix measured bottlenecks before introducing caching layers or complex infrastructure.

## 3. Performance Targets

The following are proposed initial targets for testing, not guarantees or measured results.

| Operation                               | Initial target                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Local UI response                       | Immediate visual feedback for ordinary interactions                          |
| Cached screen navigation                | Target under 200 ms where practical                                          |
| Standard API response                   | Target p95 under 500 ms for lightweight requests under the defined test load |
| Published lesson retrieval              | Target p95 under 1 second under the defined test load                        |
| Initial usable screen                   | Target under 3 seconds on the agreed reference device and network            |
| Code execution                          | Within the challenge-specific time limit                                     |
| Lesson completion persistence           | Confirm success only after the backend confirms the operation                |
| Recovery from transient network failure | Provide a retry path without duplicating the operation                       |

**Measurement rule:** API targets must be measured separately from client rendering, network latency and external code-runner time. A p95 target means 95% of measured requests complete within the stated time under the documented test conditions.

Final targets should be adjusted after baseline testing on the chosen stack and representative devices.

## 4. Critical User Journeys

Performance testing should prioritise:

* App launch and Home rendering.
* Opening Explore and a world learning path.
* Loading a lesson and its activities.
* Moving between lesson steps.
* Running and submitting a coding challenge.
* Saving lesson progress.
* Viewing results and updated XP.
* Returning to an unfinished lesson.

A fast Home screen is not sufficient if the actual lesson player or code runner feels slow.

## 5. Frontend Performance

### 5.1 Rendering

* Avoid unnecessary component re-renders where they measurably affect responsiveness.
* Keep lesson activity state local to the relevant feature where practical.
* Load large or non-essential resources only when needed.
* Use appropriately sized images and efficient image formats.
* Avoid loading every lesson and every world at app startup.
* Keep animations lightweight and respect reduced-motion preferences.
* Display stable layouts while content loads to minimise visual movement.

Do not introduce complex state-management or caching systems solely for hypothetical performance benefits.

### 5.2 Lists and curriculum content

* Render long lesson or activity lists efficiently.
* Fetch only the content required for the current screen or learning step.
* Paginate large administrative or historical lists if they grow substantially.
* Avoid downloading large image assets when a smaller representation is sufficient.

The actual list strategy should follow the selected framework and observed data volume.

## 6. Backend and API Performance

* Keep API responses focused on the data the screen needs.
* Add database indexes for frequently queried relationships and filtered fields.
* Avoid repeated database queries for the same information within a request.
* Use pagination for potentially large result sets.
* Set explicit timeouts for external services.
* Avoid blocking lesson completion on optional analytics delivery.
* Keep expensive code execution separate from ordinary API request processing.

Database optimisation should follow query analysis. Indexes and caching must be justified by actual access patterns.

## 7. Coding Engine Performance

Code execution is a distinct workload and must have stricter controls than ordinary API requests.

Requirements:

* Apply a per-challenge execution timeout.
* Limit CPU, memory and output volume.
* Terminate timed-out or runaway executions.
* Limit concurrent executions to protect service capacity.
* Return clear states: queued, running, completed, failed or timed out, as applicable.
* Distinguish learner-code errors from infrastructure errors.
* Avoid making the main application server execute arbitrary learner code without an appropriate isolation boundary.
* Ensure one learner's execution cannot block or inspect another learner's work.

Timeout values should be configured according to the language, challenge type and execution environment. Do not assume one universal timeout is appropriate for HTML, JavaScript and React challenges.

## 8. Network Resilience

ZELO should handle temporary network failures without misleading the learner.

### Required behaviour

* Show a loading state for requests that take noticeable time.
* Prevent accidental repeated submission while a non-repeatable operation is in progress.
* Provide a retry option after recoverable failures.
* Preserve local, unsaved work when practical.
* Distinguish network failure from incorrect code or an incorrect answer.
* Avoid silently discarding completed activity input.
* Refresh stale server data when reconnecting.

### Safe retries

Read-only requests can generally be retried according to the request policy.

For operations such as lesson completion, reward creation or challenge submission, retries must be designed around idempotency or duplicate detection. A client timeout does not prove that the server failed to process the request.

Full offline learning and background synchronisation are not required for the MVP unless later prioritised.

## 9. Reliability and Data Integrity

The following operations require special care:

### Lesson completion

* Persist completion on the backend.
* Handle repeated completion requests safely.
* Do not show confirmed completion before receiving an authoritative result.
* Recover correctly when the response is lost after the server commits the operation.

### XP rewards

* Award rewards through authoritative server-side rules.
* Prevent duplicate rewards from repeated requests or network retries.
* Keep the reward ledger and displayed totals consistent.

### Coding submissions

* Associate each submission with the correct learner and challenge.
* Store a result only according to the defined submission policy.
* Handle runner timeouts and service failures distinctly.
* Do not expose hidden test cases when an evaluation fails.

## 10. Availability and Recovery Targets

Availability targets depend on the hosting provider, release architecture and budget.

For the MVP:

* Establish a basic service-health check.
* Detect backend and database connectivity failures.
* Monitor repeated API failures and code-runner timeouts.
* Document how to restore service after a deployment failure.
* Maintain backups appropriate to the importance of learner data.
* Test the recovery process before public launch.

**Recovery Point Objective (RPO):** The maximum acceptable amount of data loss measured in time.

**Recovery Time Objective (RTO):** The target time to restore service after a disruptive failure.

Exact RPO and RTO values remain open decisions. They should reflect realistic hosting capabilities and the consequences of losing learner progress.

## 11. Resource and Cost Management

* Limit request payload sizes.
* Limit code execution time, memory and output.
* Set sensible database connection limits.
* Monitor storage and compute usage.
* Prevent unlimited retries or unbounded background jobs.
* Avoid expensive polling where a simpler request-driven flow works.
* Introduce caching only where correctness and invalidation rules are clear.

The system must remain understandable and maintainable before it is optimised for large-scale traffic.

## 12. Performance Testing Strategy

### Phase 1 — Baseline

Measure:

* Initial screen load.
* Lesson retrieval.
* Lesson-step transitions.
* Progress-save latency.
* Challenge execution latency.
* Backend error rate.

Use representative devices, realistic lesson content and documented network conditions.

### Phase 2 — Load testing

Test:

* Concurrent lesson retrieval.
* Simultaneous progress updates.
* Multiple coding submissions.
* Database behaviour under the expected initial load.

Define expected concurrency before selecting the load-test profile.

### Phase 3 — Failure testing

Simulate:

* Slow responses.
* Temporary network disconnection.
* Backend unavailability.
* Database connection failure.
* Code-runner timeout.
* Repeated requests.
* Lost responses after successful server processing.

Verify that the learner receives a useful status and that persistent data remains consistent.

## 13. Performance Acceptance Criteria

* [ ] Baseline measurements exist for critical learner journeys.
* [ ] The initial performance targets are measured under documented conditions.
* [ ] Lesson navigation provides prompt visual feedback.
* [ ] Loading, timeout and failure states are implemented.
* [ ] Lesson completion remains consistent after a lost response and retry.
* [ ] Repeated reward requests do not create duplicate awards.
* [ ] Coding execution has configured time and resource limits.
* [ ] One code execution cannot consume unlimited shared resources.
* [ ] Database queries for critical flows have been checked for avoidable inefficiencies.
* [ ] The release passes the agreed critical-flow performance tests.
* [ ] Recovery and backup procedures have been tested according to release risk.

## 14. MVP Boundaries

### Included

* Basic performance measurement.
* Responsive UI and loading states.
* Efficient curriculum retrieval.
* Safe retry handling for critical operations.
* Code execution limits and isolation.
* Basic health monitoring.
* Tested recovery procedures.

### Out of scope unless justified

* Multi-region deployment.
* Complex distributed caching.
* Large-scale auto-scaling architecture.
* Custom performance analytics infrastructure.
* Predictive capacity management.
* Advanced offline synchronisation.

These features should be introduced only when product needs and measured usage justify them.

## 15. Open Decisions

1. Reference devices and network conditions for performance testing.
2. Final response-time targets after baseline measurements.
3. Expected concurrent users for the first public release.
4. Hosting provider and service-health capabilities.
5. Code-runner resource limits.
6. Backup frequency, RPO and RTO.
7. Whether offline lesson access should be introduced in a later release.

## 16. Definition of Done

The performance and reliability foundation is ready when critical user journeys have measurable targets, transient failures do not corrupt learner progress, coding workloads are bounded and isolated, and the team has a tested approach to monitoring and recovery.

**End of Document — ZELO-PERF-030**

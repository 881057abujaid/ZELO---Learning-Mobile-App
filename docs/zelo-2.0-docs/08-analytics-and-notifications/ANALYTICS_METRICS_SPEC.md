# ZELO 2.0 — Analytics & Learning Metrics Specification

**Document ID:** ZELO-AN-027
**Filename:** `ANALYTICS_METRICS_SPEC.md`
**Version:** 2.7
**Status:** Draft
**Priority:** MVP — Must Have for Measurement; Advanced Analytics — Later

---

## 1. Purpose

Define the minimum analytics ZELO needs to understand learner engagement, lesson completion, coding practice and retention.

Analytics must help answer four questions:

1. Are new learners starting their first lesson?
2. Are learners completing lessons and understanding the material?
3. Where do learners encounter difficulties or abandon a lesson?
4. Do learners return and continue learning?

Analytics should support product decisions without collecting unnecessary personal information or distracting the team with vanity metrics.

## 2. Analytics Principles

* **Learning outcomes over screen views:** Prioritise meaningful learning actions.
* **Data minimisation:** Collect only what supports a defined product question.
* **Privacy by design:** Never collect passwords, authentication tokens or raw sensitive information in analytics.
* **Consistent event definitions:** One event must have one documented meaning.
* **Reliable measurement:** Prevent duplicate events and distinguish failed actions from successful ones.
* **Actionable insights:** Every important metric should help inform a product decision.
* **Beginner-friendly interpretation:** An incorrect answer is useful diagnostic information, not evidence that a learner has failed overall.

## 3. Primary Product Metrics

### 3.1 Activation Rate

**Question:** Are new users reaching the first meaningful learning experience?

Definition:

$$
\text{Activation Rate} =
\frac{\text{New users completing their first lesson}}
{\text{New users who registered}}
\times 100
$$

The measurement window must be defined consistently, for example within seven days of registration.

Initial target: **70% of users who complete onboarding start their first lesson**, as defined in the PRD. This is a proposed target, not an observed result.

### 3.2 First Lesson Completion Rate

**Question:** Can beginners successfully complete their first lesson?

$$
\text{Completion Rate} =
\frac{\text{Users completing their first lesson}}
{\text{Users starting their first lesson}}
\times 100
$$

Initial target: 60% of first-lesson starters complete it.

Use a consistent cohort and time window when reporting this metric.

### 3.3 Seven-Day Return Rate

**Question:** Do learners come back after their initial session?

Track the percentage of new learners who perform a meaningful learning action during days 1–7 after their initial activity, using a clearly documented cohort definition.

Meaningful actions include:

* Starting or continuing a lesson.
* Completing an activity.
* Submitting a coding challenge.

A simple app launch or background refresh should not automatically count as meaningful learning.

Initial target: 30% of first-lesson completers return within seven days.

### 3.4 Learning Progression

Measure:

* Lessons started.
* Lessons completed.
* Modules completed.
* Curriculum progression by world.
* Time between lesson start and completion, where reliable and useful.

Do not treat a high lesson count alone as proof of learning quality.

### 3.5 Coding Practice Engagement

Measure:

* Coding challenges started.
* Code runs initiated.
* Submissions attempted.
* Submissions passing evaluation.
* Challenges completed.
* Common failure categories.

Track first-attempt success separately from eventual success after retries. This helps distinguish challenge difficulty from successful learning through feedback.

## 4. Event Taxonomy

All event names should use a consistent `snake_case` convention.

| Event                       | When it fires                                | Purpose                              |
| --------------------------- | -------------------------------------------- | ------------------------------------ |
| `onboarding_completed`      | Required onboarding steps finish             | Measure onboarding completion        |
| `lesson_started`            | A learner starts a lesson                    | Measure activation and lesson starts |
| `activity_answered`         | An activity is answered                      | Measure activity interaction         |
| `activity_feedback_viewed`  | Feedback is presented                        | Understand feedback exposure         |
| `coding_challenge_started`  | A coding challenge opens for work            | Measure coding engagement            |
| `code_run_requested`        | A learner requests execution                 | Measure practice attempts            |
| `code_submission_evaluated` | Evaluation returns a result                  | Measure challenge outcomes           |
| `lesson_completed`          | The server confirms lesson completion        | Measure learning progression         |
| `xp_awarded`                | A valid reward is recorded                   | Measure reward distribution          |
| `quest_completed`           | A quest reaches its completion criteria      | Measure quest engagement             |
| `learning_session_started`  | A meaningful learning session begins         | Analyse learning sessions            |
| `learning_session_ended`    | A session ends according to the defined rule | Estimate session duration            |

Events must represent real outcomes. For example, `lesson_completed` must not fire simply because a user opens the lesson result screen.

## 5. Standard Event Properties

Where relevant, events may include:

* `event_id`: unique identifier for deduplication.
* `occurred_at`: event timestamp.
* `user_id`: internal pseudonymous identifier, if user-level analytics are permitted.
* `session_id`: temporary identifier for grouping related activity.
* `world_id`: relevant curriculum world identifier.
* `lesson_id`: relevant lesson identifier.
* `activity_type`: category of activity.
* `result`: a controlled value such as `correct`, `incorrect`, `passed` or `failed`.
* `platform`: supported platform category.
* `app_version`: application version.

Properties should be included only when necessary for the specific event. Avoid sending empty or irrelevant fields.

Never include passwords, tokens, full request bodies, private code content or personally identifying information that is not necessary for the defined analytics purpose.

## 6. Event Ownership and Reliability

### 6.1 Client-side events

The client can record interactions such as:

* Opening a screen.
* Selecting an answer.
* Requesting a code run.
* Starting a learning session.

These events describe user interactions, not authoritative business outcomes.

### 6.2 Server-side events

The backend should be the authoritative source for:

* Confirmed lesson completion.
* XP awards.
* Quest completion.
* Persisted coding evaluation results.
* Successful progress updates.

Client-generated events must not be used as proof that a reward or completion actually occurred.

### 6.3 Duplicate prevention

* Give events stable identifiers where retries are possible.
* Deduplicate events when processing or aggregating them.
* Avoid counting a single lesson completion multiple times because of repeated API requests.
* Distinguish repeated coding attempts from duplicated network events.
* Do not award XP simply because an analytics event was received.

Analytics failures must not prevent the core learning action from succeeding.

## 7. Funnel Analysis

The primary beginner funnel is:

**Registration → Onboarding Completed → First Lesson Started → First Lesson Completed → Second Lesson Started → Return Within 7 Days**

For each stage, report:

* Number of eligible users.
* Number progressing to the next stage.
* Conversion rate.
* Drop-off rate.
* Relevant cohort and measurement window.

A funnel should identify where learners leave, not assume why they leave. Follow up with usability tests, feedback or qualitative research before deciding on a fix.

## 8. Lesson Quality Metrics

For each published lesson, measure:

* Unique learners starting it.
* Completion rate.
* Median completion time, if timestamps are reliable.
* Activity-level correct and incorrect response rates.
* Retry frequency.
* Coding challenge first-attempt pass rate.
* Final challenge completion rate.
* Drop-off before completion.

Interpret these metrics together.

Examples:

* A high incorrect-answer rate may indicate a difficult concept, unclear wording or a weak prerequisite.
* A high completion rate with almost no interaction may indicate that the lesson is too easy or does not assess understanding.
* A high retry rate followed by successful completion may indicate that feedback is helping learners improve.

Do not automatically remove challenging material because its first-attempt pass rate is low.

## 9. Dashboard Requirements

### MVP product dashboard

A basic internal report should show:

1. New registrations.
2. Onboarding completion rate.
3. First lesson start and completion rates.
4. Seven-day return rate.
5. Lessons completed.
6. Coding challenge first-attempt and eventual pass rates.
7. Lesson-level drop-off and retry patterns.

Filters may include date range, world, lesson and platform where the data supports them.

Do not build a complex real-time analytics dashboard for the initial release. A simple report or basic dashboard is sufficient.

## 10. Privacy and Data Governance

* Define a purpose for every tracked event.
* Collect the minimum data necessary.
* Avoid collecting raw source code or user-entered free text for analytics.
* Keep authentication and security logs separate from product analytics where practical.
* Restrict access to user-level analytics.
* Establish retention and deletion rules before public release.
* Respect applicable privacy requirements and user choices.
* Document whether analytics is first-party, third-party or both.
* If a third-party analytics provider is selected, review its data handling, access controls and configuration before integration.

Analytics should not be used to infer sensitive personal attributes.

## 11. MVP Implementation Strategy

### Phase 1 — Essential measurement

* Define the event taxonomy.
* Record meaningful learning events.
* Ensure server-authoritative events are correct.
* Establish funnel and completion-rate calculations.
* Validate events during manual testing.
* Use basic reporting to review activation and retention.

### Phase 2 — Lesson diagnostics

* Add lesson-level drop-off reporting.
* Compare first-attempt and eventual challenge success.
* Analyse retry patterns.
* Identify lessons that may require content revisions.

### Phase 3 — Advanced analytics

Only consider these when there is a clear product need:

* Controlled experiments.
* More detailed cohort comparisons.
* Advanced behavioural segmentation.
* Automated anomaly detection.
* Personalised learning recommendations.

AI-driven learner profiling is not required for the MVP.

## 12. Analytics Acceptance Criteria

* [ ] Every MVP event has a documented trigger and purpose.
* [ ] Event names and property formats are consistent.
* [ ] Lesson completion events correspond to persisted completion.
* [ ] XP events correspond to confirmed reward records.
* [ ] Repeated requests do not inflate unique completion counts.
* [ ] Failed code runs are distinguishable from successful evaluations.
* [ ] Funnel metrics use documented denominators and time windows.
* [ ] No passwords, authentication tokens or raw private code are sent to analytics.
* [ ] Analytics outages do not break lessons or coding practice.
* [ ] Retention and access policies are documented.
* [ ] Key metrics can be checked against authoritative application data.

## 13. Out of Scope

* Public leaderboards and social analytics.
* Tracking every tap or animation.
* Recording learner screens or keystrokes.
* Collecting raw code for behavioural profiling.
* Complex predictive models.
* Personalised advertising analytics.
* Claims about learning improvement without appropriate evidence.

## 14. Open Decisions

1. Which analytics provider, if any, will be used?
2. Will the MVP use first-party analytics, third-party analytics or basic database reporting?
3. What is the exact definition of a learning session?
4. What cohort and time-window definitions will be used for retention?
5. How long should event-level data be retained?
6. Which users may access the analytics dashboard?
7. What consent and privacy controls are required for the selected deployment regions?

These decisions must be finalised before integrating a third-party analytics service.

## 15. Definition of Done

The analytics foundation is ready when the essential events are documented, critical events are sourced from authoritative server outcomes, core funnel calculations are validated, privacy rules are defined, and the team can use the resulting measurements to identify specific product improvements.

**End of Document — ZELO-AN-027**

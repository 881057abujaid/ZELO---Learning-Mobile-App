# ZELO 2.0 — PROGRESS_XP_SPEC.md

**Version:** 1.9
**Status:** Draft
**Module:** Progress Tracking & XP Rules
**Priority:** MVP — Must Have
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

Define one reliable system for tracking learning progress and awarding Experience Points (XP) throughout ZELO 2.0.

The system must provide consistent progress information across:

* Home Dashboard
* Explore Worlds
* World Learning Path
* Lesson Player
* Lesson Completion & Results
* Coding Practice
* Daily Quests
* Profile & Learning Progress

**Core principle:** Progress represents what a learner has actually completed. XP rewards learning activity according to centrally defined rules.

## 2. Progress Tracking Model

### 2.1 Lesson progress states

| State       | Meaning                                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| Not Started | The learner has not started the lesson.                                                 |
| In Progress | The learner has started but has not completed the lesson.                               |
| Completed   | All required completion criteria have been satisfied and the completion has been saved. |
| Locked      | The lesson is unavailable because a required prerequisite has not been completed.       |

`Available` is a UI status derived from access rules; it does not need to be stored as a separate learner progress state.

### 2.2 Lesson completion rules

A lesson becomes Completed only when:

1. All required steps have been completed.
2. Required assessments have passed according to their configured rules.
3. Any required coding challenge has passed.
4. The completion record has been successfully persisted.

Optional steps may be skipped only when their configuration explicitly allows it.

Opening a lesson, viewing an explanation, or pressing Continue without satisfying required criteria must not automatically mark the lesson as completed.

### 2.3 Resume behaviour

* A learner can resume an In Progress lesson from the last saved step.
* The system must preserve answers or coding drafts where supported.
* Reopening a completed lesson opens Review Mode.
* Reviewing a lesson must not create another lesson completion or award completion XP again.
* If content changes after a learner starts a lesson, the application must handle the content version explicitly instead of silently corrupting progress.

## 3. Progress Calculation

### 3.1 World progress

Calculate progress using published lessons that belong to the selected world.

**Formula:**

World Progress = Completed Published Lessons ÷ Total Published Lessons × 100

Example: If 6 of 10 published lessons are completed, world progress is 60%.

### 3.2 Overall curriculum progress

Calculate progress across the published curriculum.

Overall Progress = Completed Published Lessons ÷ Total Published Lessons × 100

The application must use one consistent denominator across Home, Explore and Profile.

### 3.3 Calculation rules

* Draft and archived lessons must not count as active learning targets.
* Locked published lessons may count in the curriculum total, but they cannot be completed until unlocked.
* A completed lesson counts once, regardless of how often it is reviewed.
* A world is complete only when all required published lessons in that world are complete.
* If no published lessons exist, display an appropriate empty state instead of dividing by zero.
* Progress values must be between 0% and 100%.
* The backend or authoritative progress service must calculate or validate persisted completion status; the UI must not independently invent progress.

**Open decision:** Whether optional lessons should contribute to world completion and the overall curriculum percentage. This must be finalised before the curriculum is published.

## 4. XP Reward System

### 4.1 XP principles

XP should encourage consistent learning without making beginners afraid to experiment.

* Award XP only for eligible, verifiable learning events.
* Use a central reward policy rather than hardcoding reward values into individual screens.
* Never deduct XP for incorrect answers, failed submissions, or retries.
* Do not award completion XP repeatedly for reviewing the same completed lesson.
* Do not award coding challenge completion XP for every Run or Submit action.
* Do not use XP as the primary mechanism for locking essential curriculum content.

### 4.2 Eligible reward events

| Event                                                 | Reward policy                                               |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| First qualifying lesson completion                    | Eligible for configured XP                                  |
| First qualifying coding challenge pass                | Eligible for configured XP                                  |
| Correct answer or completed activity                  | Optional; enable only if a clear anti-farming policy exists |
| Lesson review                                         | No repeat completion XP                                     |
| Failed coding submission                              | No completion XP                                            |
| Repeated submission of an already completed challenge | No repeat completion XP                                     |
| Daily Quest completion                                | Eligible for its configured reward                          |
| Opening the app or viewing a screen                   | No XP by default                                            |

The exact XP values are intentionally **not finalised** in this specification. They must be defined in a central configuration before release.

### 4.3 Reward calculation

Each eligible event must be evaluated against a single reward policy.

The reward service determines:

1. Whether the event is valid.
2. Whether the learner is eligible.
3. Whether the reward has already been issued.
4. The configured XP amount.
5. Whether the reward can be committed successfully.

The same event must never award XP twice because of a retry, duplicated network request, app restart, or repeated screen navigation.

## 5. XP Ledger and Data Integrity

### 5.1 Authoritative reward records

XP must be calculated from authoritative reward records rather than a value maintained only in the mobile application.

Each reward record should logically contain:

* `id`
* `userId`
* `eventType`
* `sourceId`
* `sourceEventId` or another idempotency key
* `xpAmount`
* `createdAt`

These are logical requirements, not a final database schema.

### 5.2 Idempotency

The reward system must prevent duplicate awards for the same qualifying event.

For example, if a lesson completion request is submitted twice because the network times out, the learner must receive the reward only once.

Use an appropriate database uniqueness constraint or equivalent atomic deduplication mechanism. Completion persistence, reward issuance and any related quest update should be coordinated so partial failures do not produce inconsistent results.

### 5.3 Total XP

Total XP is the sum of valid committed reward records for the learner.

* The backend is authoritative.
* The frontend may display a temporary pending state while a reward is being saved.
* The frontend must not permanently increase XP before confirmation.
* Failed reward persistence must provide a recoverable state.
* If the reward was committed but the response was lost, a retry must return the existing outcome rather than issue another reward.

No coins, gems, paid boosts or currency conversion system is required for the MVP.

## 6. Coding Challenge Progress

Coding challenges need separate execution and completion rules.

### Execution states

* Ready
* Running
* Passed
* Failed
* Execution Error

A challenge can be marked completed only when its required evaluation criteria have passed and the result has been persisted.

**Important distinctions:**

* Running code does not mean the challenge is completed.
* A failed test must not award completion XP.
* An infrastructure or execution error must not be reported as a learner failure.
* Repeated runs must not repeatedly award completion XP.
* A previously completed challenge may be reopened for practice without generating another first-completion reward.

The challenge's completion status and the XP reward status must remain consistent.

## 7. Daily Quest Progress Integration

Daily Quests must use the same trusted learning events as the progress system.

Examples:

* Completing an eligible lesson updates the corresponding quest.
* Passing an eligible coding challenge updates the coding quest.
* Reviewing an already completed lesson does not count as a new lesson completion unless the quest explicitly defines a different eligible event.

Each event must be processed once for quest progress, even when duplicate requests arrive.

Quest completion and its XP reward must be idempotent. A learner must not receive the same quest reward repeatedly by refreshing the screen or resubmitting requests.

Daily reset timing, timezone handling and treatment of incomplete quests remain separate configuration decisions to be finalised before Daily Quests launch.

## 8. Streak Policy

**Streaks are optional for the MVP.**

ZELO must not display a streak counter until the product team has defined:

* What qualifies as a learning day.
* Which timezone determines the day boundary.
* When a day begins and ends.
* How missed days affect the streak.
* How offline activity is handled.
* Whether a streak is restored after a synchronisation failure.

If these rules are not ready, hide the streak UI rather than showing an unreliable number.

Streaks must support healthy learning habits and must not penalise a learner for an application or network failure.

## 9. UI Requirements

### Home Dashboard

* Show overall progress using the canonical calculation.
* Show total XP only from committed reward records.
* Keep Continue Learning aligned with actual lesson state.
* Do not display a completed lesson as incomplete because of stale local data.

### Explore Worlds and Learning Path

* Show consistent world and lesson progress.
* Clearly distinguish Locked, Available, In Progress and Completed.
* Do not use XP as an unlock condition unless a future product decision explicitly changes the curriculum rules.

### Lesson Results

* Show the confirmed XP reward after successful persistence.
* Distinguish lesson completion from world completion and full curriculum completion.
* Do not show an unconfirmed reward as final.

### Profile

* Display total XP from the authoritative reward records.
* Count each completed lesson once.
* Calculate world completion using the same rules as Explore.

### Daily Quests

* Display progress derived from eligible learning events.
* Show completed rewards accurately.
* Avoid duplicate completion celebrations or reward animations.

## 10. Failure and Recovery Behaviour

The system must handle these scenarios:

* A learner completes a lesson while the network is unstable.
* A completion request is sent more than once.
* XP is committed but the client does not receive the response.
* A quest update fails after a valid learning event.
* The learner reopens the application before progress synchronises.
* A coding execution service fails.
* Published curriculum content changes after progress has been recorded.

The application must preserve valid learning progress, provide a clear status and retry safe operations without duplicate rewards.

Do not silently convert a failed save into a successful completion.

## 11. Acceptance Criteria

* [ ] Lesson progress uses the defined states.
* [ ] Completed lessons satisfy all required completion criteria.
* [ ] Lesson progress resumes from the last saved state where supported.
* [ ] World and overall progress use consistent published-lesson calculations.
* [ ] Reviewing a lesson does not create another completion.
* [ ] Total XP comes from authoritative reward records.
* [ ] XP values are centrally configured.
* [ ] Duplicate completion requests cannot issue duplicate rewards.
* [ ] Failed coding submissions do not earn completion XP.
* [ ] Coding execution errors are distinguishable from failed tests.
* [ ] Daily Quest progress responds to eligible events without duplication.
* [ ] No streak is displayed before its policy is defined.
* [ ] Save failures and pending rewards have clear UI states.
* [ ] Automated tests cover duplicate requests, retries, completion and reward persistence.
* [ ] Home, Explore, Results, Quests and Profile display consistent progress.

## 12. Out of Scope

* Competitive leaderboards and ranked XP.
* XP-based paywalls or essential curriculum locks.
* Coins, gems, loot boxes and reward shops.
* XP multipliers, boosts and streak freezes.
* AI-generated personalised rewards.
* Complex anti-cheat analytics beyond basic server-side validation and deduplication.
* Public learner profiles and social comparisons.
* A detailed analytics dashboard for administrators.

## 13. Dependencies

This specification depends on:

* Content Model & Curriculum Structure
* Lesson Player and Completion & Results
* Coding Practice & Challenge
* Daily Quests
* Authentication and user identity
* Backend persistence and data-integrity rules

## 14. Open Decisions

Before implementation, finalise:

1. XP values for lesson completion, coding challenge completion and quest completion.
2. Whether any individual activity can earn XP independently.
3. Whether optional lessons count towards overall progress and world completion.
4. Whether streaks are included in the first release.
5. How progress is reconciled when content versions change.
6. How offline completions are queued and synchronised, if offline learning is supported.
7. The final persistence schema and transaction boundaries.

**Implementation rule:** Build the smallest reliable progress and reward system first. Add more sophisticated gamification only when actual learner behaviour demonstrates a need.

---

**Next document:** Screen 20 — Curriculum Blueprint & Lesson Sequencing. This will turn the four worlds into a structured learning plan, without prematurely fixing lesson counts or marking unfinished React content as complete.

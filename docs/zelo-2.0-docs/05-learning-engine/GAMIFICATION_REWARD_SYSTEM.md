# ZELO 2.0 — Gamification System & Reward Economy

**File:** `GAMIFICATION_REWARD_SYSTEM.md`
**Version:** 3.6
**Status:** Draft — Pending Approval
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

This document defines the gamification system for ZELO 2.0.

It covers:

* Experience points (XP).
* Learning progress and rewards.
* Achievements.
* Daily quests.
* Learning streaks.
* Reward eligibility.
* Anti-exploit protections.
* Learner-facing feedback.
* Gamification metrics.

The system must reinforce meaningful learning without creating unnecessary complexity, pressure, or incentives to exploit the application.

## 2. Gamification Philosophy

ZELO should make learning feel rewarding through visible progress, achievable challenges, and immediate feedback.

The system follows five principles:

1. **Learning comes first:** Rewards support learning rather than replace it.
2. **Effort is visible:** Learners should see their progress after meaningful actions.
3. **Mistakes are safe:** Incorrect answers are opportunities to learn, not reasons for punishment.
4. **Rewards are predictable:** Learners should understand what earns XP.
5. **Keep it simple:** Avoid complex currencies, shops, inventories, and upgrade systems in the MVP.

The intended emotional loop is:

**Learn → Practise → Improve → Earn progress → Continue learning.**

---

## 3. MVP Gamification Scope

| Feature                               | MVP decision                                          |
| ------------------------------------- | ----------------------------------------------------- |
| XP                                    | Include                                               |
| Lesson completion rewards             | Include                                               |
| Coding challenge rewards              | Include only with defined eligibility rules           |
| Achievements                          | Include a small predefined set                        |
| Daily quests                          | Include a small set of meaningful quests              |
| Learning streak                       | Optional; implement only after its rules are approved |
| Coins or secondary currency           | Out of scope                                          |
| Shop and purchases                    | Out of scope                                          |
| Character upgrades and inventories    | Out of scope                                          |
| Leaderboards and competitive rankings | Out of scope                                          |
| Social rewards                        | Out of scope                                          |

The initial release should focus on a few reliable mechanics rather than implementing every familiar feature from gamified learning apps.

---

## 4. Experience Points (XP)

XP represents a learner's cumulative progress through meaningful learning activities.

### Reward eligibility

Potential XP-earning actions include:

* Completing a lesson for the first time.
* Passing a qualifying coding challenge for the first time.
* Completing an eligible daily quest.
* Reaching a defined learning milestone.

Not every action needs its own reward. For example, opening a screen or repeatedly submitting the same answer should not generate XP.

### Proposed initial reward values

These values are **illustrative proposals, not approved final values**.

| Action                                 | Proposed XP |
| -------------------------------------- | ----------: |
| Complete a standard lesson             |       20 XP |
| Complete a qualifying coding challenge | 10 XP bonus |
| Complete an eligible daily quest       | 15 XP bonus |
| Complete a major curriculum milestone  | 50 XP bonus |

The implementation must define whether the coding challenge reward is included in lesson XP or awarded separately. The same achievement must never be rewarded twice through overlapping rules.

### XP principles

* Rewards must be configured centrally rather than hardcoded throughout UI components.
* The server calculates authoritative XP.
* XP must be awarded only when the corresponding eligibility conditions are met.
* The learner must receive clear feedback when XP is earned.
* XP values may be adjusted through an explicit configuration change.
* Previously earned XP must not silently disappear when reward values change.

---

## 5. Reward Ledger and Duplicate Prevention

XP must be recorded through a persistent reward ledger or an equivalent auditable mechanism.

Each reward record should identify:

* User.
* Reward type.
* Source activity or milestone.
* XP amount.
* Creation timestamp.
* Idempotency key or equivalent uniqueness identifier.

### Required behaviour

**First successful lesson completion**

* Record completion.
* Award eligible lesson XP.
* Create a corresponding reward record.

**Repeated completion request**

* Return the existing result.
* Do not create another reward.

**Lesson review**

* Preserve progress.
* Do not award lesson-completion XP again.

**Repeated coding submission**

* Evaluate the submission according to the challenge rules.
* Award a first-completion bonus only if the challenge is eligible and the reward has not already been issued.

**Quest completion**

* Record quest completion once.
* Prevent duplicate quest rewards.

Database constraints and transactional server logic should enforce these rules wherever supported. Hiding a reward button or disabling a client control is not sufficient.

---

## 6. Achievements

Achievements recognize meaningful learning milestones.

### Proposed MVP achievements

| Achievement         | Eligibility                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| First Steps         | Complete the first lesson.                                                     |
| HTML Explorer       | Complete the defined introductory HTML milestone.                              |
| Style Starter       | Complete the defined introductory CSS milestone.                               |
| JavaScript Initiate | Complete the defined introductory JavaScript milestone.                        |
| React Beginner      | Complete the defined introductory React milestone.                             |
| Consistent Learner  | Complete an approved multi-day learning milestone, if streaks are implemented. |

Achievement names and criteria are proposed. They must be finalized alongside the curriculum.

### Achievement rules

* Each achievement has a stable identifier.
* Criteria must be objectively verifiable.
* Achievements are granted once per user unless explicitly designed otherwise.
* The server validates eligibility.
* Achievement progress must be recoverable after an interruption.
* Achievements should not require paid access.
* An achievement must not be displayed as earned before its criteria are satisfied.

Achievements may initially be informational and need not award extra XP. If they do grant XP, that reward must use the same duplicate-prevention mechanism as other rewards.

---

## 7. Daily Quests

Daily quests give learners a short, achievable goal that encourages meaningful practice.

### Proposed quest types

* Complete one lesson.
* Complete a coding challenge.
* Finish two eligible practice activities.
* Continue a partially completed lesson.
* Make progress in the current learning world.

The available quests must match the learner's unlocked curriculum and actual published content.

A learner must not receive a quest that requires a locked or unavailable lesson.

### Quest structure

Each quest definition should include:

* Stable quest ID.
* Display title and instructions.
* Eligibility conditions.
* Target progress.
* Reward, if any.
* Active period.
* Completion criteria.
* Publication status.

Each learner's quest progress should be stored separately from the shared quest definition.

### Progress rules

* Progress is derived from qualifying learning events.
* The same event must not increment progress multiple times accidentally.
* A quest is completed only after its target is reached.
* Rewards are issued once.
* Failed network requests must not cause duplicate progress or rewards.
* Expired quests must not continue progressing unless the product explicitly supports that behaviour.

### Daily reset policy

The exact reset time and timezone policy remain open decisions.

The product must use one documented rule consistently. It must not reset a quest differently on different screens or devices.

---

## 8. Learning Streaks

A streak represents consecutive eligible days on which a learner makes meaningful learning progress.

A streak should encourage consistency without shaming learners for taking breaks.

### Proposed eligibility rule

A day counts toward a streak when the learner completes at least one qualifying learning action, such as a lesson or an explicitly eligible practice milestone.

Simply opening the app, viewing the Home screen, or collecting a notification must not count.

### Streak rules

Before implementation, define:

* What constitutes a qualifying action.
* The learner's timezone source.
* When a learning day begins and ends.
* How travel and timezone changes are handled.
* Whether missed days break the streak.
* Whether streak recovery is supported.

**Proposed default — not approved:** Do not implement streak freezes, paid streak recovery, or other complex recovery mechanics in the MVP.

If streak rules cannot be implemented reliably, defer the streak feature rather than display misleading values.

---

## 9. Daily Quests and XP Must Reward Learning

The reward system must not encourage meaningless repetition.

### Anti-farming rules

* Repeating a completed lesson does not generate another completion reward.
* Reopening an activity does not generate XP.
* Duplicate API requests do not create duplicate rewards.
* Repeated incorrect answers do not generate XP merely for submission.
* A challenge reward must be linked to verified eligibility.
* Quest progress must be based on unique or properly deduplicated qualifying events.
* Client-supplied XP amounts must never be trusted.
* The server must validate user identity, lesson access, and completion evidence.

### Coding challenge protections

Coding challenges need additional safeguards:

* Apply execution quotas and time limits.
* Validate challenge access.
* Keep hidden tests on the trusted side of the evaluation boundary.
* Prevent the client from claiming a successful result without evaluation.
* Avoid awarding rewards for repeated successful submissions of an already rewarded challenge.

The system should not punish genuine learning retries. Anti-exploit rules must distinguish legitimate practice from repeated attempts to manufacture rewards.

---

## 10. Reward Feedback and UI

Rewards should feel satisfying without overwhelming the lesson experience.

### On successful activity

Show concise feedback that helps the learner understand the result.

### On lesson completion

Display:

* Lesson completion confirmation.
* XP earned from that completion.
* Updated learning progress.
* Newly unlocked content, when applicable.
* An obvious next action.

### On achievement unlock

Show the achievement name and a brief explanation of its criteria.

### On quest completion

Show completion status and the reward, if applicable.

### Visual rules

* Use small, purposeful animations.
* Keep the learning content more prominent than reward effects.
* Respect reduced-motion preferences.
* Never block lesson continuation behind a long animation.
* Do not use deceptive reward counters.
* Do not imply that a reward was granted before the server confirms it.

The experience should feel playful and motivating while preserving ZELO's clean, premium interface.

---

## 11. Progress and Reward Data

The following logical records are expected to support gamification. Final database entities and fields are defined by the database design and technical decisions.

### User reward balance

The displayed total XP should be derived from authoritative reward records or maintained through a consistent, auditable balance strategy.

### Reward ledger

Stores the history of earned rewards and their sources.

### Achievement definitions

Stores achievement identifiers, descriptions, criteria, and publication status.

### User achievement records

Stores which achievements each learner has earned and when.

### Quest definitions

Stores the available quest rules and reward configuration.

### User quest progress

Stores a learner's progress, status, and completion information for each quest period.

### Learning streak data

Required only if streaks are included. The data model must support the approved eligibility and timezone rules.

Reward and progress updates must remain consistent if a request is retried or interrupted.

---

## 12. Analytics and Success Metrics

Gamification must be evaluated by whether it supports learning.

Useful measures include:

* Percentage of learners who start their first lesson.
* First-lesson completion rate.
* Return rate after seven days.
* Number of published lessons completed.
* Coding challenge participation and success.
* Quest completion rate.
* Percentage of earned rewards issued without duplication.
* Learner-reported usefulness of feedback.

XP totals alone are not a meaningful measure of learning success.

Analytics must follow the approved privacy and data-retention policy.

---

## 13. Acceptance Criteria

The gamification system is ready for MVP release when:

* [ ] XP eligibility rules are documented and centrally configured.
* [ ] Lesson-completion XP is awarded only once.
* [ ] Coding challenge bonuses follow explicit eligibility rules.
* [ ] Duplicate requests cannot create duplicate rewards.
* [ ] Achievement criteria are deterministic.
* [ ] Achievement unlocks are persisted.
* [ ] Daily quests use published, accessible content.
* [ ] Quest progress is correctly deduplicated.
* [ ] Streak values, if implemented, follow a documented timezone policy.
* [ ] Incorrect answers do not trigger unfair penalties.
* [ ] The UI displays only authoritative reward results.
* [ ] Reward logic has automated tests for retries, concurrency, and failure recovery.

---

## 14. Open Decisions

Resolve these before the corresponding feature is implemented:

1. Final XP values and reward stacking rules.
2. Whether coding challenges grant separate bonus XP.
3. Final achievement list and criteria.
4. Daily quest selection strategy.
5. Quest reset time and timezone handling.
6. Whether streaks belong in the first MVP release.
7. Whether achievements grant XP or are informational only.
8. Reward ledger retention and correction procedures.
9. Which learning events qualify for quest progress.
10. Whether any reward configuration can change without a code deployment.

---

## 15. Final Rule

**Reward meaningful learning, not meaningless activity.**

ZELO's gamification system should help beginners see their progress, celebrate genuine milestones, and build consistent learning habits.

A small, reliable system with clear rules is preferable to a complex economy that distracts from learning HTML, CSS, JavaScript, and React.

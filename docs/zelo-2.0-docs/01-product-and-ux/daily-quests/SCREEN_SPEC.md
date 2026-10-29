# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.8
**Status:** Draft
**Module:** Daily Quests
**Priority:** MVP — Should Have
**Related Screens:** Home Dashboard, Lesson Player, Coding Practice, Lesson Completion

---

## 1. Purpose

Daily Quests provide small, achievable learning goals that encourage consistent practice.

Learners should be able to:

* See their current daily goals.
* Understand how each goal can be completed.
* Track progress toward each goal.
* Claim or receive eligible rewards.
* Return to learning without unnecessary navigation.

**Primary action:** Complete a learning activity that advances a quest.

## 2. MVP Quest Types

Start with a small set of predefined quest templates.

Examples:

| Quest                | Completion condition                    |
| -------------------- | --------------------------------------- |
| Learn Something New  | Complete one eligible lesson            |
| Practice Your Skills | Complete one eligible practice activity |
| Keep Coding          | Pass one eligible coding challenge      |

These are illustrative templates. Final quest rules and XP rewards will be defined in the Gamification Rules document.

Do not generate an unlimited number of quests or introduce AI-generated objectives in the MVP.

## 3. Screen Layout

### A. Header

Display:

* Screen title: Daily Quests.
* A short motivational subtitle.
* Optional daily progress summary.

Keep the header compact and consistent with ZELO's other screens.

### B. Daily Progress Summary

Show the learner's overall progress through the current set of quests.

Example:

`Daily Progress`

`1 of 3 quests completed`

Use a simple progress bar. Do not display a percentage if the quest set has not loaded or its total is unknown.

### C. Quest Cards

Each quest card should contain:

* Quest title.
* One-line description.
* Progress indicator.
* Reward amount, when applicable.
* Status.
* A relevant action.

Example:

**Learn Something New**

Complete one eligible lesson.

Progress: 0/1

Reward: +20 XP

Action: Start Learning

The values above are examples only, not final reward rules.

### D. Bottom Navigation

Use the shared navigation structure:

* Home
* Explore
* Code
* Quests
* Profile

The active Quests tab should be clearly indicated. Do not introduce a separate navigation system for quests.

## 4. Quest States

### Available

* The quest is active.
* Show its objective and current progress.
* Provide a relevant action.

### In Progress

* Show updated progress.
* Explain what remains to be completed.
* Provide a route to the relevant activity.

### Completed

* Display a clear completion state.
* Show the confirmed reward.
* Prevent the same quest from being completed repeatedly for duplicate rewards.

### Unavailable

If no quests are configured or available, display a simple empty state and provide a route to Explore or Home.

Do not show fake quests merely to fill the screen.

## 5. Quest Progress Rules

Quest progress must be tied to actual eligible learning events.

Examples:

* A lesson quest advances only when an eligible lesson is completed.
* A coding quest advances only when a qualifying challenge passes.
* A practice quest advances only when an eligible practice activity is completed.

Additional rules:

* Opening a lesson does not count as completing it.
* Repeatedly opening a completed lesson must not repeatedly advance a completion-based quest.
* Duplicate event submissions must not increment progress more than once.
* Failed coding submissions must not count as successful coding challenges.
* Quest progress must persist across app restarts.

The backend should validate reward eligibility rather than trusting client-side counters.

## 6. Daily Reset Rules

The product must define a consistent daily reset policy before implementation.

The policy should specify:

* Which timezone determines the daily boundary.
* When new quests become active.
* What happens to incomplete quests at reset.
* How completed quests and reward history are retained.
* How resets behave when the learner is offline.

For the MVP, use one clearly defined daily cycle. Avoid multiple overlapping timers or complicated weekly and monthly quest systems.

The exact timezone and reset behaviour remain an open product decision.

## 7. Rewards

Daily Quests use the same XP system as lessons and coding challenges.

Requirements:

* Display rewards before completion.
* Award XP only when the quest's completion conditions are satisfied.
* Record each reward exactly once.
* Prevent duplicate claims after retries or network failures.
* Keep rewards consistent with the central Gamification Rules.

The MVP does not require a separate coin or gem economy.

## 8. Required UI States

### Loading

Display lightweight placeholders for the quest summary and quest cards.

### Active Quests

Show the configured quests and their actual progress.

### All Quests Completed

Display a concise completion message and the confirmed rewards.

Provide a route back to learning rather than an unnecessary reward-only screen.

### No Available Quests

Explain that no quests are currently available and provide a useful navigation action.

### Network Error

Explain that quest information could not be loaded and provide Retry.

Preserve previously confirmed progress where supported.

### Reward Processing

If rewards are processed asynchronously:

* Show a processing state.
* Prevent duplicate claim requests.
* Do not display an unconfirmed reward as successfully awarded.

## 9. Visual Design

Follow ZELO's established visual direction:

* Light ivory/white background.
* Violet primary accent.
* Green for completed objectives.
* Simple, consistent cards.
* Compact progress indicators.
* Minimal illustrations.
* One clear action per quest.

Avoid:

* Animated quest maps.
* Complex quest chains.
* Multiple reward currencies.
* Large reward chests.
* Excessive confetti.
* Countdown pressure or aggressive urgency messages.

Daily Quests should encourage learning without making learners feel punished for missing a day.

## 10. Logical Data Requirements

**Quest Definition**

* Quest ID.
* Title and description.
* Quest type.
* Completion condition.
* Reward configuration.
* Active period.
* Publication status.

**Learner Quest Progress**

* Learner ID.
* Quest ID.
* Current progress.
* Completion status.
* Completion timestamp.
* Reward status.

**Learning Event**

* Event identifier.
* Learner ID.
* Event type.
* Associated lesson or challenge.
* Event timestamp.

These are logical requirements, not a final database schema. The exact data model, event processing, and timezone policy will be documented separately.

## 11. Acceptance Criteria

* [ ] Configured daily quests appear correctly.
* [ ] Every quest explains its objective.
* [ ] Progress reflects actual eligible learning events.
* [ ] Completed quests display the correct status.
* [ ] Duplicate events cannot award duplicate XP.
* [ ] Failed coding attempts do not count as successful challenges.
* [ ] Quest progress persists across app restarts.
* [ ] Daily reset behaviour follows the documented policy.
* [ ] Loading, empty, and error states are handled.
* [ ] Rewards are displayed only according to the central reward rules.
* [ ] The screen uses shared navigation and UI components.
* [ ] Quest actions lead to valid learning destinations.

## 12. Out of Scope

The MVP will not include:

* Weekly or monthly quest campaigns.
* User-created quests.
* AI-generated daily objectives.
* Friends' quests or cooperative challenges.
* Competitive leaderboards.
* Streak freezes or paid recovery items.
* Randomised loot boxes.
* Complex quest dependency graphs.
* Push notifications requiring advanced scheduling.

## 13. Dependencies

* Home Dashboard.
* Lesson Player.
* Coding Practice.
* Learner progress persistence.
* XP and reward rules.
* Defined daily reset policy.
* Reliable learning-event processing.

## 14. Definition of Done

Daily Quests are complete when learners can view their configured goals, advance them through eligible learning activities, see accurate progress, and receive rewards exactly once under the documented reset and reward rules.

---

**Next screen:** Screen 09 — Profile & Learning Progress. This will define the learner's profile, learning statistics, completed worlds, and progress summary without turning the app into a complex analytics dashboard.

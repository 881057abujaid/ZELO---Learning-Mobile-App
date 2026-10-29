# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.5
**Status:** Draft
**Module:** Lesson Completion & Results
**Priority:** MVP — Must Have
**Previous Screen:** Lesson Player
**Next Screen:** Next Lesson or World Learning Path

---

## 1. Purpose

The Lesson Completion & Results screen confirms that a learner has completed a lesson and communicates the outcome.

It should:

* Acknowledge the learner's achievement.
* Summarise the completed lesson.
* Display XP earned, where applicable.
* Update the learner's visible progress.
* Offer a clear next step.
* Allow revision or retry when appropriate.

**Primary action:** Continue to the next available lesson.

## 2. Screen Layout

### A. Completion Header

Display:

* A simple success illustration or completion icon.
* A short heading, such as “Lesson Complete!”
* The lesson title.
* A brief encouraging message.

The message should acknowledge the completed work without exaggerated claims about mastery.

Avoid full-screen animations or long celebration sequences that delay the learner from continuing.

### B. Results Summary

Show only meaningful information:

* Lesson completion status.
* XP earned in this lesson.
* Updated world progress.
* Optional activity summary when the lesson contains meaningful assessments.

Example:

**Lesson Complete!**

HTML Elements — Lesson 1

* XP earned: +20 XP
* World progress: 1 of 12 lessons

*Example values only; actual rewards and lesson counts will be defined separately.*

Do not show a percentage score for a lesson that contains no scored assessment.

### C. Primary Action

Display one prominent button.

Recommended label: **Continue Learning**

Behaviour:

* Open the next available lesson when one exists.
* Respect prerequisite and unlock rules.
* If the world is complete, return to the World Learning Path or offer the next world when available.
* Never route the learner to an unpublished or locked lesson.

### D. Secondary Actions

Keep secondary actions limited to useful choices:

* **Review Lesson:** Reopen the completed lesson.
* **Back to Learning Path:** Return to the current world's lesson sequence.

Do not add multiple competing reward, sharing, or navigation actions.

## 3. XP Reward Rules

XP is a lightweight motivation mechanism, not a currency required to access educational content.

For the MVP:

* Award XP only for eligible completed activities or lessons.
* Define reward values centrally in the product rules.
* Record rewards so the same completion cannot be claimed repeatedly.
* Reopening a completed lesson must not automatically award the same completion XP again.
* A retry must not generate unlimited rewards.
* Failed submissions must not receive completion rewards.
* Reward rules must be consistent across all four curriculum subjects.

XP values are not final in this document. They will be specified in the Gamification Rules document.

### Reward Display

* Show the XP earned clearly.
* Use a subtle positive visual treatment.
* Do not introduce coins, gems, energy, loot boxes, or paid reward mechanics in the MVP.

## 4. Learning Progress Updates

On successful completion:

1. Confirm that the lesson meets its completion requirements.
2. Persist the completion record.
3. Update world progress.
4. Record eligible XP rewards exactly once.
5. Recalculate the next available lesson.
6. Present the completion screen.

The completion screen must display confirmed progress, not optimistic values that could contradict the saved state.

If a save operation fails, explain that progress could not be confirmed and provide an appropriate retry or recovery path.

## 5. Assessment Results

Some lessons will contain quizzes or coding challenges; others may focus on introductory explanations and practice.

Therefore, assessment results must be conditional.

### Lessons With Scored Activities

Where applicable, display:

* Number of questions or tests completed.
* Correct answers or passed tests.
* A score or success summary, if the assessment defines one.

### Lessons Without Scored Activities

Show the completion confirmation and progress summary without inventing a score.

### Failed Required Assessment

If a required activity has not met its completion criteria:

* Do not show the lesson as completed.
* Return the learner to the relevant activity.
* Explain what remains to be completed.

The completion screen must not be used to bypass lesson validation.

## 6. World Completion

When the learner completes the final required lesson in a world:

* Display a world-completion message.
* Show the updated world progress.
* Provide access to the completed learning path for revision.
* Offer the next world only if it is published and its prerequisites are satisfied.

Do not imply that the learner has completed the entire web-development curriculum when only one world is finished.

The same distinction applies to HTML, CSS, JavaScript, and React.

## 7. Required UI States

### Standard Lesson Completion

* Show the completed lesson.
* Display confirmed rewards and progress.
* Provide Continue Learning as the primary action.

### World Completion

* Acknowledge completion of the current world.
* Show the final world progress.
* Provide an appropriate next action.

### Progress Save Pending

* Show a clear saving or processing state.
* Prevent duplicate reward claims.
* Avoid falsely confirming completion before the save is confirmed.

### Progress Save Error

* Explain that the result could not be saved.
* Provide a Retry action.
* Preserve recoverable lesson results where supported.
* Avoid awarding duplicate XP during recovery.

### No Next Lesson Available

* Replace Continue Learning with an appropriate action, such as “Back to Learning Path.”
* Do not display a dead-end button.

### Review Mode

When the learner revisits a completed lesson:

* Clearly distinguish review from first-time completion.
* Preserve the original completion status.
* Do not award duplicate completion XP.

## 8. Visual Design

Follow the ZELO 2.0 design system:

* Ivory/white background.
* Violet primary accent.
* Green for successful completion.
* Simple layout with clear visual hierarchy.
* One small success illustration or icon.
* Spacious but compact results summary.
* Minimal motion and immediate access to the next action.

Avoid:

* Large full-screen reward animations.
* Excessive confetti.
* Long celebration screens.
* Multiple currencies and reward counters.
* Leaderboard comparisons.
* Social sharing prompts.
* Unnecessary modal chains.

The learner should be able to understand the result quickly and continue learning.

## 9. Navigation Rules

* Lesson Player → Completion & Results after successful completion.
* Continue Learning → Next available lesson.
* Review Lesson → Completed lesson in review mode.
* Back to Learning Path → Current world's learning path.
* World completion → Learning path or next eligible world.

Navigation must respect the learner's actual progress and prerequisite rules.

## 10. Logical Data Requirements

**Completion Result**

* Lesson ID.
* Completion status.
* Completion timestamp.
* Assessment result, where applicable.
* Confirmed XP earned.
* World progress after completion.

**Reward Record**

* Learner ID.
* Reward type.
* Reward amount.
* Associated completion or activity identifier.
* Record timestamp.
* A reliable uniqueness mechanism to prevent duplicate awards.

These are logical requirements, not a final database schema. Exact transaction and idempotency rules will be defined in the backend specification.

## 11. Acceptance Criteria

* [ ] Successful lesson completion opens this screen.
* [ ] The correct lesson title is displayed.
* [ ] XP reflects the confirmed reward record.
* [ ] World progress reflects persisted completion data.
* [ ] Assessment results appear only when applicable.
* [ ] An incomplete required assessment cannot be bypassed.
* [ ] Continue Learning opens the correct next available lesson.
* [ ] World completion is distinguished from curriculum completion.
* [ ] Review mode does not award duplicate completion XP.
* [ ] Failed save operations do not produce false success confirmations.
* [ ] Duplicate submissions cannot create duplicate rewards.
* [ ] The screen handles the absence of a next lesson.
* [ ] Layout and actions remain usable on supported mobile devices.
* [ ] No visible button leads to a non-functional destination.

## 12. Out of Scope

The MVP will not include:

* Global leaderboards.
* Friends' achievement comparisons.
* Reward chests or random rewards.
* Coins, gems, or energy systems.
* Paid XP boosts.
* Social sharing of results.
* Complex badge collections.
* Animated character celebrations.
* AI-generated personalised praise.

## 13. Dependencies

* Lesson Player completion rules.
* Persistent learner progress.
* XP and reward rules.
* World Learning Path.
* Curriculum publication and prerequisite rules.
* Reliable backend reward recording.
* Shared UI components.

## 14. Definition of Done

The screen is complete when a learner receives an accurate completion summary, sees confirmed progress and eligible rewards, and can continue to the next valid lesson or return to the learning path without losing progress or claiming duplicate rewards.

---

**Next screen:** Screen 06 — Coding Practice / Challenge. Define the code editor experience, starter code, run and submit behaviour, test results, hints, and safe execution requirements.

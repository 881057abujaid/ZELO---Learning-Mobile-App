# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.7
**Status:** Draft
**Module:** Interactive Quiz & Practice Activities
**Priority:** MVP — Must Have
**Parent Screen:** Lesson Player
**Related Screen:** Coding Practice / Challenge

---

## 1. Purpose

Interactive activities help learners practise concepts instead of passively reading lesson content.

This specification defines how ZELO presents questions, accepts answers, validates responses, and provides educational feedback.

The activity system must:

* Support the five core question types.
* Present one focused task at a time.
* Provide immediate, meaningful feedback.
* Support retry and hints where configured.
* Preserve progress across navigation.
* Reuse the same components across HTML, CSS, JavaScript, and React lessons.

**Primary action:** Answer the current activity and understand the result.

## 2. Supported Activity Types

The MVP supports five reusable question types:

1. Single-choice MCQ.
2. Multiple-select.
3. Drag/reorder.
4. Fill-in-the-blank with options.
5. Fill-in-the-blank with typed answers.

Coding challenges are handled by the Coding Practice module but can be launched from the same Lesson Player.

The activity type must be determined by the lesson content configuration. The app must not rely on manually creating a separate screen for each question.

## 3. Common Activity Layout

Every activity should use a consistent structure.

### A. Question Header

Display:

* Short question title or instruction.
* Optional activity progress, such as “Question 2 of 5.”
* Optional points or difficulty only when relevant.

Question progress should reflect the actual activity sequence. Avoid unnecessary counters and decorative badges.

### B. Question Content

Display:

* The question or task.
* Relevant context.
* Code snippets, examples, or small diagrams when needed.
* Clear instructions about what the learner must do.

Questions should be concise and appropriate for complete beginners.

### C. Answer Area

Render the appropriate interaction component:

* Radio-style options.
* Multiple-select controls.
* Reorderable items.
* Option selectors inside blanks.
* Text input fields.

All controls must provide a visible selected or entered state.

### D. Feedback Area

After submission, display:

* Correct or incorrect status.
* A short explanation.
* A hint or retry action when allowed.

Do not reveal feedback before submission when doing so would give away the answer.

### E. Primary Action

The main button changes according to the activity state:

* **Check Answer** — before submission.
* **Continue** — after an accepted answer or completed attempt.
* **Try Again** — when a retry is available.

Only one primary action should be visually dominant at a time.

## 4. Activity Type Specifications

### A. Single-Choice MCQ

**Interaction**

* Display one question and a list of answer options.
* Allow exactly one selected option.
* Allow the learner to change the selection before submission.

**Validation**

* Require a selection before enabling submission, or explain why an answer is needed.
* Compare the selected answer with the configured correct answer.
* Show feedback after submission.

**Feedback**

* Explain why the correct option is appropriate.
* When useful, briefly explain the misconception behind a common wrong answer.

### B. Multiple-Select

**Interaction**

* Clearly state that more than one answer may be correct.
* Allow multiple selections.
* Allow selections to be changed before submission.

**Validation**

* Validate the complete selected set.
* Do not treat an incomplete selection as fully correct unless the activity explicitly defines partial credit.
* Show which concepts need further attention without exposing unnecessary internal scoring details.

### C. Drag / Reorder

**Interaction**

* Display a set of items that the learner must arrange.
* Provide a clear target order or task instruction.
* Allow the learner to reorder items before submission.

**Accessibility**

* Provide an alternative to dragging, such as move-up and move-down controls.
* Use visible position indicators.
* Do not rely exclusively on colour to communicate item status.

**Validation**

* Compare the final order with the activity's defined expected sequence.
* Explain the correct sequence after submission when appropriate.

### D. Fill-in-the-Blank — Options

**Interaction**

* Display a sentence, code snippet, or statement with a missing value.
* Present available choices.
* Show the selected choice in context.

**Validation**

* Validate the selected option.
* Keep the surrounding sentence or code visible during feedback.
* Explain why the selected value fits or does not fit.

### E. Fill-in-the-Blank — Typed Answer

**Interaction**

* Display the missing value in context.
* Provide a text input.
* Explain the expected answer format when ambiguity is possible.

**Validation**

* Apply activity-specific validation rules.
* Ignore harmless whitespace or casing differences only when appropriate.
* Preserve meaningful distinctions in code syntax and case-sensitive identifiers.
* Avoid accepting answers through overly broad text matching.

For programming syntax questions, validation rules must account for the actual language and intended learning objective.

## 5. Answer Validation Rules

Each activity must have a defined validation contract.

The contract should specify:

* What counts as a correct answer.
* Whether partial credit is supported.
* Whether retries are allowed.
* Whether hints are available.
* When the activity is considered complete.
* What feedback is shown for each result.

Validation must be deterministic for the same answer and activity configuration.

The UI must not decide correctness using presentation logic alone when the result affects persisted progress or rewards.

## 6. Feedback and Retry

### Correct Answer

* Display a clear success state.
* Provide a concise explanation where useful.
* Enable the Continue action.
* Preserve the completed activity state.

### Incorrect Answer

* Explain the relevant concept or misconception.
* Offer a retry when configured.
* Preserve the learner's other completed steps.
* Avoid making the learner restart the entire lesson.

### Hint

Hints should guide the learner without immediately revealing the complete answer.

The initial MVP should use reviewed, predefined hints stored with the activity content. AI-generated hints are out of scope.

### Retry Rules

* Retry behaviour must be consistent with the activity configuration.
* Changing an answer before submission must not count as a new attempt.
* Duplicate submission requests must not create duplicate progress or XP records.
* Repeated attempts must not bypass required completion conditions.

The exact XP and attempt rules belong in the Gamification Rules document.

## 7. Question Navigation

* The learner progresses through activities in the defined lesson order.
* Required activities cannot be skipped to falsely complete a lesson.
* Optional practice can be skipped only when the lesson configuration allows it.
* Returning to a previous activity should restore its saved state where supported.
* Completed activities should remain completed unless an explicit reset action exists.
* Leaving the activity must not silently erase unsaved answers.

Avoid adding a complex question navigator or test-taking dashboard to the MVP.

## 8. Required UI States

### Ready

* Question and instructions are visible.
* Answer controls are interactive.
* Check Answer is available when the input is valid.

### Answer Selected

* The selected answer is clearly visible.
* The learner can change it before submission.

### Evaluating

* Show a lightweight processing state when evaluation requires a request.
* Prevent accidental duplicate submissions.
* Preserve the current answer.

### Correct

* Show success feedback.
* Enable Continue.
* Record completion according to the activity rules.

### Incorrect

* Show useful feedback.
* Offer retry or a hint where configured.

### Invalid or Empty Answer

* Explain what the learner needs to provide.
* Do not submit malformed answers unnecessarily.

### Loading or Content Error

* Display an appropriate loading or error state.
* Provide Retry when possible.
* Do not mark an activity complete when its configuration failed to load.

## 9. Visual Design

Use the ZELO 2.0 design system:

* Ivory/white background.
* Violet primary accent.
* Green for successful answers.
* Clear typography.
* Comfortable tap targets.
* Simple bordered answer areas.
* Minimal, consistent feedback illustrations.

Selected answers must be distinguishable from correct answers. A selected answer is not automatically a correct answer.

Avoid:

* Excessive animations after every answer.
* Large decorative illustrations inside every question.
* Multiple competing buttons.
* Dense explanations displayed before the learner attempts an answer.
* Complex point multipliers or streak bonuses in the activity UI.

## 10. Accessibility

* Support keyboard navigation where applicable.
* Provide visible focus and selection states.
* Ensure answer controls have clear labels.
* Maintain sufficient contrast.
* Offer a non-drag alternative for ordering activities.
* Do not communicate correctness through colour alone.
* Keep text readable on supported mobile devices.
* Avoid time limits unless a specific, documented learning objective requires them.

## 11. Logical Data Requirements

**Activity Definition**

* Activity ID.
* Lesson ID.
* Type.
* Question text.
* Instructions.
* Answer options or expected answer.
* Validation configuration.
* Explanation.
* Optional hints.
* Retry and completion rules.
* Sequence order.

**Learner Activity State**

* Activity ID.
* Learner ID.
* Current answer or recoverable draft.
* Completion status.
* Attempt information, where needed.
* Last updated timestamp.

These are logical requirements, not a final database schema. The final content model and persistence strategy will be documented separately.

## 12. Acceptance Criteria

* [ ] All five activity types render through reusable components.
* [ ] Each activity displays clear instructions.
* [ ] Answer selection and editing work correctly.
* [ ] Empty or invalid answers are handled appropriately.
* [ ] Validation follows the activity's defined rules.
* [ ] Correct and incorrect responses show meaningful feedback.
* [ ] Retry and hint behaviour follows configuration.
* [ ] Required activities cannot be skipped to falsely complete a lesson.
* [ ] Progress survives navigation and app restart where persistence is supported.
* [ ] Duplicate submissions do not duplicate completion or rewards.
* [ ] Ordering activities have an accessible non-drag alternative.
* [ ] The interface works on supported mobile screen sizes.
* [ ] Failed content loading does not create false completion.
* [ ] Activity components are reusable across all four subjects.

## 13. Out of Scope

The MVP will not include:

* AI-generated questions.
* Adaptive question difficulty using machine learning.
* Multiplayer quizzes.
* Timed competitive exams.
* Global quiz leaderboards.
* User-created questions.
* Complex partial-credit scoring engines.
* Advanced analytics dashboards.
* Multiple question themes with separate implementations.

## 14. Dependencies

* Lesson Player.
* Approved lesson and activity content.
* Validation logic.
* Learner progress persistence.
* Accessibility requirements.
* Shared UI component library.
* Defined XP and completion rules.

## 15. Definition of Done

The module is complete when all five activity types can be configured as lesson content, accept and validate learner responses, provide clear feedback, support the defined retry rules, and update persisted progress correctly without duplicating rewards.

---

**Next screen:** Screen 08 — Home Dashboard refinements and learning-state integration. Before adding more screens, we should also consolidate the specifications into a single screen inventory and resolve any conflicting requirements.

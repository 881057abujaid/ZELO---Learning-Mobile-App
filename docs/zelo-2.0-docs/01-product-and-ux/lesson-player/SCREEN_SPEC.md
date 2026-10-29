# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.4
**Status:** Draft
**Module:** Lesson Player
**Priority:** MVP — Must Have
**Previous Screen:** World Learning Path
**Next Screen:** Lesson Completion / Results

---

## 1. Purpose

Lesson Player is the core learning interface of ZELO 2.0. It delivers structured lessons through short explanations, practical examples, interactive questions, and coding exercises.

The experience should help a complete beginner understand a concept and then demonstrate that understanding.

The screen must:

* Present one manageable learning step at a time.
* Explain concepts using beginner-friendly language.
* Connect theory with practical examples.
* Support multiple interactive question types.
* Provide useful feedback after an answer.
* Preserve lesson progress when the learner leaves.
* Work consistently across HTML, CSS, JavaScript, and React.

**Primary action:** Complete the current learning step and continue.

## 2. Core Learning Loop

Every lesson should follow a deliberate learning sequence:

1. **Learn:** Read a short explanation.
2. **See:** Review an example or visual result.
3. **Try:** Answer a question or complete an activity.
4. **Get feedback:** Understand why the answer is correct or incorrect.
5. **Continue:** Move to the next learning step.

Not every step must contain all five stages. A simple concept may need only an explanation and a question; a coding concept may require an explanation, example, and coding exercise.

Avoid forcing every lesson into an unnecessarily long, identical template.

## 3. Screen Layout

### A. Top Bar

Display:

* Back button.
* Current lesson title or compact lesson identifier.
* Lesson progress indicator.
* Optional exit confirmation when leaving could interrupt an unsaved activity.

The progress indicator should reflect the lesson's actual steps, not an arbitrary animation.

Do not display excessive statistics or multiple reward counters in the lesson interface.

### B. Lesson Content Area

Display one learning step at a time.

Supported content blocks:

**1. Explanation**

* Short heading.
* Beginner-friendly explanation.
* Clear paragraphs and bullet points where useful.
* Important terms highlighted sparingly.

**2. Example**

* Practical example related to the current concept.
* Code snippets with readable formatting.
* Output or visual result when relevant.
* Brief explanation of what the example demonstrates.

**3. Tip or Key Takeaway**

* Optional compact note.
* Used for common mistakes, syntax reminders, or important rules.

**4. Interactive Activity**

* One supported question or coding task.
* Clear instructions.
* Appropriate answer controls.
* Feedback after submission.

**5. Continue Action**

* One prominent primary button.
* Label changes according to context, such as “Continue,” “Check Answer,” or “Run Code.”
* Do not display multiple competing primary actions at the same time.

### C. Content Presentation

Use a scrollable content area with clear separation between explanation, examples, and activities.

Code examples must:

* Preserve indentation and line breaks.
* Use a readable monospace font.
* Support horizontal scrolling when necessary.
* Avoid shrinking text until it becomes unreadable.

For longer examples, provide a clear output or result instead of making the learner infer everything from the code.

## 4. Supported Interactive Activities

The MVP Lesson Player must support these reusable activity types.

### A. Single-Choice MCQ

The learner selects one answer.

Requirements:

* Display a clear question.
* Present selectable answer options.
* Allow one selected answer at a time.
* Provide feedback after submission.
* Explain the correct answer when appropriate.

### B. Multiple-Select

The learner selects all applicable answers.

Requirements:

* Explicitly state that multiple answers may be correct.
* Allow multiple selections.
* Validate the complete answer set.
* Explain incorrect or missing selections.

### C. Drag / Reorder

The learner arranges items in the correct sequence.

Example: Reorder the basic stages of an HTML document or steps in a simple process.

Requirements:

* Clearly indicate that items can be reordered.
* Provide an accessible alternative, such as move-up and move-down controls, where drag-and-drop is not practical.
* Validate the final order.
* Do not rely only on colour to communicate correctness.

### D. Fill in the Blank — Options

The learner fills a missing value by selecting from provided options.

Requirements:

* Keep the blank visible in context.
* Present clear answer choices.
* Provide feedback after submission.

### E. Fill in the Blank — Typed Answer

The learner types a short answer.

Requirements:

* Accept only the answer formats defined by the activity.
* Handle harmless formatting differences where appropriate.
* Explain expected syntax when the answer is incorrect.
* Do not mark an answer correct using overly broad matching rules.

### F. Coding Challenge

The learner writes or edits code and submits it for evaluation.

Requirements:

* Provide a concise task description.
* Show starter code when appropriate.
* Provide an editable code area.
* Offer a Run or Submit action.
* Display execution results or test feedback.
* Explain failures in beginner-friendly language.
* Provide a way to retry.

Coding challenges require a defined execution and evaluation architecture. Arbitrary user code must not execute directly on a trusted application server without appropriate isolation and resource limits.

## 5. Answer Feedback

Feedback is part of the teaching experience, not merely a right-or-wrong indicator.

### Correct Answer

* Clearly indicate success.
* Explain the key reason when educationally useful.
* Allow the learner to continue.
* Avoid excessive celebrations that interrupt the learning flow.

### Incorrect Answer

* Clearly indicate that the answer needs correction.
* Explain the misconception or relevant rule.
* Offer a hint or retry when the activity permits it.
* Keep the learner on the current step until the required action is complete.

### Hint

A hint should guide the learner toward the solution without immediately revealing it.

Hints should be authored as part of the lesson content. AI-generated hints are not required for the MVP.

### Retry

Retry behaviour must be defined consistently for each activity type.

For the initial implementation:

* Allow retry on practice questions.
* Preserve lesson progress while retrying.
* Avoid awarding duplicate completion rewards for repeated submissions.
* Track attempts only if they are needed for product behaviour or meaningful progress reporting.

## 6. Navigation Rules

* World Learning Path → Lesson Player.
* Back → World Learning Path, with unsaved work handled appropriately.
* Continue → Next lesson step.
* Final required step → Lesson Completion / Results.
* Resume → Restore saved lesson progress where supported.
* Retry → Repeat the relevant activity without resetting unrelated completed lessons.

The learner must not accidentally lose completed steps because of back navigation or an app restart.

## 7. Lesson Completion Rules

A lesson is complete only when its defined completion requirements are satisfied.

Possible requirements:

* Reading or progressing through required content blocks.
* Completing required knowledge checks.
* Passing required coding exercises.

The exact rules must be defined in the curriculum specification. Merely opening a lesson must not mark it as complete.

On successful completion:

1. Persist the completion state.
2. Update world progress.
3. Award any eligible XP once.
4. Open the Lesson Completion / Results screen.

If persistence fails, the app must not falsely confirm that progress has been saved.

## 8. Required UI States

### Loading

* Show a lightweight loading state.
* Avoid blank screens while content loads.

### Content Error

* Display a clear error message.
* Offer Retry.
* Preserve any previously saved progress.

### Answer Submitted

* Disable duplicate submissions while evaluation is pending.
* Show a clear result when evaluation finishes.

### Offline / Network Error

* Explain when an action requires a network connection.
* Preserve locally available content and progress where supported.
* Never pretend a server-side coding evaluation succeeded when it did not run.

### Completed Lesson

* Allow review of completed content.
* Distinguish review mode from an unfinished lesson.
* Prevent duplicate completion rewards.

### Code Execution Error

Differentiate between:

* Compilation or syntax errors.
* Failed test cases.
* Runtime errors.
* Execution service or network failures.

Display only the technical detail needed to help a beginner take the next step.

## 9. Visual Design

Follow ZELO's established design direction:

* Light ivory/white background.
* Violet primary accent.
* Green for positive outcomes.
* Clear headings and comfortable reading width.
* Simple rectangular content sections.
* Consistent code formatting.
* Restrained icons and small illustrations.
* Adequate spacing between explanations and activities.

Avoid:

* Large animated backgrounds.
* A different layout for every lesson.
* Excessive confetti and reward animations.
* Overly dense paragraphs.
* Multiple persistent toolbars.
* Decorative elements that compete with the lesson content.

The learner should focus on the concept, not the interface.

## 10. Accessibility and Usability

* Use readable text sizes and sufficient contrast.
* Make answer options large enough to tap comfortably.
* Provide visible selected, correct, incorrect, and disabled states.
* Do not communicate status through colour alone.
* Support keyboard interaction where applicable.
* Provide a practical alternative to drag-and-drop.
* Preserve readable code indentation.
* Ensure primary actions remain easy to find on smaller screens.

## 11. Logical Data Requirements

**Lesson Content**

* Lesson ID.
* Title and learning objective.
* Ordered content blocks.
* Content block type.
* Explanation text and examples.
* Activity configuration.
* Required completion rules.

**Activity**

* Activity ID and type.
* Prompt and instructions.
* Answer options or expected answer.
* Validation rules.
* Explanation and optional hints.
* Coding test configuration, where applicable.

**Learner Progress**

* Lesson ID.
* Current step.
* Completed steps or activities.
* Completion status.
* Saved code or answer state, where required.
* Last updated timestamp.

These are logical requirements, not a final database schema. The content format and API contracts will be documented separately.

## 12. Acceptance Criteria

* [ ] A lesson loads the correct content in the defined order.
* [ ] Explanation and example blocks render consistently.
* [ ] All six required activity types are supported by the reusable player.
* [ ] Each activity validates answers according to its own rules.
* [ ] Correct and incorrect answers produce useful feedback.
* [ ] Retry behaviour works without resetting unrelated progress.
* [ ] Coding results distinguish test failures from execution failures.
* [ ] Required completion conditions are enforced.
* [ ] Lesson progress persists and can be resumed where supported.
* [ ] Completion rewards cannot be repeatedly claimed by reopening a lesson.
* [ ] Loading, error, and offline states are handled appropriately.
* [ ] Code examples remain readable on supported screen sizes.
* [ ] Navigation does not silently discard saved progress.
* [ ] The same player works across HTML, CSS, JavaScript, and React lessons.
* [ ] No activity uses placeholder logic while appearing fully functional.

## 13. Out of Scope

The MVP will not include:

* An AI tutor or unrestricted AI-generated lessons.
* A full desktop-class IDE.
* Arbitrary package installation.
* Production deployment or hosting of learner projects.
* Multiplayer coding battles.
* Real-time collaborative editing.
* Complex code editor customisation.
* Adaptive difficulty powered by machine learning.
* Voice-based lesson delivery.

## 14. Dependencies

* Approved curriculum and lesson content format.
* World Learning Path screen.
* Lesson Completion / Results screen.
* Progress persistence.
* Activity validation and evaluation logic.
* Secure coding execution design.
* Shared UI components and navigation.

## 15. Definition of Done

The Lesson Player is complete when a beginner can open a published lesson, understand its content, complete the supported interactive activities, receive meaningful feedback, retry where appropriate, and finish the lesson with progress saved accurately.

The experience must be reusable across all four curriculum subjects without duplicating the entire screen implementation.

---

**Next screen:** Screen 05 — Lesson Completion & Results. Define how ZELO presents learning outcomes, XP rewards, progress updates, retry options, and the next lesson without overloading the learner with gamification.

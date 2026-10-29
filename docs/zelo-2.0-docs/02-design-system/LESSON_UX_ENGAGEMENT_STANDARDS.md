# ZELO 2.0 — Lesson UX & Engagement Design Standards

**Document ID:** ZELO-UX-038
**Filename:** `LESSON_UX_ENGAGEMENT_STANDARDS.md`
**Version:** 3.8
**Status:** Draft
**Product:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Purpose

Define the user experience and instructional design standards for ZELO lessons so beginners actively learn, practise, receive useful feedback, and experience a clear sense of progress.

Lessons should feel engaging like leading learning apps without becoming visually noisy, excessively gamified, or difficult to navigate.

## 2. Core UX Principles

1. **One meaningful step at a time:** Each learning beat should teach or reinforce one primary concept.
2. **Learn by doing:** Learners should answer questions, predict outputs, arrange code, or write code rather than only read explanations.
3. **Immediate feedback:** Every submitted response should produce a clear and useful outcome.
4. **Visible progress:** Learners should understand where they are in the lesson and what comes next.
5. **Small wins:** Acknowledge meaningful progress without celebrating every minor tap excessively.
6. **Beginner-first language:** Explain technical terms before relying on them.
7. **Practical relevance:** Connect concepts to visible webpage behaviour and real development tasks.
8. **Low-friction navigation:** Learners should focus on understanding, not figuring out the interface.

## 3. Standard Lesson Experience

The standard learning loop is:

**Learn → See → Interact → Practise → Feedback → Continue**

Not every lesson must use every stage. The sequence should adapt to the learning objective.

### 3.1 Learn

* Introduce one concept in plain language.
* Explain why the concept matters.
* Keep paragraphs short and scannable.
* Introduce only the terminology required for the current step.
* Use examples that build on previously taught concepts.

### 3.2 See

* Show a small, relevant code example.
* Explain important lines or code sections.
* Display the expected output where applicable.
* Avoid presenting a large block of unexplained code.

### 3.3 Interact

Use a short activity to verify understanding before increasing difficulty.

Suitable activities include:

* Single-choice questions.
* Multiple-select questions.
* Reordering steps or code fragments.
* Filling blanks from options.
* Typing a missing value or expression.
* Predicting the output of a code snippet.

### 3.4 Practise

* Apply the concept in a focused task.
* Give learners enough context to begin.
* Use hints when appropriate.
* Separate the learning objective from unnecessary setup work.
* Introduce larger coding tasks only when prerequisite concepts are available.

### 3.5 Feedback and Continue

* Explain whether the response was correct.
* For incorrect answers, identify the relevant misconception when possible.
* Offer a retry or explanation before continuing, according to the activity's rules.
* Make the next action explicit.

## 4. Content Density and Screen Hierarchy

Each lesson screen should have one dominant purpose.

Recommended hierarchy:

1. Lesson step title or short question.
2. Essential explanation, example, or task.
3. Relevant visual or code output.
4. Primary interaction or action.
5. Optional hint or supporting information.
6. Progress indicator and navigation controls.

### Content guidelines

* Prefer concise explanations over long walls of text.
* Split complex ideas into multiple meaningful steps.
* Avoid splitting a simple concept into unnecessary screens.
* Keep code examples readable on small screens.
* Use expandable explanations only for genuinely optional details.
* Do not show multiple competing primary actions.
* Preserve the learner's place when returning to a lesson.

There is no mandatory word count per screen. Content length should match the complexity of the concept.

## 5. Interaction and Feedback Standards

### Correct response

A correct response should:

* Clearly confirm success.
* Briefly explain why the answer works when educationally useful.
* Provide a clear Continue action.
* Use restrained visual feedback, such as a colour change, icon, or subtle animation.

### Incorrect response

An incorrect response should:

* Clearly indicate that the answer needs correction.
* Explain the relevant concept without shaming the learner.
* Highlight the specific error when possible.
* Offer a hint or another attempt when appropriate.
* Avoid revealing the full solution too early when productive practice is the goal.

Avoid feedback that says only “Wrong” or “Try again” when a useful explanation can be provided.

### Retry behaviour

* Preserve the learner's existing answer when appropriate.
* Allow retries according to the activity's defined rules.
* Make hint availability clear.
* Do not punish normal learning mistakes with lost progress.
* Do not award duplicate completion rewards for repeated attempts.

## 6. Pacing and Difficulty Progression

Lessons should gradually move from recognition to independent application.

Recommended progression:

1. Understand a concept.
2. Recognise it in an example.
3. Predict what it will do.
4. Complete a partially solved task.
5. Solve a focused problem independently.
6. Apply it in a small practical project when appropriate.

Difficulty should increase through concept complexity and learner independence—not through confusing instructions or artificially restrictive timers.

A lesson should not introduce an advanced prerequisite before the learner has received the required foundation.

## 7. Coding Challenge UX

Coding challenges should make the relationship between code and output easy to understand.

### Required experience

* Display the task and expected behaviour clearly.
* Provide starter code when appropriate.
* Keep editor controls understandable for beginners.
* Separate **Run** from **Submit** where both actions exist.
* Display output, errors, or evaluation results in a readable area.
* Preserve the learner's draft when moving between supported states.
* Explain common errors in accessible language.
* Provide a meaningful next step after success or failure.

### Run versus Submit

* **Run:** Executes the current code and displays its behaviour or output.
* **Submit:** Evaluates the solution against the challenge's acceptance criteria.

Running code alone must not mark a challenge complete unless the challenge specification explicitly defines that behaviour.

### Error presentation

Prefer actionable messages, such as identifying a missing bracket or explaining that the expected output differs from the actual output.

Never expose hidden tests, internal infrastructure details, credentials, or sensitive execution information.

## 8. Progress and Transition UX

Learners should understand:

* Which lesson they are completing.
* How much of the current lesson remains.
* Whether the lesson has been completed.
* What they can do next.

Use progress indicators that represent meaningful completion, not merely elapsed time or the number of screens opened.

At lesson completion, present a concise result with:

* Completion status.
* Relevant learning progress.
* Earned rewards, when applicable.
* A clear next step.
* An option to review the lesson when supported.

Transitions should feel connected. Avoid unnecessary confirmation dialogs between ordinary lesson steps.

## 9. ZELO Visual Identity

### Design direction

* Ivory and white surfaces.
* Violet as a primary accent.
* Green for positive feedback and selected success states.
* Clear typography and generous spacing.
* Simple, purposeful illustrations.
* Readable code blocks and clear visual separation between explanation and practice.

### Avoid

* Excessive gradients and decorative effects.
* Crowded dashboards inside the lesson player.
* Complex 3D scenes that distract from the learning objective.
* Constant animations, confetti, and reward pop-ups.
* Unnecessary rounded cards around every element.
* Multiple unrelated badges, counters, and progress indicators competing for attention.

Visual effects should reinforce learning feedback, not replace it.

## 10. Motivation Without Pressure

ZELO should encourage consistent learning while respecting the learner's pace.

* Celebrate lesson completion and meaningful milestones.
* Keep streaks optional or easy to ignore.
* Never imply that a learner has failed because they missed a day.
* Avoid guilt-based reminders and urgency tactics.
* Do not make core learning content inaccessible merely because a learner missed a daily target.
* Do not use artificial waiting periods to slow educational progress.
* Keep reward animations brief and non-blocking.

Motivation should come primarily from understanding concepts, solving problems, and seeing practical progress.

## 11. Mobile-First and Accessibility Requirements

Design for small screens first while remaining adaptable to other approved platforms.

* Use readable text sizes and sufficient spacing.
* Keep primary actions easy to locate and operate.
* Avoid horizontal scrolling for ordinary lesson content.
* Ensure code examples and editor controls remain usable on narrow screens.
* Provide non-drag alternatives for reordering activities.
* Support keyboard navigation where the platform permits it.
* Provide meaningful labels for assistive technologies.
* Do not communicate correctness through colour alone.
* Respect reduced-motion preferences where supported.
* Ensure feedback and validation messages are perceivable without relying exclusively on animation.

## 12. UX Metrics

Use product analytics to evaluate learning quality rather than relying only on time spent in the app.

Suggested metrics:

* Lesson start-to-completion rate.
* Activity accuracy and retry rate.
* Lesson abandonment by step.
* Coding challenge run-to-submit conversion.
* Challenge completion rate.
* Return rate after a completed lesson.
* Learner-reported clarity and difficulty.

Interpret metrics carefully. A high retry rate may indicate a useful challenge or a confusing explanation; investigate before making changes.

## 13. Acceptance Criteria

The lesson experience is ready for release when:

* Each lesson step has a clear learning purpose.
* Instructions are understandable to the intended beginner audience.
* Correct and incorrect answers receive appropriate feedback.
* Retry and hint behaviour follows the activity specification.
* Learners can identify progress and the next action.
* Coding challenges distinguish execution from evaluation where applicable.
* Lesson completion and rewards remain consistent with server-confirmed progress.
* The layout works at supported screen sizes.
* Essential accessibility requirements are met.
* Motion and reward effects do not block learning.
* No core learning step depends on decorative animation or a complex visual environment.
* Analytics can identify meaningful lesson starts, completions, and challenge outcomes without unnecessarily collecting personal data.

## 14. Out of Scope

This document does not define:

* The complete curriculum or individual lesson answers.
* The XP economy, achievement catalogue, or reward values.
* The final technology stack.
* A full visual design specification for every screen.
* AI-generated explanations or adaptive AI tutoring.
* Social competitions, leaderboards, or pressure-based engagement mechanics.

These areas are governed by their respective ZELO specifications.

## 15. Open Decisions

* Whether lesson steps use a fixed bottom action area on all supported platforms.
* Which lesson steps can be revisited before completion.
* How hints affect challenge scoring, if scoring is introduced.
* Which learner feedback prompts belong in the MVP.
* Which analytics events are mandatory for the first release.

---

**End of Document 38 — Lesson UX & Engagement Design Standards**

**Next document:** Document 39 — `SAMPLE_LESSON_SPEC.md`, using a complete beginner-friendly HTML lesson to validate the lesson structure, activity types, feedback, and completion flow in a realistic example.

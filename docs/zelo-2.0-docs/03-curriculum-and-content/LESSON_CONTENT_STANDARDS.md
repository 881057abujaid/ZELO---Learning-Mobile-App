# ZELO 2.0 — LESSON_CONTENT_STANDARDS.md

**Version:** 2.1
**Status:** Draft
**Module:** Lesson Content Authoring & Quality Standards
**Priority:** MVP — Must Have

## 1. Purpose

Define a consistent, repeatable process for creating high-quality lessons for complete beginners learning web development.

Every lesson should be:

* Easy to understand without prior knowledge of the topic.
* Interactive rather than purely text-based.
* Practical, with opportunities to apply the concept.
* Accurate, tested and technically correct.
* Short enough to maintain focus without sacrificing understanding.
* Consistent with ZELO's curriculum, progress rules and visual design.

**Core principle:** A lesson is successful when learners understand and can apply a concept—not merely when they reach its final screen.

## 2. Target Learner

The primary learner is a complete beginner who may:

* Have never written code.
* Confuse similar technical terms.
* Need examples before attempting exercises.
* Make syntax and logical errors.
* Benefit from immediate, constructive feedback.
* Learn at a different pace from other learners.

Content must not assume that a learner already knows an unexplained technical term.

When introducing a new term, explain it in simple language and demonstrate it in context.

## 3. Standard Lesson Structure

Each lesson follows a flexible learning sequence.

<box border radius="lg" padding={3} gap={3}>
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="md" size="40px" align="center" justify="center">
      <icon name="book-open" size="lg" />
    </box>
    <box flex="1" gap={1}>
      **1. Learn**

```
  <text color="secondary" size="sm">Introduce one concept with a short, clear explanation and a relevant example.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="md" size="40px" align="center" justify="center">
      <icon name="eye" size="lg" />
    </box>
    <box flex="1" gap={1}>
      **2. See**

```
  <text color="secondary" size="sm">Show what the code does, what the output looks like and why the result occurs.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="md" size="40px" align="center" justify="center">
      <icon name="mouse-pointer-click" size="lg" />
    </box>
    <box flex="1" gap={1}>
      **3. Interact**

```
  <text color="secondary" size="sm">Use a question, code prediction, reordering activity or fill-in-the-blank exercise.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="md" size="40px" align="center" justify="center">
      <icon name="code-2" size="lg" />
    </box>
    <box flex="1" gap={1}>
      **4. Practise**

```
  <text color="secondary" size="sm">Ask the learner to apply the concept in a small coding task when appropriate.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box background="surface-secondary" radius="md" size="40px" align="center" justify="center">
      <icon name="check-circle" size="lg" />
    </box>
    <box flex="1" gap={1}>
      **5. Understand and continue**

```
  <text color="secondary" size="sm">Explain mistakes, confirm learning and move to the next concept.</text>
</box>
```

  </row>
</box>

Not every lesson needs five separate stages. Simple concepts may require only an explanation and one exercise, while complex concepts may need several examples and practice steps.

## 4. Explanation Writing Standards

### 4.1 One primary objective

Each lesson must have one primary learning objective.

Good example:

“By the end of this lesson, the learner can create a hyperlink using the HTML anchor element.”

Avoid objectives such as:

“Understand HTML, CSS, JavaScript, accessibility and responsive design.”

That combines multiple concepts into one lesson.

### 4.2 Use simple, direct language

* Prefer short paragraphs.
* Explain technical terms before relying on them.
* Use consistent terminology throughout the curriculum.
* Avoid unnecessary jargon and lengthy introductions.
* Use headings to separate distinct ideas.
* Include only information relevant to the learning objective.

### 4.3 Explain the reason, not only the syntax

A lesson must not simply show code and expect the learner to memorise it.

It should explain:

1. What the code does.
2. Why the code is needed.
3. How its important parts work.
4. What changes when a value or element is modified.
5. What common mistake to avoid.

### 4.4 Keep examples focused

Use the smallest example that demonstrates the concept clearly.

For example, when teaching HTML links, begin with a single link before introducing navigation menus, multiple pages and advanced attributes.

Examples must be technically correct and consistent with the learner's current level.

## 5. Code Example Standards

Every code example must satisfy the following rules:

* Use readable indentation and meaningful names.
* Avoid unrelated concepts.
* Show the expected output or behaviour where useful.
* Explain important lines rather than explaining every trivial character.
* Use supported language features appropriate to the curriculum stage.
* Verify syntax and execution before publication.
* Clearly distinguish starter code from the completed solution.

### Example: HTML hyperlinks

**Explanation:** An anchor element creates a hyperlink. The `href` attribute specifies where the link points.

```html
<a href="https://example.com">Visit Example</a>
```

**Expected result:** The browser displays clickable text reading “Visit Example”. Selecting it navigates to the specified address.

**Practice prompt:** Change the visible link text to “Learn Web Development”.

The example should be tested and the explanation must accurately describe its behaviour.

## 6. Interactive Activity Standards

ZELO supports six initial activity categories.

| Activity             | Authoring requirements                                            |
| -------------------- | ----------------------------------------------------------------- |
| Single-choice MCQ    | One correct answer and meaningful distractors                     |
| Multiple-select      | Explicitly define all correct choices                             |
| Drag/reorder         | Define the expected sequence and a non-drag alternative           |
| Fill blank — options | Define accepted choices and unambiguous blanks                    |
| Fill blank — typed   | Define accepted answers and normalisation rules                   |
| Coding challenge     | Provide starter code, instructions, evaluation criteria and tests |

### 6.1 Good question design

Questions should assess the stated learning objective rather than test confusing wording.

For every activity:

* Write an unambiguous prompt.
* Define the correct answer before writing distractors.
* Ensure incorrect choices represent plausible beginner mistakes.
* Avoid trick questions.
* Avoid relying on visual colour alone.
* Do not reveal the answer through inconsistent option formatting.

### 6.2 Feedback is mandatory

For each answer, define the feedback behaviour.

**Correct answer:**

* Confirm the answer.
* Briefly explain why it is correct when useful.
* Allow the learner to continue.

**Incorrect answer:**

* Identify the misconception where possible.
* Provide a short explanation or hint.
* Allow retry according to the activity's rules.
* Do not shame, insult or unnecessarily discourage the learner.

### 6.3 Avoid repetitive busywork

Do not create extra questions merely to make a lesson longer.

Every activity should have a clear purpose, such as introducing a concept, checking understanding, practising recall or applying knowledge.

## 7. Coding Challenge Standards

A coding challenge must define:

1. Learning objective.
2. Task description.
3. Starter code, if required.
4. Expected behaviour or output.
5. Acceptance criteria.
6. Evaluation method.
7. Relevant test cases.
8. Helpful hints.
9. Feedback for common failures.
10. Completion and reward eligibility.

### Evaluation examples

* **HTML:** Required elements, attributes and semantic structure.
* **CSS:** Required styling properties and observable layout behaviour.
* **JavaScript:** Syntax, expected output, return values or behaviour tests.
* **React:** Component rendering, props, state and required interactions.

Evaluation should assess the intended outcome, not an unnecessarily narrow implementation, unless the lesson explicitly teaches a particular syntax or method.

Hidden tests, where used, must not be exposed to the learner or included in client-side source code.

Code execution must use an appropriate isolated environment with resource limits and security controls.

## 8. Difficulty Progression

Every lesson must be assigned a difficulty level for authoring and review purposes.

* **Level 1 — Introduction:** Recognise or understand a new concept.
* **Level 2 — Guided Practice:** Apply the concept with hints or partial code.
* **Level 3 — Independent Practice:** Solve a small task with limited guidance.
* **Level 4 — Integration:** Combine previously learned concepts.

These levels are internal content guidelines, not a requirement to display numeric difficulty labels in the UI.

A lesson should not suddenly introduce several unrelated concepts or require knowledge that its prerequisites have not taught.

## 9. Engagement Without Excessive Gamification

ZELO should feel rewarding because learners can see and understand their progress.

Use:

* Immediate answer feedback.
* Visible step progress.
* Small coding victories.
* Clear lesson completion.
* Meaningful XP rewards.
* Occasional practical challenges.
* Short recaps that reinforce important ideas.

Avoid:

* Unnecessary animations after every action.
* Long sequences of trivial questions.
* Artificial waiting timers.
* Punishing learners for incorrect answers.
* Excessive pop-ups and reward screens.
* Rewards that encourage repeated low-effort actions rather than learning.

The goal is to make learning enjoyable without distracting from the subject.

## 10. Lesson Content Definition

Each lesson should be representable through the existing content model.

Required logical fields:

* `id`
* `moduleId`
* `title`
* `description`
* `order`
* `learningObjectives`
* `prerequisites`
* `estimatedDuration`
* `completionCriteria`
* `contentVersion`
* `status`

Each step should include:

* `id`
* `lessonId`
* `type`
* `order`
* `title`
* `content`
* `required`
* `configuration`

Activity-specific configuration must define accepted answers, feedback, hints, code evaluation requirements and other relevant rules.

This is a logical authoring contract, not a final database schema or a requirement to introduce a new content management platform.

## 11. Review and Publishing Workflow

Every lesson must follow this lifecycle:

**Draft → Review → Published → Archived**

### Draft

The author creates the lesson and its activities.

### Review

A reviewer verifies:

* Technical correctness.
* Learning objective alignment.
* Clarity for beginners.
* Code execution and expected results.
* Activity validation and feedback.
* Prerequisite availability.
* Completion criteria.
* Accessibility and mobile usability.

### Published

Only approved content becomes available to learners.

### Archived

Content that should no longer be newly assigned is archived according to curriculum and progress-preservation rules.

Published lesson changes must be versioned where needed so existing learner progress is not silently invalidated.

## 12. Quality Assurance Checklist

Before publication:

* [ ] The learning objective is clear and measurable.
* [ ] All prerequisites are available.
* [ ] Every explanation is accurate and beginner-friendly.
* [ ] All code examples have been checked.
* [ ] Expected output matches actual behaviour.
* [ ] Every activity has a defined answer or evaluation contract.
* [ ] Correct and incorrect feedback is appropriate.
* [ ] Hints are useful without unnecessarily revealing answers.
* [ ] Coding challenges pass their own evaluation tests.
* [ ] Required completion criteria are configured.
* [ ] The lesson can be completed on the supported device sizes.
* [ ] Screen-reader and keyboard requirements are considered.
* [ ] No placeholder content is presented as finished curriculum.
* [ ] The lesson has passed review.

## 13. MVP Scope

**Included:**

* A standard lesson template.
* The six supported activity categories.
* Structured content and validation.
* Beginner-friendly feedback.
* Code example and challenge testing.
* Draft/review/publish lifecycle.
* Content versioning requirements.
* Reusable lesson authoring conventions.

**Out of scope:**

* AI-generated lesson content.
* AI-generated feedback.
* Adaptive difficulty engines.
* A visual drag-and-drop course builder.
* User-created courses.
* Community submissions and public reviews.
* Automatic translation into multiple languages.
* Advanced learning analytics.
* A full learning management system.

## 14. Acceptance Criteria

* Every published lesson has a measurable learning objective.
* Every required activity has deterministic validation.
* Learners receive useful feedback after answering.
* Required coding tasks have testable completion criteria.
* Lessons use consistent structures without becoming mechanically repetitive.
* Content cannot be published without passing required checks.
* Changes to published lessons do not silently erase learner progress.
* Lessons remain consistent with the curriculum and progress specifications.
* The authoring process does not require an unnecessarily complex platform.

## 15. Open Decisions

Before production-scale content creation, finalise:

1. The lesson authoring format and storage location.
2. Who can author, review and publish lessons.
3. Whether content is initially maintained in structured files or a database-backed authoring interface.
4. The minimum test coverage required for each activity type.
5. The content versioning and migration strategy.
6. The initial lesson set for the first beta.

**Implementation principle:** Start with a small set of high-quality lessons and reusable activity templates. Improve the authoring workflow only when real content production demonstrates a need.

---

**Next document:** Screen 22 — Coding Engine & Code Execution Architecture.

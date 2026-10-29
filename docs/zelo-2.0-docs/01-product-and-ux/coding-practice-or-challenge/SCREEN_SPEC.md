# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.6
**Status:** Draft
**Module:** Coding Practice / Challenge
**Priority:** MVP — Must Have
**Previous Screen:** Lesson Player
**Next Screen:** Lesson Player or Lesson Completion / Results

---

## 1. Purpose

The Coding Practice screen allows learners to apply programming concepts through guided coding challenges.

It must support a gradual progression from simple markup exercises to JavaScript logic and React components.

The experience should:

* Explain the coding task clearly.
* Provide starter code where appropriate.
* Let learners edit and run code.
* Evaluate code against defined requirements.
* Explain errors and failed tests.
* Provide hints and retry options.
* Preserve work where supported.

**Primary action:** Run or submit the learner's code and receive useful feedback.

## 2. MVP Scope

The screen must support these curriculum areas:

| Subject    | Example activity                                 |
| ---------- | ------------------------------------------------ |
| HTML       | Create a heading and paragraph                   |
| CSS        | Style an element using specified properties      |
| JavaScript | Write a function that transforms a value         |
| React      | Build a component that renders specified content |

These are examples, not the final curriculum.

The exact challenge types, execution environments, and supported language features will be defined in the coding architecture and curriculum specifications.

## 3. Screen Layout

### A. Top Bar

Display:

* Back button.
* Challenge title.
* Compact challenge progress or lesson identifier.
* Optional difficulty label when difficulty levels are formally defined.

Do not display unnecessary counters or multiple reward indicators.

### B. Challenge Instructions

Show:

* Task title.
* Clear objective.
* Short instructions.
* Acceptance criteria.
* Expected behaviour or output when useful.

Example:

**Challenge: Create a Profile Heading**

“Write HTML that displays a heading containing your profile name and a paragraph introducing yourself.”

Requirements:

* Use an appropriate heading element.
* Include a paragraph.
* Keep the markup valid.

The challenge should describe what the learner needs to accomplish without requiring them to guess hidden requirements.

### C. Code Editor

The editor must:

* Display starter code when provided.
* Allow the learner to edit the code.
* Preserve indentation and line breaks.
* Use readable monospace text.
* Support scrolling for longer code.
* Provide basic undo/redo or rely on the editor's built-in support where available.
* Display a clear editing area on supported mobile screen sizes.

For the initial MVP, use a focused editor with essential functionality rather than building a complete IDE.

The editor must not be presented as functional if it only displays static code.

### D. Run / Submit Controls

Provide the actions relevant to the challenge.

**Run**

* Executes the current code in the configured environment.
* Displays the output or preview.
* Does not automatically mark the lesson complete.

**Submit**

* Evaluates the code against the challenge's defined requirements.
* Displays the result and relevant test feedback.
* Satisfies the challenge only when its completion conditions pass.

Where a challenge does not need separate Run and Submit actions, a single clearly labelled action may be sufficient.

Avoid displaying redundant buttons that perform the same operation.

### E. Output and Feedback

Show the execution result in a clearly separated area.

Depending on the challenge, this may contain:

* Rendered HTML/CSS preview.
* Console output.
* Test results.
* Compilation or syntax errors.
* Runtime errors.
* A concise explanation of the failure.

Keep the output area easy to find without forcing the learner to navigate through multiple screens.

On smaller devices, the editor and output can be arranged vertically.

## 4. Challenge Evaluation

Each challenge must have explicit evaluation rules.

### HTML Challenges

Possible checks:

* Required elements exist.
* Required text or attributes are present.
* The rendered result satisfies defined requirements.
* Markup follows the task's expected structure.

Avoid relying exclusively on exact string matching when equivalent valid HTML should be accepted.

### CSS Challenges

Possible checks:

* Required CSS properties are applied.
* The target elements receive the intended styles.
* The rendered preview meets defined visual or structural requirements.

Where possible, validate computed styles or observable behaviour rather than requiring one exact formatting style.

### JavaScript Challenges

Possible checks:

* The code parses and executes.
* The required function or output exists.
* Defined test cases pass.
* Relevant edge cases are covered when appropriate.

The test suite must evaluate the required behaviour rather than a single hardcoded answer whenever possible.

### React Challenges

Possible checks:

* The required component renders.
* Expected content appears.
* Props and component behaviour satisfy the task.
* Defined tests pass.

React challenges require an appropriate configured environment. They must not silently fall back to static output while appearing to execute real React code.

## 5. Feedback and Hints

### Successful Submission

* Show a clear success message.
* Summarise the result, such as “All required tests passed.”
* Explain the relevant concept when useful.
* Allow the learner to continue.

### Failed Submission

* Identify which requirement or test failed.
* Show a helpful error message.
* Keep the learner's code intact.
* Offer a retry option.
* Provide a hint when one is available.

Do not reveal every hidden test or its expected solution automatically if doing so would undermine the exercise.

### Hints

Hints should progress from general guidance to more specific assistance.

For example:

1. Identify the concept involved.
2. Point toward the relevant syntax or approach.
3. Provide a more specific clue.

Full solutions should be shown only when the lesson design explicitly allows them.

Hints must be authored and reviewed as curriculum content for the MVP. An AI tutor is not required.

## 6. Code Persistence

The system should preserve a learner's work when supported by the challenge type.

Required behaviour:

* Keep the current editor contents when showing test feedback.
* Do not reset the code after a failed submission.
* Restore saved code when resuming a challenge if draft persistence is implemented.
* Provide a clear warning before discarding unsaved work when appropriate.
* Do not mark work complete merely because the editor contains code.

Draft persistence may be implemented locally or through the backend according to the architecture decision.

## 7. Security and Execution Requirements

Executing learner-written code is a security-sensitive operation.

The implementation must:

* Never execute arbitrary learner code directly inside a trusted backend process without suitable isolation.
* Use an appropriate sandbox or isolated execution service.
* Apply execution timeouts and resource limits.
* Prevent unauthorised access to server secrets, internal services, and unrelated user data.
* Restrict network access and filesystem access according to the challenge's requirements.
* Validate submissions on the trusted evaluation side.
* Avoid exposing hidden tests or server credentials to the learner.
* Return clear failure responses when execution infrastructure is unavailable.

For HTML and CSS previews, isolate learner content from the main application.

The specific sandbox, runtime provider, supported languages, and hosting approach are architecture decisions. They must be selected before implementing real code execution.

**Security is a release requirement, not an optional enhancement.**

## 8. Required UI States

### Ready

* Challenge instructions and starter code are visible.
* The editor is interactive.
* The learner can run or submit code.

### Running

* Display a processing indicator.
* Prevent duplicate submissions while the same operation is pending.
* Keep the current code unchanged.

### Passed

* Show a clear success state.
* Display relevant test results.
* Enable the appropriate Continue action.

### Failed

* Show failed test details or an understandable error.
* Preserve the code.
* Offer retry and available hints.

### Execution Error

Distinguish between:

* Syntax or compilation error.
* Runtime error.
* Failed test cases.
* Timeout or resource-limit failure.
* Network or execution-service failure.

### Empty or Invalid Submission

* Explain what is missing.
* Avoid sending invalid requests unnecessarily.
* Keep the learner on the current challenge.

### Offline

* Preserve local work where supported.
* Explain that remote execution or evaluation is unavailable.
* Do not fabricate successful results.

## 9. Navigation Rules

* Lesson Player → Coding Practice.
* Successful required challenge → Lesson Player or completion flow, according to lesson configuration.
* Failed challenge → Remain on the challenge.
* Hint → Remain on the challenge.
* Back → Return to the previous lesson step, handling unsaved work appropriately.
* Resume → Restore challenge state where supported.

A learner must not bypass a required coding exercise by navigating directly to a completion screen.

## 10. Visual Design

Follow ZELO's existing design direction:

* Light ivory/white background.
* Violet primary actions.
* Green for passed tests.
* Clear, readable code typography.
* Simple bordered editor and output sections.
* Minimal icons.
* Strong contrast between instructions, code, and feedback.

On mobile, prioritise a comfortable editor and readable output. Avoid compressing the editor into an unusably small panel just to display a desktop-style split view.

Do not add complex IDE toolbars, multiple terminal panels, minimaps, plugin systems, or advanced debugging controls to the MVP.

## 11. Logical Data Requirements

**Challenge**

* Challenge ID.
* Lesson ID.
* Title and instructions.
* Challenge type.
* Starter code.
* Required completion criteria.
* Supported runtime.
* Hint content.

**Submission**

* Learner ID.
* Challenge ID.
* Submission identifier.
* Code submitted.
* Evaluation status.
* Test results or safe feedback summary.
* Timestamp.

**Draft State**

* Learner ID.
* Challenge ID.
* Saved code, where supported.
* Last updated timestamp.

These are logical requirements, not a final database schema. Retention, privacy, execution contracts, and data storage must be specified separately.

## 12. Acceptance Criteria

* [ ] Challenge instructions and acceptance criteria are clear.
* [ ] The editor supports genuine code editing.
* [ ] Starter code is provided where appropriate.
* [ ] Run and Submit actions have clearly defined behaviour.
* [ ] Evaluation follows explicit challenge rules.
* [ ] Output and test feedback are understandable.
* [ ] Failed submissions preserve the learner's code.
* [ ] Retry and hints work as specified.
* [ ] Required tests must pass before the challenge is considered complete.
* [ ] HTML/CSS previews are isolated from the main application.
* [ ] Code execution has appropriate isolation, timeouts, and resource limits.
* [ ] Server secrets and hidden tests are not exposed to learners.
* [ ] Execution-service failures do not appear as successful submissions.
* [ ] Navigation respects lesson completion requirements.
* [ ] The editor and results are usable on supported mobile devices.

## 13. Out of Scope

The MVP will not include:

* A complete VS Code-style IDE.
* Arbitrary package installation.
* Git integration inside the editor.
* Project deployment or public hosting.
* Multi-file project management unless a specific curriculum requirement justifies it.
* Collaborative live coding.
* AI-generated code corrections.
* An unrestricted terminal.
* User-created coding challenges.
* Competitive coding leaderboards.

## 14. Dependencies

* Approved coding curriculum.
* Lesson Player and completion flow.
* Challenge content format.
* Secure execution architecture.
* Evaluation and test framework.
* Progress and submission persistence.
* Shared editor and feedback components.

## 15. Definition of Done

The screen is complete when a learner can understand a coding task, edit and execute code in its configured environment, receive reliable feedback against defined requirements, retry without losing work, and complete the challenge only after its actual success criteria are met.

---

**Next screen:** Screen 07 — Interactive Quiz & Practice Activities. Define the reusable interaction experience for MCQs, multiple-select questions, ordering exercises, fill-in-the-blanks, and short-answer activities.

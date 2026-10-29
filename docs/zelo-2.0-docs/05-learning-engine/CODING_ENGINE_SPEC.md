# ZELO 2.0 — CODING_ENGINE_SPEC.md

**Version:** 2.2
**Status:** Draft
**Module:** Coding Engine & Code Execution Architecture
**Priority:** MVP — Must Have for coding challenges

## 1. Purpose

Define how ZELO executes, previews and evaluates learner-written code for HTML, CSS, JavaScript and React challenges.

The coding engine must provide:

* A beginner-friendly coding experience.
* Immediate and understandable feedback.
* Reliable challenge evaluation.
* A safe execution environment.
* Consistent behaviour across supported devices.
* Integration with lesson completion, progress tracking and XP.

**Core principle:** The learner should experience coding as simple as possible, while the underlying execution system remains secure and testable.

## 2. Supported Languages

| Language   | Learner experience                     | Evaluation approach                               |
| ---------- | -------------------------------------- | ------------------------------------------------- |
| HTML       | Write markup and preview a page        | Structure and required-element checks             |
| CSS        | Style an HTML page and preview changes | Styling requirements and visual/structural checks |
| JavaScript | Write and execute JavaScript           | Output, return values and behaviour tests         |
| React      | Build a component and see it render    | Rendering, props, state and interaction tests     |

Each language requires its own evaluation strategy. A single generic text comparison is not sufficient for every challenge.

## 3. MVP Architecture

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **ZELO Mobile App**

```
<text color="secondary" size="sm">Instructions · Editor · Run · Submit · Feedback</text>
```

  </box>
  <icon name="arrow-down-up" size="xl" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Coding Challenge API**

```
<text color="secondary" size="sm">Authentication · Challenge configuration · Submission records</text>
```

  </box>
  <icon name="arrow-down-up" size="xl" color="secondary" />
  <grid columns={2} gap={2}>
    <grid-item>
      <box border radius="md" padding={3} align="center" gap={1}>
        <icon name="monitor" size="xl" />
        **Web Preview**

```
    <text color="secondary" size="sm" textAlign="center">HTML + CSS rendering</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={3} align="center" gap={1}>
    <icon name="shield-check" size="xl" />
    **Isolated Evaluator**

    <text color="secondary" size="sm" textAlign="center">JS and React execution/tests</text>
  </box>
</grid-item>
```

  </grid>
  <text color="secondary" size="sm" textAlign="center">Conceptual architecture. Exact deployment and execution technology remain open decisions.</text>
</box>

The diagram represents logical responsibilities, not a requirement to deploy four separate services.

For the MVP, use the smallest architecture that can safely isolate untrusted code and meet the required evaluation needs.

## 4. Coding Challenge Interface

Each challenge should contain:

1. **Challenge title** — a short, descriptive name.
2. **Instructions** — what the learner must build or change.
3. **Starter code** — optional prefilled code.
4. **Editor** — a focused code input area.
5. **Run button** — executes or previews the current code.
6. **Output panel** — displays rendered content or execution results.
7. **Submit button** — evaluates the challenge's completion criteria.
8. **Feedback area** — explains success, failure or execution problems.
9. **Hints** — predefined guidance where configured.

On mobile, the editor and output may appear as separate tabs or stacked panels to avoid cramped layouts. The chosen layout should preserve easy access to Run and Submit.

The interface should not attempt to reproduce a full desktop IDE.

## 5. HTML and CSS Preview

### 5.1 Behaviour

* Provide starter HTML and optional CSS.
* Render the current HTML and CSS in a controlled preview.
* Allow the learner to run the preview without submitting the challenge.
* Preserve the draft while navigating within the supported challenge flow.
* Show clear errors when preview generation fails.

### 5.2 Evaluation

HTML challenges may check:

* Required elements.
* Required attributes.
* Text or structural requirements.
* Semantic markup where relevant.

CSS challenges may check:

* Required CSS properties or rules.
* Expected computed styles.
* Layout requirements that can be evaluated reliably.

Avoid requiring an exact HTML string or CSS formatting pattern when multiple valid implementations satisfy the learning objective.

Visual checks should be used only when the expected layout can be evaluated reliably.

### 5.3 Security

Learner HTML and CSS are untrusted input.

* Use an isolated preview context, such as a suitably sandboxed browser frame.
* Restrict scripts and external resource loading unless explicitly required.
* Do not allow preview code to access application credentials, privileged APIs or unrelated app data.
* Prevent preview content from navigating or modifying the trusted application context.
* Apply suitable resource and execution limits.

A browser preview is not automatically secure merely because it is displayed inside a frame. Sandbox permissions and content-security restrictions must be configured deliberately.

## 6. JavaScript Execution

### 6.1 Supported behaviour

The JavaScript evaluator should support the subset of JavaScript features required by the published curriculum.

Depending on the challenge, it may evaluate:

* Syntax validity.
* Console output.
* Return values.
* Function behaviour.
* Expected transformations.
* Required test cases.

### 6.2 Execution model

JavaScript submitted by a learner must execute in a controlled environment.

For server-side execution:

* Use an isolated execution environment or appropriately hardened sandbox.
* Enforce execution timeouts and resource limits.
* Restrict filesystem and network access by default.
* Do not expose environment variables, API keys or internal credentials.
* Separate learner output from evaluator diagnostics.
* Terminate runaway execution safely.

Do not execute arbitrary learner code directly inside the trusted backend process.

### 6.3 Error feedback

Where possible, translate technical errors into useful guidance.

For example:

* Technical error: `Unexpected token`
* Learner-facing guidance: “Check the syntax around this line. You may have missed a bracket or punctuation mark.”

Keep the original technical details available when useful, but do not expose internal server paths, secrets or sensitive infrastructure information.

## 7. React Challenge Execution

React challenges require additional support for JSX transformation, React rendering and component testing.

The evaluator must define:

* The supported React version.
* Which imports are available.
* How JSX is transformed.
* Which APIs and browser features are supported.
* How component output and interactions are tested.
* How execution is isolated and terminated.

### MVP recommendation

Start with **single-component challenges** using a controlled React environment and predefined dependencies.

Do not allow arbitrary package installation or unrestricted access to the build system.

Multi-file applications, routing libraries, complex build configuration and arbitrary dependencies should be considered only after the basic React challenge flow is reliable.

## 8. Run Versus Submit

These actions must have distinct purposes.

| Action                     | Purpose                                      | Completion XP                |
| -------------------------- | -------------------------------------------- | ---------------------------- |
| Run                        | Preview or execute the current draft         | No                           |
| Submit — failed            | Evaluate the draft; requirements are not met | No                           |
| Submit — passed            | Confirm required criteria are satisfied      | Eligible under the XP policy |
| Review completed challenge | Practise an already completed challenge      | No repeat completion XP      |

Passing a challenge does not automatically mean the XP reward has been committed. The progress and reward system must confirm persistence before the final reward is shown.

## 9. Evaluation Contract

Every published coding challenge must define an evaluation contract.

Required logical fields:

* `challengeId`
* `language`
* `instructions`
* `starterCode`
* `evaluationType`
* `acceptanceCriteria`
* `testCases`
* `timeoutPolicy`
* `resourceLimits`
* `hints`
* `completionPolicy`
* `contentVersion`

Optional fields may include a reference solution and hidden tests.

The exact schema should be finalised with the Content Model and backend implementation rather than duplicating existing models unnecessarily.

### Evaluation rules

* A challenge must not be published without a valid evaluation contract.
* Test results must be deterministic where practical.
* Hidden tests must remain on the trusted evaluation side.
* A challenge passes only when all required tests pass.
* Infrastructure failures must not be reported as learner mistakes.
* Changes to challenge tests must be versioned when they affect existing submissions.

## 10. Challenge States

| State           | Meaning                                                             |
| --------------- | ------------------------------------------------------------------- |
| Ready           | The challenge is ready for editing or execution.                    |
| Running         | The current code is being executed.                                 |
| Passed          | Required evaluation criteria have passed.                           |
| Failed          | The code ran or was evaluated, but requirements were not satisfied. |
| Execution Error | The evaluator could not complete execution reliably.                |
| Saving          | The draft or submission is being persisted.                         |

The UI must prevent accidental duplicate submissions where appropriate and safely handle retries.

A failed request must not silently become a Passed result.

## 11. Draft and Submission Persistence

Where persistence is supported:

* Save learner drafts separately from authoritative completion records.
* Associate drafts with the correct user and challenge.
* Preserve valid code after failed runs.
* Avoid overwriting a newer draft with an older request.
* Store submission outcomes and relevant evaluation metadata.
* Avoid storing unnecessary sensitive information.
* Apply a retention policy to execution logs and submission data.

If draft saving fails, explain the problem and avoid falsely indicating that the code was saved.

## 12. Security Requirements

The execution system must treat all learner code as potentially malicious.

Required protections include:

* Execution isolation.
* CPU, memory and time limits.
* Restricted network and filesystem access.
* No secrets in learner-visible environments.
* Authentication and authorisation for protected API operations.
* Server-side validation of challenge identifiers and submission eligibility.
* Rate limiting and abuse protection.
* Output size limits.
* Safe handling of malformed or intentionally expensive code.
* Monitoring for evaluator failures and resource exhaustion.

Security controls must be tested before public release. Client-side validation alone is not sufficient.

## 13. Accessibility and Mobile Usability

* Provide readable code text and sufficient contrast.
* Use a monospaced font in the editor.
* Keep Run, Submit and output navigation easy to reach.
* Support device text scaling where practical.
* Avoid relying exclusively on colour to communicate pass/fail.
* Preserve code when switching between editor and output views.
* Provide accessible alternatives to interactions that require dragging.
* Ensure errors are readable by assistive technology.

The editor should prioritise reliable basic editing over advanced developer tooling.

## 14. Testing Requirements

Before release, test:

* Valid HTML and CSS previews.
* Invalid markup and CSS.
* Correct and incorrect JavaScript solutions.
* Infinite loops and excessive output.
* React rendering and interaction tests.
* Malformed submissions.
* Execution timeouts and service failures.
* Network loss during submission.
* Duplicate submissions.
* Draft persistence.
* Challenge completion and XP idempotency.
* Attempts to access restricted APIs, credentials or other users' data.
* Behaviour on the actual supported mobile devices.

A security test must confirm that learner code cannot escape its intended execution boundary.

## 15. MVP Scope

**Included:**

* Focused coding editor.
* HTML/CSS preview.
* JavaScript execution and evaluation.
* A constrained React challenge environment when React content is published.
* Predefined challenge tests and hints.
* Run and Submit actions.
* Feedback and error states.
* Draft persistence where supported.
* Secure evaluation and resource limits.
* Integration with lesson progress and XP.

**Out of scope:**

* Full VS Code-like IDE.
* Terminal access.
* Arbitrary package installation.
* Git integration.
* Application deployment and hosting.
* Unrestricted multi-file projects.
* Real-time collaborative coding.
* AI-generated fixes.
* AI code completion.
* User-created public coding challenges.

## 16. Acceptance Criteria

* [ ] Learners can edit and run supported challenge code.
* [ ] HTML and CSS challenges display a controlled preview.
* [ ] JavaScript challenges use defined evaluation criteria.
* [ ] React challenges use a documented, constrained execution environment.
* [ ] Passing and failing submissions produce distinct feedback.
* [ ] Execution errors are distinguishable from incorrect solutions.
* [ ] Draft code is preserved where persistence is supported.
* [ ] Repeated runs do not award completion XP.
* [ ] Successful completion is persisted without duplicate rewards.
* [ ] Untrusted code is isolated and subject to resource limits.
* [ ] Hidden tests and secrets are not exposed to learners.
* [ ] The basic experience is usable on the supported mobile devices.
* [ ] Automated tests cover execution, evaluation and failure recovery.

## 17. Open Decisions

Before implementation, finalise:

1. The editor library compatible with the chosen mobile stack.
2. Whether execution uses a browser-only sandbox, an isolated backend runner or a hybrid approach.
3. The execution infrastructure and its operating cost.
4. Supported browser APIs and JavaScript features.
5. The React challenge runtime and dependency policy.
6. Draft persistence and retention requirements.
7. Maximum execution time, memory and output size.
8. The first set of challenges needed for the beta.

**Implementation principle:** Do not build a complete online IDE. Build a safe, focused learning environment that supports exactly the coding tasks ZELO teaches.

---

**Next document:** Screen 23 — Backend Architecture & API Contracts.

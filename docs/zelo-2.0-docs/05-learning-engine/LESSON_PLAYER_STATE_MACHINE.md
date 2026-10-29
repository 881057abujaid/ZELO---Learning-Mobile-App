# ZELO 2.0 — Lesson Player State Machine & Completion Logic

**File:** `LESSON_PLAYER_STATE_MACHINE.md`
**Version:** 3.5
**Status:** Draft — Pending Approval
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

This document defines the runtime behaviour of the ZELO lesson player.

It specifies:

* Lesson lifecycle states.
* Activity lifecycle states.
* Valid state transitions.
* Answer submission and feedback.
* Retry behaviour.
* Lesson completion rules.
* Progress persistence and recovery.
* XP award coordination.
* Error and interruption handling.

The objective is to make the learning experience predictable for learners and technically reliable for the application.

## 2. Core Principles

1. A lesson is not completed merely because a learner opens it.
2. Every state transition must have a defined trigger.
3. The server is authoritative for persisted completion and rewards.
4. The client must not award authoritative XP independently.
5. Retrying an activity must not create duplicate rewards.
6. Network failures must not silently discard acknowledged progress.
7. A completed lesson must remain completed unless an explicit administrative correction or supported policy says otherwise.
8. The player must prevent learners from skipping mandatory requirements.
9. UI animations must never determine whether learning progress is saved.

---

## 3. Lesson Lifecycle States

The lesson player uses the following logical states.

| State               | Meaning                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `NOT_STARTED`       | The learner has not started the lesson.                                                                                                 |
| `IN_PROGRESS`       | The learner has started and has unfinished requirements.                                                                                |
| `READY_TO_COMPLETE` | All required activities and completion conditions are satisfied locally, but final completion has not yet been confirmed by the server. |
| `COMPLETED`         | The server has confirmed lesson completion.                                                                                             |
| `LOCKED`            | Prerequisites or availability rules prevent access.                                                                                     |

`LOCKED` is primarily an access state. It should not be confused with a lesson that the learner started but has not completed.

### State transition overview

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **LOCKED**

```
<text size="sm" color="secondary">Prerequisites not satisfied</text>
```

  </box>
  <icon name="arrow-down" size="lg" />
  <text size="xs" color="secondary">Prerequisites satisfied</text>
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **NOT_STARTED**

```
<text size="sm" color="secondary">Lesson can be opened</text>
```

  </box>
  <icon name="arrow-down" size="lg" />
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **IN_PROGRESS**

```
<text size="sm" color="secondary">Learning and activities are underway</text>
```

  </box>
  <icon name="arrow-down" size="lg" />
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **READY_TO_COMPLETE**

```
<text size="sm" color="secondary">All required conditions satisfied</text>
```

  </box>
  <icon name="arrow-down" size="lg" />
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **COMPLETED**

```
<text size="sm" color="secondary">Completion confirmed by the server</text>
```

  </box>
</box>

A learner may reopen a completed lesson for review without returning its authoritative progress state to `IN_PROGRESS`.

---

## 4. Valid Lesson Transitions

| Current state        | Event                                | Next state                             |
| -------------------- | ------------------------------------ | -------------------------------------- |
| `LOCKED`             | Prerequisites become satisfied       | `NOT_STARTED`                          |
| `NOT_STARTED`        | Learner starts the lesson            | `IN_PROGRESS`                          |
| `IN_PROGRESS`        | Required conditions are satisfied    | `READY_TO_COMPLETE`                    |
| `READY_TO_COMPLETE`  | Server confirms completion           | `COMPLETED`                            |
| `READY_TO_COMPLETE`  | Completion request fails temporarily | Remain pending; retry safely           |
| `COMPLETED`          | Learner opens lesson for review      | `COMPLETED`                            |
| Any accessible state | Lesson becomes unavailable           | Follow the defined availability policy |

Invalid transitions must be rejected rather than silently accepted.

For example, the client must not move a lesson directly from `LOCKED` to `COMPLETED`.

---

## 5. Activity Lifecycle States

Each activity has its own state, separate from the overall lesson.

| State             | Meaning                                                      |
| ----------------- | ------------------------------------------------------------ |
| `NOT_STARTED`     | No answer has been submitted.                                |
| `ANSWERING`       | The learner is selecting or entering an answer.              |
| `SUBMITTING`      | The answer is being evaluated.                               |
| `CORRECT`         | The answer satisfies the evaluation criteria.                |
| `INCORRECT`       | The submitted answer does not satisfy the criteria.          |
| `RETRY_AVAILABLE` | Another attempt is permitted.                                |
| `COMPLETED`       | The activity's required completion conditions have been met. |
| `ERROR`           | Evaluation failed for a technical reason.                    |

Not every activity needs every state. For example, a simple information step may only need to track whether it has been viewed.

### Activity transition rules

* Editing an answer moves the activity into `ANSWERING`.
* Submitting an answer moves it into `SUBMITTING`.
* A valid evaluation produces `CORRECT` or `INCORRECT`.
* A retryable incorrect answer produces `RETRY_AVAILABLE`.
* A technically failed evaluation produces `ERROR`, not `INCORRECT`.
* Successful completion of the activity moves it to `COMPLETED`.

A network error must never be shown as a wrong answer.

---

## 6. Answer Submission Rules

When a learner submits an answer:

1. Validate that the answer has the expected format.
2. Disable duplicate submission while the same request is pending.
3. Send the answer to the appropriate evaluator.
4. Evaluate the response according to the activity type.
5. Display specific feedback.
6. Update the activity state.
7. Persist progress according to the activity's saving policy.

### Duplicate submission protection

The UI should prevent accidental repeated taps. The backend must independently protect operations that can affect persisted progress or rewards.

Disabling a button is a usability measure, not a substitute for backend idempotency.

### Feedback rules

**Correct answer:**

* Confirm success.
* Explain why the answer is correct when useful.
* Allow the learner to continue.

**Incorrect answer:**

* Explain the relevant concept.
* Identify the mistake without shaming the learner.
* Offer a retry when permitted.

**Technical error:**

* Explain that the answer could not be evaluated.
* Preserve the learner's answer where possible.
* Offer a safe retry.

---

## 7. Retry and Review Behaviour

### Retry during an incomplete lesson

A learner may retry an activity according to its configured rules.

* An incorrect answer does not automatically complete a required activity.
* A retry must not erase progress from unrelated activities.
* Attempts may be recorded for analytics if that collection is enabled.
* Retry limits, if any, must be explicit and consistent.

**Proposed default — not approved:** Allow learners to retry ordinary practice activities without a restrictive attempt limit. Any limits for expensive or abuse-sensitive code execution should be handled separately.

### Review after completion

Reopening a completed lesson should:

* Preserve the completed progress state.
* Allow review of explanations and examples.
* Permit additional practice when supported.
* Avoid awarding lesson-completion XP again.
* Avoid changing historical completion timestamps without a defined reason.

---

## 8. Lesson Completion Conditions

A lesson may become eligible for completion only when its configured requirements are satisfied.

Possible requirements include:

* Required content steps have been visited.
* Mandatory quiz activities are completed.
* Required coding challenges pass their evaluation criteria.
* Required practice activities meet their completion conditions.

Not every lesson must require every activity type.

### Completion evaluation

The application should evaluate completion against the published lesson definition and its explicit completion rules.

A simple conceptual rule is:

`lessonComplete = allRequiredConditionsSatisfied`

This is a logical expression, not a final implementation contract.

Optional activities should not block completion unless the published lesson definition explicitly marks them as required.

### Server confirmation

When all required conditions are met:

1. The client enters `READY_TO_COMPLETE`.
2. It sends a completion request containing the lesson identifier and any required evidence.
3. The server validates lesson access and required activity results.
4. The server records completion transactionally.
5. The server applies the approved XP award policy.
6. The server returns the authoritative completion and reward result.
7. The client enters `COMPLETED` and displays the results experience.

If the server rejects completion because a requirement is missing, the client must refresh the relevant state and guide the learner to the unfinished requirement.

---

## 9. Progress Persistence

The player must distinguish between transient UI state and persisted learning progress.

### Transient state

Examples:

* The currently open explanation.
* An unsaved text input.
* Whether a feedback animation is visible.
* The currently selected option before submission.

Transient state may be lost if the app closes unless a draft-saving policy covers it.

### Persisted state

Examples:

* Lesson started.
* Completed required activities.
* Accepted answers where persistence is necessary.
* Successful coding challenge submissions.
* Lesson completion.
* Reward ledger entries.

Persist only what is necessary for reliable learning progress and product functionality.

### Saving policy

* Save meaningful progress at defined checkpoints.
* Do not wait until the entire lesson ends to persist every progress change.
* Clearly distinguish saved progress from a pending save.
* Do not claim that progress was saved until the application has sufficient confirmation.
* Use safe retry behaviour for failed requests.

---

## 10. Interruption and Recovery

If a learner leaves a lesson or the application closes:

1. Reload the learner's authoritative lesson progress.
2. Restore the most relevant unfinished step where the required information is available.
3. Preserve server-confirmed activity and lesson completion.
4. Restore unsaved answers only if a supported draft mechanism exists.
5. If the network is unavailable, show an appropriate state rather than inventing a successful save.
6. Reconcile pending operations safely after connectivity returns.

### Recovery scenarios

| Scenario                               | Expected behaviour                                                   |
| -------------------------------------- | -------------------------------------------------------------------- |
| App closes after a saved activity      | Resume with the activity progress preserved.                         |
| App closes before an answer is saved   | Restore only if a local or server draft exists.                      |
| Completion request times out           | Check or retry using an idempotent operation.                        |
| XP response is delayed                 | Reconcile with the server; do not grant XP locally as authoritative. |
| Network fails during evaluation        | Preserve the answer when possible and allow retry.                   |
| Lesson was completed on another device | Refresh and display the server-confirmed completed state.            |

Full offline learning and conflict-free multi-device synchronization are outside the initial scope unless separately approved.

---

## 11. Completion and XP Transaction Safety

Lesson completion and reward issuance must not drift apart.

**Required rule:** Repeating a completion request must not award duplicate lesson-completion XP.

Where the selected database supports transactions, the server should use an appropriate transactional workflow to:

* Confirm the lesson's eligibility for completion.
* Persist completion.
* Create the reward ledger entry if the award is eligible.
* Ensure a unique idempotency key or equivalent duplicate-prevention mechanism.

If the completion request is retried after a timeout, the server should return the existing authoritative result when the operation has already succeeded.

Reviewing a lesson, retrying an activity, or refreshing the results screen must not independently create another completion reward.

---

## 12. Loading and Error States

The lesson player must represent important states explicitly.

### Loading

Display progress feedback while lesson content or evaluation results are loading.

### Saving

Indicate that progress is being saved when the delay is meaningful.

### Evaluation error

Differentiate infrastructure or connectivity failures from incorrect answers.

### Completion pending

Keep the learner informed while the server confirms completion.

### Access denied

Explain when prerequisites or lesson availability prevent access.

### Content unavailable

Provide a recovery path when published content cannot be loaded.

Do not use a single generic error state for every failure.

---

## 13. Accessibility and Interaction Requirements

* All activity controls must be keyboard accessible where the platform supports keyboard navigation.
* Screen readers must receive meaningful answer feedback.
* Correctness must not be communicated through colour alone.
* Submission controls must have clear disabled and loading states.
* Feedback must not depend only on animation.
* Motion and transitions must not delay essential learning actions.
* Learners must be able to understand what remains before completing a lesson.

---

## 14. Acceptance Criteria

The lesson player state machine is ready for MVP release when:

* [ ] Locked lessons cannot be completed directly.
* [ ] Required activities control completion correctly.
* [ ] Optional activities do not block completion unexpectedly.
* [ ] Technical evaluation failures are not reported as incorrect answers.
* [ ] Retry behaviour preserves unrelated progress.
* [ ] Completed lessons remain completed during review.
* [ ] Completion is confirmed by the server.
* [ ] Repeated completion requests cannot create duplicate XP.
* [ ] Saved progress survives an application restart.
* [ ] Failed saves and evaluations have clear recovery paths.
* [ ] Lesson completion and reward records remain consistent.
* [ ] Invalid state transitions are rejected or safely reconciled.

---

## 15. Open Decisions

The following decisions require approval before implementation:

1. Exact mandatory-step rules for each activity type.
2. Whether content steps require explicit acknowledgement or simply viewing.
3. Whether ordinary activities have any retry limits.
4. Which answer drafts should be persisted.
5. How much in-progress state should be restored after an interruption.
6. The completion API's exact idempotency contract.
7. How published lesson revisions affect active learners.
8. Whether and when multi-device synchronization is supported.

---

## 16. Final Rule

**The learner experience may be optimistic, but persisted progress and rewards must be authoritative.**

The client should make lessons feel responsive. The server must ensure that completion, progress, and XP remain correct after retries, interruptions, and repeated requests.

The result should be a lesson player that is engaging for beginners and reliable enough to support the entire ZELO curriculum.

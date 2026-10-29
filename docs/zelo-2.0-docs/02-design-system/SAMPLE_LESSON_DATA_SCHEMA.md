# ZELO 2.0 — Sample Lesson Data Schema

**Document ID:** ZELO-DATA-040
**Filename:** `SAMPLE_LESSON_DATA_SCHEMA.md`
**Version:** 4.0
**Status:** Draft
**Related Documents:** Content Model, Lesson Authoring Workflow, Lesson Player State Machine, Coding Challenge Evaluation Specification

---

## 1. Purpose

Define a structured, versionable representation of lesson content that can be rendered by ZELO's reusable Lesson Player.

The schema must support:

* Lesson metadata and learning objectives.
* Ordered lesson steps.
* Explanations and code examples.
* Interactive activities.
* Answer validation and feedback.
* Coding challenges and evaluation criteria.
* Prerequisites and completion requirements.
* Content validation and publication.

**Core principle:** Content describes what the learner sees and does. The Lesson Player determines how that content is presented and how learner progress is managed.

## 2. Design Principles

1. Use one common structure for all curriculum worlds.
2. Support multiple activity types without creating a separate screen for each lesson.
3. Separate educational content from user progress.
4. Separate coding challenge instructions from secure evaluation logic.
5. Validate content before it can be published.
6. Version published content so updates can be managed safely.
7. Keep the initial schema small and extend it only when a real requirement appears.

## 3. Content Hierarchy

```text
Curriculum
└── World
    └── Module
        └── Lesson
            ├── Metadata
            ├── Learning objectives
            ├── Ordered steps
            │   ├── Explanation
            │   ├── Example
            │   └── Activity
            └── Completion requirements
```

A coding challenge can be represented as a lesson step that references a challenge definition.

## 4. Lesson Metadata

Each lesson must define:

| Field                    | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| `id`                     | Stable unique lesson identifier                         |
| `slug`                   | Human-readable identifier for routing or content lookup |
| `title`                  | Learner-facing lesson title                             |
| `summary`                | Short lesson description                                |
| `worldId`                | Parent curriculum world                                 |
| `moduleId`               | Parent module                                           |
| `contentVersion`         | Version of the lesson content                           |
| `difficulty`             | Beginner, intermediate, or advanced                     |
| `estimatedMinutes`       | Optional estimated duration                             |
| `learningObjectives`     | Observable learning outcomes                            |
| `prerequisiteLessonIds`  | Lessons that must be completed first                    |
| `steps`                  | Ordered learning steps                                  |
| `completionRequirements` | Conditions required to complete the lesson              |
| `status`                 | Draft, review, published, or archived                   |

Progress, XP earned, streaks, and learner answers must **not** be stored as lesson content fields.

## 5. Step Types

The initial schema supports the following step types:

| Type                 | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `intro`              | Introduce the lesson                        |
| `explanation`        | Teach a concept                             |
| `code_example`       | Present code and expected behaviour         |
| `single_choice`      | Select one correct option                   |
| `multiple_select`    | Select all correct options                  |
| `reorder`            | Arrange items in the correct order          |
| `fill_blank_options` | Complete a statement using provided options |
| `fill_blank_text`    | Enter a missing value or expression         |
| `coding_challenge`   | Solve a programming task                    |

The UI should render these through reusable components. A new step type should be introduced only when existing types cannot represent the learning activity adequately.

## 6. Example Lesson Data

The following JSON illustrates the intended content structure for the sample lesson, *Build Your First Webpage*.

```json
{
  "id": "html-first-webpage-001",
  "slug": "build-your-first-webpage",
  "title": "Build Your First Webpage",
  "summary": "Learn basic HTML structure and create your first webpage.",
  "worldId": "html",
  "moduleId": "html-foundations",
  "contentVersion": "1.0.0",
  "difficulty": "beginner",
  "estimatedMinutes": 10,
  "learningObjectives": [
    "Explain what HTML does",
    "Recognise opening and closing tags",
    "Create a heading and paragraph"
  ],
  "prerequisiteLessonIds": [],
  "status": "draft",
  "steps": [
    {
      "id": "welcome",
      "type": "intro",
      "title": "Let's build your first webpage!",
      "content": [
        {
          "type": "paragraph",
          "text": "HTML defines the structure of a webpage."
        },
        {
          "type": "paragraph",
          "text": "CSS controls presentation, while JavaScript adds interactive behaviour."
        }
      ],
      "completion": {
        "mode": "continue"
      }
    },
    {
      "id": "html-element",
      "type": "explanation",
      "title": "Meet the HTML element",
      "content": [
        {
          "type": "paragraph",
          "text": "An HTML element commonly contains an opening tag, content, and a closing tag."
        },
        {
          "type": "code",
          "language": "html",
          "source": "<p>Hello, world!</p>"
        }
      ],
      "completion": {
        "mode": "continue"
      }
    },
    {
      "id": "opening-tag-question",
      "type": "single_choice",
      "title": "Identify the opening tag",
      "prompt": "Which tag opens a paragraph element?",
      "options": [
        {
          "id": "option-a",
          "label": "</p>"
        },
        {
          "id": "option-b",
          "label": "<p>"
        },
        {
          "id": "option-c",
          "label": "<paragraph>"
        },
        {
          "id": "option-d",
          "label": "<h1>"
        }
      ],
      "answerKey": "option-b",
      "feedback": {
        "correct": "Correct! <p> opens a paragraph element.",
        "incorrect": "Look for the tag without the forward slash. </p> is the closing tag."
      },
      "retryPolicy": {
        "allowed": true
      },
      "completion": {
        "mode": "correct_answer"
      }
    },
    {
      "id": "first-webpage-challenge",
      "type": "coding_challenge",
      "challengeId": "html-first-webpage-challenge-001",
      "title": "Create your first webpage",
      "prompt": "Create a heading and paragraph using the required text.",
      "completion": {
        "mode": "challenge_passed"
      }
    }
  ],
  "completionRequirements": {
    "requiredStepIds": [
      "welcome",
      "html-element",
      "opening-tag-question",
      "first-webpage-challenge"
    ],
    "codingChallengeMustPass": true
  }
}
```

**Important:** This is an illustrative schema draft. The final validator must define allowed fields, required fields, content escaping, and type-specific constraints before production use.

The `answerKey` shown here is appropriate for a trusted content-authoring example, but correct answers must not be exposed in learner-facing API responses. Production delivery should separate public activity data from server-side answer keys.

## 7. Activity Data Contracts

Each activity type has a shared identity and a type-specific payload.

### 7.1 Single-choice activity

Required fields:

* Activity ID.
* Prompt.
* Two or more unique options.
* Correct answer reference.
* Correct and incorrect feedback.
* Retry policy.
* Completion rule.

The learner-facing response must include options and instructions but exclude the answer key.

### 7.2 Multiple-select activity

Additional requirements:

* One or more correct options.
* Defined scoring and submission behaviour.
* Clear instructions that multiple answers may be correct.

Partial credit is optional and should not be implemented until its scoring rules are defined.

### 7.3 Reorder activity

Required fields:

* Items with stable IDs.
* Expected order.
* Instructions.
* Feedback.

The learner must have an accessible alternative to drag-and-drop, such as move-up and move-down controls.

### 7.4 Fill-in-the-blank activity

The schema must distinguish:

* `fill_blank_options`: learner chooses from provided options.
* `fill_blank_text`: learner enters text.

Typed answers require explicit validation rules. Normalisation must not silently change code in ways that hide a learner's mistake.

### 7.5 Coding challenge

A lesson step references a challenge by ID. The challenge definition separately contains:

* Prompt and instructions.
* Language or challenge mode.
* Starter code.
* Required behaviour.
* Evaluation mode.
* Resource limits.
* Feedback policy.
* Test configuration.

Execution and evaluation must run through the approved isolated coding system, not through the content renderer.

## 8. Content Rendering Contract

The frontend receives validated, learner-safe content and maps each supported type to a reusable renderer.

Example mapping:

| Content type         | Renderer                    |
| -------------------- | --------------------------- |
| `intro`              | Intro step                  |
| `explanation`        | Explanation step            |
| `code_example`       | Code example step           |
| `single_choice`      | Single-choice activity      |
| `multiple_select`    | Multiple-select activity    |
| `reorder`            | Reorder activity            |
| `fill_blank_options` | Option-based blank activity |
| `fill_blank_text`    | Typed-answer activity       |
| `coding_challenge`   | Coding challenge player     |

Unknown step types must produce a controlled validation or compatibility error. The app must not silently treat unsupported content as valid.

## 9. Content Validation Rules

A lesson cannot be published unless:

1. All IDs are unique within their required scope.
2. Metadata and required fields are present.
3. Step types are supported.
4. Step order is deterministic.
5. Activity option references are valid.
6. Correct-answer references point to existing options.
7. Coding challenge references resolve to valid challenge definitions.
8. Required steps are present.
9. Prerequisites resolve and do not introduce invalid dependency cycles.
10. Code examples pass the applicable validation checks.
11. Learner-facing content contains no internal answer keys or secrets.
12. The content passes educational and technical review.

Validation should produce actionable errors identifying the lesson, step, field, and problem.

## 10. Content Versioning

* Every published lesson has a content version.
* Draft edits must not silently overwrite a published version used by active learners.
* Changes to evaluation criteria require challenge revalidation.
* Changes to required steps must be reviewed for their effect on existing progress.
* Stable IDs should be retained when the underlying learning objective remains the same.
* Breaking changes should create a new content version and use an explicit migration or progress-compatibility policy.

The exact versioning and migration strategy remains an architecture decision.

## 11. Separation of Responsibilities

**Content layer**

* Lesson text.
* Code examples.
* Activity prompts.
* Options and feedback.
* Challenge references.
* Prerequisites and completion requirements.

**Lesson Player**

* Rendering and navigation.
* Input state.
* Answer submission.
* Retry UX.
* Step transitions.
* Progress display.

**Backend**

* Authorisation.
* Content publication and delivery.
* Answer validation where required.
* Progress persistence.
* Completion confirmation.
* Reward idempotency.

**Coding evaluation system**

* Secure execution.
* Resource limits.
* Test evaluation.
* Normalised results.

No layer should assume that data received from the client is trustworthy.

## 12. Acceptance Criteria

* A lesson can be represented using the defined content structure.
* The Lesson Player can render every supported step type.
* The sample HTML lesson can run without lesson-specific UI components.
* Correct-answer data is protected from learner-facing responses.
* Coding challenges reference a separate challenge definition.
* Invalid content is rejected before publication.
* Content and progress remain separate.
* Published lesson changes follow a defined versioning policy.
* Unsupported step types fail safely.
* The schema can be extended without unnecessary architectural complexity.

## 13. Open Decisions

* Whether lessons are stored in a database, version-controlled files, or a hybrid.
* The final schema-validation library and schema format.
* Whether content is delivered as a complete lesson or step-by-step.
* How answer keys and evaluation rules are stored and accessed securely.
* The policy for learners who have progress against an older content version.
* Whether optional steps are required for completion or only for learning recommendations.

---

**End of Document 40 — Sample Lesson Data Schema**

# ZELO 2.0 — Sample Lesson Specification

**Document ID:** ZELO-CONTENT-039
**Filename:** `SAMPLE_LESSON_SPEC.md`
**Version:** 3.9
**Status:** Draft
**World:** HTML World
**Module:** HTML Foundations
**Lesson:** Build Your First Webpage

---

## 1. Purpose

This document defines one complete, beginner-friendly HTML lesson as a practical reference for ZELO's lesson player and content authoring workflow.

It validates:

* Short, structured learning steps.
* Interactive activities and meaningful feedback.
* Progressive difficulty.
* A practical coding challenge.
* Lesson completion and reward integration.
* Content validation before publication.

This is a sample lesson, not a commitment to the final curriculum size or lesson count.

## 2. Learning Objectives

By the end of this lesson, learners should be able to:

1. Explain what HTML does.
2. Identify a basic HTML document structure.
3. Recognise opening and closing tags.
4. Create a heading and paragraph.
5. Build a simple webpage using valid HTML.

**Prerequisites:** None.

**Estimated duration:** 8–12 minutes. This is a planning estimate, not a time limit.

**Difficulty:** Beginner.

## 3. Lesson Overview

| Property               | Value                                                      |
| ---------------------- | ---------------------------------------------------------- |
| World                  | HTML                                                       |
| Module                 | HTML Foundations                                           |
| Lesson ID              | `html-first-webpage-001`                                   |
| Content version        | `1.0.0`                                                    |
| Lesson type            | Concept + interactive practice + coding challenge          |
| Completion requirement | Complete required activities and pass the coding challenge |
| XP                     | Determined by the central reward rules                     |
| Publication status     | Draft                                                      |

## 4. Learning Experience

The lesson follows this sequence:

**Welcome → Understand HTML → Inspect an Example → Identify Tags → Predict Output → Practise → Build a Webpage → Results**

Each step should have one primary learning objective and a clear next action.

---

## 5. Step-by-Step Lesson Content

### Step 1 — Welcome to HTML

**Type:** Introduction

**Title:** Let's build your first webpage!

**Learner-facing content:**

Every website you visit has a structure. HTML helps define that structure.

HTML stands for **HyperText Markup Language**. It tells the browser which content is a heading, paragraph, image, link, and more.

Think of HTML as the structure of a house. CSS adds the appearance, while JavaScript can add interactive behaviour.

**Visual direction:** Show a simple webpage with a heading and paragraph. Keep the illustration minimal.

**Primary action:** `Let's Start`

**Completion rule:** Learner opens the first learning step.

### Step 2 — Understand an HTML Element

**Type:** Concept explanation

**Title:** Meet the HTML element

**Learner-facing content:**

An HTML element commonly consists of an opening tag, content, and a closing tag.

Example:

```html
<p>Hello, world!</p>
```

* `<p>` is the opening tag.
* `Hello, world!` is the content.
* `</p>` is the closing tag.
* Together, they form a paragraph element.

The forward slash `/` indicates the closing tag in this example.

**Important note:** Some HTML elements, such as `<img>`, are void elements and do not use a closing tag.

**Primary action:** `Got It`

**Completion rule:** Learner continues to the next step.

### Step 3 — Inspect a Complete Document

**Type:** Code example

**Title:** A webpage's basic structure

**Learner-facing content:**

A simple HTML document looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>I am learning HTML.</p>
</body>
</html>
```

**Explain the important parts:**

* `<!DOCTYPE html>` declares an HTML document using modern HTML.
* `<html>` contains the document.
* `<head>` contains metadata and the page title.
* `<title>` defines the browser-tab title.
* `<body>` contains the visible page content.
* `<h1>` creates a top-level heading.
* `<p>` creates a paragraph.

**Learning focus:** At this stage, learners need to understand the main structure, not memorise every attribute.

**Primary action:** `Continue`

### Step 4 — Activity: Identify the Opening Tag

**Type:** Single-choice question

**Question:**

Which tag opens a paragraph element?

Options:

* A. `</p>`
* B. `<p>`
* C. `<paragraph>`
* D. `<h1>`

**Correct answer:** B. `<p>`

**Correct feedback:**

Correct! `<p>` is the opening tag for a paragraph element. The closing tag is `</p>`.

**Incorrect feedback:**

Look for the tag without the forward slash. In this example, `<p>` opens the element, while `</p>` closes it.

**Retry:** Allowed.

**Completion rule:** A valid answer is submitted. The lesson player records the activity outcome according to the activity rules.

### Step 5 — Activity: Predict the Output

**Type:** Output prediction

**Code:**

```html
<h1>My First Website</h1>
<p>Welcome to my page.</p>
```

**Question:** What will the browser display?

Options:

* A. A heading followed by a paragraph.
* B. Only a paragraph.
* C. A browser error because HTML requires JavaScript.
* D. The HTML tags as ordinary visible text.

**Correct answer:** A.

**Correct feedback:**

Exactly! The browser displays “My First Website” as a heading and “Welcome to my page.” as a paragraph.

**Incorrect feedback:**

Remember that `<h1>` creates a heading and `<p>` creates a paragraph. The browser interprets these tags to structure the content.

**Retry:** Allowed.

### Step 6 — Activity: Complete the Element

**Type:** Fill in the blank

**Prompt:**

Complete the HTML paragraph.

```html
___Hello, learner!___
```

**Required answers:**

* Opening tag: `<p>`
* Closing tag: `</p>`

**Expected result:**

```html
<p>Hello, learner!</p>
```

**Correct feedback:**

Nice work! You created a complete paragraph element with an opening tag and a closing tag.

**Incorrect feedback:**

A paragraph starts with `<p>` and ends with `</p>`. The closing tag includes a forward slash.

**Retry:** Allowed.

**Validation:** Compare the learner's response against the expected tags after applying only explicitly supported normalisation rules. Do not silently transform arbitrary code.

### Step 7 — Guided Practice

**Type:** Coding challenge

**Title:** Create your first webpage

**Task:**

Write HTML that displays:

1. A heading containing `Hello, ZELO!`
2. A paragraph containing `I am learning to build websites.`

**Starter code:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
</head>
<body>
  <!-- Write your heading and paragraph here -->

</body>
</html>
```

**Expected solution:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, ZELO!</h1>
  <p>I am learning to build websites.</p>
</body>
</html>
```

**Evaluation requirements:**

* The document contains an `h1` with the required heading text.
* The document contains a paragraph with the required paragraph text.
* The result is rendered in the supported preview environment.
* The solution is evaluated against the task's defined criteria, not merely whether the code executes.

**Run behaviour:**

* Render the current HTML in the preview.
* Show the resulting heading and paragraph.
* Do not grant challenge completion solely because the preview renders.

**Submit behaviour:**

* Evaluate the required elements and text.
* Return a clear pass or actionable failure feedback.
* Mark the challenge passed only when all required checks pass.

**Hint 1:** Use `<h1>` for the main heading.

**Hint 2:** Use `<p>` for the paragraph.

**Failure feedback example:**

Your page is missing the required heading. Add an `<h1>` element containing `Hello, ZELO!`, then submit again.

**Success feedback:**

You built your first webpage! Your HTML now contains a heading and a paragraph that the browser can display.

**Retry:** Allowed.

### Step 8 — Lesson Completion

**Type:** Results

**Title:** Your first webpage is ready! 🎉

**Learner-facing content:**

You have taken your first step into web development. You learned what HTML does, explored basic document structure, and created a webpage of your own.

**Show:**

* Lesson completion status.
* XP awarded by the central reward system.
* Updated HTML World progress.
* Next available lesson, if published.
* A review option.

**Primary action:** `Continue Learning`

**Secondary action:** `Review Lesson`

**Completion behaviour:**

* Persist completion through the server.
* Grant rewards using the central reward ledger.
* Prevent duplicate completion rewards.
* Unlock the next lesson only when its prerequisites are satisfied.
* If the completion request fails, show a recoverable error instead of falsely confirming completion.

---

## 6. Content and Evaluation Rules

### Activity requirements

* Every activity must have a unique ID.
* Each activity must define its prompt, accepted answer or evaluation criteria, feedback, and retry behaviour.
* Incorrect feedback should teach the relevant concept.
* Coding challenges must have explicit, testable acceptance criteria.
* Evaluation must not depend on matching whitespace or formatting when those differences are irrelevant to the learning objective.
* Hidden evaluation details must not be exposed to learners.

### Lesson completion requirements

The lesson can be completed only when:

1. All required activities satisfy their completion rules.
2. The coding challenge passes its defined evaluation.
3. The server confirms the completion transaction.
4. Reward and progress updates are applied safely.

Reading-only steps do not need artificial quizzes if no meaningful interaction is necessary.

## 7. Content Quality Checklist

Before publication, confirm:

* [ ] Learning objectives are clear and beginner-appropriate.
* [ ] The explanation uses correct HTML terminology.
* [ ] All code examples have been validated.
* [ ] Every question has a correct answer and useful feedback.
* [ ] Incorrect answers do not shame the learner.
* [ ] The coding challenge has deterministic acceptance criteria.
* [ ] The preview and evaluation environment behave as specified.
* [ ] Retry and completion flows work correctly.
* [ ] The lesson works on supported screen sizes.
* [ ] Accessibility and keyboard requirements are addressed where applicable.
* [ ] The lesson does not depend on unpublished prerequisites.
* [ ] The content is reviewed before publication.

## 8. Acceptance Criteria

This sample is ready for implementation validation when:

1. A new learner can begin the lesson without prior HTML knowledge.
2. All explanatory steps display the intended content.
3. Interactive activities accept the correct answers and provide appropriate feedback.
4. Learners can retry supported activities.
5. The coding challenge displays a preview and evaluates the required output.
6. Failed submissions provide actionable guidance.
7. A successful submission allows lesson completion.
8. Progress and XP are not duplicated on retries or repeated requests.
9. The next lesson remains locked if its prerequisites are not satisfied.
10. The lesson can be revised and validated before publication.

## 9. Implementation Note

This document defines the intended learning experience. It does not prescribe a specific frontend framework, database, code editor, or execution provider.

The sample should be used to validate the lesson player and authoring model before producing the full HTML curriculum.

---

**End of Document 39 — Sample Lesson Specification**

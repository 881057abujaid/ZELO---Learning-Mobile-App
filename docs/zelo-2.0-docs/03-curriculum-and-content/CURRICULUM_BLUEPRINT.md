# ZELO 2.0 — CURRICULUM_BLUEPRINT.md

**Version:** 2.0
**Status:** Draft
**Module:** Curriculum Blueprint & Lesson Sequencing
**Priority:** MVP — Must Have

## 1. Purpose

Define the initial learning roadmap for complete beginners progressing through:

**HTML → CSS → JavaScript → React**

The curriculum must teach concepts in a logical order, reinforce learning through practice, and avoid introducing advanced topics before their prerequisites.

This is a curriculum blueprint, not the final lesson content. Exact lesson counts, activity counts and estimated durations will be finalised after individual lessons are designed and reviewed.

## 2. Curriculum Design Principles

1. **Beginner-first:** Assume learners have no prior programming experience.
2. **Concept before complexity:** Introduce a concept, demonstrate it, then let the learner practise.
3. **Learn by doing:** Use frequent interactive activities rather than long text-only lessons.
4. **Small learning units:** Each lesson should have a clear objective and manageable scope.
5. **Progressive difficulty:** Reuse familiar concepts while introducing one or a few new ideas at a time.
6. **Practical outcomes:** Connect lessons to visible results and small projects.
7. **Prerequisite-based progression:** Unlock content based on required learning milestones, not XP.
8. **Honest curriculum status:** A world must not appear complete until its required published content is actually available and completed.

## 3. Curriculum Architecture

<text weight="medium" size="md">Learning hierarchy</text>

<box border radius="lg" padding={3} gap={2}>
  <box background="surface-secondary" radius="md" padding={3} align="center">
    **Curriculum**

```
<text color="secondary" size="sm">Complete Web Development Path</text>
```

  </box>
  <box align="center">
    <icon name="arrow-down" size="lg" color="secondary" />
  </box>
  <grid columns={2} gap={2}>
    <grid-item>
      <box border radius="md" padding={2} align="center" gap={1}>
        <icon name="code-2" size="xl" color="#7957D5" />
        **World 1**

```
    <text size="sm" textAlign="center">HTML</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={2} align="center" gap={1}>
    <icon name="palette" size="xl" color="#7957D5" />
    **World 2**

    <text size="sm" textAlign="center">CSS</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={2} align="center" gap={1}>
    <icon name="braces" size="xl" color="#7957D5" />
    **World 3**

    <text size="sm" textAlign="center">JavaScript</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={2} align="center" gap={1}>
    <icon name="layers" size="xl" color="#7957D5" />
    **World 4**

    <text size="sm" textAlign="center">React</text>
  </box>
</grid-item>
```

  </grid>
  <text color="secondary" size="sm">Each world contains modules or topics, lessons, ordered steps, and practice activities.</text>
</box>

The content hierarchy is:

**Curriculum → World → Module/Topic → Lesson → Lesson Steps → Activities**

Coding challenges may be embedded inside lessons or offered as standalone practice linked to relevant topics.

## 4. World 1 — Frontend Foundations (HTML)

**Goal:** Enable learners to understand how web pages are structured and create a simple semantic HTML page.

### Module 1: Understanding the Web

* What is a website?
* What are HTML, CSS and JavaScript?
* How a browser displays a web page.
* Understanding tags, elements and attributes.

### Module 2: Your First HTML Page

* Basic HTML document structure.
* Headings and paragraphs.
* Text emphasis.
* Comments and indentation.
* Understanding opening and closing tags.

### Module 3: Links and Images

* Anchor elements and hyperlinks.
* Relative versus absolute paths.
* Adding images and alternative text.
* Linking between pages.

### Module 4: Lists and Content Structure

* Ordered and unordered lists.
* Nested lists.
* Grouping related content.
* Semantic page sections.

### Module 5: Tables and Forms

* Table rows, headers and cells.
* Form elements and labels.
* Text, email and password inputs.
* Buttons and basic input attributes.
* Basic form accessibility.

### Module 6: Semantic HTML and Accessibility

* Header, navigation, main, section and footer.
* Choosing appropriate elements.
* Meaningful headings.
* Accessible links and images.
* Basic HTML debugging.

### World project

Build a simple personal profile page containing headings, paragraphs, an image, links and a structured content section.

Forms and tables may be included as additional project requirements if they fit the learner's progress.

### Exit criteria

A learner can create a valid basic HTML document, structure content, link resources and identify common markup mistakes.

## 5. World 2 — Styling Studio (CSS)

**Goal:** Enable learners to style HTML pages, control layout and build responsive interfaces.

### Module 1: CSS Foundations

* What CSS does.
* Inline, internal and external CSS.
* Selectors and declarations.
* Properties and values.
* Comments and basic syntax.

### Module 2: Colours, Typography and Units

* Text colour and backgrounds.
* Font family, size and weight.
* Text alignment and line height.
* Pixels, percentages and relative units.
* Basic visual hierarchy.

### Module 3: The Box Model

* Content, padding, border and margin.
* Width and height.
* `box-sizing`.
* Borders and spacing.
* Understanding overflow.

### Module 4: Selectors and Reusable Styling

* Element, class and ID selectors.
* Combining selectors.
* Specificity fundamentals.
* Pseudo-classes such as `:hover` and `:focus`.
* Reusing CSS classes.

### Module 5: Layout Fundamentals

* Normal document flow.
* `display` and positioning basics.
* Flexbox.
* CSS Grid fundamentals.
* Alignment and spacing.

### Module 6: Responsive Design

* Viewport concepts.
* Media queries.
* Flexible widths.
* Responsive images.
* Mobile-first design.

### Module 7: Polish and Debugging

* Hover and focus states.
* Transitions as an introduction.
* Browser developer tools.
* Fixing common layout problems.
* Maintaining readable CSS.

### World project

Transform the HTML profile page into a responsive personal website with consistent typography, spacing, a navigation area and a clear content layout.

### Exit criteria

A learner can connect CSS to HTML, apply reusable styles, create basic layouts and adapt a page to different screen sizes.

## 6. World 3 — JavaScript Lab

**Goal:** Teach programming fundamentals and browser interaction before introducing React.

### Module 1: JavaScript Foundations

* What JavaScript does.
* Running JavaScript in a browser.
* Variables with `let` and `const`.
* Primitive data types.
* Operators and expressions.

### Module 2: Decisions and Logic

* Comparisons.
* Boolean values.
* Logical operators.
* `if`, `else if` and `else`.
* Basic `switch` usage where appropriate.

### Module 3: Loops

* `for` loops.
* `while` loops.
* Loop conditions.
* Counters and accumulators.
* Avoiding infinite loops.

### Module 4: Functions

* Function declarations.
* Parameters and arguments.
* Return values.
* Function expressions and arrow functions.
* Scope fundamentals.

### Module 5: Arrays and Objects

* Creating and accessing arrays.
* Indexes and array length.
* Adding and removing elements.
* Objects, properties and methods.
* Iterating over arrays.

### Module 6: Working with Data

* Strings and common string operations.
* Array methods such as `map`, `filter` and `find`.
* Transforming data.
* Destructuring fundamentals.
* Spread syntax where appropriate.

### Module 7: DOM Manipulation

* Selecting HTML elements.
* Updating text and attributes.
* Changing classes and styles.
* Creating and removing elements.
* Responding to browser events.

### Module 8: Events and Forms

* Event listeners.
* Click and input events.
* Reading form values.
* Basic validation.
* Preventing default form behaviour.

### Module 9: Asynchronous JavaScript

* Synchronous versus asynchronous operations.
* Callbacks at a basic level.
* Promises.
* `async` and `await`.
* Fetching data and handling errors.

### Module 10: Modern JavaScript and Modules

* Template literals.
* Optional chaining and nullish coalescing.
* Import and export.
* Error handling.
* Reading and debugging common errors.

### World project

Build a small interactive browser application, such as a task list or quiz, using HTML, CSS and JavaScript.

### Exit criteria

A learner can write functions, work with arrays and objects, respond to browser events, manipulate the DOM and understand basic asynchronous code.

**Prerequisite for React:** Learners should understand JavaScript variables, functions, arrays, objects, modules and basic asynchronous concepts. Advanced JavaScript mastery is not required before starting React.

## 7. World 4 — React World

**Goal:** Teach component-based UI development using React and the JavaScript knowledge established in the previous world.

### Module 1: React Foundations

* Why React exists.
* Declarative UI concepts.
* Components.
* JSX.
* Rendering a component.

### Module 2: Components and Props

* Reusable components.
* Passing props.
* Rendering dynamic content.
* Component composition.
* Lists and stable keys.

### Module 3: State and Events

* Understanding component state.
* `useState`.
* Handling user events.
* Updating state correctly.
* Avoiding direct state mutation.

### Module 4: Conditional and List Rendering

* Conditional UI.
* Rendering arrays.
* Empty states.
* Keys and common list mistakes.
* Combining props, state and rendering.

### Module 5: Forms and User Input

* Controlled inputs.
* Handling form submission.
* Validation.
* Displaying errors.
* Resetting form state.

### Module 6: Effects and Data Fetching

* Understanding side effects.
* `useEffect` fundamentals.
* Fetching data.
* Loading, success and error states.
* Avoiding unnecessary effects.

### Module 7: Component Design and Structure

* Splitting UI into components.
* Organising files.
* Sharing data through props.
* Lifting state when necessary.
* Keeping components focused.

### Module 8: Building a Complete Application

* Planning screens and reusable components.
* Combining state, forms and lists.
* Integrating a simple data source.
* Debugging React behaviour.
* Reviewing accessibility and responsive design.

### World project

Build a small React application with reusable components, interactive state, form input and appropriate loading or empty states where data fetching is included.

### Exit criteria

A learner can build and explain a small React application, use props and state, render lists, handle user input and fetch data with basic error handling.

## 8. Lesson Design Template

Every published lesson must include:

1. **Learning objective:** One clear, measurable outcome.
2. **Introduction:** Explain why the concept matters.
3. **Explanation:** Present the concept in beginner-friendly language.
4. **Example:** Show a small, relevant example.
5. **Interactive practice:** Use one or more supported activity types.
6. **Feedback:** Explain why an answer is correct or incorrect.
7. **Application:** Include a coding challenge or practical task when appropriate.
8. **Completion criteria:** Define exactly what the learner must finish.
9. **Review support:** Allow the learner to revisit completed material.

Not every lesson needs every block. Keep lessons focused and avoid padding them with repetitive activities merely to increase their length.

## 9. Recommended Learning Activity Mix

Use the activity type that best teaches the concept.

| Learning objective                     | Suitable activity                 |
| -------------------------------------- | --------------------------------- |
| Recognise a concept                    | Single-choice question            |
| Distinguish several correct statements | Multiple-select                   |
| Understand sequence or structure       | Reorder activity                  |
| Recall a keyword or value              | Fill in the blank                 |
| Write a small code fragment            | Typed fill-in or coding challenge |
| Apply multiple concepts                | Mini project                      |

Coding challenges should increase in complexity gradually. A beginner should not be asked to build an entire application before practising its individual building blocks.

## 10. Curriculum Release Strategy

### Release A — Foundations

* Publish the initial HTML learning sequence.
* Add the CSS foundations needed for practical page styling.
* Validate lesson quality, completion and progress tracking.
* Test the first complete learning journey with beginners.

### Release B — Programming

* Expand CSS where necessary.
* Publish JavaScript fundamentals and browser interaction.
* Add reliable coding challenge evaluation.
* Validate that learners can complete the JavaScript project.

### Release C — React

* Publish the React prerequisite review.
* Add components, props, state, forms and data fetching.
* Add the React project.
* Test the full HTML-to-React learning journey.

These are content milestones, not promises of release dates. The order can be adjusted based on content quality and learner feedback.

## 11. Content Quality Checklist

Before publishing a lesson, verify:

* [ ] The learning objective is specific and testable.
* [ ] Prerequisites are available and appropriate.
* [ ] Explanations are understandable to beginners.
* [ ] Examples are correct and runnable where applicable.
* [ ] Required activities have deterministic evaluation rules.
* [ ] Incorrect answers receive useful feedback.
* [ ] Coding challenges have defined success criteria and tests.
* [ ] Lesson completion rules are configured.
* [ ] Content identifiers and references are valid.
* [ ] The lesson has been reviewed before publication.
* [ ] The lesson works with the intended mobile interface and accessibility requirements.

## 12. Out of Scope

* Backend development, databases and deployment as required curriculum stages.
* TypeScript as a mandatory React prerequisite.
* Advanced React frameworks and server rendering.
* AI-generated lessons or adaptive curriculum.
* Multiple programming tracks.
* User-created lessons and a course marketplace.
* Fixed lesson counts before lesson design and validation.
* Claims that the complete curriculum is available when some worlds remain unpublished.

## 13. Open Decisions

Before detailed content production, finalise:

1. Exact modules and lesson titles for the first release.
2. Learning objectives and completion criteria for every lesson.
3. Approximate lesson duration and activity count.
4. Which lessons require coding challenges.
5. HTML/CSS preview and JavaScript/React execution strategy.
6. Whether the first beta publishes all four worlds or releases them progressively.
7. Curriculum review and versioning workflow.

**Implementation principle:** Build a complete, high-quality beginner learning journey before expanding the number of lessons. A smaller curriculum that teaches effectively is preferable to a large collection of shallow lessons.

---

**Next document:** Screen 21 — Lesson Content Authoring & Quality Standards.

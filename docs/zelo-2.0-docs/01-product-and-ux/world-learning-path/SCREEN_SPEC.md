# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.3
**Status:** Draft
**Module:** World Learning Path
**Priority:** MVP — Must Have
**Previous Screen:** Explore Worlds
**Next Screen:** Lesson Player

---

## 1. Purpose

World Learning Path screen learner ko selected world ka complete lesson sequence dikhati hai.

Learner should be able to:

* Understand what they will learn in this world.
* See completed, current, available, and locked lessons.
* Identify the next recommended lesson.
* Resume an unfinished lesson.
* Understand why a lesson is locked.
* Track progress through the world.

**Primary action:** Start or continue the next available lesson.

## 2. Initial Curriculum

The learning path must support these four worlds:

1. **Frontend Foundations** — HTML
2. **Styling Studio** — CSS
3. **JavaScript Lab** — JavaScript
4. **React World** — React

Each world will contain an ordered sequence of lessons. Exact lesson titles, counts, and learning objectives will be documented separately in the curriculum specification.

The interface must not display invented lesson counts or mark unfinished curriculum as completed.

## 3. Screen Layout

### A. Header

Display:

* Back button to Explore Worlds.
* Selected world name.
* Short world description.
* Overall world progress.

Keep the header compact. Avoid a large decorative hero banner.

### B. World Progress Summary

Show:

* Completed lessons / total published lessons.
* A simple progress bar.
* Percentage complete, if useful.

Example:

`HTML Foundations`

`4 of 12 lessons completed`

Progress must be calculated from persisted lesson-completion records, not from the number of times the learner opens a lesson.

### C. Learning Path

Display lessons in a single vertical sequence.

Each lesson item contains:

* Lesson number or small sequence indicator.
* Lesson title.
* Short description, where useful.
* Estimated duration, only when a reliable estimate exists.
* Status indicator.
* Primary action or status-specific guidance.

Use a simple connected path or vertical timeline. Avoid complex maps, excessive illustrations, and decorative game elements.

### D. Lesson Checkpoints

Some lessons may contain a quiz, coding practice, or another checkpoint.

A checkpoint should appear as part of the relevant lesson or as a clearly labelled step in the sequence. Do not introduce a separate checkpoint system unless the curriculum genuinely requires one.

## 4. Lesson States

Every lesson must have a clear state.

### Not Started — Available

* The learner can open the lesson.
* Show a Start action or equivalent clear affordance.
* The first lesson is available when the learner enters a new world, subject to any required onboarding.

### In Progress

* Show a visible progress indicator or “In progress” label.
* Reopening the lesson resumes from the saved position when supported.
* Do not reset the learner's work simply because they left the screen.

### Completed

* Display a subtle completion indicator.
* Preserve the completed state after the app restarts.
* Allow the learner to revisit the lesson.
* Revisiting must not accidentally award completion XP again.

### Locked

* Use a visibly distinct but restrained locked state.
* Explain the prerequisite in plain language.
* Example: “Complete Lesson 3 to unlock this lesson.”
* If a locked lesson is selected, show the prerequisite and a way to return to it.

A lesson must only be locked when an explicit curriculum or prerequisite rule requires it. Do not use XP as an arbitrary gate for essential educational content.

## 5. Core Interactions

| User action               | Expected behaviour                  |
| ------------------------- | ----------------------------------- |
| Tap an available lesson   | Open the Lesson Player              |
| Tap an in-progress lesson | Resume the saved lesson state       |
| Tap a completed lesson    | Open it in review mode              |
| Tap a locked lesson       | Explain the prerequisite            |
| Tap Back                  | Return to Explore Worlds            |
| Finish a lesson           | Save completion and update progress |
| Return to this screen     | Show the latest persisted progress  |

After lesson completion, the learner should be able to return to this screen or continue to the next available lesson through the completion screen.

## 6. Navigation Rules

* Explore Worlds → World Learning Path.
* World Learning Path → Lesson Player.
* Lesson Player → Lesson Completion/Results.
* Lesson Completion/Results → Next Lesson or World Learning Path.
* Back navigation must preserve the learner's progress.
* Bottom navigation should remain consistent with the app's shared navigation design, if enabled on this screen.

Do not create extra navigation destinations for individual lesson statuses.

## 7. Progress and Unlock Rules

For the MVP:

1. Lessons follow a defined curriculum order.
2. The first lesson in a world is available by default, unless a documented prerequisite applies.
3. Later lessons follow explicit prerequisite rules.
4. Completing a lesson updates world progress.
5. Unlocking a lesson depends on its prerequisites, not on cosmetic rewards.
6. Completed lessons remain accessible for revision.
7. Progress must persist across app restarts and authenticated sessions.
8. A failed network request must not silently mark a lesson as complete.

**Progress calculation:**

World completion percentage = completed published lessons ÷ total published lessons × 100.

If a world has no published lessons, show an appropriate empty state instead of dividing by zero or displaying misleading progress.

## 8. Required UI States

### Loading

* Show lightweight placeholders for the header, progress summary, and lesson list.
* Avoid a full-screen spinner when the screen structure can be displayed immediately.

### New Learner

* Show the first available lesson clearly.
* Display a short, encouraging instruction.
* Do not show fake completion statistics or streaks.

### Returning Learner

* Highlight the next available or in-progress lesson.
* Keep previously completed lessons visible.
* Reflect the latest saved progress.

### Empty Curriculum

Display a clear message such as:

“This learning path is being prepared. Check back soon.”

Do not show dead lesson links.

### Network or Loading Error

* Explain that the learning path could not be loaded.
* Provide a Retry action.
* Preserve any locally available progress where supported.

### World Completed

* Show a clear completion message.
* Keep completed lessons available for review.
* Provide a route back to Explore Worlds.
* Only show a next-world action if the next world exists and its prerequisite rules are satisfied.

## 9. Visual Design

Follow ZELO 2.0's agreed visual direction:

* Light ivory/white background.
* Violet as the primary accent.
* Green for positive progress and completion.
* Clear typography and generous spacing.
* Simple rectangular or lightly rounded lesson items.
* Small, consistent status icons.
* Minimal illustrations, used only when they improve comprehension.
* Consistent spacing and component styles across all four worlds.

Avoid:

* Large animated world maps.
* Excessive connecting curves and decorative elements.
* Too many colours for lesson statuses.
* Multiple competing primary buttons.
* Complex animations or 3D environments.
* Large amounts of information on each lesson item.

## 10. Logical Data Requirements

The screen needs access to:

**World**

* ID
* Name
* Description
* Curriculum order
* Publication status

**Lesson**

* ID
* World ID
* Title
* Short description
* Sequence order
* Publication status
* Prerequisite lesson IDs, if applicable
* Optional estimated duration

**Learner Progress**

* Lesson ID
* Completion status
* Saved lesson position, where supported
* Completion timestamp, where applicable

These are logical requirements, not a final database schema. Data models and API contracts will be documented separately before implementation.

## 11. Acceptance Criteria

* [ ] The selected world's name and description are displayed correctly.
* [ ] Lessons appear in the defined curriculum order.
* [ ] Each lesson displays the correct status.
* [ ] Available lessons can be opened.
* [ ] In-progress lessons resume where supported.
* [ ] Completed lessons can be revisited.
* [ ] Locked lessons explain their prerequisites.
* [ ] World progress reflects actual saved completion records.
* [ ] Progress remains correct after app restart.
* [ ] Empty, loading, and error states are handled.
* [ ] Unpublished lessons are not presented as available curriculum.
* [ ] The layout remains usable on supported mobile screen sizes.
* [ ] The screen follows ZELO's shared visual and navigation conventions.
* [ ] No visible lesson item leads to a non-functional destination.

## 12. Out of Scope

The MVP will not include:

* Branching skill trees.
* User-created learning paths.
* AI-generated personalised paths.
* Multiplayer progress or social activity.
* Complex character upgrades or currency-based unlocks.
* Animated 3D maps.
* Manual drag-and-drop lesson rearrangement.
* Advanced prerequisite graphs.

## 13. Dependencies

* Approved curriculum structure.
* Explore Worlds screen.
* Lesson Player screen.
* Lesson progress persistence.
* Defined prerequisite and unlock rules.
* Shared UI components and navigation.
* Lesson publication status and content availability.

## 14. Definition of Done

This screen is complete when a learner can open a world, understand its learning sequence, start or resume a lesson, identify locked lessons and their prerequisites, and see accurate persisted progress without encountering dead links or misleading statuses.

---

**Next screen:** Screen 04 — Lesson Player. This will define how lesson explanations, examples, interactive questions, and coding practice are presented through one reusable learning experience.

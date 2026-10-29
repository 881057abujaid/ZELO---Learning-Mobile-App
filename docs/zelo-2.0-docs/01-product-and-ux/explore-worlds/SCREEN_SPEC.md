# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.2
**Module:** Explore Worlds
**Status:** Draft
**Priority:** MVP — Must Have

---

## 1. Purpose

Explore Worlds allows learners to discover the web-development curriculum and enter a learning world.

The screen must communicate:

* What the learner can learn.
* Which world they should start with.
* Their progress through each world.
* Which worlds are available or locked.

**Primary objective:** Help the learner choose or resume a suitable learning path with minimal friction.

## 2. Curriculum structure

The initial curriculum contains four worlds, arranged in prerequisite order:

1. **Frontend Foundations — HTML**
2. **Styling Studio — CSS**
3. **JavaScript Lab — JavaScript**
4. **React World — React**

Worlds represent curriculum stages, not separate unrelated courses.

Backend, databases and AI are not part of the initial web-development curriculum unless they are explicitly added to a later roadmap.

## 3. Screen layout

### A. Header

Elements:

* Screen title: **Explore**
* Short subtitle, such as “Choose your next skill.”
* Optional compact overall learning progress.

Rules:

* Keep the header small.
* No large hero banner is required.
* Do not duplicate the full Home Dashboard statistics.

### B. World list

Display worlds as a vertically scrollable list of simple cards.

Each world card contains:

* Small illustrative image or icon.
* World name.
* Short description.
* Progress indicator or status.
* Lesson count, once the curriculum count is defined.
* Clear action or visual affordance to open the world.

Example descriptions:

**Frontend Foundations**
Learn how web pages are structured with HTML.

**Styling Studio**
Make web pages attractive and responsive with CSS.

**JavaScript Lab**
Learn programming logic and add interactivity to websites.

**React World**
Build reusable UI components and interactive web applications.

Visual rules:

* Use the same card structure for every world.
* Use small, consistent illustrations rather than oversized 3D environments.
* Limit decorative badges and secondary statistics.
* Preserve whitespace and readable text.
* Do not make the screen feel like a complex game map.

### C. World status

Each world can have one of these states:

**Available**

* The learner can open the world.
* The card shows its current progress or a “Start” action.

**In progress**

* The card shows saved progress.
* The primary action is “Continue”.

**Completed**

* The card displays completed status and progress.
* The learner can revisit lessons for practice.

**Locked**

* The card indicates that prerequisite learning is required.
* The reason for locking is explained briefly.
* The learner can navigate to the required previous world.

MVP rule: only use the locked state if the prerequisite rules have been defined and implemented. Do not lock content arbitrarily.

## 4. User interactions

| Action                           | Expected result                                      |
| -------------------------------- | ---------------------------------------------------- |
| Tap an available world           | Opens its World Learning Path                        |
| Tap an in-progress world         | Opens its path with progress preserved               |
| Tap a completed world            | Opens its path for review                            |
| Tap a locked world               | Explains the prerequisite and provides a route to it |
| Tap Explore in bottom navigation | Opens this screen                                    |
| Tap Home                         | Returns to Home Dashboard                            |

A card must not launch a lesson directly unless that behavior is explicitly defined for a separate shortcut.

## 5. Learning progression rules

* The initial recommended order is HTML → CSS → JavaScript → React.
* Progress is based on completed lessons, not time spent on the screen.
* World completion depends on the defined curriculum completion rules.
* XP alone must not unlock prerequisite-dependent worlds.
* Repeatedly opening a world must not reset its progress.
* Completed worlds remain available for revision and practice.

The exact unlock criteria and mastery thresholds will be defined in the learning-system specification.

## 6. Screen states

### Loading

Show lightweight placeholders for the world list.

### First-time learner

* Show HTML as the recommended starting point.
* Explain that worlds build on one another.
* Do not present all future worlds as inaccessible without explaining why.

### Returning learner

* Display accurate progress for each world.
* Make the current world easy to identify.

### Empty curriculum

Show a helpful message and retry option rather than a blank list.

### Network error

Show a concise error message and retry action.
Preserve locally available progress information where supported.

## 7. Data requirements

The screen logically needs:

* World identifier and name.
* Description.
* Display order.
* Image or icon reference.
* Availability status.
* Completed and total lesson counts, when known.
* Learner's saved world progress.
* Prerequisite information, if the world is locked.

These are requirements for the data model, not a final database schema.

## 8. Acceptance criteria

* [ ] All four curriculum worlds appear in the correct order.
* [ ] Every world has a consistent card layout.
* [ ] World images or icons render correctly, with a fallback if unavailable.
* [ ] Available worlds open the correct World Learning Path.
* [ ] Locked worlds explain their prerequisites.
* [ ] Progress matches saved learning data.
* [ ] Completed worlds remain accessible.
* [ ] The list works on supported mobile screen sizes.
* [ ] Loading, empty and error states are handled.
* [ ] Bottom navigation works correctly.
* [ ] The screen avoids unnecessary decoration and duplicate statistics.

## 9. Explicitly out of scope

* User-created worlds.
* Multiplayer exploration.
* A large animated world map.
* AI-generated curriculum paths.
* Search and filtering across many languages.
* Backend, database and AI worlds outside the initial curriculum.
* Complex world-specific currencies or reward systems.

## 10. Dependencies

* Curriculum and world definitions.
* User progress persistence.
* World Learning Path screen.
* Prerequisite and unlock rules.
* Shared card and navigation components.

## 11. Definition of Done

Explore Worlds is complete when the world list displays accurate curriculum and progress data, world navigation works, prerequisite states are handled correctly, and the screen passes its acceptance tests.

**Next screen:** World Learning Path — specify lesson nodes, lesson order, checkpoints, locked states and how learners enter or resume a lesson.

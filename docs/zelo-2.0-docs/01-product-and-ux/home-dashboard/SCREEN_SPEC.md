# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.1
**Module:** Home Dashboard
**Status:** Draft
**Priority:** MVP — Must Have

---

## 1. Purpose

Home Dashboard is the user's main landing screen. It should help the learner understand their current progress and continue learning with minimal friction.

**Primary objective:** The user should be able to resume their current lesson with one clear primary action.

## 2. Target user

Complete beginner learning web development through HTML, CSS, JavaScript and React.

The interface must be understandable even if the user has never used a programming-learning app before.

## 3. Screen layout

The screen uses a vertically scrollable layout with a persistent bottom navigation bar.

### A. Header

Elements:

* ZELO logo or wordmark.
* Greeting, such as “Good morning!”
* Small profile avatar.
* Optional compact streak indicator.

Rules:

* Keep the header compact.
* Do not display multiple competing statistics.
* Profile avatar opens the Profile screen.

### B. Learning progress summary

Elements:

* Current learning stage or world.
* Overall progress indicator.
* Optional compact XP or streak value.

Rules:

* Progress must reflect persisted learning data.
* Do not show arbitrary or hardcoded progress.
* Avoid large decorative charts on the Home screen.

### C. Continue Learning — Primary Card

Elements:

* Current course or world name.
* Current lesson title.
* Short description or lesson number.
* Lesson progress, if available.
* Primary button: **Continue Learning**.

Behavior:

* Opens the user's next incomplete lesson.
* If the user has never started learning, opens the first available lesson.
* If a lesson was interrupted, resumes at the appropriate point where supported.
* If the course is complete, shows a suitable next step rather than an invalid lesson link.

This must be the most visually prominent section on the screen.

### D. Daily Quest — Compact Section

Elements:

* One daily learning goal.
* Progress indicator.
* XP reward.
* Link or button to view quests.

Behavior:

* Quest progress updates when eligible activities are completed.
* Tapping the section opens the Daily Quests screen.
* If quests are unavailable, the section should be hidden or display a useful fallback.

MVP constraint:

* Start with a small number of predefined quest rules.
* Do not introduce complex quest generation or multiple reward currencies.

### E. Quick Practice

Elements:

* A compact entry point to coding practice.
* Short label explaining what the user can practise.
* Button: **Practice Now**.

Behavior:

* Opens a suitable available practice challenge.
* If no challenge is available, provides an appropriate empty state or directs the user to the current lesson.

MVP constraint:

* One clear entry point is sufficient. Multiple practice categories and recommendation algorithms are not required initially.

### F. Bottom Navigation

Five destinations:

1. Home
2. Explore
3. Code
4. Quests
5. Profile

Rules:

* Home is visibly selected on this screen.
* Navigation labels and icons remain consistent across the app.
* Settings is accessible from Profile rather than occupying a separate bottom tab.
* Lesson Player and individual lesson results do not need separate permanent navigation tabs.

---

## 4. User interactions

| Action                        | Expected result                       |
| ----------------------------- | ------------------------------------- |
| Tap Continue Learning         | Opens the next incomplete lesson      |
| Tap Daily Quest               | Opens Daily Quests                    |
| Tap Practice Now              | Opens an available coding challenge   |
| Tap Explore                   | Opens Explore Worlds                  |
| Tap Code                      | Opens Code Studio                     |
| Tap Quests                    | Opens Daily Quests                    |
| Tap Profile avatar            | Opens Profile                         |
| Pull to refresh, if supported | Refreshes relevant server-backed data |

Do not add interactions that have no clearly defined result.

## 5. Screen states

### Loading state

* Show lightweight placeholders for data-dependent sections.
* Avoid a blank screen while loading.
* Keep navigation usable where possible.

### First-time user state

* Show a welcome message.
* Present the first recommended learning step.
* Continue Learning should start the first available lesson.
* Do not show empty statistics as if the user has already made progress.

### Returning user state

* Display the current learning position.
* Show persisted progress and any eligible daily quest.
* Make resuming the lesson the primary action.

### Offline or network-error state

* Preserve any locally available progress information.
* Display a concise message when fresh data cannot be loaded.
* Provide a retry action when appropriate.
* Never display unsaved progress as successfully synchronized.

### Completed curriculum state

* Replace the Continue Learning action with an appropriate next step, such as review or an available project.
* Do not send the user to a locked or nonexistent lesson.

---

## 6. Visual design requirements

* Light theme with white and ivory surfaces.
* Violet as the primary accent; green for positive progress states.
* Clean spacing and restrained card usage.
* Clear typography and accessible contrast.
* Small illustrations only where they improve comprehension.
* Consistent buttons, progress bars, icons and card styles across screens.
* Avoid excessive gradients, decorative game elements, oversized illustrations and unnecessary animations.

The Home Dashboard should feel like a focused learning app, not a complex game interface.

## 7. Data requirements

The screen may require the following information from the application state or backend:

* User's display name and avatar.
* Current course or world.
* Current lesson and lesson status.
* Overall learning progress.
* XP and streak, if enabled.
* Active daily quest and its progress.
* An available coding challenge.

These are logical data requirements, not a finalized database schema. The exact API contracts and persistence strategy will be defined in the technical design.

## 8. Acceptance criteria

The Home Dashboard is ready for acceptance testing when:

* [ ] It displays correctly on supported mobile screen sizes.
* [ ] A first-time user can start the first lesson.
* [ ] A returning user can resume the correct lesson.
* [ ] Progress and statistics reflect actual saved data.
* [ ] Daily Quest navigation opens the correct screen.
* [ ] Practice Now opens a valid available challenge.
* [ ] All five bottom navigation destinations work.
* [ ] Loading, empty, offline and error states are handled.
* [ ] No primary action leads to a nonexistent screen or lesson.
* [ ] The layout remains visually consistent with the ZELO design system.

## 9. Explicitly out of scope

The following are not required for this screen's MVP implementation:

* AI-generated personalized recommendations.
* Complex analytics dashboards.
* Leaderboards or social activity feeds.
* Multiple reward currencies.
* Animated 3D worlds.
* Dynamic dashboard customization.
* Advanced notification scheduling.

## 10. Dependencies

* Authentication and user state.
* Curriculum and lesson progression model.
* Lesson Player.
* Progress persistence.
* Basic XP and quest rules.
* Bottom navigation and shared UI components.

## 11. Definition of Done

The Home Dashboard is complete when its UI, navigation, data integration, persistence-dependent behavior and acceptance tests pass together on the target mobile platform.

**Next screen specification:** Explore Worlds — define world cards, available and locked states, navigation into a world, and the relationship between worlds and the curriculum.

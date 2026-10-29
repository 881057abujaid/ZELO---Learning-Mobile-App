# ZELO 2.0 — SCREEN_SPEC.md

**Version:** 0.9
**Status:** Draft
**Module:** Profile & Learning Progress
**Priority:** MVP — Must Have
**Related Screens:** Home Dashboard, Explore Worlds, World Learning Path, Settings

---

## 1. Purpose

The Profile & Learning Progress screen provides a central place for learners to view their account information and learning achievements.

Learners should be able to:

* View their basic profile.
* Understand their overall curriculum progress.
* Review completed and in-progress worlds.
* See meaningful learning statistics.
* Access account settings.

**Primary action:** Review learning progress or return to learning.

## 2. Screen Layout

### A. Profile Header

Display:

* Profile avatar or initials.
* Learner's display name.
* Email address, where appropriate.
* Edit Profile action, if profile editing is supported.

If the learner has not chosen a display name or avatar, show a sensible default.

Do not require learners to upload a profile image.

### B. Learning Summary

Show a small set of meaningful metrics:

* Total completed lessons.
* Completed worlds.
* Total XP earned.
* Current streak, only if streak tracking is implemented.

Each value must come from actual persisted data. Do not show placeholder statistics as if they belonged to the learner.

Avoid adding many similar metrics that do not help the learner understand progress.

### C. Curriculum Progress

Display the four initial curriculum worlds:

1. Frontend Foundations — HTML
2. Styling Studio — CSS
3. JavaScript Lab — JavaScript
4. React World — React

Each world entry should show:

* World name.
* Completion status.
* Completed lessons or progress bar.
* A View Learning Path action.

Use the same progress calculation as Explore Worlds and World Learning Path.

Do not show React as completed merely because HTML, CSS, and JavaScript are complete.

### D. Account and Settings Links

Provide simple navigation to:

* Personal Details.
* Settings.
* Sign Out.

Additional options such as account deletion can be placed within the appropriate account settings flow.

Do not duplicate settings controls directly on the Profile screen.

## 3. Learning Statistics Rules

### Completed Lessons

Count distinct lessons whose completion requirements have been satisfied.

Reopening or reviewing a lesson must not increase this count.

### Completed Worlds

Count only worlds whose required published curriculum has been completed.

A world with no published lessons must not automatically appear as completed.

### Total XP

Display confirmed XP earned according to the central reward ledger.

Avoid calculating XP by simply adding client-side counters or awarding additional XP for opening completed lessons.

### Learning Streak

If streak tracking is included:

* Define the qualifying learning activity.
* Use the documented timezone and daily boundary.
* Calculate the streak from eligible learning events.
* Avoid resetting a streak due to temporary network failure.
* Do not use guilt-inducing language when a streak ends.

Streak tracking is optional until its rules are defined.

## 4. Profile Editing

If profile editing is included in the MVP, allow the learner to edit only supported fields.

Possible fields:

* Display name.
* Avatar selection.

Requirements:

* Validate inputs.
* Show clear save success or failure feedback.
* Preserve the existing profile if saving fails.
* Do not allow profile editing to change learning progress or XP.

Changing the email address, password, or authentication provider belongs to the relevant account-management flow rather than this screen.

## 5. Required UI States

### Loading

Show lightweight placeholders for the profile header and progress summary.

### New Learner

Display:

* Default profile information.
* Zero or empty progress values where appropriate.
* A clear action to start learning.

Do not show invented achievements or completed worlds.

### Returning Learner

Display the latest confirmed profile and learning progress.

### Incomplete Curriculum

Show the learner's actual progress across available worlds, including locked worlds when relevant.

### Profile Load Error

Explain that the profile could not be loaded and offer Retry.

Avoid replacing unavailable statistics with misleading zero values.

### Signed-Out State

If the session expires, follow the app's authentication flow and preserve recoverable local state where supported.

## 6. Visual Design

Follow ZELO 2.0's design system:

* Ivory/white background.
* Violet primary accent.
* Green for completed progress.
* Compact profile header.
* Simple progress bars and cards.
* Clear typography and generous spacing.
* Consistent shared navigation.

Avoid:

* Large decorative profile banners.
* Complex charts.
* Public follower or friend counts.
* Multiple achievement currencies.
* Excessive badges.
* Competitive rankings.
* Dense statistical dashboards.

The profile should feel like a learning summary, not a social media profile.

## 7. Navigation Rules

* Profile → Personal Details.
* Profile → Settings.
* Profile → Sign Out confirmation.
* Curriculum progress item → Corresponding World Learning Path.
* Start Learning → First available or next recommended learning destination.

After signing out, clear session-specific information from the UI and return the learner to the appropriate authentication screen.

Signing out must not delete the learner's saved server-side progress.

## 8. Privacy and Account Security

* Display only profile information needed for the product.
* Do not expose authentication tokens or private account identifiers.
* Protect profile and progress APIs with appropriate authorisation.
* Ensure learners can access only their own private account data.
* Do not treat a user ID supplied by the client as proof of authorisation.
* Follow the product's documented data-retention and account-deletion rules.

## 9. Logical Data Requirements

**User Profile**

* User ID.
* Display name.
* Email, when available.
* Avatar reference, if configured.
* Account status.

**Learning Summary**

* Completed lesson count.
* Completed world count.
* Confirmed XP total.
* Streak data, if implemented.

**World Progress**

* World ID.
* Completed lesson count.
* Published lesson count.
* Completion status.
* Last activity timestamp, where useful.

These are logical requirements, not a final database schema. The source of truth and aggregation strategy will be defined in the backend specification.

## 10. Acceptance Criteria

* [ ] Profile information is displayed accurately.
* [ ] Default avatar and display-name states work.
* [ ] Learning metrics use confirmed persisted data.
* [ ] Lesson and world counts do not increase on review.
* [ ] Progress matches the World Learning Path screen.
* [ ] Unfinished curriculum is not shown as complete.
* [ ] Profile editing validates and saves supported fields.
* [ ] Failed saves preserve existing information.
* [ ] Settings and sign-out navigation work correctly.
* [ ] Signing out does not delete saved learning progress.
* [ ] Private account data is protected.
* [ ] Loading, empty, and error states are handled.
* [ ] The layout is usable on supported mobile screen sizes.

## 11. Out of Scope

The MVP will not include:

* Public learner profiles.
* Followers and friends.
* Social feeds.
* Global leaderboards.
* Complex achievement galleries.
* Advanced learning analytics.
* Custom profile themes.
* Multiple avatars with unlockable upgrades.
* Public sharing of detailed learning statistics.

## 12. Dependencies

* Authentication and account management.
* Persisted lesson progress.
* World curriculum and unlock rules.
* XP reward ledger.
* Shared navigation and UI components.
* Settings screen.
* Profile API and authorisation rules.

## 13. Definition of Done

The screen is complete when a learner can view their profile, understand their actual learning progress, navigate to a world for continued practice, and access account settings without misleading statistics or exposing private account data.

---

**Next screen:** Screen 10 — Settings. Define essential preferences, account controls, learning preferences, and sign-out behaviour while keeping the settings experience minimal.

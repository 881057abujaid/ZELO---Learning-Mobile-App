# ZELO 2.0 — Notifications & Reminder System Specification

**Document ID:** ZELO-NOT-028
**Filename:** `NOTIFICATIONS_SPEC.md`
**Version:** 2.8
**Status:** Draft
**Priority:** MVP — Basic In-App Notifications; Push Reminders — Later Phase

---

## 1. Purpose

Define how ZELO communicates useful learning updates and optional reminders to learners.

The notification system should help learners resume their learning journey, understand relevant progress updates and return to unfinished activities without creating pressure or distraction.

## 2. Product Principles

1. **Learner control:** Users can choose whether to receive reminders.
2. **Low frequency:** Notifications must not overwhelm learners.
3. **Relevant timing:** Send reminders only when there is a meaningful reason.
4. **No punishment:** Missing a day must not produce guilt-based messaging.
5. **Privacy:** Notification previews must not expose sensitive account information.
6. **Independent learning:** Notifications must never be required to access lessons, quests or progress.
7. **Reliable delivery:** A notification must reflect a real application state, not an assumed outcome.

## 3. Notification Categories

### 3.1 Learning reminders

Purpose: Encourage a learner to continue their learning path.

Example:

* “Ready for your next ZELO lesson?”
* “Your next JavaScript lesson is waiting.”

Rules:

* Reminders are optional.
* Do not send them when the user has disabled reminders.
* Avoid reminders when the learner has already completed the relevant action.
* Do not imply that the learner has lost progress when they have not.

### 3.2 Quest updates

Purpose: Inform learners about meaningful quest progress.

Examples:

* “Daily Quest completed!”
* “One more learning activity to finish your quest.”

Rules:

* Only send updates when the underlying quest state confirms the event.
* Avoid sending a separate notification for every minor progress increment.
* Quest updates must not be used to pressure users into continuous app usage.

### 3.3 Learning milestones

Purpose: Acknowledge meaningful progress.

Examples:

* Completing the first lesson.
* Completing a world.
* Finishing a major curriculum milestone.

Rules:

* Keep messages concise and encouraging.
* Avoid generating a notification for every routine action.
* Celebrate progress without comparing learners with other people.

### 3.4 Account and security notifications

Purpose: Communicate important account-related events when supported by the authentication system.

Examples:

* Password or account security changes.
* Relevant account recovery events.

Security notifications must follow the chosen authentication provider’s capabilities and security policies. They must not reveal passwords, tokens or recovery secrets.

## 4. Delivery Channels

| Channel                    | MVP decision               | Purpose                                                |
| -------------------------- | -------------------------- | ------------------------------------------------------ |
| In-app feedback            | Included                   | Confirm immediate actions and relevant progress        |
| In-app notification centre | Optional later enhancement | Store notifications for later viewing                  |
| Local device reminders     | Later phase                | Schedule optional reminders on a supported device      |
| Remote push notifications  | Later phase                | Deliver server-triggered notifications                 |
| Email notifications        | Out of scope initially     | Avoid introducing unnecessary messaging infrastructure |

A toast or success message is immediate UI feedback; it does not automatically need to become a persistent notification.

## 5. MVP Scope

The first release should prioritise:

* Immediate feedback after important learner actions.
* Optional, simple learning reminders only if the required scheduling capability is available without excessive complexity.
* A basic reminder preference in Settings if reminders are implemented.
* Clear handling when device or operating-system notification permission is unavailable.
* No mandatory push-notification infrastructure.

A persistent notification centre is not required for the initial MVP.

## 6. Reminder Preferences

If reminders are implemented, users should be able to:

* Enable or disable learning reminders.
* Choose an appropriate reminder time, if scheduling supports it.
* Review and change their preference in Settings.
* Use ZELO normally when reminders are disabled.

Do not show a permission prompt immediately on first launch without context. Explain the benefit before requesting operating-system permission.

The operating system's notification permission and ZELO's internal reminder preference are separate controls. Both must allow delivery before a reminder is sent.

## 7. Scheduling and Frequency Rules

The initial reminder policy should be conservative.

Proposed defaults:

* No more than one routine learning reminder per day.
* No reminder after the learner has already completed the intended learning activity that day.
* No repeated notifications for the same event.
* Respect the user's local time and configured quiet hours if those features are introduced.
* Do not send a reminder when the account is disabled or the reminder preference is off.

The exact default reminder time, daily reset time and timezone policy remain open decisions.

If a reliable local scheduling approach is available, prefer it for simple device-only reminders. Remote push delivery should be added only when a clear product requirement justifies its additional backend and infrastructure needs.

## 8. Notification Event Model

If ZELO later requires persistent or remotely delivered notifications, use a minimal model.

Suggested logical fields:

| Field               | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `id`                | Unique notification identifier                                 |
| `user_id`           | Intended recipient                                             |
| `type`              | Controlled notification category                               |
| `title`             | Short display title                                            |
| `body`              | Notification message                                           |
| `created_at`        | Creation timestamp                                             |
| `read_at`           | Read timestamp, if a notification centre exists                |
| `deduplication_key` | Prevent duplicate creation for the same event                  |
| `delivery_status`   | Delivery state, only if persistent delivery tracking is needed |

This is a proposed logical model, not a commitment to create a database table in the MVP.

For event-triggered notifications, use the authoritative application event. For example, a quest-completion notification must follow confirmed quest completion rather than a client-side button press.

## 9. Notification Lifecycle

A notification, when supported, follows this lifecycle:

1. A meaningful event occurs.
2. The system checks the event and notification eligibility.
3. User preferences and permission requirements are checked.
4. Duplicate events are filtered.
5. The notification is scheduled or delivered.
6. Delivery status is recorded only if needed.
7. The system handles delivery failure without breaking the learning flow.

Not every notification must be persisted. Simple success feedback can remain a UI-only event.

## 10. Navigation Behaviour

Notifications should lead users to a relevant destination when possible.

Examples:

* Learning reminder → Continue Learning or the next available lesson.
* Quest completion → Quests screen.
* Curriculum milestone → Relevant world or learning path.
* Account security notification → Relevant account settings or recovery flow.

Before navigation, the app must verify that the destination remains available and the user is authorised to access it.

If the target lesson becomes locked or unavailable, show a safe fallback rather than opening a broken screen.

## 11. Privacy and Security

* Do not include authentication credentials, recovery links containing secrets or private code in notification content.
* Keep lock-screen text generic where sensitive details might otherwise be exposed.
* Do not send notifications to devices that are no longer associated with the account.
* Protect remote notification tokens as sensitive identifiers.
* Remove or invalidate device registrations when required by account lifecycle rules.
* Avoid collecting precise location data for reminders.
* Respect applicable privacy and notification-consent requirements.

## 12. Failure and Edge Cases

The system must handle:

* Notifications disabled at the operating-system level.
* ZELO reminders disabled in Settings.
* Missing or invalid device tokens.
* Timezone changes.
* Duplicate event processing.
* A quest being completed before a reminder is delivered.
* A lesson becoming unavailable after a reminder is scheduled.
* Network failure.
* A user signing out or deleting their account.

A notification delivery failure must never undo lesson completion, XP awards or quest progress.

## 13. Acceptance Criteria

* [ ] Users can learn without enabling notifications.
* [ ] Disabled reminders are not scheduled or sent.
* [ ] The system does not repeatedly notify users about the same event.
* [ ] Quest notifications correspond to confirmed quest state.
* [ ] Reminder frequency respects the configured policy.
* [ ] Navigation targets are checked before opening.
* [ ] Notification permission denial does not break Settings or onboarding.
* [ ] Notification failures do not affect core learning actions.
* [ ] No secrets are exposed in notification content.
* [ ] Account and device lifecycle rules are documented before remote push is introduced.

## 14. Out of Scope

* Social notifications.
* Competitive ranking alerts.
* Marketing campaigns.
* Email newsletters.
* Multiple notification schedules per day.
* Complex notification-personalisation algorithms.
* AI-generated reminders.
* Streak-loss warnings designed to create pressure.
* A large notification-management dashboard.

## 15. Open Decisions

1. Should the MVP include local device reminders or only in-app feedback?
2. What should the default reminder time be, if reminders are included?
3. What timezone and daily-reset policy should reminders follow?
4. Is a persistent notification centre necessary?
5. Will remote push notifications be justified by user demand?
6. What retention policy applies to notification records and device tokens?

These decisions should be resolved before implementing scheduling or remote delivery.

## 16. Definition of Done

The notification foundation is ready when the supported channels are defined, user preferences and permission behaviour are clear, duplicate delivery is prevented where applicable, privacy requirements are met, and notifications cannot interfere with core learning functionality.

**End of Document — ZELO-NOT-028**

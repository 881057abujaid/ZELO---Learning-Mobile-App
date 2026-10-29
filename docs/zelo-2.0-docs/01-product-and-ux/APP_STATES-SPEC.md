# ZELO 2.0 — APP_STATES_SPEC.md

## Screen 15: Loading, Empty, Error & Offline States

**Version:** 1.5
**Status:** Draft
**Module:** App-wide States & Recovery
**Priority:** MVP — Must Have

---

## 1. Purpose

ZELO 2.0 ko sirf successful conditions mein nahi, balki slow networks, missing content, failed requests aur interrupted learning sessions mein bhi reliable hona chahiye.

Yeh specification shared UI states aur recovery behaviour define karti hai.

**Primary goals:**

* Users ko clear feedback dena.
* Failed operations ko safely recover karna.
* Duplicate submissions aur duplicate rewards prevent karna.
* Loading aur error states ko consistent rakhna.
* Learning progress ko protect karna.

## 2. State Categories

| State        | Meaning                                                              |
| ------------ | -------------------------------------------------------------------- |
| Loading      | Required data ya operation abhi process ho raha hai                  |
| Empty        | Request successful hai, lekin display karne ke liye content nahi hai |
| Error        | Request ya operation fail hua hai                                    |
| Offline      | Network unavailable hai ya service reachable nahi hai                |
| Success      | Operation successfully complete hua hai                              |
| Partial Data | Kuch information available hai, lekin kuch requests fail hui hain    |

In states ko interchangeable nahi maana jayega. Example: empty Explore screen ka matlab yeh nahi ki server request fail hui hai.

## 3. Loading State

### Behaviour

* Initial screen loading par lightweight skeleton ya progress indicator show ho.
* Long-running actions par user ko operation ka status samajh aaye.
* Repeated submission se duplicate requests prevent hon.
* Navigation ko unnecessary block na kiya jaye.
* Previously loaded content available ho toh appropriate cases mein use retain kiya ja sakta hai.

### Rules

* Har button tap par full-screen loader zaroori nahi.
* Local UI actions ko network request ki tarah present nahi karna.
* Indefinite loading ke case mein timeout/recovery behaviour defined ho.
* Coding execution aur reward processing jaise operations ke liye specific loading states use hon.

## 4. Empty State

Empty state tab show hogi jab request successful ho, lekin relevant content available na ho.

### Examples

**No Learning Progress**

Message: "Your learning journey starts here."

Action: Start First Lesson.

**No Available Coding Challenges**

Message: "No coding challenges are available right now."

Action: Explore Learning Path, if a valid destination exists.

**No Active Quests**

Message: "No quests are available right now."

Action: Continue Learning, if an eligible lesson exists.

**No Completed Lessons**

Profile par zero completed lessons aur zero earned XP accurately show honge.

### Rules

* Empty state fake content ya invented progress display nahi karegi.
* Har empty state mein action tabhi show hoga jab valid destination available ho.
* Empty state aur error state clearly distinguish honge.

## 5. Error State

### Error Categories

* Network request failure.
* Authentication/session error.
* Missing or unavailable content.
* Validation failure.
* Permission/authorization failure.
* Coding execution infrastructure error.
* Progress save failure.
* Reward processing failure.

### Behaviour

* User ko understandable message mile.
* Sensitive internal errors, stack traces ya server details expose nahi honge.
* Retry sirf retryable operations ke liye show hoga.
* Validation errors relevant field ya activity ke paas appear honge.
* Unavailable content ke liye safe back navigation hogi.
* Error ke baad duplicate reward ya duplicate completion record create nahi hoga.

### Example Messages

| Situation                  | Message                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| General network error      | "We couldn't load this right now. Please try again."                 |
| Missing lesson             | "This lesson is currently unavailable."                              |
| Session expired            | "Your session has expired. Please sign in again."                    |
| Coding service unavailable | "Code execution is temporarily unavailable. Your code is preserved." |
| Progress save failed       | "Your progress couldn't be saved yet. Please retry."                 |

Messages final UI copy ke roop mein refine kiye ja sakte hain.

## 6. Offline Behaviour

MVP mein complete offline learning automatically guaranteed nahi hai.

### Offline Requirements

* Network-dependent operations fail hone par clear feedback mile.
* Unsaved coding work ko supported local draft mechanism se preserve karne ki preference ho.
* Previously loaded content ko retain karna implementation aur caching policy par depend karega.
* Offline state ko server success ke roop mein represent nahi karna hai.
* Unsupported offline actions disable ya clearly explain kiye jayen.
* Reconnection par pending operations safely reconcile hon, where supported.

### Important Distinction

**Offline support** aur **offline-first architecture** alag commitments hain.

Initial MVP ke liye basic offline detection, clear messaging aur accidental data loss ko minimize karna target hoga. Full offline lessons, offline code execution aur complex conflict resolution separate decisions hain.

## 7. Data-Saving and Retry Rules

* Retryable requests ko controlled manner mein repeat kiya jayega.
* Non-idempotent operations ko blindly repeat nahi karna hai.
* Lesson completion aur XP award operations duplicate-safe hone chahiye.
* Failed save par local state ko immediately discard nahi karna hai.
* Server-confirmed state aur local pending state distinguish honi chahiye.
* Reconnection ke baad authoritative server data ke saath reconciliation hogi.

Idempotency keys, retry limits aur backoff strategy technical architecture mein define ki jayengi.

## 8. Screen-Specific Requirements

| Module           | Required behaviour                                          |
| ---------------- | ----------------------------------------------------------- |
| Home             | Loading placeholders; accurate zero-progress state          |
| Explore          | Empty curriculum aur unavailable world states               |
| Learning Path    | Missing lessons aur locked prerequisites                    |
| Lesson Player    | Content loading, answer submission aur progress-save errors |
| Coding Practice  | Running, test failure aur execution infrastructure errors   |
| Results          | Completion-save status aur duplicate reward protection      |
| Quests           | No active quests aur delayed progress updates               |
| Profile          | Loading, zero stats aur profile-fetch errors                |
| Settings         | Account operation errors                                    |
| Authentication   | Validation, network failures aur session expiry             |
| Personal Details | Profile update errors aur unsaved-input preservation        |

## 9. Accessibility

* Error messages sirf colour se communicate nahi honge.
* Loading status assistive technologies ke liye appropriately exposed hoga.
* Focus relevant error ya recovery action par move ho sakta hai.
* Buttons aur retry actions accessible touch targets honge.
* Animations essential information convey karne ka only method nahi hongi.
* Long-running operations mein status changes perceivable hone chahiye.

## 10. Acceptance Criteria

* [ ] Har data-dependent screen mein loading behaviour defined hai.
* [ ] Successful empty response ko error ke saath confuse nahi kiya jata.
* [ ] Retryable errors par valid retry action available hai.
* [ ] Non-retryable errors ke liye appropriate alternative diya gaya hai.
* [ ] Network failure par misleading success state nahi dikhti.
* [ ] Lesson progress aur coding drafts supported cases mein preserve hote hain.
* [ ] Duplicate submissions aur rewards prevent hote hain.
* [ ] Session expiry protected screens par consistently handle hoti hai.
* [ ] Error messages internal technical details expose nahi karte.
* [ ] Accessibility aur small-screen behaviour tested hain.

## 11. Out of Scope

* Guaranteed full offline mode.
* Offline code execution.
* Complex background synchronization.
* Multi-device conflict resolution.
* Automatic retry loops without limits.
* Advanced diagnostics dashboard for learners.
* User-visible server logs.

## 12. Dependencies

* Shared UI components.
* API error contract.
* Authentication/session management.
* Progress persistence.
* Coding execution service.
* Reward processing.
* Local draft/cache policy.

## 13. Definition of Done

Shared state handling tab complete mani jayegi jab MVP ke critical flows loading, empty, error aur offline conditions mein predictable recovery provide karein aur learning progress ya rewards accidentally duplicate ya silently lose na hon.

---

**Next Document:** Screen 16 — Accessibility & Responsive UI Requirements

Ismein typography, touch targets, contrast, screen sizes, keyboard navigation aur beginner-friendly interaction rules define karenge, taaki ZELO sirf visually clean nahi, balki genuinely usable bhi ho.

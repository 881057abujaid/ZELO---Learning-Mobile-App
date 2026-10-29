# ZELO 2.0 — SCREEN_SPEC.md

## Screen 14: Personal Details

**Version:** 1.4
**Status:** Draft
**Module:** Personal Details
**Priority:** MVP — Must Have for basic profile viewing; editing depends on authentication and backend support.

---

## 1. Purpose

Personal Details screen learner ko apne account se associated basic profile information dekhne aur supported fields update karne degi.

**Primary goals:**

* Basic profile information display karna.
* Display name update karne ka option dena.
* Email aur authentication-related information ko safely handle karna.
* Profile changes ko reliably save karna.
* Unnecessary personal information collect karne se bachna.

## 2. Entry Points

* Profile → Personal Details.
* Settings → Personal Details, if this shortcut is provided.

Successful save ke baad learner isi screen par rahega aur updated information dekh sakega.

Back action user ko us previous screen par return karega jahan se woh aaya tha.

## 3. Screen Layout

### A. Header

* Back button.
* Title: **Personal Details**
* Simple, consistent ZELO layout.

### B. Profile Identity

* Profile avatar ya initials.
* Display name.
* Email address, where available.

Avatar upload initial MVP mein optional hai. Agar image upload, storage aur deletion flows implemented nahi hain, toh upload control show nahi hoga.

### C. Editable Fields

| Field         | MVP behaviour                                                |
| ------------- | ------------------------------------------------------------ |
| Display Name  | Editable, subject to validation                              |
| Email Address | Read-only by default; change flow only if supported          |
| User ID       | Internal identifier; normal UI mein expose karna unnecessary |
| Password      | Is screen par direct password display nahi hoga              |

Display name ko trim karna aur reasonable length limits enforce karna chahiye. Exact minimum/maximum length implementation ke validation rules mein define hogi.

### D. Save Controls

* Primary action: **Save Changes**
* Secondary action: **Cancel**, if there are unsaved changes.

Save button tabhi enabled hoga jab valid changes hon.

Repeated taps se duplicate update requests generate nahi honi chahiye.

## 4. Display Name Update Flow

1. Learner display name edit karega.
2. Input validation perform hogi.
3. Save Changes select karega.
4. Server authenticated user ki authorization verify karega.
5. Valid update persist hogi.
6. Updated name screen aur relevant profile components mein reflect hoga.
7. User ko concise success confirmation milegi.

Agar request fail hoti hai, toh unsaved input ko unnecessarily discard nahi karna hai.

Profile changes sirf current authenticated user ke account par apply honi chahiye.

## 5. Email Address Behaviour

Email address authentication identity ka part ho sakta hai, isliye use ordinary text field ki tarah update nahi karna chahiye.

Agar email change supported hai:

* Dedicated email-change flow use hoga.
* New address ki verification required ho sakti hai.
* Pending verification aur successful change states clearly show hongi.
* Authentication provider ki security requirements follow hongi.

Agar email change supported nahi hai, toh address read-only rahega. User ko non-functional edit control nahi dikhana hai.

## 6. Validation Rules

| Condition                   | Expected behaviour                                  |
| --------------------------- | --------------------------------------------------- |
| Display name empty          | Clear validation message                            |
| Name exceeds allowed length | Input correction prompt                             |
| No changes made             | Save button disabled                                |
| Invalid characters          | Defined validation rules apply                      |
| Network failure             | Retry option; unsaved input preserve ho             |
| Session expired             | Re-authentication                                   |
| Save request in progress    | Duplicate submission disabled                       |
| Server rejects update       | Safe error message; existing saved data preserve ho |

Validation client aur server dono par honi chahiye.

## 7. UI States

**Loading:** Profile information load hote waqt lightweight placeholder.

**Default:** Current saved information visible.

**Editing:** Supported fields editable.

**Saving:** Loading indicator; duplicate submission disabled.

**Success:** Updated information reflect ho aur confirmation mile.

**Validation Error:** Relevant field ke paas error.

**Network Error:** Retry option aur local form input preserve ho.

**Session Expired:** Authentication flow par return.

**Unavailable Profile:** Clear error aur retry/back option.

## 8. Data Requirements

Logical requirements:

* Authenticated user identifier.
* Display name.
* Email address, if available.
* Profile update timestamp, if required by backend.
* Email verification status, if email changes are supported.

Sensitive authentication records aur application profile information ko appropriate boundaries ke saath manage kiya jayega.

Yeh logical data requirements hain, final database schema nahi.

## 9. Security and Privacy

* Server har profile update par user authorization verify karega.
* User-supplied user ID ke basis par arbitrary profile updates allow nahi honge.
* Email change ke liye provider-supported verification aur security controls follow honge.
* Passwords aur authentication tokens UI ya logs mein expose nahi honge.
* Sirf necessary personal information collect aur display hogi.
* Profile endpoint se doosre users ka private data access nahi kiya ja sakega.

## 10. Acceptance Criteria

* [ ] Authenticated learner apni profile details dekh sakta hai.
* [ ] Supported display name editing correctly work karti hai.
* [ ] Invalid input par clear validation message milta hai.
* [ ] Save ke baad updated information persist hoti hai.
* [ ] Failed requests mein unsaved input unnecessarily lose nahi hota.
* [ ] Email address read-only hai unless a complete change flow exists.
* [ ] Profile updates server-side authorization se protected hain.
* [ ] Session expiry aur network errors safely handle hote hain.
* [ ] Profile changes Home aur Profile screens par consistent reflect hote hain.
* [ ] Layout mobile accessibility requirements follow karta hai.

## 11. Out of Scope

* Public profile pages.
* Followers and social features.
* Custom profile themes.
* Multiple profile avatars and avatar marketplace.
* Public biography, social links and profile badges.
* Account merging.
* Advanced account security dashboard.
* Multiple email addresses per account.

## 12. Dependencies

* Authentication provider.
* Profile API and persistence.
* Session management.
* Profile screen.
* Settings screen.
* Email verification flow, if supported.

## 13. Definition of Done

Personal Details screen tab complete mani jayegi jab supported profile information accurately display ho, authorized updates persist hon, unsupported controls hidden hon aur failure/security cases tested hon.

---

**Next Document:** Screen 15 — Loading, Empty, Error & Offline States

Is document mein hum app-wide failure aur recovery behaviour define karenge, taaki ZELO slow network, missing content, server errors aur empty learning states mein bhi predictable rahe.

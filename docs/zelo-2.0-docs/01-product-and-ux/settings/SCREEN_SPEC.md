# ZELO 2.0 — SCREEN_SPEC.md

## Screen 10: Settings

**Version:** 1.0
**Status:** Draft
**Module:** Settings
**Priority:** MVP — Must Have for essential account controls; optional preferences depend on implementation.

---

## 1. Purpose

Settings screen learners ko apni essential app preferences aur account-related actions manage karne degi.

**Primary goals:**

* Account settings tak easy access.
* Sign out securely karna.
* Supported preferences ko manage karna.
* Account-related errors ko clearly handle karna.

Settings screen ka purpose learning experience ko improve karna hai, na ki unnecessary configuration options add karna.

## 2. Navigation

Settings screen Profile screen se accessible hogi.

* Back button → Previous screen.
* Personal Details → Personal Details screen.
* Notification Preferences → Only if notifications are implemented.
* Sign Out → Confirmation dialog, then sign out.
* Delete Account → Account deletion flow, if supported.

Settings ke liye bottom navigation mein separate tab nahi hoga.

## 3. Screen Layout

### A. Header

* Title: **Settings**
* Back navigation.
* Simple, uncluttered layout.

### B. Account Section

| Option              | Behaviour                                                            |
| ------------------- | -------------------------------------------------------------------- |
| Personal Details    | Display name aur supported profile information manage karna          |
| Account Information | Signed-in account ki relevant information dikhana, where appropriate |
| Sign Out            | Confirmation ke baad current session end karna                       |
| Delete Account      | Separate confirmation aur account deletion process, if implemented   |

Account-related actions authenticated user ke context mein hi operate karengi.

### C. Preferences Section

**Appearance**

* ZELO ka initial visual direction light theme hai.
* Theme selector tabhi show hoga jab alternate themes actually supported aur tested hon.
* Agar sirf light theme available hai, toh redundant theme toggle nahi dikhana.

**Notifications — Optional**

* Notification preferences tabhi available hongi jab app notifications implement kare.
* Permission denied hone par user ko clear explanation aur supported system-settings guidance deni hogi.
* Notifications unavailable hon toh empty ya non-functional settings option nahi dikhana.

**Learning Preferences — Future Scope**

* Language selection tabhi add hogi jab selected language mein sufficient curriculum content available ho.
* Reminder scheduling aur advanced learning preferences initial MVP ka part nahi hain.

## 4. Sign-Out Behaviour

1. User **Sign Out** select karega.
2. Confirmation dialog current action explain karega.
3. Cancel karne par user Settings screen par rahega.
4. Confirm karne par session securely terminate hoga.
5. User Login screen par navigate karega.
6. Protected screens aur account data ko unauthorized access se protect kiya jayega.

Network failure ki situation mein app misleading success message nahi dikhayegi. Session handling authentication provider ke actual behaviour ke according hogi.

## 5. Delete Account Behaviour

Agar account deletion MVP mein supported hai:

1. User ko deletion ke consequences clearly explain honge.
2. Explicit confirmation required hogi.
3. Re-authentication required ho sakti hai, depending on the authentication system.
4. Account aur associated personal data ko documented retention/deletion policy ke according handle kiya jayega.
5. Successful deletion ke baad user signed-out state mein jayega.

Account deletion sirf UI se account record hide karne tak limited nahi honi chahiye. Backend aur related user data ke liye defined deletion behaviour zaroori hai.

## 6. UI States

**Default State:** Available settings options visible hon.

**Loading State:** Account-dependent information load hote waqt lightweight loading indicator.

**Account Error:** Account information load nahi hoti toh retry option aur clear message.

**Sign-Out Processing:** Duplicate sign-out requests prevent hon.

**Sign-Out Error:** Error explain ho aur user ko safe recovery option mile.

**Unsupported Preference:** Unsupported settings option render na ho.

## 7. Visual Guidelines

* Existing ZELO light-theme direction follow karna.
* Ivory/white background, violet primary accents, green positive states.
* Simple grouped sections aur readable labels.
* Icons sirf tab use hon jab meaning clear ho.
* Har option ke liye large decorative card ki zaroorat nahi.
* Destructive actions, jaise Delete Account, visually distinguish hon.
* Small screens par scrolling natural aur touch targets accessible hon.

## 8. Data Requirements

Settings screen ko zaroorat ke mutabik ye information access karni hogi:

* Current authenticated user.
* Supported preference values.
* Notification permission/preference state, if implemented.
* Account deletion status, if applicable.

Ye logical requirements hain, final database schema nahi. Preferences ko database mein store karna hai ya local device par, iska decision har preference ke behaviour aur sync requirements ke basis par hoga.

## 9. Acceptance Criteria

* [ ] Settings Profile screen se accessible hai.
* [ ] Back navigation expected screen par return karti hai.
* [ ] Personal Details link correct screen open karta hai.
* [ ] Sign-out confirmation aur cancellation correctly work karte hain.
* [ ] Successful sign-out ke baad protected content inaccessible hai.
* [ ] Failed account operations ke liye clear error aur recovery path hai.
* [ ] Unsupported preferences ke liye fake controls nahi hain.
* [ ] Theme controls sirf implemented themes ke liye visible hain.
* [ ] Account deletion, if supported, explicit confirmation aur documented data handling follow karti hai.
* [ ] Layout mobile screens aur accessibility requirements ke liye tested hai.

## 10. Out of Scope

* Multiple custom themes.
* Advanced notification scheduling.
* Language selector without translated curriculum.
* Complex personalization controls.
* Social privacy settings without social features.
* Subscription and payment management.
* Developer/debug settings for ordinary learners.

## 11. Dependencies

* Authentication and session management.
* Profile / Personal Details screen.
* Notification infrastructure, if included.
* Account deletion and data-retention policy, if deletion is included.

## 12. Definition of Done

Settings screen tab complete mani jayegi jab supported account actions correctly work karein, errors handle hon, unsupported controls hidden hon aur authentication-related security checks pass hon.

---

**Next Document:** Screen 11 — Onboarding

Ismein hum define karenge ki ek brand-new learner ZELO open karne ke baad apna account kaise create karega, learning path kaise samjhega aur bina confusion ke apna pehla lesson kaise start karega.

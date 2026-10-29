# ZELO 2.0 — NAVIGATION_SPEC.md

## Screen 13: Navigation & App Flow

**Version:** 1.3
**Status:** Draft
**Module:** App Navigation
**Priority:** MVP — Must Have

---

## 1. Purpose

Navigation system ZELO 2.0 ki saari screens ko ek consistent, predictable flow mein connect karega.

**Primary goals:**

* Har screen ka clear entry point aur exit path.
* Learning journey mein unnecessary navigation avoid karna.
* Lesson progress aur current state preserve karna.
* Authentication aur protected screens correctly handle karna.
* Duplicate screens aur conflicting navigation logic prevent karna.

## 2. Application Structure

ZELO ke navigation ko chaar logical groups mein divide kiya jayega:

<box border radius="lg" padding={3} gap={3}>
  <box background="surface-secondary" radius="md" padding={3} gap={1}>
    <title size="md">A. Authentication & Onboarding</title>
    <text size="sm">Welcome → Learning Journey → Sign Up / Sign In</text>
  </box>
  <box align="center">
    <icon name="arrow-down" size="lg" color="secondary" />
  </box>
  <box background="surface" border radius="md" padding={3} gap={1}>
    <title size="md">B. Main Application</title>
    <text size="sm">Home · Explore · Code · Quests · Profile</text>
  </box>
  <box align="center">
    <icon name="arrow-down" size="lg" color="secondary" />
  </box>
  <box background="surface" border radius="md" padding={3} gap={1}>
    <title size="md">C. Learning Flow</title>
    <text size="sm">World Path → Lesson Player → Activity / Coding Challenge → Results</text>
  </box>
  <box align="center">
    <icon name="arrow-down" size="lg" color="secondary" />
  </box>
  <box background="surface-secondary" radius="md" padding={3} gap={1}>
    <title size="md">D. Account & Preferences</title>
    <text size="sm">Profile → Personal Details → Settings → Sign Out</text>
  </box>
</box>

Yeh logical grouping hai, final route names ya specific navigation library ka decision nahi.

## 3. Main Navigation

Authenticated learner ko persistent bottom navigation mein paanch destinations milenge:

| Tab     | Purpose                              |
| ------- | ------------------------------------ |
| Home    | Resume learning aur progress summary |
| Explore | Worlds aur curriculum discover karna |
| Code    | Available coding challenges          |
| Quests  | Daily learning goals                 |
| Profile | Learning stats aur account settings  |

**Rules:**

* Selected tab visually distinguish hona chahiye.
* Tab switch karne par unnecessary data reset nahi hona chahiye.
* Lesson Player aur Results bottom navigation ke separate tabs nahi honge.
* Back navigation current flow ko follow karegi.
* Agar kisi tab ke liye content unavailable hai, toh dead-end screen nahi dikhani hai.

## 4. Core Learning Flow

<box border radius="lg" padding={3} gap={2}>
  <box background="surface-secondary" radius="md" padding={3} align="center">
    **Home Dashboard**
    <text color="secondary" size="sm">Continue Learning / Start First Lesson</text>
  </box>
  <box align="center"><icon name="arrow-down" color="secondary" /></box>
  <box border radius="md" padding={3} align="center">
    **World Learning Path**
    <text color="secondary" size="sm">Lesson selection and prerequisites</text>
  </box>
  <box align="center"><icon name="arrow-down" color="secondary" /></box>
  <box border radius="md" padding={3} align="center">
    **Lesson Player**
    <text color="secondary" size="sm">Explanation and interactive activities</text>
  </box>
  <box align="center"><icon name="arrow-down" color="secondary" /></box>
  <box border radius="md" padding={3} align="center">
    **Lesson Completion & Results**
    <text color="secondary" size="sm">Progress saved and eligible rewards processed</text>
  </box>
  <box align="center"><icon name="arrow-down" color="secondary" /></box>
  <box background="surface-secondary" radius="md" padding={3} align="center">
    **Next Lesson or Learning Path**
    <text color="secondary" size="sm">Continue the curriculum or review completed work</text>
  </box>
</box>

### Learning flow rules

1. Home ka Continue Learning action next eligible lesson open karega.
2. Explore se world select karne par uska Learning Path open hoga.
3. Learning Path se lesson select karne par Lesson Player open hoga.
4. Lesson complete hone par Results screen open hogi.
5. Next Lesson action next available lesson open karega.
6. Agar next lesson available nahi hai, toh completed world ka Learning Path ya appropriate completion state open hogi.
7. Review mode mein lesson dobara complete karne se duplicate XP ya duplicate completion record nahi banega.

## 5. Coding Practice Flow

Coding challenges do tarikon se accessible honge:

* Home ke Quick Practice section se.
* Main navigation ke Code tab se.

**Expected flow:**

Code → Challenge List → Challenge Detail / Editor → Run → Submit → Result

Rules:

* Challenge list mein sirf available challenges dikhaye jayen.
* Lesson ke andar se open hua challenge lesson context preserve kare.
* Independent practice se lesson automatically complete nahi hoga, jab tak curriculum rules explicitly aisa define na karein.
* Run aur Submit alag actions honge.
* Infrastructure ya execution error ko incorrect answer ke roop mein report nahi karna hai.
* Challenge results save honge according to the defined progress policy.

## 6. Explore and World Navigation

Explore → World → World Learning Path → Selected Lesson

* Back action Explore par return karega.
* World progress aur lesson status consistent rahenge.
* Locked lessons ke liye prerequisite ka reason dikhaya jayega.
* Completed lessons review ke liye accessible rahenge.
* Unavailable ya unpublished lessons open nahi honge.
* Curriculum order HTML → CSS → JavaScript → React rahega.

## 7. Quests Navigation

Home → Daily Quest → Relevant Learning Activity

* Quest action directly relevant lesson ya challenge open karega.
* Activity complete hone par quest progress update hogi.
* User Quests tab par return karke updated progress dekh sakta hai.
* Duplicate completion events duplicate quest progress ya rewards generate nahi karenge.
* Quest unavailable hone par app user ko broken destination par navigate nahi karegi.

## 8. Profile and Settings Navigation

Profile → Personal Details → Back to Profile

Profile → Settings → Back to Profile

Settings → Sign Out → Confirmation → Login

Rules:

* Profile aur Settings ke beech predictable back behaviour.
* Sign-out ke baad protected screens accessible nahi rahengi.
* Delete Account, if implemented, explicit confirmation aur account-deletion flow use karega.
* Account deletion ke baad user ko authenticated state mein nahi rehna chahiye.

## 9. Authentication Guards

Protected screens aur APIs authenticated state verify karengi.

| Scenario                           | Expected behaviour                                  |
| ---------------------------------- | --------------------------------------------------- |
| New user                           | Onboarding / Sign Up                                |
| Existing signed-out user           | Login                                               |
| Valid authenticated session        | Main Application                                    |
| Expired session                    | Re-authentication                                   |
| Protected destination requested    | Login, then return to destination where appropriate |
| Sign-out complete                  | Login screen                                        |
| Authentication service unavailable | Clear error and retry option                        |

Navigation-level guards security ka replacement nahi hain. Backend ko har protected request par authorization verify karni hogi.

## 10. Back Navigation Rules

* Onboarding → Previous onboarding step, if applicable.
* Login / Sign Up → Previous public screen or appropriate authentication screen.
* World Learning Path → Explore.
* Lesson Player → Previous learning context; supported progress safely preserve ho.
* Coding Challenge → Calling screen or challenge list.
* Results → Next lesson, review, or learning path.
* Personal Details → Profile.
* Settings → Profile.
* Root screen par back action ke liye platform-appropriate behaviour.

Accidental exit ya unsaved coding work ke case mein confirmation sirf tab dikhayi jaye jab actual unsaved changes ka risk ho.

## 11. State Preservation

Navigation ke dauran:

* Lesson ka current step aur saved answers supported resume behaviour ke according preserve hon.
* Coding editor ka draft supported persistence policy ke according preserve ho.
* Tab switching lesson ko unnecessarily restart na kare.
* User progress backend ki authoritative state se reconcile ho.
* Network failure ke baad duplicate completion/reward requests safe tarike se handle hon.

Offline support ko guaranteed feature nahi maana jayega jab tak separate offline requirements define na hon.

## 12. Navigation Error States

* Unknown route → Safe fallback screen.
* Missing lesson/world → Clear unavailable message aur valid return action.
* Network failure → Retry option.
* Session expiry → Sign-in flow.
* Deleted/unpublished content → Safe fallback, no crash.
* Duplicate taps → Duplicate navigation/submission prevent karna where appropriate.

## 13. Acceptance Criteria

* [ ] Saare MVP screens ke entry aur exit paths documented hain.
* [ ] Bottom navigation ke paanch tabs correct destinations open karte hain.
* [ ] Core learning flow end-to-end work karta hai.
* [ ] Back navigation expected context restore karti hai.
* [ ] Login ke baad intended destination restore ho sakta hai.
* [ ] Protected data unauthorized access se secure hai.
* [ ] Locked content ke prerequisites clear hain.
* [ ] Lesson review se duplicate rewards nahi milte.
* [ ] Coding challenge errors aur failed tests correctly distinguish hote hain.
* [ ] Loading, network, missing-content aur expired-session states tested hain.
* [ ] Koi MVP navigation link dead end nahi banata.

## 14. Out of Scope

* Deep-link routing for every content type.
* Complex nested navigation stacks without product need.
* Social profiles and shared learning sessions.
* Web-based public course URLs.
* Cross-device offline conflict resolution.
* Advanced navigation analytics.

## 15. Dependencies

* Authentication and session management.
* Home, Explore, Learning Path, Lesson Player and Results screens.
* Coding Practice and Quests.
* Profile and Settings.
* Curriculum and progress rules.
* Selected platform and navigation library.

## 16. Definition of Done

Navigation specification tab complete mani jayegi jab all MVP flows, back behaviour, authentication guards, progress preservation aur error recovery implementation aur end-to-end tests ke liye clear hon.

---

**Next Document:** Screen 14 — Personal Details

Ismein profile editing, display name, email change restrictions aur account information update karne ka behaviour define karenge. Authentication provider ki capabilities ke bina unsupported account controls promise nahi kiye jayenge.

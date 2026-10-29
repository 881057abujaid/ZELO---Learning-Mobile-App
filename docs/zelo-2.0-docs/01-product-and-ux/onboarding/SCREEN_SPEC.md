# ZELO 2.0 — SCREEN_SPEC.md

## Screen 11: Onboarding

**Version:** 1.1
**Status:** Draft
**Module:** Onboarding
**Priority:** MVP — Must Have

---

## 1. Purpose

Onboarding first-time learners ko ZELO ka purpose samjhayega aur unhe learning journey start karne mein help karega.

**Primary goals:**

* ZELO kya hai aur kaise kaam karta hai, clearly explain karna.
* Complete beginners ko comfortable feel karwana.
* Account creation ya sign-in ka clear path dena.
* Learner ko HTML se shuru hone wale web-development curriculum tak pahunchana.
* Unnecessary setup aur lengthy forms avoid karna.

**Core principle:** Learner ko app explore karne se pehle unnecessary information bharne ke liye force nahi karna.

## 2. Target Audience

Onboarding un learners ke liye design hoga jo:

* Coding bilkul nahi jaante.
* Web development seekhna chahte hain.
* HTML, CSS, JavaScript aur React ka structured path follow karna chahte hain.
* Technical terminology se unfamiliar ho sakte hain.

Language simple, encouraging aur beginner-friendly honi chahiye.

## 3. Onboarding Flow

<box gap={2}>
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" size="44px" align="center" justify="center">
      <icon name="sparkles" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Step 1 — Welcome to ZELO**

```
  <text color="secondary" size="sm">Product introduction aur primary action.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" size="44px" align="center" justify="center">
      <icon name="route" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Step 2 — Your Learning Journey**

```
  <text color="secondary" size="sm">HTML → CSS → JavaScript → React ka short overview.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" size="44px" align="center" justify="center">
      <icon name="user-round" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Step 3 — Get Started**

```
  <text color="secondary" size="sm">Sign up, sign in, ya supported guest access.</text>
</box>
```

  </row>
  <divider color="subtle" />
  <row align="center" gap={3}>
    <box background="surface-secondary" radius="lg" size="44px" align="center" justify="center">
      <icon name="book-open" size="xl" />
    </box>
    <box flex="1" gap={1}>
      **Step 4 — Start Learning**

```
  <text color="secondary" size="sm">Learner ko first available HTML lesson par le jaana.</text>
</box>
```

  </row>
</box>

Yeh logical flow hai; implementation mein Welcome aur Learning Journey ko ek screen par combine kiya ja sakta hai. Unnecessary multi-screen onboarding avoid karna hai.

## 4. Screen Requirements

### A. Welcome Screen

**Content:**

* ZELO logo/wordmark.
* Tagline: **Learn. Practice. Build.**
* Short introduction: coding concepts seekho, interactive exercises solve karo aur practical challenges complete karo.
* Primary CTA: **Start Learning**
* Existing users ke liye secondary CTA: **I already have an account**

**Behaviour:**

* Start Learning → Learning Journey overview ya Get Started flow.
* Existing account → Login screen.
* Back navigation aur repeated taps safely handle hon.

### B. Learning Journey Overview

Learner ko curriculum ka short visual overview mile:

1. **HTML** — Web pages ki structure banana.
2. **CSS** — Web pages ko style karna.
3. **JavaScript** — Pages ko interactive banana.
4. **React** — Reusable UI components banana.

Har stage ke saath short description aur simple illustration/icon ho sakta hai.

**Rules:**

* Yeh overview hai, full curriculum browser nahi.
* React aur future stages ko available lessons se pehle playable show nahi karna.
* Learner ko kisi specific programming experience ka claim karne ke liye force nahi karna.
* Primary CTA: **Let's Begin**.

### C. Get Started

Learner ko available authentication options dikhaye jayen:

* Create Account.
* Sign In.
* Guest Mode — sirf tab jab guest progress aur later account linking properly supported hon.

Sign-up ke liye minimum required information hi maangi jaye. Exact fields authentication design document mein define honge.

Agar guest mode support nahi hota, toh uska button show nahi hoga.

### D. First Learning Session

Successful sign-up/sign-in ke baad:

* Learner ko Home Dashboard par le jaya ja sakta hai.
* Home par clear **Start Your First Lesson** CTA hoga.
* First lesson HTML curriculum ka pehla published lesson hoga.
* Learner ko Explore aur World Learning Path se bhi same lesson milna chahiye.

Isse onboarding aur learning navigation mein duplicate logic nahi banega.

## 5. Returning User Behaviour

Returning users ko onboarding dobara complete nahi karni hogi.

* Valid session → Home Dashboard.
* No valid session → Login screen.
* Incomplete onboarding → Sirf required step continue hoga.
* Existing progress → Preserve hoga.
* Reinstall ya device change ke baad progress restoration backend/account-sync capabilities par depend karegi.

## 6. UI States

* **First Visit:** Welcome content aur clear CTA.
* **Authentication Loading:** Loading indicator aur duplicate submissions disabled.
* **Authentication Success:** Home ya appropriate next screen.
* **Validation Error:** Relevant field ke paas understandable error.
* **Network Error:** Retry option; entered information unnecessarily discard nahi hogi.
* **Existing Account:** Login path provide hoga.
* **Completed Onboarding:** Unnecessary onboarding screens dobara show nahi hongi.

## 7. Visual Guidelines

* Existing ZELO light theme: ivory/white, violet accents, green positive states.
* Clean typography aur generous spacing.
* Simple illustrations; heavy animations ya complex 3D scenes nahi.
* Har screen par ek clear primary action.
* Onboarding indicators sirf tab jab multiple genuine steps hon.
* Text aur buttons mobile screen par readable aur accessible hon.

## 8. Data Requirements

Logical data requirements:

* Authentication/session status.
* Onboarding completion status, if needed.
* Curriculum availability and first published lesson.
* Existing learner progress.
* Guest progress and account-linking state, only if guest mode is implemented.

Final database schema abhi define nahi kiya ja raha.

## 9. Acceptance Criteria

* [ ] First-time learner ko ZELO ka purpose samajh aata hai.
* [ ] Curriculum order HTML → CSS → JavaScript → React hi hai.
* [ ] New learner minimum steps mein learning start kar sakta hai.
* [ ] Existing user directly sign-in kar sakta hai.
* [ ] Authentication errors clearly handle hote hain.
* [ ] Successful authentication ke baad correct destination open hota hai.
* [ ] Existing learner progress overwrite ya reset nahi hota.
* [ ] Unimplemented guest mode ya unavailable curriculum stages display nahi hote.
* [ ] Onboarding mobile devices aur accessibility requirements par tested hai.

## 10. Out of Scope

* Long personality quizzes.
* Mandatory skill assessment before the first lesson.
* AI-generated personalised curriculum.
* Avatar customisation.
* Detailed learning goals and scheduling wizard.
* Social account linking unless required by authentication.
* Multiple curriculum tracks in the initial release.

## 11. Dependencies

* Authentication and session management.
* Home Dashboard.
* Curriculum and lesson availability.
* Progress persistence.
* Login/Sign-up screen specifications.

## 12. Definition of Done

Onboarding complete tab mani jayegi jab a new learner welcome flow se authentication tak aur phir first available HTML lesson tak reliably pahunch sake, aur returning learner ka existing progress safe rahe.

---

**Next Document:** Screen 12 — Login & Sign Up

Ismein authentication methods, form validation, session behaviour, error handling aur account security define karenge. Iske baad hum screens ke beech ke navigation rules ko consolidate kar sakte hain.

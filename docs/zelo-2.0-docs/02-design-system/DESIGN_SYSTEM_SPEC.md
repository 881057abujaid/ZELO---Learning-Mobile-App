# ZELO 2.0 — DESIGN_SYSTEM_SPEC.md

## Screen 17: Design System & Reusable UI Components

**Version:** 1.7
**Status:** Draft
**Module:** Design System
**Priority:** MVP — Must Have

---

## 1. Purpose

ZELO 2.0 ke liye ek reusable visual system define karna, jo interface ko consistent, accessible aur maintainable rakhe.

**Design principles:**

* Simple, premium aur beginner-friendly.
* Learning content decoration se zyada important.
* Clear hierarchy aur ek prominent primary action.
* Reusable components, unnecessary abstractions nahi.
* Mobile-first layouts aur accessible interactions.

## 2. Visual Identity

**Product:** ZELO

**Tagline:** Learn. Practice. Build.

**Design direction:** Clean learning interface with restrained gamification.

### Colour Tokens

Initial palette direction:

| Token            | Intended use                             |
| ---------------- | ---------------------------------------- |
| `background`     | Main ivory/white page surface            |
| `surface`        | Cards and content panels                 |
| `text-primary`   | Main headings and body text              |
| `text-secondary` | Supporting descriptions                  |
| `primary`        | Violet primary actions and highlights    |
| `success`        | Green success states                     |
| `error`          | Validation and failure states            |
| `border`         | Subtle dividers and control boundaries   |
| `progress-track` | Incomplete progress indicator background |

Exact HEX values implementation se pehle contrast verification ke saath finalize honge. Colour token names illustrative hain; final naming convention chosen framework ke according consistent honi chahiye.

### Colour Usage Rules

* Violet primary action ke liye reserved rahe.
* Green completed/success states ke liye use ho.
* Error states clearly distinguish hon.
* Har card ko alag bright colour dena zaroori nahi.
* Essential meaning sirf colour se communicate nahi hoga.

## 3. Typography

Typography ka focus readability aur clear hierarchy hoga.

| Token     | Purpose                               |
| --------- | ------------------------------------- |
| Display   | Welcome screen ya rare major headings |
| Heading 1 | Screen title                          |
| Heading 2 | Section title                         |
| Heading 3 | Card/lesson title                     |
| Body      | Explanations and descriptions         |
| Label     | Buttons, fields and compact metadata  |
| Caption   | Supporting information                |
| Code      | Code editor and code examples         |

Rules:

* Limited font families use karna.
* Body text readable aur comfortably spaced ho.
* Long explanations mein excessive bold text avoid karna.
* Code ke liye monospace font use karna.
* Font sizes aur line heights shared tokens se manage hon.
* Platform text scaling ko unnecessarily restrict nahi karna.

Specific font family aur numerical type scale implementation se pehle select ki jayegi.

## 4. Spacing and Layout

Consistent spacing scale use hogi, for example:

* `space-1`
* `space-2`
* `space-3`
* `space-4`
* `space-6`
* `space-8`

In tokens ki exact values final design system mein define hongi.

Rules:

* Screen padding consistent rahe.
* Related elements paas aur unrelated sections visibly separated hon.
* Cards mein unnecessary nested containers avoid hon.
* Primary CTA ko sufficient breathing room mile.
* Mobile layouts par content naturally scroll kare.
* Fixed heights sirf specific, justified components ke liye use hon.

## 5. Shape, Borders and Elevation

ZELO ka interface simple cards aur restrained surfaces par based hoga.

* Cards ke corners moderately rounded ho sakte hain.
* Buttons aur inputs consistent shape follow karein.
* Borders subtle hon aur separation ke liye primarily use hon.
* Shadows limited hon.
* Har section ko separate floating card banane ki zaroorat nahi.
* Heavy glassmorphism, excessive gradients aur complex 3D surfaces avoid hon.

## 6. Reusable Components

<box gap={3}>
  <row align="start" gap={3}>
    <box width="104px" background="surface-secondary" radius="lg" padding={3} gap={2}>
      <box background="#7357E8" radius="md" padding={2} align="center">
        <text color="#FFFFFF" weight="medium" size="sm">Continue</text>
      </box>
      <box border radius="md" padding={2} align="center">
        <text size="sm">Secondary</text>
      </box>
    </box>
    <box flex="1" gap={1}>
      **Buttons**

```
  Primary, secondary, text/tertiary, disabled aur loading variants. Har button ka label aur action clear hona chahiye.
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box width="104px" background="surface" border radius="lg" padding={2} gap={2}>
      <box background="surface-secondary" radius="md" height="12px" />
      <box background="surface-secondary" radius="md" height="6px" width="70%" />
      <box background="surface-secondary" radius="full" height="5px" />
    </box>
    <box flex="1" gap={1}>
      **Cards**

```
  WorldCard, LessonCard, QuestCard aur ChallengeCard shared spacing aur typography use karenge, lekin har card apne purpose ke hisaab se content dikhayega.
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box width="104px" background="surface" border radius="lg" padding={3} gap={2}>
      <row align="center" justify="between">
        <text size="sm" weight="medium">Progress</text>
        <text size="xs" color="secondary">60%</text>
      </row>
      <box background="surface-secondary" height="7px" radius="full" clip>
        <box background="#7357E8" height="7px" radius="full" width="60%" />
      </box>
    </box>
    <box flex="1" gap={1}>
      **Progress Indicators**

```
  Progress bar, lesson step indicator aur completion state. Progress actual saved learning data se derive hogi.
</box>
```

  </row>
  <divider color="subtle" />
  <row align="start" gap={3}>
    <box width="104px" background="surface" border radius="lg" padding={2} gap={2}>
      <box border radius="md" padding={2}>
        <text size="sm">Choose an answer</text>
      </box>
      <box border={{size:1,color:"#7357E8"}} radius="md" padding={2}>
        <text size="sm">Selected option</text>
      </box>
    </box>
    <box flex="1" gap={1}>
      **Activity Controls**

```
  AnswerOption, SelectionGroup, FillBlankInput, ReorderItem aur FeedbackMessage reusable components honge.
</box>
```

  </row>
</box>

## 7. Component Inventory

### Navigation

* `AppHeader`
* `BottomNavigation`
* `BackButton`
* `ScreenContainer`

### Learning

* `WorldCard`
* `LessonCard`
* `LessonStepIndicator`
* `ProgressBar`
* `ContinueLearningCard`
* `QuestCard`
* `ChallengeCard`

### Activities

* `QuestionHeader`
* `AnswerOption`
* `SelectionGroup`
* `FillBlankInput`
* `ReorderActivity`
* `FeedbackMessage`
* `HintPanel`

### Feedback and States

* `LoadingState`
* `EmptyState`
* `ErrorState`
* `SuccessMessage`
* `ConfirmationDialog`

### Forms and Account

* `FormField`
* `PasswordField`
* `PrimaryButton`
* `SecondaryButton`

Yeh proposed inventory hai, final file structure nahi. Similar components ko merge kiya ja sakta hai agar unke behaviours genuinely same hon.

## 8. Component Design Rules

Har reusable component ke liye define hona chahiye:

* Purpose.
* Required and optional props.
* Supported visual states.
* Interaction behaviour.
* Accessibility requirements.
* Responsive behaviour.
* Error/loading behaviour, where relevant.

Components mein unnecessary configuration props nahi add karne hain. Abstraction tabhi create hogi jab reuse ya maintainability ka real benefit ho.

## 9. Interaction States

Interactive components ko relevant states support karni hongi:

* Default.
* Pressed/active.
* Focused, where applicable.
* Selected.
* Disabled.
* Loading.
* Success.
* Error.

Har component ko har state support karna zaroori nahi; sirf applicable states implement hongi.

## 10. Illustration and Iconography

* Simple, consistent illustrations.
* World illustrations curriculum topics se relevant hon.
* Icons clear meaning convey karein.
* Decorative imagery essential information ko replace nahi karegi.
* Image loading failure par appropriate fallback ho.
* Unnecessary animation aur large decorative assets avoid hon.

## 11. Accessibility Integration

* Text contrast applicable WCAG AA targets meet kare.
* Buttons aur inputs accessible names provide karein.
* Touch targets comfortable hon.
* Focus indicators visible hon.
* Disabled aur selected states distinguishable hon.
* Activity components keyboard aur supported assistive technologies ke liye usable hon.
* Motion restrained ho aur supported reduced-motion preferences respect hon.

## 12. Design Tokens and Implementation

Design tokens ek central source se maintain honge.

Illustrative categories:

* Colour tokens.
* Typography tokens.
* Spacing tokens.
* Radius tokens.
* Border tokens.
* Elevation tokens.
* Animation duration tokens, if needed.

Token values ko individual screens mein unnecessarily hardcode nahi karna hai.

Exact token format aur storage location selected platform aur styling approach decide hone ke baad finalize hogi.

## 13. Acceptance Criteria

* [ ] Core screens shared typography aur spacing rules follow karti hain.
* [ ] Primary and secondary actions visually consistent hain.
* [ ] World, Lesson, Quest aur Challenge cards reusable patterns follow karte hain.
* [ ] Activity controls consistent validation aur feedback provide karte hain.
* [ ] Loading, empty aur error states reusable patterns use karte hain.
* [ ] Design tokens centralized hain.
* [ ] Colour contrast aur accessibility requirements tested hain.
* [ ] Components responsive hain.
* [ ] Duplicate components bina justified reason ke create nahi kiye gaye.
* [ ] Design system unnecessary abstraction ya configuration complexity introduce nahi karta.

## 14. Out of Scope

* Full theme editor.
* User-customizable colours and fonts.
* Multiple visual themes in the initial release.
* Complex motion-design framework.
* Large component library without product need.
* 3D environment and advanced visual effects.
* Separate design systems for each curriculum world.

## 15. Dependencies

* Screen specifications.
* Accessibility requirements.
* Selected mobile/web framework.
* Final typography and colour palette.
* Reusable component inventory.
* Coding editor and activity component requirements.

## 16. Definition of Done

Design system tab ready mani jayegi jab core tokens, reusable component contracts aur accessibility rules documented hon aur implementation team unhe consistently apply kar sake.

---

**Next Document:** Screen 18 — Content Model & Curriculum Structure

Ismein hum define karenge ki Worlds, Lessons, Steps, Activities aur Coding Challenges ko kis logical structure mein organize kiya jayega, taaki content badhne par har lesson ko manually hardcode na karna pade.

# ZELO 2.0 — ACCESSIBILITY_RESPONSIVE_SPEC.md

## Screen 16: Accessibility & Responsive UI Requirements

**Version:** 1.6
**Status:** Draft
**Module:** Accessibility & Responsive Design
**Priority:** MVP — Must Have

---

## 1. Purpose

ZELO 2.0 ko aise design aur implement karna hai ki learners different devices, screen sizes aur interaction methods ke saath comfortably use kar saken.

Accessibility ko final polish nahi, balki core product requirement maana jayega.

**Primary goals:**

* Readable text aur understandable interactions.
* Accessible buttons, forms, quizzes aur coding activities.
* Small-screen devices par reliable layouts.
* Consistent visual hierarchy.
* Assistive technologies ke saath basic compatibility.

## 2. Responsive Design Strategy

ZELO ka primary design target mobile-first hoga.

### Supported Layouts

| Layout                    | Expected behaviour                                                       |
| ------------------------- | ------------------------------------------------------------------------ |
| Small mobile              | Single-column layout; compact spacing                                    |
| Standard mobile           | Full primary experience                                                  |
| Tablet                    | More available space, without unnecessary extra panels                   |
| Desktop/Web, if supported | Comfortable content width; optional side-by-side editor and instructions |

Exact breakpoint values frontend implementation mein selected UI framework ke according define honge.

### Responsive Rules

* Horizontal scrolling avoid karna, except intentionally designed code/editor regions.
* Important actions screen ke visible area mein reasonably accessible hon.
* Content height ke basis par naturally scroll kare.
* Bottom navigation device safe areas aur keyboard visibility respect kare.
* Fixed-height containers text clipping cause nahi karenge.
* Dialogs small screens par usable rahenge.
* Landscape orientation mein essential controls inaccessible nahi hone chahiye.

## 3. Typography and Readability

* Body text comfortable reading size mein ho; mobile par generally 16 CSS px ek useful starting point hai.
* Headings clear hierarchy follow karein.
* Text resizing aur system font scaling supported honi chahiye where platform permits.
* Long explanations ko readable paragraphs aur short sections mein divide karein.
* Code font monospace ho aur indentation preserve ho.
* Error messages aur hints readable aur specific hon.
* Sirf colour ya font weight ke through essential information convey na karein.

## 4. Colour and Contrast

ZELO ka visual direction ivory/white surfaces, violet primary accents aur green positive states hai.

Accessibility requirements:

* Normal text ke liye WCAG AA contrast target: at least **4.5:1**.
* Large text ke liye target: at least **3:1**.
* Essential interface controls, boundaries aur visual indicators ke liye applicable non-text contrast target: **3:1**.
* Disabled controls ko understandable rakhein, lekin unhe active controls jaisa present na karein.
* Correct/incorrect answers ko colour ke saath text, icon ya other visual cue se distinguish karein.
* Actual colour combinations ko implementation ke dauran contrast-check karna hoga.

Colour palette ki aesthetic preference accessibility requirements ko override nahi karegi.

## 5. Touch Targets and Interaction

* Primary actions easy to tap hon.
* Mobile touch targets ke liye approximately **44 × 44 CSS px** ek useful design target hai; platform-specific guidance aur spacing bhi consider ki jayegi.
* Interactive elements ke beech accidental taps reduce karne ke liye sufficient spacing ho.
* Icons-only controls ke accessible labels hon.
* Tap feedback clear ho.
* Critical action sirf hover par depend nahi karega.
* Drag-and-drop activities ke liye non-drag alternative available hoga, jaise item select karna aur destination choose karna.

## 6. Keyboard and Focus Accessibility

Jahan keyboard input applicable hai, particularly web/desktop interfaces mein:

* Interactive elements logical tab order follow karein.
* Visible focus indicator available ho.
* Keyboard se primary actions perform kiye ja saken.
* Modal dialogs focus ko appropriately manage karein.
* Modal close hone par focus appropriate originating control par return ho.
* Coding editor ke keyboard shortcuts normal navigation ko unnecessarily block na karein.
* Focus indicator sirf colour change tak limited na ho.

Mobile interfaces par relevant platform accessibility behaviours bhi follow honge.

## 7. Screen Reader Support

* Buttons aur interactive elements ke meaningful accessible names hon.
* Form fields ke labels aur validation messages correctly associated hon.
* Loading, success aur error state changes appropriately announce kiye ja saken.
* Progress bars ke accessible values hon, where applicable.
* Decorative illustrations assistive technology se hide ki ja sakti hain.
* Meaningful images ke appropriate descriptions hon.
* Bottom navigation ke selected states announce hon.
* Lesson activity options, selection aur correctness understandable form mein expose hon.

Implementation mein platform ke native accessibility APIs aur semantics use kiye jayenge.

## 8. Learning Activity Accessibility

### MCQ and Multiple Select

* Har option keyboard aur supported assistive input se select ho sake.
* Selected aur disabled states clearly identify hon.
* Feedback text ke through bhi communicate ho.

### Drag and Reorder

* Dragging ke bina reorder karne ka alternative ho.
* Current order understandable ho.
* Final order submit karne se pehle review kiya ja sake.

### Fill in the Blank

* Inputs ke labels aur instructions available hon.
* Keyboard visible hone par submit controls accessible rahen.
* Validation messages input ke saath associated hon.

### Coding Challenges

* Instructions aur code editor visually distinct hon.
* Code font readable ho aur indentation preserve ho.
* Editor focus aur keyboard behaviour predictable ho.
* Run, Submit aur output status clearly labelled hon.
* Execution errors ko sirf red colour se represent na kiya jaye.

## 9. Motion and Animation

ZELO simple, restrained motion use karega.

* Essential information animations par depend nahi karegi.
* Reward animations short aur non-blocking hongi, if implemented.
* Reduced-motion preferences ko supported platforms par respect kiya jayega.
* Excessive bouncing, flashing aur continuous decorative movement avoid hoga.
* Animation ke complete hone ka wait kiye bina learner essential actions perform kar sake.

## 10. Forms and Error Handling

* Har field ka clear label ho.
* Placeholder ko label ka replacement nahi maana jayega.
* Required fields identifiable hon.
* Validation message error explain kare aur next action suggest kare.
* Failed submission ke baad entered data unnecessarily clear na ho.
* Error summary aur field-level feedback accessible hon.
* Form completion sirf colour-based state par depend nahi karegi.

## 11. Coding and Reading Experience

* Long lesson content naturally scroll kare.
* Code blocks horizontal scrolling support kar sakte hain, without forcing the entire screen to scroll horizontally.
* Code wrapping behaviour language aur activity requirements ke according select ho.
* Syntax highlighting readable contrast maintain kare.
* Code output, test failures aur success state clearly separate hon.
* Mobile par instructions aur editor ko manageable layout mein present kiya jaye.
* Narrow screens par editor controls unnecessarily compress na hon.

## 12. Accessibility Testing

Release testing mein include hon:

* Text scaling.
* Contrast verification.
* Screen reader smoke tests.
* Keyboard-only navigation where applicable.
* Focus visibility and order.
* Touch target usability.
* Drag alternatives.
* Form error announcements.
* Small-screen and landscape testing.
* Reduced-motion behaviour where supported.

Automated accessibility checks helpful hain, lekin manual testing ka replacement nahi.

## 13. Acceptance Criteria

* [ ] Primary mobile screens small viewports par usable hain.
* [ ] Important content clipping ya accidental horizontal scrolling cause nahi karta.
* [ ] Text resizing supported hai where platform permits.
* [ ] Required text aur interface contrast targets verify kiye gaye hain.
* [ ] Buttons aur inputs meaningful accessible labels provide karte hain.
* [ ] Focus indicators aur keyboard navigation supported interfaces par work karte hain.
* [ ] Activity feedback colour ke alawa bhi communicate hota hai.
* [ ] Drag-and-drop activities ke alternatives available hain.
* [ ] Loading, progress aur error updates accessible hain.
* [ ] Reduced-motion preferences relevant platforms par respected hain.
* [ ] Critical learning flows accessibility testing pass karte hain.

## 14. Out of Scope

* Full translation/localisation of the curriculum.
* Dedicated dyslexia font mode.
* Custom colour-theme builder.
* Advanced voice navigation.
* Specialised assistive-device integrations beyond supported platform capabilities.
* Formal third-party accessibility certification.

In items ko future user needs aur testing evidence ke basis par evaluate kiya ja sakta hai.

## 15. Dependencies

* Design system and typography.
* Shared UI components.
* Activity and coding editor implementations.
* Selected mobile/web framework.
* Accessibility testing tools.
* Supported platform capabilities.

## 16. Definition of Done

Accessibility and responsive requirements tab complete mani jayengi jab critical MVP screens supported device sizes par usable hon, accessibility checks pass karein aur core learning activities keyboard, touch aur supported assistive technologies ke saath reasonably accessible hon.

---

**Next Document:** Screen 17 — Design System & Reusable UI Components

Ismein hum colours, typography, spacing, buttons, cards, progress indicators, activity controls aur shared component rules define karenge, taaki ZELO ki saari screens ek consistent design language follow karein.

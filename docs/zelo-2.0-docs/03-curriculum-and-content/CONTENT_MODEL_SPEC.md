# ZELO 2.0 — CONTENT_MODEL_SPEC.md

## Screen 18: Content Model & Curriculum Structure

**Version:** 1.8
**Status:** Draft
**Module:** Curriculum & Learning Content
**Priority:** MVP — Must Have

---

## 1. Purpose

ZELO 2.0 ke learning content ko ek consistent, reusable aur maintainable structure mein organize karna.

Content model define karega ki curriculum kis hierarchy mein store hoga aur Lesson Player us content ko kaise display karega.

**Primary goals:**

* HTML, CSS, JavaScript aur React ko structured learning path mein organize karna.
* Explanations, examples, quizzes aur coding challenges support karna.
* Content aur UI implementation ko separate rakhna.
* Lesson progress aur prerequisites consistently manage karna.
* Future curriculum expansion ko unnecessary code changes ke bina support karna.

## 2. Curriculum Hierarchy

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **Curriculum**
    <text color="secondary" size="sm">Complete Web Development Path</text>
  </box>
  <icon name="arrow-down" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **World**
    <text color="secondary" size="sm">HTML, CSS, JavaScript or React</text>
  </box>
  <icon name="arrow-down" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Module / Topic**
    <text color="secondary" size="sm">A group of related concepts</text>
  </box>
  <icon name="arrow-down" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Lesson**
    <text color="secondary" size="sm">One focused learning objective</text>
  </box>
  <icon name="arrow-down" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Lesson Steps**
    <text color="secondary" size="sm">Explanation, examples and activities</text>
  </box>
</box>

Coding Challenges ko Lesson Steps ke andar include kiya ja sakta hai ya standalone practice ke liye publish kiya ja sakta hai.

## 3. Initial Curriculum

ZELO 2.0 ka initial curriculum sirf web development par focused rahega.

| Order | World                | Primary Content |
| ----- | -------------------- | --------------- |
| 1     | Frontend Foundations | HTML            |
| 2     | Styling Studio       | CSS             |
| 3     | JavaScript Lab       | JavaScript      |
| 4     | React World          | React           |

Har world ke andar modules/topics aur lessons honge.

**Important:** Exact lesson count abhi fixed nahi hai. Content review aur curriculum planning ke baad hi lesson count finalize hoga.

React World future curriculum stage hai; use fully available mark nahi kiya jayega jab tak uska actual content publish na ho.

## 4. World Content Model

Har World ke logical fields:

* `id` — Stable unique identifier.
* `slug` — URL/navigation-friendly identifier, where applicable.
* `title` — Display name.
* `description` — Short explanation.
* `order` — Curriculum sequence.
* `imageRef` — Optional illustration reference.
* `status` — Draft, Published or Archived.
* `prerequisites` — Required previous learning units, if applicable.

World progress learner-specific data se derive hogi; static world content mein user progress hardcode nahi hogi.

## 5. Module / Topic Content Model

Module related lessons ko group karega.

Logical fields:

* `id`
* `worldId`
* `title`
* `description`
* `order`
* `status`

Example for HTML:

* Introduction to HTML
* Elements and Tags
* Headings and Paragraphs
* Links and Images
* Lists
* Forms and Semantic HTML

Yeh example topic groups hain, finalized curriculum nahi. Exact sequence learning objectives aur prerequisite requirements ke basis par refine hogi.

## 6. Lesson Content Model

Har lesson ek clearly defined learning objective par focused hoga.

Logical fields:

* `id`
* `moduleId`
* `title`
* `description`
* `order`
* `learningObjectives`
* `estimatedDuration`, if useful
* `status`
* `prerequisites`, where required
* `completionCriteria`
* `contentVersion`

Estimated duration learner ko rough guidance degi; lesson completion timer par dependent nahi hogi.

### Lesson Completion

Lesson complete tab hoga jab uske configured required steps aur activities successfully satisfy ho jayen.

* Optional activities completion ko block nahi karengi.
* Required assessments ko bypass nahi kiya jayega.
* Review mode se duplicate completion reward nahi milega.
* Published content mein changes existing learner progress ko silently invalidate nahi karne chahiye.

## 7. Lesson Step Types

Lesson Player ko ek shared step format support karna chahiye.

| Step Type            | Purpose                                       |
| -------------------- | --------------------------------------------- |
| `explanation`        | Concept ko simple language mein explain karna |
| `example`            | Concept ka worked example dikhana             |
| `tip`                | Short practical advice                        |
| `single_choice`      | Ek correct option select karna                |
| `multiple_select`    | Multiple correct options select karna         |
| `reorder`            | Items ko correct sequence mein arrange karna  |
| `fill_blank_options` | Options se missing value choose karna         |
| `fill_blank_typed`   | Missing value type karna                      |
| `coding_challenge`   | Code likhna aur evaluate karna                |

Step types content ke logical identifiers hain. Final naming convention implementation ke waqt consistent rakhi jayegi.

### Common Step Fields

* `id`
* `lessonId`
* `type`
* `order`
* `title`, if applicable
* `content`
* `required`
* `configuration`, specific to step type

Har type ki configuration validated honi chahiye. Unsupported step type ko silently ignore nahi kiya jayega.

## 8. Activity Content Requirements

### Explanations

* Beginner-friendly language.
* One main concept per step, where practical.
* Clear headings and concise paragraphs.
* Code examples ke saath expected output ya explanation where relevant.

### Quizzes

* Clear question.
* Defined answer options.
* Correct answer and deterministic validation rules.
* Feedback for correct and incorrect responses.
* Optional hint.
* Accessible interaction alternative.

### Coding Challenges

* Clear problem statement.
* Starter code where required.
* Expected behaviour.
* Evaluation criteria.
* Test configuration.
* Hint, if available.

Learner ko hidden test cases ya secret evaluation logic expose nahi karni hai.

## 9. Content Versioning and Publishing

Content lifecycle:

**Draft → Review → Published → Archived**

Rules:

* Draft content normal learners ko visible nahi hoga.
* Only validated content publish hoga.
* Published content ke stable identifiers preserve honge.
* Existing learner progress ko content edits ke through accidentally reset nahi karna hai.
* Breaking changes ke liye explicit migration/versioning policy honi chahiye.
* Archived content ko new learners ke liye unavailable kiya ja sakta hai, while existing progress/history ko policy ke according preserve kiya jayega.

Initial MVP mein complex content-authoring platform zaroori nahi. Content files aur a simple seed/import workflow sufficient ho sakta hai, provided validation aur publishing rules follow hon.

## 10. Prerequisites and Unlocking

Unlock rules curriculum relationships par based honge.

* First published HTML lesson initial starting point hoga.
* A lesson prerequisite ke complete hone par unlock ho sakta hai.
* World unlocking ka exact rule curriculum plan mein define hoga.
* XP mandatory learning prerequisites ka replacement nahi hoga.
* Locked content ke liye user ko reason samajh aana chahiye.
* Optional content aur mandatory content clearly distinguish hon.

## 11. Learner Progress Separation

Content definitions aur learner progress separate concerns hain.

**Content data** batata hai lesson mein kya padhaya jayega.

**Learner progress** batata hai ki particular learner ne kya complete kiya.

Logical learner progress fields:

* `userId`
* `lessonId`
* `status`
* `currentStepId`, if resumable step tracking is supported
* `completedAt`
* `contentVersion`
* `updatedAt`

Activity answers aur coding drafts ke liye additional records required ho sakte hain.

Yeh conceptual model hai, final database schema nahi.

## 12. Content Validation

Publish/import se pehle checks:

* Required fields present hon.
* IDs unique hon.
* Order values valid hon.
* Referenced world, module aur lesson exist karte hon.
* Prerequisite references valid hon.
* Circular prerequisite dependencies na hon.
* Step types supported hon.
* Activity configuration required structure follow kare.
* Coding challenge ke evaluation rules configured hon.
* Lesson completion criteria achievable hon.
* Published content ke required assets accessible hon.

Invalid content ko learner-facing app mein silently load nahi karna chahiye.

## 13. Acceptance Criteria

* [ ] Four initial worlds defined hain.
* [ ] Curriculum hierarchy consistent hai.
* [ ] Lessons ordered aur identifiable hain.
* [ ] Lesson Player reusable step types support karta hai.
* [ ] Content definitions aur learner progress separate hain.
* [ ] Prerequisites explicitly defined hote hain.
* [ ] Draft content normal learners ko visible nahi hota.
* [ ] Content validation invalid definitions detect karti hai.
* [ ] Published content updates existing progress ko silently corrupt nahi karte.
* [ ] Coding challenge evaluation criteria explicit hain.
* [ ] New lessons add karne ke liye unnecessary UI duplication nahi hoti.

## 14. Out of Scope

* User-generated courses.
* AI-generated curriculum.
* Visual drag-and-drop course authoring tool.
* Multi-language curriculum management platform.
* Advanced adaptive learning engine.
* Public course marketplace.
* Collaborative course editing.
* Complex branching curriculum graphs.

## 15. Dependencies

* Lesson Player.
* Interactive Activities.
* Coding Practice.
* World Learning Path.
* Progress tracking.
* Content validation and publishing workflow.
* Backend/data architecture.

## 16. Definition of Done

Content model tab ready mana jayega jab curriculum hierarchy, supported step types, validation, publishing lifecycle aur learner progress separation implementation ke liye clear hon.

---

**Next Document:** Screen 19 — Progress Tracking & XP Rules

Ismein hum lesson completion, XP awards, retries, duplicate rewards, world progress aur learner stats ke rules define karenge, taaki Home, Profile, Quests aur Results par progress hamesha consistent rahe.

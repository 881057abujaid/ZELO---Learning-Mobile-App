# ZELO 2.0 — SCREEN_SPEC.md

## Screen 12: Login & Sign Up

**Version:** 1.2
**Status:** Draft
**Module:** Authentication
**Priority:** MVP — Must Have

---

## 1. Purpose

Authentication system learners ko securely account create karne, sign in karne aur apni learning progress access karne dega.

**Primary goals:**

* Simple account creation.
* Reliable sign-in and sign-out.
* Learner progress ko correct account se associate karna.
* Authentication errors ko clearly communicate karna.
* Credentials aur sessions ko securely handle karna.

## 2. Authentication Scope

MVP mein authentication provider aur exact implementation abhi open decisions hain.

Supported options ko evaluate karne ke baad ek primary authentication approach select ki jayegi.

**Initial requirements:**

* Email-based registration and sign-in.
* Secure session management.
* Email verification, if required by the chosen provider.
* Password reset, if password-based authentication is selected.
* Sign-out.
* Protected access to user-specific progress and profile information.

Google sign-in, multiple social providers aur guest-account linking tabhi add honge jab unki clear product requirement aur implementation support ho.

## 3. Login Screen

### UI Elements

* ZELO wordmark.
* Heading: **Welcome Back**
* Short description: Continue your learning journey.
* Email field.
* Password field, for password-based authentication.
* Password visibility toggle.
* Primary button: **Sign In**
* Link: **Forgot Password?**, if supported.
* Link: **Create Account**

### Behaviour

* Valid credentials par authenticated session establish hoga.
* Successful login ke baad user ko intended destination par bheja jayega.
* Agar user protected lesson open karte waqt login par aaya tha, toh successful login ke baad us lesson par return karna preferred behaviour hoga.
* Agar koi intended destination nahi hai, toh Home Dashboard open hoga.
* Already-authenticated users ko login screen par unnecessarily rokna nahi hai.

## 4. Sign-Up Screen

### UI Elements

* Heading: **Create Your Account**
* Display name, if required.
* Email address.
* Password, if password-based authentication is selected.
* Password confirmation sirf tab jab chosen implementation mein useful ho.
* Terms/privacy acknowledgement, where legally required.
* Primary button: **Create Account**
* Link: **Already have an account? Sign In**

### Behaviour

* Required fields validate honge.
* Invalid email format par clear field-level message show hoga.
* Password rules chosen authentication provider ke requirements ke according hongi.
* Duplicate registration par safe, understandable response milega.
* Successful registration ke baad provider requirements ke according verification ya authenticated destination open hoga.
* Registration ke dauran existing learning progress overwrite nahi hogi.

**Important:** Password ko plaintext mein store ya log nahi kiya jayega. Agar authentication provider password storage manage karta hai, toh uske secure, documented flow ka use hoga.

## 5. Form Validation

Validation client aur server dono taraf honi chahiye.

| Condition                  | Expected behaviour                            |
| -------------------------- | --------------------------------------------- |
| Required field empty       | Field-level validation message                |
| Invalid email format       | Email correction prompt                       |
| Invalid credentials        | Generic sign-in error                         |
| Weak password              | Applicable password requirement explain karna |
| Network failure            | Retry option                                  |
| Request already processing | Duplicate submission prevent karna            |
| Session expired            | Re-authentication flow                        |
| Rate limit reached         | Safe retry guidance                           |

Authentication errors aise detailed internal messages expose nahi karenge jo attackers ko account enumeration ya system details discover karne mein help karein.

## 6. Password Reset

Agar password-based authentication select hoti hai, toh password reset flow mein:

1. User email enter karega.
2. System reset request securely process karega.
3. User ko appropriate confirmation message milega.
4. Reset link/token secure aur time-limited hoga.
5. Expired ya invalid reset links handle honge.
6. Password update hone ke baad session behaviour authentication provider ki security policy follow karega.

Password reset ko implemented aur tested kiye bina **Forgot Password?** link visible nahi hona chahiye.

## 7. Session Management

* Authenticated session securely persist hoga according to the chosen platform and provider.
* Protected API requests server-side authentication verify karengi.
* Expired session ke baad safe re-authentication hoga.
* Sign-out ke baad protected data access block hona chahiye.
* Authentication state app restart ke baad correctly restore honi chahiye, where supported.
* Session tokens ko insecure local storage ya logs mein expose nahi karna hai.
* Sign-out ke baad cached user-specific data ko appropriate policy ke according clear ya isolate karna hoga.

## 8. UI States

**Idle:** Form ready for input.

**Validating:** Required fields aur input format check ho rahe hain.

**Submitting:** Loading indicator; repeated submission disabled.

**Success:** Correct destination par navigation.

**Validation Error:** Relevant field ke paas actionable message.

**Authentication Error:** Safe, understandable error message.

**Network Error:** Retry option aur entered values ka reasonable preservation.

**Email Verification Pending:** Verification instructions aur resend option, if supported.

**Session Expired:** Sign-in flow par return.

## 9. Security and Privacy Requirements

* Passwords plaintext mein store nahi honge.
* Authentication secrets source code, client bundle ya logs mein expose nahi honge.
* Server-side protected routes aur user-specific resources authorize honge.
* Input validation server par bhi hogi.
* Login aur reset endpoints appropriate rate limiting use karenge.
* Tokens aur reset links secure lifecycle follow karenge.
* User A kisi bhi request manipulation ke through User B ka profile ya progress access nahi kar sakega.
* Authentication failure messages unnecessary account information reveal nahi karenge.
* Privacy policy aur data handling documentation available honi chahiye.

## 10. Data Requirements

Logical requirements:

* Authenticated user identifier.
* Email verification state, if applicable.
* Session/authentication state.
* Display name, if collected.
* Password-reset state, only if applicable.
* User progress ke saath stable account association.

Authentication provider ke managed records aur application-owned profile data ko clearly separate rakha jayega. Final database schema implementation planning mein define hoga.

## 11. Acceptance Criteria

* [ ] New learner supported registration flow complete kar sakta hai.
* [ ] Existing learner securely sign in kar sakta hai.
* [ ] Invalid inputs par understandable validation hoti hai.
* [ ] Duplicate submissions prevent hoti hain.
* [ ] Successful login ke baad correct destination open hota hai.
* [ ] Protected APIs unauthenticated requests reject karti hain.
* [ ] User-specific data server-side authorization se protected hai.
* [ ] Session expiry aur sign-out correctly handle hote hain.
* [ ] Password reset aur email verification links sirf tab visible hain jab flows implemented hon.
* [ ] Sensitive credentials aur tokens logs mein expose nahi hote.
* [ ] Network failures aur authentication errors tested hain.

## 12. Out of Scope

* Multiple social-login providers.
* Custom identity-provider infrastructure without a clear need.
* Multi-factor authentication UI beyond provider requirements.
* Organization/team accounts.
* Role-based admin dashboards.
* Subscription and billing.
* Advanced device/session management dashboard.
* Biometric login unless separately justified.

## 13. Dependencies

* Selected authentication provider.
* Backend authorization and session validation.
* Profile management.
* Onboarding navigation.
* Progress persistence.
* Privacy and data-retention requirements.

## 14. Definition of Done

Authentication module tab complete mani jayegi jab registration, login, supported recovery flow, session restoration, sign-out aur protected-resource authorization end-to-end tested hon.

---

**Next Document:** Screen 13 — Navigation & App Flow

Is document mein hum Home, Explore, Learning Path, Lesson Player, Coding Practice, Quests, Profile aur Authentication ke beech complete navigation map define karenge, taaki implementation ke dauran screens ke flow mein confusion na ho.

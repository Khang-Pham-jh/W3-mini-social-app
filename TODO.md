Based on the current repo and the visible scope in `react-mini-social-app/Estimation_Sheet.html:1`, this is the practical checklist.

**Legend**

- `[x]` done
- `[~]` started but incomplete
- `[ ]` not done yet

**Current Status**

- `[x]` Project scaffold exists with Vite/React scripts and deps in `react-mini-social-app/package.json:1`
- `[x]` App bootstraps correctly at `react-mini-social-app/src/main.jsx:1`
- `[x]` Supabase client scaffold exists in `react-mini-social-app/src/libs/supabase.js:1`
- `[x]` Auth page is wired as the current entry screen in `react-mini-social-app/src/App.jsx:1` and `react-mini-social-app/src/features/auth/pages/AuthPage.jsx:1`
- `[~]` Signup UI skeleton exists in `react-mini-social-app/src/features/auth/components/SignupForm.jsx:1`
- `[~]` Login UI skeleton exists in `react-mini-social-app/src/features/auth/components/LoginForm.jsx:2`
- `[x]` Position options are defined in `react-mini-social-app/src/features/auth/constants/positions.js:1`
- `[ ]` Validation helpers are not implemented in `react-mini-social-app/src/shared/utils/validation.js`
- `[ ]` Route constants are not implemented in `react-mini-social-app/src/shared/constants/route.js`
- `[ ]` Shared `Button` and `Input` components are not implemented in `react-mini-social-app/src/shared/components/Button.jsx` and `react-mini-social-app/src/shared/components/Input.jsx`

**Auth Checklist**

- `[ ]` Add form state: `signupFormData`, `loginFormData`
- `[ ]` Add error state: `signupErrors`, `loginErrors`
- `[ ]` Add auth state: `currentUser`, `isLoggedIn`
- `[ ]` Implement `validateSignupForm()`, `validateLoginForm()`, email/password/required checks
- `[ ]` Implement signup submit flow and duplicate-email handling
- `[ ]` Implement login submit flow and credential checking
- `[ ]` Connect auth state to UI and navigation
- `[ ]` Fix `LoginForm` export/runtime issue in `react-mini-social-app/src/features/auth/components/LoginForm.jsx:2`

**Everything After Auth**

- `[ ]` Top bar / sidebar responsive navigation
- `[ ]` Protected homepage/feed
- `[ ]` Post list, pagination/infinite scroll
- `[ ]` User preview popup and profile navigation
- `[ ]` Hide/archive post flow
- `[ ]` Post creation flow with image upload
- `[ ]` Tests for auth/storage/state flows
- `[ ]` Production deploy flow

**What To Do Next**

- `[ ]` 1. Finish auth foundation: state, validation, route constants
- `[ ]` 2. Make signup work end-to-end
- `[ ]` 3. Make login work end-to-end
- `[ ]` 4. Add auth-aware navigation
- `[ ]` 5. Build protected homepage/feed
- `[ ]` 6. Add post creation and remaining social features
- `[ ]` 7. Add tests and deployment polish

If you want, I can turn this into a `TODO.md` inside `react-mini-social-app` and order it by implementation priority.

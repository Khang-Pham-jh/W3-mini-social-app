**Recommended Tree**

```text
react-mini-social-app/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.jsx
│   │   │   └── AppProviders.jsx
│   │   ├── routes/
│   │   │   ├── AppRouter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── routePaths.js
│   │   └── styles/
│   │       ├── index.css
│   │       ├── variables.css
│   │       └── utilities.css
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── AuthCard.jsx
│   │   │   │   └── PositionSelect.jsx
│   │   │   ├── pages/
│   │   │   │   └── AuthPage.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLoginForm.js
│   │   │   │   └── useSignupForm.js
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   ├── utils/
│   │   │   │   └── authValidation.js
│   │   │   ├── constants/
│   │   │   │   └── positions.js
│   │   │   └── types/
│   │   │       └── auth.types.js
│   │   ├── feed/
│   │   │   ├── components/
│   │   │   │   ├── PostList.jsx
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── UserPreviewPopup.jsx
│   │   │   │   └── RoleBadge.jsx
│   │   │   ├── pages/
│   │   │   │   └── HomePage.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useFeed.js
│   │   │   ├── services/
│   │   │   │   ├── postService.js
│   │   │   │   └── hiddenPostService.js
│   │   │   └── utils/
│   │   │       └── feedMapper.js
│   │   ├── post-create/
│   │   │   ├── components/
│   │   │   │   ├── CreatePostForm.jsx
│   │   │   │   ├── ImagePicker.jsx
│   │   │   │   └── EmojiPickerTrigger.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useCreatePost.js
│   │   │   ├── services/
│   │   │   │   ├── createPostService.js
│   │   │   │   └── uploadPostImageService.js
│   │   │   └── utils/
│   │   │       └── postValidation.js
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   └── navigation/
│   │       ├── components/
│   │       │   ├── Topbar.jsx
│   │       │   ├── Sidebar.jsx
│   │       │   └── NavItem.jsx
│   │       ├── hooks/
│   │       │   └── useNavigation.js
│   │       └── utils/
│   │           └── navItems.js
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   └── useToggle.js
│   │   ├── utils/
│   │   │   ├── validation.js
│   │   │   ├── formatDate.js
│   │   │   └── helpers.js
│   │   ├── constants/
│   │   │   ├── route.js
│   │   │   ├── appConfig.js
│   │   │   └── errorMessages.js
│   │   └── layouts/
│   │       ├── MainLayout.jsx
│   │       └── AuthLayout.jsx
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.js
│   │   │   ├── authApi.js
│   │   │   ├── postApi.js
│   │   │   └── userApi.js
│   │   └── storage/
│   │       └── localStorageService.js
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── .env.example
├── package.json
├── README.md
└── TODO.md
```

**Why This Fits**

- Use `features/` for business modules, so auth/feed/profile stay isolated.
- Use `shared/` only for truly reusable UI and helpers.
- Keep API calls in `services/`, not inside components.
- Keep page components thin; move logic into hooks and services.
- Keep each function single-purpose: validate, fetch, map, submit, redirect.

**Rules**

- `components/`: render UI only.
- `hooks/`: manage local feature logic/state.
- `services/`: call Supabase or storage only.
- `utils/`: pure functions only.
- `constants/`: fixed values only.
- `pages/`: assemble feature components for routes.

**Naming**

- Use clear names like `validateSignupForm`, `getUserByEmail`, `createPost`, `hidePost`.
- Avoid generic names like `handleData`, `doAuth`, `commonUtil`.
- One file should answer one concern.

If you want, I can next map your current files into this structure without moving anything yet.

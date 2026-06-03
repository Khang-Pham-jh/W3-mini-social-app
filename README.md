# React Mini Social App

A minimal auth-first social app built with Vite + React. The current scope focuses on authentication
and session handling with Supabase.

## Features

- Login and sign up flows built with Final Form.
- Supabase session management, profile upsert, and route protection.
- Placeholder authenticated home that confirms user metadata after login.

## Routes

- `/` and `/login`: Login screen.
- `/signup`: Sign up screen.
- `/home`: Protected route that requires an active session.

## Setup

1. Install dependencies (if you cloned the repo, this will also install the Final Form packages):

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

After the dev server starts, open the printed local URL to view the app.

## Supabase configuration

The app expects these environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Notes

- `HomePage.jsx` is a placeholder to confirm session and profile data after login.
- Auth flows use the Supabase client in `src/libs/supabase.js` and are wrapped by `AuthContext`.

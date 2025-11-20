# Firebase Authentication Setup Guide

## Overview

Candyverse now has Firebase authentication integrated. All pages except the login page are protected and require user authentication.

## Features

- ✅ Email/Password authentication
- ✅ Sign-up and sign-in flows
- ✅ Anonymous guest access
- ✅ Protected routes (automatically redirect unauthenticated users to login)
- ✅ Session persistence (users stay logged in across app restarts)
- ✅ Firebase-based user management

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Enable **Authentication** → Sign-in methods:
   - Enable "Email/Password"
   - Enable "Anonymous" (optional, for guest access)
4. Copy your Firebase config from Project Settings

### 2. Environment Variables

Add the following to your `.env` file (use `.env.example` as a template):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can find these values in Firebase Console → Project Settings → Web App

### 3. Run the Application

```bash
npm run dev
```

## Architecture

### AuthContext (`src/renderer/src/contexts/AuthContext.tsx`)

Manages authentication state globally using React Context API:

- `user` - Current Firebase user object
- `loading` - Loading state during auth initialization
- `isAuthenticated` - Boolean flag for easy auth checks
- `logout()` - Function to sign out the user

### ProtectedRoute Component (`src/renderer/src/components/ProtectedRoute.tsx`)

Wraps pages that require authentication:

- Redirects unauthenticated users to `/login`
- Shows loading state while checking auth status
- Allows authenticated users to access protected pages

### LoginPage (`src/renderer/src/pages/Login/LoginPage.tsx`)

Comprehensive authentication UI with:

- Email/Password sign-in
- Sign-up with validation
- Anonymous guest access
- Error handling and user-friendly messages
- Auto-redirect to home if already authenticated

### Firebase Config (`src/renderer/src/config/firebase.ts`)

Initializes Firebase with environment variables and enables session persistence.

## Usage

### In Components

```tsx
import { useAuth } from '@renderer/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Routes

All pages are protected by default. In `routeConfig.tsx`:

```tsx
{
  path: 'tasks',
  element: (
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  )
}
```

Only the `/login` route is publicly accessible.

## Authentication Flow

1. **App Launch** → `AuthProvider` checks Firebase auth state
2. **Unauthenticated** → Redirected to `/login`
3. **Login Page** → User can sign in, sign up, or continue as guest
4. **Authenticated** → Access to protected pages (Home, Tasks, Updates)
5. **Session Persistence** → User remains logged in across app restarts

## Testing

### Test Accounts

Create test accounts in Firebase Console for testing.

### Guest Access

Click "Continue as Guest" on the login page for anonymous authentication.

### Logout

Add a logout button in your components using:

```tsx
const { logout } = useAuth()

<button onClick={logout}>Sign Out</button>
```

## Important Notes

⚠️ **Security**:

- Never commit `.env` file with real Firebase keys
- Use environment variables for all sensitive config
- Firebase security rules should be configured in Firebase Console
- Consider adding email verification for production

⚠️ **Public Repo**:

- If your GitHub repo is public, your Firebase project can still be private
- Users will only authenticate through the Electron app, not via GitHub
- No need to make the repo public for Firebase to work

## Troubleshooting

### "Cannot find Firebase config"

- Check `.env` file exists with all `VITE_FIREBASE_*` variables
- Restart dev server after adding env variables

### "User stays logged in when shouldn't"

- This is expected behavior (session persistence is intentional)
- Users can manually sign out using the logout button

### "Authentication not working in built app"

- Ensure env variables are included during build
- Check `.env.production` or build environment variables

## Files Modified/Created

- ✅ `src/renderer/src/config/firebase.ts` - Firebase initialization
- ✅ `src/renderer/src/contexts/AuthContext.tsx` - Auth state management
- ✅ `src/renderer/src/components/ProtectedRoute.tsx` - Route protection
- ✅ `src/renderer/src/pages/Login/LoginPage.tsx` - Login UI
- ✅ `src/renderer/src/pages/Login/styles.module.scss` - Login styles
- ✅ `src/renderer/src/router/routeConfig.tsx` - Protected routes
- ✅ `src/renderer/src/main.tsx` - AuthProvider wrapper
- ✅ `src/renderer/src/env.d.ts` - Firebase env types
- ✅ `.env.example` - Environment template
- ✅ `package.json` - Firebase dependency

## Next Steps

1. ✅ Set up Firebase project and get config keys
2. ✅ Add Firebase keys to `.env` file
3. ✅ Run `npm run dev` and test authentication
4. ✅ Customize login page styling as needed
5. ✅ Add logout buttons where needed (e.g., in Navigation)

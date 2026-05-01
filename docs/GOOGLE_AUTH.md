# Google Sign-In Setup

SmartShop Thesis supports Google sign-in through Auth.js. The app now hides the active Google redirect flow until credentials are present, so local development can still use email/password sign-in without OAuth errors.

## Local Redirect URI

Add this authorized redirect URI in your Google Cloud OAuth client:

```text
http://localhost:3000/api/auth/callback/google
```

For deployment, add the same callback path on your live domain:

```text
https://your-domain.com/api/auth/callback/google
```

## Environment Variables

Add your Google OAuth client values to `.env.local`:

```env
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

Restart the development server after changing these values. The Google button becomes active when both variables are present.

## User Records

When a user signs in with Google, the app creates or updates the matching MongoDB user by email and assigns the default `User` role. Existing admin roles are preserved.

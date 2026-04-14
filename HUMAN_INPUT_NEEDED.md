# Human Input Needed

## Google OAuth Credentials (Required for Sign In)

The app uses Google OAuth for authentication. You need to set up credentials:

1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable the "Google+ API" or "Google Identity"
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (for dev)
7. Add your production domain: `https://yourdomain.com/api/auth/callback/google`
8. Copy the Client ID and Client Secret

Then add to your `.env.local` file:
```
AUTH_GOOGLE_ID=your_client_id_here
AUTH_GOOGLE_SECRET=your_client_secret_here
AUTH_SECRET=a_random_32_char_secret_string
```

Generate AUTH_SECRET with: `openssl rand -base64 32`

## Stripe (Required for Pro Purchases - Optional for Free Tier)

The app has Stripe integration planned for Pro purchases at $9.

1. Sign up at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Notes

- The timer itself works WITHOUT any credentials - Google OAuth and Stripe are only needed for save/login and pro purchase features.
- SQLite database (`dev.db`) is used for local development and is already set up.

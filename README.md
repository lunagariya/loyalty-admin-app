# Loyalty Merchant Admin

Embedded Shopify Admin dashboard for configuring and monitoring the Loyalty & Rewards platform. It is the merchant-facing repository in a three-app architecture:

1. **loyalty-admin-app** (this project) renders the embedded merchant UI.
2. **loyalty-backend** owns Shopify OAuth/access tokens, business logic, MongoDB, webhooks, and all API access.
3. The standalone customer portal handles member login, balances, and redemption.

This frontend never stores a Shopify secret or access token and never calls Shopify Admin GraphQL. Browser requests go through the same-origin `/backend-api/*` route so App Bridge can attach a fresh short-lived ID token (formerly called a session token); the route forwards that token to `loyalty-backend`. This avoids mixed tunnel origins and browser CORS failures. The one public Shopify value in this app is its Client ID.

## Local development

Requirements: Node.js 22+, the running `loyalty-backend`, a Shopify development store, and a public HTTPS tunnel.

1. Copy `.env.example` to `.env.local` and set the Shopify Client ID and backend URL.
2. Run `npm install` and `npm run dev`.
3. Expose port 3001 with Shopify CLI's tunnel or `ngrok http 3001`.
4. Set the Shopify app URL to the tunnel URL and the allowed OAuth callback to `${BACKEND_URL}/auth/callback`. Set the backend's `ADMIN_APP_URL` to the frontend tunnel URL and include that origin in `CORS_ORIGINS`.
5. Start installation at `${BACKEND_URL}/auth?shop=your-store.myshopify.com`, then launch the app from Shopify Admin. App Bridge requires the embedded context; direct local browsing displays an installation prompt.

Use `npm run lint` for static checks and `npm run build` for the production build.

## Netlify deployment

Import this repository as a Netlify site. Use `npm run build` as the build command and `.next` as the framework-managed output; Netlify's Next.js adapter detects the App Router automatically. Configure both public environment variables, redeploy, update Shopify's app URL to the Netlify HTTPS URL, and update `ADMIN_APP_URL` plus `CORS_ORIGINS` on the backend. Do not place the Shopify client secret in Netlify frontend variables.

## Features

- Dashboard metrics and top-member activity
- Debounced customer search, tier filtering, pagination, profiles, and ledger history
- Loyalty-rule and reward CRUD with confirmation, validation, optimistic toggles, and product selection
- Revenue/points analytics, responsive charts, and authenticated CSV downloads
- Responsive Polaris loading, empty, error, and success states
- Persisted light/dark appearance

## Screenshots

Add release screenshots here after connecting a populated development store:

- Dashboard — `docs/screenshots/dashboard.png`
- Customers — `docs/screenshots/customers.png`
- Rules and rewards — `docs/screenshots/configuration.png`
- Analytics — `docs/screenshots/analytics.png`

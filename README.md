# SmartShop Thesis

SmartShop Thesis is a full-stack ecommerce thesis project focused on product discovery, secure ordering, multilingual shopping, administration, and commerce analytics. The project uses Next.js, React, MongoDB, Mongoose, Auth.js, Tailwind CSS, Stripe, PayPal, UploadThing, and Resend.

## Thesis Focus

The goal of this project is to demonstrate how a modern ecommerce platform can support both customer shopping workflows and administrative decision-making. Beyond the standard storefront, the app includes a commerce-intelligence layer that summarizes product, sales, stock, and rating signals for future recommendation and inventory-analysis work.

## Core Features

- Multilingual storefront with product browsing, filtering, search, and detail pages.
- Customer account flows for authentication, profile management, cart, checkout, orders, and reviews.
- Admin dashboard for products, orders, users, settings, web pages, and sales analytics.
- Payment integration structure for Stripe and PayPal.
- Email workflow structure for receipts and review reminders.
- Seeded MongoDB data for local testing and demonstration.
- Admin-only commerce intelligence for thesis-specific analytics positioning.
- Admin Product Intelligence page with explainable product-performance and restock-risk scoring.
- Customer-facing Smart Recommendations ranked by browsing interest, demand, ratings, reviews, and stock.

## Tech Stack

- **Frontend:** Next.js App Router, React, Tailwind CSS, shadcn-style UI components.
- **Backend:** Next.js server actions and API routes.
- **Database:** MongoDB with Mongoose models.
- **Authentication:** Auth.js with credentials and Google provider support.
- **Payments:** Stripe and PayPal integrations.
- **Uploads and Email:** UploadThing and Resend.
- **Internationalization:** next-intl.

## Installation And Startup

### Prerequisites

Before running the application, install:

- Node.js 20 or later.
- npm.
- MongoDB running locally, or a MongoDB Atlas connection string.
- Git.

Optional service accounts are needed only for external integrations:

- Google Cloud OAuth credentials for Google sign-in.
- Resend API key for email.
- Stripe test keys for card payments.
- PayPal sandbox credentials for PayPal payments.

1. Install dependencies:

   ```shell
   npm install --legacy-peer-deps
   ```

2. Create a local environment file from the example file:

   ```shell
   cp .example-env .env.local
   ```

3. Generate an Auth.js secret:

   ```shell
   npx auth secret
   ```

   Copy the generated value into `AUTH_SECRET` in `.env.local`.

4. Update `.env.local` with the required local values:

   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   EMAIL_PUBLIC_BASE_URL=https://your-public-demo-url.example
   EMAIL_IMAGE_BASE_URL=https://raw.githubusercontent.com/Mahmoudezzat00/Thesis/main/public
   MONGODB_URI=mongodb://localhost/smartshop-thesis
   AUTH_SECRET=your-generated-auth-secret
   ```

   The app can run locally with email/password authentication and Cash On
   Delivery using only these required values. Google, Resend, Stripe, PayPal,
   and UploadThing can be configured later.

   `EMAIL_PUBLIC_BASE_URL` is only required if you want product images inside
   sent emails to load correctly. Email clients cannot load images from
   `localhost`, so use a deployed HTTPS URL or an HTTPS tunnel for email tests.
   For seeded demo products, `EMAIL_IMAGE_BASE_URL` can point to the repository's
   public image folder on GitHub.

5. Make sure MongoDB is running, then seed the database:

   ```shell
   npm run seed
   ```

6. Start the development server:

   ```shell
   npm run dev
   ```

7. Open the application:

   ```text
   http://localhost:3000
   ```

8. Sign in with the seeded admin account:

   ```text
   Email: admin@example.com
   Password: 123456
   ```

## Demo Accounts

After running the seed script, the default admin login is:

```text
Email: admin@example.com
Password: 123456
```

Use seeded accounts only for development and demonstration. Production deployments must replace all test credentials and secrets.

## Documentation

- [Thesis Overview](./docs/THESIS.md)
- [System Architecture](./docs/ARCHITECTURE.md)
- [Brand Identity](./docs/BRANDING.md)
- [Google Sign-In Setup](./docs/GOOGLE_AUTH.md)
- [Product Intelligence Method](./docs/PRODUCT_INTELLIGENCE.md)
- [Recommendation Method](./docs/RECOMMENDATIONS.md)
- [Payment Demo Setup](./docs/PAYMENTS.md)
- [Testing Plan](./docs/TESTING.md)

## Scripts

- `npm run dev` starts the development server.
- `npm run dev:https` starts the development server with a self-signed HTTPS certificate for Stripe form testing.
- `npm run build` builds the production app.
- `npm run start` starts the production server.
- `npm run seed` resets and seeds the database.
- `npm run email` starts the email preview server.

## Deployment Checklist

- Use a MongoDB Atlas database or another production MongoDB instance.
- Set `NEXT_PUBLIC_SERVER_URL` to the deployed site URL.
- Generate a strong `AUTH_SECRET`.
- Add real Stripe, PayPal, Resend, UploadThing, and Google OAuth keys if those features are enabled.
- Confirm `.env.local` is not committed.
- Run a production build before submission or deployment.

## Academic Note

This repository has been cleaned and repositioned as a thesis project. Any third-party code, libraries, templates, or learning resources used during development should be acknowledged according to the university's citation rules.

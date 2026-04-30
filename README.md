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
- Homepage Commerce Intelligence Snapshot for thesis-specific analytics positioning.
- Admin Product Intelligence page with explainable product-performance and restock-risk scoring.

## Tech Stack

- **Frontend:** Next.js App Router, React, Tailwind CSS, shadcn-style UI components.
- **Backend:** Next.js server actions and API routes.
- **Database:** MongoDB with Mongoose models.
- **Authentication:** Auth.js with credentials and Google provider support.
- **Payments:** Stripe and PayPal integrations.
- **Uploads and Email:** UploadThing and Resend.
- **Internationalization:** next-intl.

## Local Setup

1. Install dependencies:

   ```shell
   npm install --legacy-peer-deps
   ```

2. Create a local environment file:

   ```shell
   cp .example-env .env.local
   ```

3. Update `.env.local` with your MongoDB URI and service keys.

4. Seed the database:

   ```shell
   npm run seed
   ```

5. Start the development server:

   ```shell
   npm run dev
   ```

6. Open `http://localhost:3000`.

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
- [Product Intelligence Method](./docs/PRODUCT_INTELLIGENCE.md)
- [Testing Plan](./docs/TESTING.md)

## Scripts

- `npm run dev` starts the development server.
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

# System Architecture

## Overview

SmartShop Thesis is built with the Next.js App Router. The application combines server-rendered pages, client components, server actions, API routes, MongoDB models, and third-party service integrations.

## Main Layers

### Presentation Layer

- `app/` contains route groups for storefront, auth, checkout, admin, and localized pages.
- `components/shared/` contains reusable feature components such as header, footer, product cards, cart sidebar, and homepage modules.
- `components/ui/` contains reusable UI primitives.
- `messages/` contains translation files for supported locales.

### Business Logic Layer

- `lib/actions/` contains server actions for products, orders, users, settings, reviews, and web pages.
- `lib/utils.ts` contains shared formatting, calculation, and helper functions.
- `lib/validator.ts` contains validation schemas.

### Data Layer

- `lib/db/index.ts` handles the Mongoose connection.
- `lib/db/client.ts` handles the MongoDB client used by Auth.js.
- `lib/db/models/` contains schemas for users, products, orders, reviews, settings, and web pages.
- `lib/data.ts` contains seed data for local demonstration.

### Integration Layer

- `auth.ts` and `auth.config.ts` configure authentication.
- `lib/paypal.ts` handles PayPal requests.
- Stripe is used in checkout and webhook routes.
- UploadThing routes handle product image uploads.
- Resend is used for email workflow integration.

## Data Models

Key collections include:

- **User:** authentication, role, address, and payment preferences.
- **Product:** catalog information, variants, price, stock, tags, reviews, sales, and publishing status.
- **Order:** order items, shipping address, payment status, delivery status, and totals.
- **Review:** rating and customer feedback.
- **Setting:** site, currency, payment, delivery, and theme settings.
- **WebPage:** editable content pages such as help, privacy, and policies.

## Thesis Feature: Commerce Intelligence Snapshot

The homepage includes a server-rendered analytics module powered by `getCommerceInsightSummary` in `lib/actions/product.actions.ts`. It aggregates product data from MongoDB and displays operational metrics that can later support deeper analytics and recommendation features.

## Thesis Feature: Product Intelligence

The admin section includes `/admin/intelligence`, which uses `getProductIntelligenceReport` in `lib/actions/product.actions.ts`. The report calculates product-performance scores, category strength, and restock-risk signals from published product data. This feature is intentionally implemented as an explainable scoring model so it can be described and evaluated in the thesis documentation.

## Deployment View

For production, the application needs:

- a hosted MongoDB database,
- production environment variables,
- payment provider credentials,
- email provider credentials,
- upload provider token,
- deployment on Vercel or another Node-compatible host.

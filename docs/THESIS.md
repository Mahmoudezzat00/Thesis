# Thesis Overview

## Working Title

SmartShop Thesis: A Full-Stack Ecommerce Platform with Administrative Commerce Intelligence

## Problem Statement

Small and medium-sized online stores often need more than a product catalog and checkout page. They need a platform that helps customers discover products efficiently while helping administrators understand sales, stock, product performance, and customer behavior. This project explores how a full-stack ecommerce application can combine storefront functionality with decision-support features.

## Project Objectives

- Build a complete ecommerce workflow from product discovery to order tracking.
- Support customer and administrator roles with separate responsibilities.
- Provide multilingual browsing for a wider audience.
- Integrate payment, upload, and email service boundaries.
- Add an admin commerce-intelligence module that summarizes product performance signals.
- Prepare the system for future recommendation and inventory analysis features.

## Current Scope

The current implementation includes:

- Product catalog, category browsing, tags, search, sorting, and filtering.
- Cart, checkout, order creation, and order history.
- Admin management for products, users, orders, settings, and web pages.
- Reviews and ratings.
- Stripe and PayPal payment integration points.
- Email integration points for receipts and review reminders.
- Seeded demonstration data.
- Admin-only commerce intelligence and product-performance reporting.
- Original SmartShop Thesis branding with a custom logo and blue analytics-focused theme.

## Installation And Startup

### Prerequisites

The application requires:

- Node.js 20 or later.
- npm.
- Git.
- MongoDB, either installed locally or provided through a MongoDB Atlas connection string.

Optional services can be configured for the full feature set:

- Google Cloud OAuth credentials for Google sign-in.
- Resend API key for order and receipt emails.
- Stripe test keys for card payment testing.
- PayPal sandbox credentials for PayPal payment testing.
- UploadThing token for image uploads.

### Setup Steps

1. Clone the repository:

   ```shell
   git clone https://github.com/Mahmoudezzat00/Thesis.git
   cd Thesis
   ```

2. Install dependencies:

   ```shell
   npm install --legacy-peer-deps
   ```

3. Create the local environment file:

   ```shell
   cp .example-env .env.local
   ```

4. Generate an authentication secret:

   ```shell
   npx auth secret
   ```

5. Add the required values to `.env.local`:

   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   EMAIL_PUBLIC_BASE_URL=https://your-public-demo-url.example
   EMAIL_IMAGE_BASE_URL=https://raw.githubusercontent.com/Mahmoudezzat00/Thesis/main/public
   MONGODB_URI=mongodb://localhost/smartshop-thesis
   AUTH_SECRET=your-generated-auth-secret
   ```

   These values are enough to run the main local demo with email/password sign-in and Cash On Delivery checkout. Third-party services such as Google, Resend, Stripe, PayPal, and UploadThing require their own credentials.

   `EMAIL_PUBLIC_BASE_URL` is needed when testing real sent emails with product images. Email clients cannot load product images from `localhost`, so this value should point to a deployed HTTPS site or an HTTPS tunnel.
   For seeded demo products, `EMAIL_IMAGE_BASE_URL` can point to the repository's public image folder on GitHub.

6. Start MongoDB locally, or confirm that the MongoDB Atlas URI in `.env.local` is reachable.

7. Seed the database:

   ```shell
   npm run seed
   ```

8. Start the development server:

   ```shell
   npm run dev
   ```

   For Stripe card-form testing over HTTPS, start the server with:

   ```shell
   npm run dev:https
   ```

9. Open the application:

   ```text
   http://localhost:3000
   ```

10. Sign in with the default seeded admin account:

    ```text
    Email: admin@example.com
    Password: 123456
    ```

## Original Thesis Contribution

The first custom thesis-oriented feature is the admin commerce intelligence module. It aggregates live product data and presents:

- number of published products,
- sales-signal total,
- average customer rating,
- low-stock product count,
- top category,
- top product signal.

This information is intentionally limited to administrators because it contains operational performance and inventory signals. It creates a foundation for deeper thesis work, such as recommendation algorithms, stock-risk detection, product-performance scoring, and admin decision support.

The second thesis-oriented feature is the Admin Product Intelligence page. It ranks products using an explainable performance score and highlights restock-risk signals. This makes the project more than a CRUD ecommerce store because administrators can use the system to reason about inventory and product strategy.

The third thesis-oriented feature is Smart Recommendations. It uses local browsing history and product-performance data to rank products for customers. The feature displays recommendation reasons so the system remains explainable rather than acting like a black box.

## Suggested Research Questions

- How can ecommerce platforms improve product discovery using browsing and sales signals?
- What operational metrics are most useful for small-store administrators?
- How can product ratings, stock, and sales history support recommendation or inventory decisions?
- How does multilingual support affect ecommerce accessibility and usability?

## Future Work

- Personalized recommendations that also use order history.
- Inventory alerts for low-stock and high-demand products.
- Product-performance score combining sales, reviews, rating, and stock.
- Admin export reports for products, orders, and users.
- Automated test coverage for auth, cart, checkout, admin, and seed flows.
- Production deployment with real service credentials.

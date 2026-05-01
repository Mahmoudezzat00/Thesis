# Testing Plan

## Testing Strategy

The testing strategy for SmartShop Thesis combines source-level automated testing targets with manual verification of the most important user-facing workflows. This is appropriate for the current stage of the project because the application includes interactive ecommerce flows, third-party service boundaries, database state, authentication, and administrator-only pages that require both repeatable checks and direct browser validation.

Testing is divided into four areas:

- Automated unit tests for isolated business logic, utility functions, validators, hooks, and reusable helpers.
- Server-action tests for selected order, product, user, and settings workflows.
- Integration-style tests for cart, checkout, validation, and authentication-sensitive flows.
- Manual end-to-end verification for the customer storefront, checkout process, and administration screens.

## Automated Test Coverage

The repository includes a project-level `__tests__` directory. The current test files cover:

- Hooks such as cart-store behavior and device-detection helpers.
- Utility functions for price formatting, calculations, pagination, filtering, and URL handling.
- Validator functions and Zod schemas used by sign-in, sign-up, product, shipping, review, and checkout forms.
- Selected order, product, and user action modules, especially state-changing server actions.
- Integration-style tests for shopping-cart persistence, checkout validation, order creation, and protected-route behavior.

The supporting test tooling includes:

- `jest.config.ts` for Jest and TypeScript configuration.
- `jest.setup.ts` for test environment setup and common mocks.
- `__tests__/README.md` as a short guide describing how to run the tests and what each group covers.
- An `npm test` script that runs the full automated test suite.

This structure shows that testing is a deliberate part of the codebase rather than an afterthought. It also makes the project easier to maintain because repeated changes to checkout, authentication, product management, and admin features can be checked without relying only on manual browser testing.

## Current Automated Test Result

The automated suite was executed locally with:

```shell
npm test -- --runInBand
```

The result was:

```text
Test Suites: 12 passed, 12 total
Tests:       208 passed, 208 total
Snapshots:   0 total
```

The suite can also be run with `npm test`, `npm test:watch`, or `npm test:coverage`.

## Manual Verification Plan

Manual verification focuses on the workflows most visible to customers and administrators.

### Storefront

- Open the home page and confirm carousel, categories, product sections, and Smart Recommendations load.
- Visit product detail pages, return home, and confirm Smart Recommendations adapt to browsing history.
- Search for a product by keyword.
- Filter products by category, rating, price, and tag.
- Open product detail pages and confirm images, price, description, ratings, and stock information render correctly.
- Add a product to the cart with selected quantity, color, and size where available.

### Authentication

- Sign in with the seeded admin account.
- Sign up as a new user in development mode.
- Sign in with Google when OAuth credentials are configured.
- Sign out and confirm protected account and admin pages are inaccessible.
- Confirm non-admin users cannot access administrator routes.

### Cart And Checkout

- Add multiple products to the cart.
- Update quantities and confirm totals change correctly.
- Remove cart items.
- Continue to checkout and verify shipping form validation.
- Select Cash On Delivery and confirm order creation.
- Select Stripe and confirm that test or demo payment marks the order as paid.
- Select PayPal and confirm that sandbox or demo payment marks the order as paid.
- Confirm missing Stripe or PayPal keys show a setup notice instead of crashing.

### Order And Email Flows

- Confirm placed orders appear in the customer account order history.
- Confirm order detail pages show item, shipping, payment, and status information.
- Confirm receipt emails are sent when Resend is configured.
- Confirm receipt email product images use a public HTTPS image base URL rather than `localhost`.

### Administration

- Open the admin dashboard.
- Open the Commerce Intelligence and Product Intelligence pages and confirm metrics, product scores, category summaries, and restock-risk signals load.
- Create, update, and delete a product.
- View and update orders.
- View users and edit a user role or profile.
- Update site settings.
- Create and edit a web page.

### Database And Seed Data

- Run `npm run seed` and confirm users, products, reviews, orders, settings, and web pages are recreated.
- Confirm homepage metrics change when product sales, stock, or published status changes.
- Confirm Product Intelligence scores change when product sales, review counts, ratings, or stock values change.
- Confirm recommendation scores change when browsing-history categories change.

## Pre-Submission Checklist

- Run `npm install --legacy-peer-deps`.
- Run `npm run seed`.
- Run `npm run build`.
- Complete the manual storefront walkthrough.
- Complete the manual admin walkthrough.
- Capture screenshots for thesis documentation.
- Verify no real secrets are committed.
- Run `npm test`.

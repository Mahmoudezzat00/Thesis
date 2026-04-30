# Testing Plan

## Manual Test Scenarios

### Storefront

- Open the home page and confirm carousel, categories, product sections, and Commerce Intelligence Snapshot load.
- Search for a product by keyword.
- Filter products by category, rating, price, and tag.
- Open a product details page.
- Add a product to cart with selected quantity, color, and size where available.

### Authentication

- Sign in with the seeded admin account.
- Sign up as a new user in development mode.
- Sign out and confirm protected account/admin pages are inaccessible.

### Cart and Checkout

- Add multiple products to the cart.
- Update quantities.
- Remove cart items.
- Continue to checkout.
- Verify shipping form validation.
- Verify payment method selection.

### Admin

- Open the admin dashboard.
- Create, update, and delete a product.
- View and update orders.
- View users and edit a user role/profile.
- Update site settings.
- Create and edit a web page.

### Database

- Run `npm run seed` and confirm users, products, reviews, orders, settings, and web pages are recreated.
- Confirm homepage metrics change when product sales, stock, or published status changes.

## Automated Testing Backlog

- Unit tests for utility functions and price calculations.
- Validation tests for Zod schemas.
- Server-action tests for product and order workflows.
- Integration tests for cart and checkout behavior.
- Role-based access tests for admin pages.
- Smoke test for production build.

## Pre-Submission Checklist

- `npm install --legacy-peer-deps`
- `npm run seed`
- `npm run build`
- Manual storefront walkthrough
- Manual admin walkthrough
- Screenshots for thesis documentation
- Verify no real secrets are committed

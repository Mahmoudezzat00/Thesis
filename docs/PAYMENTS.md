# Payment Demo Setup

## Purpose

SmartShop Thesis includes Stripe, PayPal, and Cash On Delivery payment flows. For thesis demos, the app should remain stable even when real sandbox keys are not configured.

## Local Demo Behavior

If Stripe or PayPal credentials are missing or still set to development placeholders, the payment page displays a setup notice instead of crashing. This lets the cart, checkout, order creation, and order-history flows remain demonstrable without live payment credentials.

Cash On Delivery is the safest payment method for local thesis demonstrations because it does not require third-party keys.

## Stripe Local Testing

Stripe test payments should use Stripe test card numbers, not a real card.

```text
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any three digits
ZIP: any ZIP code
```

If the browser shows this warning:

```text
Automatic filling is disabled because this form doesn't use a secure connection
```

start the app with local HTTPS:

```shell
npm run dev:https
```

Then open the HTTPS URL printed by Next.js. The browser may warn about a self-signed certificate; accept it for local development only.

## Mock Payment Confirmation

For local thesis testing, Stripe and PayPal checkout pages include a demo confirmation panel. This lets an authenticated user confirm their own unpaid Stripe or PayPal order without entering a real card number or signing in to a PayPal sandbox buyer account.

The mock payment writes realistic payment data to the order:

```text
Stripe demo id: stripe_demo_<orderId>_<timestamp>
Stripe demo status: succeeded
PayPal demo id: paypal_demo_<orderId>_<timestamp>
PayPal demo status: COMPLETED
pricePaid: the order total
paidAt: current date and time
isPaid: true
```

This feature is available automatically during local development. For safety, production builds block demo payments unless `ENABLE_DEMO_PAYMENTS=true` is explicitly set.

## Required Stripe Variables

```shell
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Stripe marks an order as paid in two places:

- The local success page verifies the returned PaymentIntent and updates the order immediately.
- The webhook also handles `payment_intent.succeeded` and `charge.succeeded` for deployed or webhook-enabled environments.

## Required PayPal Variables

```shell
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=...
PAYPAL_APP_SECRET=...
```

PayPal requires a real sandbox client ID and app secret. The generic `sb` client ID can load sandbox UI, but it is not enough for server-side order capture.

## PayPal Sandbox Testing

To test the real PayPal sandbox flow, use two different sandbox identities:

- **Business sandbox account:** receives the payment and owns the REST app credentials.
- **Personal sandbox account:** acts as the buyer who logs in during checkout.

Steps:

1. Go to the PayPal Developer Dashboard.
2. Open **Apps & Credentials** and make sure the environment is set to **Sandbox**.
3. Create or open a sandbox REST app under a **Business** sandbox account.
4. Copy the app's sandbox client ID and secret into `.env.local`:

   ```env
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com
   PAYPAL_CLIENT_ID=your-sandbox-client-id
   PAYPAL_APP_SECRET=your-sandbox-client-secret
   ```

5. Open **Testing Tools > Sandbox Accounts**.
6. Find or create a **Personal** sandbox account.
7. Use **View/Edit Account** to copy that personal sandbox email and password.
8. Restart the development server:

   ```shell
   npm run dev
   ```

9. Place an order in the app and choose **PayPal**.
10. When the PayPal popup opens, sign in with the **Personal sandbox account**, not your real PayPal account.
11. Approve the sandbox payment.
12. The app should capture the order and mark it as paid.

If sign-in fails inside the popup, confirm that you are using the sandbox buyer email and password from **Testing Tools > Sandbox Accounts**, not your real PayPal login.

## Demo Recommendation

For early thesis presentations:

1. Use Cash On Delivery to demonstrate the checkout workflow.
2. Use mock payment confirmation to demonstrate Stripe and PayPal order processing.
3. Add real sandbox keys before final deployment or a payment-specific demonstration.

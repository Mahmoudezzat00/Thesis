# Payment Demo Setup

## Purpose

SmartShop Thesis includes Stripe, PayPal, and Cash On Delivery payment flows. For thesis demos, the app should remain stable even when real sandbox keys are not configured.

## Local Demo Behavior

If Stripe or PayPal credentials are missing or still set to development placeholders, the payment page displays a setup notice instead of crashing. This lets the cart, checkout, order creation, and order-history flows remain demonstrable without live payment credentials.

Cash On Delivery is the safest payment method for local thesis demonstrations because it does not require third-party keys.

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

## Demo Recommendation

For early thesis presentations:

1. Use Cash On Delivery to demonstrate the checkout workflow.
2. Keep Stripe and PayPal as documented integration points.
3. Add real sandbox keys before final deployment or a payment-specific demonstration.

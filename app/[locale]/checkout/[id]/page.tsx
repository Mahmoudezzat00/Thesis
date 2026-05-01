import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'
import Stripe from 'stripe'

export const metadata = {
  title: 'Payment',
}

const hasUsableKey = (key: string | undefined, prefix: string) =>
  Boolean(
    key &&
      key.startsWith(prefix) &&
      !key.includes('placeholder') &&
      !key.includes('dev_')
  )
const hasUsablePaymentValue = (value: string | undefined) =>
  Boolean(
    value &&
      value.trim() &&
      value !== 'sb' &&
      !value.includes('placeholder') &&
      !value.includes('dev_')
  )

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null
  let paymentConfigMessage = ''
  const isStripeConfigured =
    hasUsableKey(process.env.STRIPE_SECRET_KEY, 'sk_') &&
    hasUsableKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, 'pk_')
  const isPayPalConfigured =
    hasUsablePaymentValue(process.env.PAYPAL_CLIENT_ID) &&
    hasUsablePaymentValue(process.env.PAYPAL_APP_SECRET)
  const enableDemoPayments =
    process.env.NODE_ENV !== 'production' ||
    process.env.ENABLE_DEMO_PAYMENTS === 'true'

  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    if (isStripeConfigured) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(order.totalPrice * 100),
          currency: 'USD',
          metadata: { orderId: order._id },
        })
        client_secret = paymentIntent.client_secret
      } catch (error) {
        console.error('Stripe payment intent failed', error)
        paymentConfigMessage =
          'Stripe could not be initialized. Check the Stripe test keys in .env.local.'
      }
    } else {
      paymentConfigMessage =
        'Stripe is not configured for this local demo. Add Stripe test keys or use Cash On Delivery.'
    }
  }
  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      clientSecret={client_secret}
      paymentConfig={{
        isPayPalConfigured,
        isStripeConfigured,
        enableDemoPayments,
        message: paymentConfigMessage,
      }}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage

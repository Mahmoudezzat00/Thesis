import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { updateOrderToPaidByStripe } from '@/lib/actions/order.actions'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Stripe webhook is not configured', { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : 'Invalid Stripe webhook',
      { status: 400 }
    )
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const orderId = paymentIntent.metadata.orderId
    if (!orderId) {
      return new NextResponse('Missing orderId metadata', { status: 400 })
    }

    const result = await updateOrderToPaidByStripe(orderId, {
      id: paymentIntent.id,
      status: paymentIntent.status,
      email_address: paymentIntent.receipt_email || '',
      pricePaid: (paymentIntent.amount_received / 100).toFixed(2),
    })
    if (!result.success) return new NextResponse(result.message, { status: 400 })

    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    let orderId = charge.metadata.orderId

    if (!orderId && typeof charge.payment_intent === 'string') {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        charge.payment_intent
      )
      orderId = paymentIntent.metadata.orderId
    }

    if (!orderId) {
      return new NextResponse('Missing orderId metadata', { status: 400 })
    }

    const result = await updateOrderToPaidByStripe(orderId, {
      id:
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.id,
      status: charge.status,
      email_address: charge.billing_details.email || '',
      pricePaid: (charge.amount / 100).toFixed(2),
    })
    if (!result.success) return new NextResponse(result.message, { status: 400 })

    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }

  return new NextResponse()
}

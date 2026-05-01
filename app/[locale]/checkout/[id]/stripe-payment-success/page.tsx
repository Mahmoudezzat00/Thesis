import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import {
  getOrderById,
  updateOrderToPaidByStripe,
} from '@/lib/actions/order.actions'

export default async function SuccessPage(props: {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ payment_intent: string }>
}) {
  const params = await props.params

  const { id } = params

  const searchParams = await props.searchParams
  const order = await getOrderById(id)
  if (!order) notFound()
  if (!searchParams.payment_intent || !process.env.STRIPE_SECRET_KEY) {
    return redirect(`/checkout/${id}`)
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent,
    { expand: ['latest_charge'] }
  )
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order._id.toString()
  )
    return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'
  if (!isSuccess) return redirect(`/checkout/${id}`)

  const latestCharge =
    typeof paymentIntent.latest_charge === 'object'
      ? (paymentIntent.latest_charge as Stripe.Charge)
      : null
  await updateOrderToPaidByStripe(id, {
    id: paymentIntent.id,
    status: paymentIntent.status,
    email_address:
      latestCharge?.billing_details.email || paymentIntent.receipt_email || '',
    pricePaid: (paymentIntent.amount_received / 100).toFixed(2),
  })

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center '>
        <h1 className='font-bold text-2xl lg:text-3xl'>
          Thanks for your purchase
        </h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/account/orders/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  )
}

import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import AskReviewOrderItemsEmail from './ask-review-order-items'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import OrderConfirmationEmail from './order-confirmation'
import type { ReactElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY as string)
const demoRecipient = process.env.RESEND_DEMO_RECIPIENT?.trim()

const sendEmail = async ({
  to,
  subject,
  react,
  scheduledAt,
}: {
  to: string
  subject: string
  react: ReactElement
  scheduledAt?: string
}) => {
  const resolvedTo = demoRecipient || to
  const result = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: resolvedTo,
    subject,
    react,
    scheduledAt,
  })

  if (result.error) {
    throw new Error(result.error.message)
  }

  console.log(
    `Email sent: ${subject} to ${resolvedTo === to ? 'customer' : 'demo recipient'}`
  )

  return result.data
}

export const sendOrderConfirmation = async ({ order }: { order: IOrder }) => {
  await sendEmail({
    to: (order.user as { email: string }).email,
    subject: 'Your order has been placed',
    react: <OrderConfirmationEmail order={order} />,
  })
}

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await sendEmail({
    to: (order.user as { email: string }).email,
    subject: 'Your payment receipt',
    react: <PurchaseReceiptEmail order={order} />,
  })
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  await sendEmail({
    to: (order.user as { email: string }).email,
    subject: 'Review your order items',
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  })
}

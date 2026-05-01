'use client'

import { useEffect } from 'react'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  approvePayPalOrder,
  confirmDemoOnlinePayment,
  createPayPalOrder,
} from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'

import CheckoutFooter from '../checkout-footer'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import StripeForm from './stripe-form'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise =
  stripePublishableKey &&
  !stripePublishableKey.includes('placeholder') &&
  !stripePublishableKey.includes('dev_')
    ? loadStripe(stripePublishableKey)
    : null

const isKnownPayPalSdkNoise = (value: unknown) => {
  if (value instanceof Error) {
    return (
      value.message.includes('paypal_js_sdk_v5_unhandled_exception') ||
      Boolean(value.stack?.includes('paypal.com/sdk/js'))
    )
  }

  if (typeof value === 'string') {
    return value.includes('paypal_js_sdk_v5_unhandled_exception')
  }

  return false
}

export default function OrderDetailsForm({
  order,
  paypalClientId,
  clientSecret,
  paymentConfig,
}: {
  order: IOrder
  paypalClientId: string
  isAdmin: boolean
  clientSecret: string | null
  paymentConfig: {
    isPayPalConfigured: boolean
    isStripeConfigured: boolean
    enableDemoPayments: boolean
    message: string
  }
}) {
  const router = useRouter()
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order
  const { toast } = useToast()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || paymentMethod !== 'PayPal') {
      return
    }

    const originalConsoleError = console.error
    console.error = (...args) => {
      if (args.some(isKnownPayPalSdkNoise)) return
      originalConsoleError(...args)
    }

    const handleWindowError = (event: ErrorEvent) => {
      if (
        isKnownPayPalSdkNoise(event.error) ||
        event.message.includes('paypal_js_sdk_v5_unhandled_exception') ||
        event.filename.includes('paypal.com/sdk/js')
      ) {
        event.preventDefault()
      }
    }

    window.addEventListener('error', handleWindowError)

    return () => {
      console.error = originalConsoleError
      window.removeEventListener('error', handleWindowError)
    }
  }, [paymentMethod])

  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Error in loading PayPal.'
    }
    return status
  }
  const PaymentSetupNotice = ({ message }: { message: string }) => (
    <div className='rounded-md border border-dashed p-3 text-sm text-muted-foreground'>
      <p className='font-medium text-foreground'>Payment setup required</p>
      <p className='mt-1'>{message}</p>
      <Button
        className='mt-3 w-full rounded-full'
        variant='outline'
        onClick={() => router.push(`/account/orders/${order._id}`)}
      >
        View order instead
      </Button>
    </div>
  )
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order._id)
    if (!res.success) {
      toast({
        description: res.message,
        variant: 'destructive',
      })
      throw new Error(res.message)
    }
    return res.data
  }
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data)
    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    })
    if (res.success) {
      window.setTimeout(() => {
        router.refresh()
        router.push(`/account/orders/${order._id}`)
      }, 800)
    }
  }
  const handleConfirmDemoPayment = async () => {
    const res = await confirmDemoOnlinePayment(order._id)
    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    })
    if (res.success) {
      router.refresh()
      router.push(`/account/orders/${order._id}`)
    }
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        <div>
          <div className='text-lg font-bold'>Order Summary</div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'FREE'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span> Tax:</span>
              <span>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className='flex justify-between  pt-1 font-bold text-lg'>
              <span> Order Total:</span>
              <span>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

            {!isPaid && paymentMethod === 'PayPal' && paymentConfig.isPayPalConfigured && (
              <div>
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: 'USD',
                    intent: 'capture',
                  }}
                >
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                    onCancel={() =>
                      toast({
                        description: 'PayPal payment was cancelled.',
                        variant: 'destructive',
                      })
                    }
                    onError={(error) =>
                      toast({
                        description:
                          error instanceof Error
                            ? error.message
                            : 'PayPal payment failed.',
                        variant: 'destructive',
                      })
                    }
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {!isPaid && paymentMethod === 'PayPal' && !paymentConfig.isPayPalConfigured && (
              <PaymentSetupNotice message='PayPal sandbox credentials are not configured. Add PAYPAL_CLIENT_ID and PAYPAL_APP_SECRET, or use Cash On Delivery for the demo.' />
            )}
            {!isPaid && paymentMethod === 'Stripe' && clientSecret && stripePromise && (
              <Elements
                options={{
                  clientSecret,
                }}
                stripe={stripePromise}
              >
                <StripeForm
                  priceInCents={Math.round(order.totalPrice * 100)}
                  orderId={order._id}
                />
              </Elements>
            )}
            {!isPaid && paymentMethod === 'Stripe' && (!clientSecret || !stripePromise) && (
              <PaymentSetupNotice
                message={
                  paymentConfig.message ||
                  'Stripe test keys are not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, or use Cash On Delivery for the demo.'
                }
              />
            )}
            {!isPaid &&
              ['Stripe', 'PayPal'].includes(paymentMethod) &&
              paymentConfig.enableDemoPayments && (
                <div className='rounded-md border border-dashed p-3 text-sm'>
                  <p className='font-medium'>Demo payment confirmation</p>
                  <p className='mt-1 text-muted-foreground'>
                    Use this for thesis testing when Stripe or PayPal sandbox
                    payment cannot be completed.
                  </p>
                  <Button
                    className='mt-3 w-full rounded-full'
                    variant='secondary'
                    onClick={handleConfirmDemoPayment}
                  >
                    Confirm Demo {paymentMethod} Payment
                  </Button>
                </div>
              )}

            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* Shipping Address */}
          <div>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Shipping Address</span>
              </div>
              <div className='col-span-2'>
                <p>
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street} <br />
                  {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>

          {/* payment method */}
          <div className='border-y'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>
                <span>Payment Method</span>
              </div>
              <div className='col-span-2'>
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 my-3 pb-3'>
            <div className='flex text-lg font-bold'>
              <span>Items and shipping</span>
            </div>
            <div className='col-span-2'>
              <p>
                Delivery date:
                {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='block md:hidden'>
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>
        <div className='hidden md:block'>
          <CheckoutSummary />
        </div>
      </div>
    </main>
  )
}

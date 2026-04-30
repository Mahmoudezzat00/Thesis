import Link from 'next/link'

import { Button } from '@/components/ui/button'

type CommerceInsightsProps = {
  summary: {
    totalProducts: number
    totalSales: number
    averageRating: number
    lowStockProducts: number
    topCategory: {
      name: string
      sales: number
      products: number
    } | null
    topProduct: {
      name: string
      sales: number
      rating: number
      href: string
    } | null
  }
}

const formatNumber = (value: number) => new Intl.NumberFormat('en').format(value)

export default function CommerceInsights({ summary }: CommerceInsightsProps) {
  const stats = [
    {
      label: 'Published products',
      value: formatNumber(summary.totalProducts),
    },
    {
      label: 'Seeded sales signals',
      value: formatNumber(summary.totalSales),
    },
    {
      label: 'Average rating',
      value: `${summary.averageRating}/5`,
    },
    {
      label: 'Low-stock items',
      value: formatNumber(summary.lowStockProducts),
    },
  ]

  return (
    <section className='bg-background border-y'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-center'>
          <div>
            <p className='text-sm font-semibold uppercase text-muted-foreground'>
              Thesis feature
            </p>
            <h2 className='mt-1 text-2xl font-bold'>
              Commerce Intelligence Snapshot
            </h2>
            <p className='mt-2 text-sm leading-6 text-muted-foreground'>
              This dashboard-style module turns storefront data into decision
              signals for product planning, stock monitoring, and future
              recommendation logic.
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {summary.topProduct && (
                <Button asChild size='sm'>
                  <Link href={summary.topProduct.href}>View top product</Link>
                </Button>
              )}
              <Button asChild size='sm' variant='outline'>
                <Link href='/admin/overview'>Admin analytics</Link>
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
            {stats.map((stat) => (
              <div key={stat.label} className='border bg-card p-4'>
                <p className='text-xs font-medium text-muted-foreground'>
                  {stat.label}
                </p>
                <p className='mt-2 text-2xl font-bold'>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {(summary.topCategory || summary.topProduct) && (
          <div className='mt-4 grid gap-3 md:grid-cols-2'>
            {summary.topCategory && (
              <div className='border bg-card p-4 text-sm'>
                <p className='font-semibold'>Top category</p>
                <p className='mt-1 text-muted-foreground'>
                  {summary.topCategory.name} leads with{' '}
                  {formatNumber(summary.topCategory.sales)} sales signals across{' '}
                  {summary.topCategory.products} products.
                </p>
              </div>
            )}
            {summary.topProduct && (
              <div className='border bg-card p-4 text-sm'>
                <p className='font-semibold'>Top product signal</p>
                <p className='mt-1 text-muted-foreground'>
                  {summary.topProduct.name} has{' '}
                  {formatNumber(summary.topProduct.sales)} sales signals and a{' '}
                  {summary.topProduct.rating}/5 average rating.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

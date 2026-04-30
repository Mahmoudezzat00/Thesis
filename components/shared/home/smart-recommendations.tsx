'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

import ProductCard from '@/components/shared/product/product-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import type { IProduct } from '@/lib/db/models/product.model'

type Recommendation = {
  product: IProduct
  score: number
  reasons: string[]
}

export default function SmartRecommendations() {
  const { products: browsingHistory } = useBrowsingHistory()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set(
      'categories',
      browsingHistory.map((product) => product.category).join(',')
    )
    params.set('ids', browsingHistory.map((product) => product.id).join(','))
    return params.toString()
  }, [browsingHistory])

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      const res = await fetch(`/api/products/recommendations?${queryString}`)
      const data = await res.json()
      setRecommendations(data)
      setIsLoading(false)
    }

    fetchRecommendations()
  }, [queryString])

  if (isLoading || recommendations.length === 0) return null

  return (
    <section className='bg-background border-y'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase text-muted-foreground'>
              Thesis feature
            </p>
            <h2 className='text-2xl font-bold'>Smart Recommendations</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Products are ranked by category affinity, sales, ratings, review
              confidence, and stock availability.
            </p>
          </div>
          <Link href='/search' className='text-sm font-medium'>
            Browse all products
          </Link>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {recommendations.slice(0, 4).map((item) => (
            <div key={item.product.slug} className='border bg-card p-3'>
              <ProductCard product={item.product} hideAddToCart />
              <div className='mt-3 space-y-3'>
                <div>
                  <div className='mb-1 flex items-center justify-between text-xs'>
                    <span className='font-medium'>Recommendation score</span>
                    <span>{item.score}/100</span>
                  </div>
                  <Progress value={item.score} />
                </div>
                <div className='flex flex-wrap gap-2'>
                  {item.reasons.slice(0, 2).map((reason) => (
                    <Badge key={reason} variant='secondary'>
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

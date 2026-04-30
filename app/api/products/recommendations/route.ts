import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'

const parseList = (value: string | null) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []

export const GET = async (request: NextRequest) => {
  const viewedIds = parseList(request.nextUrl.searchParams.get('ids'))
  const viewedCategories = parseList(
    request.nextUrl.searchParams.get('categories')
  )

  const categoryFrequency = viewedCategories.reduce<Record<string, number>>(
    (acc, category) => {
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {}
  )

  await connectToDatabase()
  const products = await Product.find({
    isPublished: true,
    _id: { $nin: viewedIds },
  })
    .select(
      'name slug category images brand price listPrice countInStock tags avgRating numReviews numSales'
    )
    .lean()

  const maxSales = Math.max(...products.map((product) => product.numSales), 1)
  const maxReviews = Math.max(
    ...products.map((product) => product.numReviews),
    1
  )
  const maxCategoryFrequency = Math.max(
    ...Object.values(categoryFrequency),
    1
  )

  const recommendations = products
    .map((product) => {
      const categoryAffinity =
        ((categoryFrequency[product.category] || 0) / maxCategoryFrequency) *
        35
      const salesScore = (product.numSales / maxSales) * 25
      const ratingScore = (product.avgRating / 5) * 20
      const reviewScore = (product.numReviews / maxReviews) * 10
      const stockScore = product.countInStock > 0 ? 10 : 0
      const score = Math.round(
        categoryAffinity + salesScore + ratingScore + reviewScore + stockScore
      )

      const reasons = [
        categoryFrequency[product.category]
          ? `Matches your interest in ${product.category}`
          : '',
        product.avgRating >= 4.2 ? 'Highly rated by customers' : '',
        product.numSales >= maxSales * 0.6 ? 'Popular with shoppers' : '',
        product.countInStock <= 10 && product.countInStock > 0
          ? 'Limited stock'
          : '',
      ].filter(Boolean)

      return {
        product,
        score,
        reasons:
          reasons.length > 0
            ? reasons
            : ['Trending product from the catalog'],
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  return NextResponse.json(recommendations)
}

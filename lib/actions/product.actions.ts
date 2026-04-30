'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { ProductInputSchema, ProductUpdateSchema } from '../validator'
import { IProductInput } from '@/types'
import { z } from 'zod'
import { getSetting } from './setting.actions'

// CREATE
export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// UPDATE
export async function updateProduct(data: z.infer<typeof ProductUpdateSchema>) {
  try {
    const product = ProductUpdateSchema.parse(data)
    await connectToDatabase()
    await Product.findByIdAndUpdate(product._id, product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// DELETE
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// GET ONE PRODUCT BY ID
export async function getProductById(productId: string) {
  await connectToDatabase()
  const product = await Product.findById(productId)
  return JSON.parse(JSON.stringify(product)) as IProduct
}

// GET ALL PRODUCTS FOR ADMIN
export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()

  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}

  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const products = await Product.find({
    ...queryFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / pageSize),
    totalProducts: countProducts,
    from: pageSize * (Number(page) - 1) + 1,
    to: pageSize * (Number(page) - 1) + products.length,
  }
}

export async function getAllCategories() {
  await connectToDatabase()
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  )
  return categories
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}
// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getCommerceInsightSummary() {
  await connectToDatabase()

  const [summary] = await Product.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalSales: { $sum: '$numSales' },
        averageRating: { $avg: '$avgRating' },
        lowStockProducts: {
          $sum: {
            $cond: [{ $lte: ['$countInStock', 10] }, 1, 0],
          },
        },
      },
    },
  ])

  const [topCategory] = await Product.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: '$category',
        sales: { $sum: '$numSales' },
        products: { $sum: 1 },
      },
    },
    { $sort: { sales: -1 } },
    { $limit: 1 },
  ])

  const topProduct = await Product.findOne({ isPublished: true })
    .sort({ numSales: -1 })
    .select('name numSales avgRating slug')
    .lean()

  return {
    totalProducts: summary?.totalProducts || 0,
    totalSales: summary?.totalSales || 0,
    averageRating: Number((summary?.averageRating || 0).toFixed(1)),
    lowStockProducts: summary?.lowStockProducts || 0,
    topCategory: topCategory
      ? {
          name: topCategory._id as string,
          sales: topCategory.sales as number,
          products: topCategory.products as number,
        }
      : null,
    topProduct: topProduct
      ? {
          name: topProduct.name,
          sales: topProduct.numSales,
          rating: topProduct.avgRating,
          href: `/product/${topProduct.slug}`,
        }
      : null,
  }
}

export async function getProductIntelligenceReport() {
  await connectToDatabase()

  const products = await Product.find({ isPublished: true })
    .select(
      'name slug category brand price countInStock avgRating numReviews numSales'
    )
    .lean()

  const maxSales = Math.max(...products.map((product) => product.numSales), 1)
  const maxReviews = Math.max(
    ...products.map((product) => product.numReviews),
    1
  )

  const scoredProducts = products
    .map((product) => {
      const salesScore = (product.numSales / maxSales) * 40
      const ratingScore = (product.avgRating / 5) * 25
      const reviewScore = (product.numReviews / maxReviews) * 15
      const stockScore =
        product.countInStock === 0
          ? 0
          : product.countInStock <= 5
            ? 6
            : product.countInStock <= 10
              ? 12
              : 20
      const performanceScore = Math.round(
        salesScore + ratingScore + reviewScore + stockScore
      )
      const restockRisk =
        product.numSales >= maxSales * 0.6 && product.countInStock <= 10
          ? 'High'
          : product.numSales >= maxSales * 0.35 && product.countInStock <= 15
            ? 'Medium'
            : 'Low'

      return {
        _id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        href: `/product/${product.slug}`,
        category: product.category,
        brand: product.brand,
        price: product.price,
        countInStock: product.countInStock,
        avgRating: product.avgRating,
        numReviews: product.numReviews,
        numSales: product.numSales,
        performanceScore,
        restockRisk,
      }
    })
    .sort((a, b) => b.performanceScore - a.performanceScore)

  const categorySummary = Object.values(
    scoredProducts.reduce<
      Record<
        string,
        {
          category: string
          products: number
          sales: number
          averageScore: number
          scoreTotal: number
        }
      >
    >((acc, product) => {
      acc[product.category] ||= {
        category: product.category,
        products: 0,
        sales: 0,
        averageScore: 0,
        scoreTotal: 0,
      }
      acc[product.category].products += 1
      acc[product.category].sales += product.numSales
      acc[product.category].scoreTotal += product.performanceScore
      acc[product.category].averageScore = Math.round(
        acc[product.category].scoreTotal / acc[product.category].products
      )
      return acc
    }, {})
  ).sort((a, b) => b.averageScore - a.averageScore)

  return {
    products: scoredProducts,
    topProducts: scoredProducts.slice(0, 8),
    restockRisks: scoredProducts
      .filter((product) => product.restockRisk !== 'Low')
      .sort((a, b) => a.countInStock - b.countInStock)
      .slice(0, 8),
    categorySummary,
    scoreWeights: [
      { label: 'Sales velocity', value: '40%' },
      { label: 'Average rating', value: '25%' },
      { label: 'Review volume', value: '15%' },
      { label: 'Stock health', value: '20%' },
    ],
  }
}

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(product)) as IProduct
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = 4,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}

// GET ALL PRODUCTS
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {}
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
}

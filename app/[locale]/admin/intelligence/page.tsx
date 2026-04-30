import Link from 'next/link'
import { Metadata } from 'next'
import { AlertTriangle, BarChart3, Boxes, LineChart } from 'lucide-react'

import { auth } from '@/auth'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProductIntelligenceReport } from '@/lib/actions/product.actions'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Product Intelligence',
}

const riskVariant = (risk: string) =>
  risk === 'High' ? 'destructive' : risk === 'Medium' ? 'secondary' : 'outline'

export default async function ProductIntelligencePage() {
  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  const report = await getProductIntelligenceReport()
  const averageScore =
    report.products.length > 0
      ? Math.round(
          report.products.reduce(
            (total, product) => total + product.performanceScore,
            0
          ) / report.products.length
        )
      : 0

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='h1-bold'>Product Intelligence</h1>
        <p className='text-sm text-muted-foreground'>
          Decision-support scoring for product performance, category strength,
          and restock risk.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Analyzed products</CardTitle>
            <Boxes />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(report.products.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Average score</CardTitle>
            <LineChart />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Restock signals</CardTitle>
            <AlertTriangle />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(report.restockRisks.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>Top category</CardTitle>
            <BarChart3 />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {report.categorySummary[0]?.category || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 lg:grid-cols-[2fr_1fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Top Product Opportunities</CardTitle>
            <CardDescription>
              Ranked by a weighted score using sales, rating, reviews, and
              stock health.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.topProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Link href={product.href} className='font-medium'>
                        {product.name}
                      </Link>
                      <div className='text-xs text-muted-foreground'>
                        {product.brand} · <ProductPrice price={product.price} plain />
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatNumber(product.numSales)}</TableCell>
                    <TableCell>
                      {product.avgRating}/5 ({formatNumber(product.numReviews)})
                    </TableCell>
                    <TableCell>{formatNumber(product.countInStock)}</TableCell>
                    <TableCell className='font-semibold'>
                      {product.performanceScore}/100
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Scoring Method</CardTitle>
              <CardDescription>
                Explainable weights for the thesis report.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {report.scoreWeights.map((weight) => (
                <div
                  key={weight.label}
                  className='flex items-center justify-between border-b pb-2 last:border-b-0'
                >
                  <span className='text-sm'>{weight.label}</span>
                  <span className='font-semibold'>{weight.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Strength</CardTitle>
              <CardDescription>
                Average score and sales by category.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {report.categorySummary.map((category) => (
                <div key={category.category} className='border-b pb-3 last:border-b-0'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{category.category}</span>
                    <span className='text-sm font-semibold'>
                      {category.averageScore}/100
                    </span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {formatNumber(category.sales)} sales signals across{' '}
                    {category.products} products
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restock Risk Signals</CardTitle>
          <CardDescription>
            Products with strong demand and limited available stock.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.restockRisks.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Link href={product.href} className='font-medium'>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatNumber(product.numSales)}</TableCell>
                  <TableCell>{formatNumber(product.countInStock)}</TableCell>
                  <TableCell>
                    <Badge variant={riskVariant(product.restockRisk)}>
                      {product.restockRisk}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

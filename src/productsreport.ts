import type { Cart, Product } from './types'
import { cartsInPeriod, lastMonth, latestCartDate } from './period'

export interface RankedProduct {
  rank: number
  productId: number
  title: string
  category: string
  unitPrice: number
  unitsSold: number
  revenue: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function countUnits(carts: Cart[]) {
  const units = new Map<number, number>()
  for (const cart of carts) {
    for (const item of cart.products) {
      units.set(item.productId, (units.get(item.productId) ?? 0) + item.quantity)
    }
  }
  return units
}

export function topProducts(carts: Cart[], products: Product[], limit = 3): RankedProduct[] {
  const productById = new Map(products.map((p) => [p.id, p]))
  const units = countUnits(carts)

  const rows = [...units].map(([productId, unitsSold]) => {
    // TODO: prodotto non in catalogo
    const product = productById.get(productId)!
    return {
      productId,
      title: product.title,
      category: product.category,
      unitPrice: product.price,
      unitsSold,
      revenue: round2(product.price * unitsSold),
    }
  })

  rows.sort((a, b) =>
    b.unitsSold - a.unitsSold ||
    b.revenue - a.revenue ||
    a.productId - b.productId
  )

  return rows.slice(0, limit).map((row, i) => ({ rank: i + 1, ...row }))
}

export function buildProductsReport(carts: Cart[], products: Product[]) {
  const anchor = latestCartDate(carts)
  const period = lastMonth(anchor)

  return {
    report: 'top-products',
    generatedAt: new Date().toISOString(),
    lastMonthAnchor: anchor.toISOString(),
    periods: {
      allTime: {
        interval: null,
        ranking: topProducts(carts, products),
      },
      lastMonth: {
        interval: period,
        ranking: topProducts(cartsInPeriod(carts, period), products),
      },
    },
  }
}
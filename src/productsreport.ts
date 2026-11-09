import type { Cart, Product } from './types'
import type { ReportContext } from './context'
import { cartsInPeriod } from './period'
import { round2 } from './utils'

export interface RankedProduct {
  rank: number
  productId: number
  title: string
  category: string
  unitPrice: number
  unitsSold: number
  revenue: number
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

export function buildProductsReport(carts: Cart[], products: Product[], ctx: ReportContext) {
  return {
    report: 'top-products',
    generatedAt: ctx.generatedAt,
    lastMonthAnchor: ctx.anchor,
    periods: {
      allTime: {
        interval: null,
        ranking: topProducts(carts, products),
      },
      lastMonth: {
        interval: ctx.period,
        ranking: topProducts(cartsInPeriod(carts, ctx.period), products),
      },
    },
  }
}
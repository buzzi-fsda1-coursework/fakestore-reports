import type { Cart, Product } from './types'
import type { ReportContext } from './context'
import { buildReport } from './report'
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

// da tenere allineato al sort in topProducts
const RANKED_BY = ['unitsSold desc', 'revenue desc', 'productId asc']

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

  const rows: Omit<RankedProduct, 'rank'>[] = []
  for (const [productId, unitsSold] of units) {
    const product = productById.get(productId)
    // senza catalogo non c'è prezzo né fatturato: la riga si scarta
    if (!product) continue
    rows.push({
      productId,
      title: product.title,
      category: product.category,
      unitPrice: product.price,
      unitsSold,
      revenue: round2(product.price * unitsSold),
    })
  }

  rows.sort((a, b) =>
    b.unitsSold - a.unitsSold ||
    b.revenue - a.revenue ||
    a.productId - b.productId
  )

  return rows.slice(0, limit).map((row, i) => ({ rank: i + 1, ...row }))
}

export function buildProductsReport(carts: Cart[], products: Product[], ctx: ReportContext) {
  return buildReport({
    id: 'top-products',
    rankedBy: RANKED_BY,
    carts,
    ctx,
    rank: (periodCarts) => topProducts(periodCarts, products),
  })
}
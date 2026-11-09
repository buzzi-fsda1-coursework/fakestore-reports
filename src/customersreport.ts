import type { Cart, Product, User } from './types'
import type { ReportContext } from './context'
import { cartsInPeriod } from './period'
import { round2 } from './utils'

// anagrafica a null se l'utente non esiste: la spesa resta vera
export interface RankedCustomer {
  rank: number
  userId: number
  username: string | null
  fullName: string | null
  email: string | null
  orders: number
  items: number
  totalSpent: number
}

interface Totals {
  orders: number
  items: number
  spent: number
}

function sumByUser(carts: Cart[], productById: Map<number, Product>) {
  const totals = new Map<number, Totals>()
  for (const cart of carts) {
    const t = totals.get(cart.userId) ?? { orders: 0, items: 0, spent: 0 }
    t.orders += 1
    for (const item of cart.products) {
      const product = productById.get(item.productId)
      // stessa regola del report prodotti: senza prezzo la riga non conta
      if (!product) continue
      t.items += item.quantity
      t.spent += product.price * item.quantity
    }
    totals.set(cart.userId, t)
  }
  return totals
}

export function topCustomers(
  carts: Cart[],
  products: Product[],
  users: User[],
  limit = 3,
): RankedCustomer[] {
  const productById = new Map(products.map((p) => [p.id, p]))
  const userById = new Map(users.map((u) => [u.id, u]))
  const totals = sumByUser(carts, productById)

  const rows = [...totals].map(([userId, t]) => {
    const user = userById.get(userId)
    return {
      userId,
      username: user?.username ?? null,
      fullName: user ? `${user.name.firstname} ${user.name.lastname}` : null,
      email: user?.email ?? null,
      orders: t.orders,
      items: t.items,
      totalSpent: round2(t.spent),
    }
  })

  rows.sort((a, b) =>
    b.totalSpent - a.totalSpent ||
    b.items - a.items ||
    a.userId - b.userId
  )

  return rows.slice(0, limit).map((row, i) => ({ rank: i + 1, ...row }))
}

export function buildCustomersReport(
  carts: Cart[],
  products: Product[],
  users: User[],
  ctx: ReportContext,
) {
  return {
    report: 'top-customers',
    generatedAt: ctx.generatedAt,
    lastMonthAnchor: ctx.anchor,
    periods: {
      allTime: {
        interval: null,
        ranking: topCustomers(carts, products, users),
      },
      lastMonth: {
        interval: ctx.period,
        ranking: topCustomers(cartsInPeriod(carts, ctx.period), products, users),
      },
    },
  }
}
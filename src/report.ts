import type { Cart } from './types'
import type { ReportContext } from './context'
import { cartsInPeriod } from './period'

interface ReportOptions<T> {
  id: string
  rankedBy: string[]
  carts: Cart[]
  ctx: ReportContext
  rank: (carts: Cart[]) => T[]
}

// stessa forma per entrambi i report
export function buildReport<T>({ id, rankedBy, carts, ctx, rank }: ReportOptions<T>) {
  return {
    report: id,
    generatedAt: ctx.generatedAt,
    rankedBy,
    lastMonthAnchor: ctx.anchor,
    periods: {
      allTime: {
        interval: null,
        ranking: rank(carts),
      },
      lastMonth: {
        interval: ctx.period,
        ranking: rank(cartsInPeriod(carts, ctx.period)),
      },
    },
  }
}
import type { Cart } from './types'
import type { Period } from './period'
import { lastMonth, latestCartDate } from './period'

// calcolato una volta sola: i due report devono condividere ancora e periodo
export interface ReportContext {
  generatedAt: string
  anchor: string | null
  period: Period | null
}

export function createReportContext(carts: Cart[]): ReportContext {
  const anchor = latestCartDate(carts)
  return {
    generatedAt: new Date().toISOString(),
    anchor: anchor ? anchor.toISOString() : null,
    period: anchor ? lastMonth(anchor) : null,
  }
}
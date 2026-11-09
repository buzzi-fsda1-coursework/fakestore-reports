import type { Cart } from './types'

// giorni in formato YYYY-MM-DD, estremi inclusi
export interface Period {
  start: string
  end: string
}

export function toUtcDay(value: string | Date) {
  return new Date(value).toISOString().slice(0, 10)
}

export function latestCartDate(carts: Cart[]) {
  // TODO: nessun carrello -> Invalid Date
  const times = carts.map((c) => new Date(c.date).getTime())
  return new Date(Math.max(...times))
}

// 31 marzo -> 29 febbraio, non 2 marzo
function oneMonthBefore(date: Date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() - 1
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const day = Math.min(date.getUTCDate(), lastDayOfMonth)
  return new Date(Date.UTC(year, month, day))
}

export function lastMonth(anchor: Date): Period {
  return {
    start: toUtcDay(oneMonthBefore(anchor)),
    end: toUtcDay(anchor),
  }
}

export function cartsInPeriod(carts: Cart[], period: Period) {
  return carts.filter((c) => {
    const day = toUtcDay(c.date)
    return day >= period.start && day <= period.end
  })
}
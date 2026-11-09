import { fetchAll } from './api'
import { createReportContext } from './context'
import { findUnknownIds } from './integrity'
import { buildProductsReport } from './productsReport'
import { buildCustomersReport } from './customersReport'

// textContent e non innerHTML: i titoli arrivano dall'API
function render(text: string) {
  const pre = document.createElement('pre')
  pre.textContent = text
  document.querySelector('#app')?.append(pre)
}

async function main() {
  const { products, carts, users } = await fetchAll()

  const unknown = findUnknownIds(carts, products, users)
  if (unknown.productIds.length > 0) {
    console.warn('Prodotti non in catalogo, righe escluse:', unknown.productIds)
  }
  if (unknown.userIds.length > 0) {
    console.warn('Utenti non in anagrafica, dati anagrafici a null:', unknown.userIds)
  }

  const ctx = createReportContext(carts)
  const reports = [
    buildProductsReport(carts, products, ctx),
    buildCustomersReport(carts, products, users, ctx),
  ]

  for (const report of reports) {
    const json = JSON.stringify(report, null, 2)
    console.log(json)
    render(json)
  }
}

main().catch((err) => {
  console.error('Impossibile generare i report:', err)
  render(`Impossibile generare i report: ${err instanceof Error ? err.message : String(err)}`)
})
import { fetchAll } from './api'
import { createReportContext } from './context'
import { findUnknownIds } from './integrity'
import { buildProductsReport } from './productsReport'
import { buildCustomersReport } from './customersReport'

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
  const productsReport = buildProductsReport(carts, products, ctx)
  const customersReport = buildCustomersReport(carts, products, users, ctx)

  console.log(JSON.stringify(productsReport, null, 2))
  console.log(JSON.stringify(customersReport, null, 2))
}

main().catch((err) => {
  console.error('Impossibile generare i report:', err)
})
import { fetchAll } from './api'
import { createReportContext } from './context'
import { buildProductsReport } from './productsReport'
import { buildCustomersReport } from './customersReport'

async function main() {
  const { products, carts, users } = await fetchAll()
  const ctx = createReportContext(carts)

  const productsReport = buildProductsReport(carts, products, ctx)
  const customersReport = buildCustomersReport(carts, products, users, ctx)

  console.log(JSON.stringify(productsReport, null, 2))
  console.log(JSON.stringify(customersReport, null, 2))
}

main()
import { fetchAll } from './api'
import { createReportContext } from './context'
import { buildProductsReport } from './productsReport'

async function main() {
  const { products, carts } = await fetchAll()
  const ctx = createReportContext(carts)

  const report = buildProductsReport(carts, products, ctx)
  console.log(JSON.stringify(report, null, 2))
}

main()
import { fetchAll } from './api'
import { buildProductsReport } from './productsReport'

async function main() {
  const { products, carts } = await fetchAll()

  const report = buildProductsReport(carts, products)
  console.log(JSON.stringify(report, null, 2))
}

main()
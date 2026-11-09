import { fetchAll } from './api'
import { topProducts } from './productsReport'

async function main() {
  const { products, carts } = await fetchAll()

  const top = topProducts(carts, products)
  console.log(JSON.stringify(top, null, 2))
}

main()
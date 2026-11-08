import { fetchAll } from './api'

async function main() {
  const { products, carts, users } = await fetchAll()

  console.log(`${products.length} prodotti, ${carts.length} carrelli, ${users.length} utenti`)
}

main()
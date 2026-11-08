const BASE_URL = 'https://fakestoreapi.com'

async function getJson(path: string) {
  const res = await fetch(`${BASE_URL}${path}`)
  return res.json()
}

async function main() {
  const [products, carts, users] = await Promise.all([
    getJson('/products'),
    getJson('/carts'),
    getJson('/users'),
  ])

  console.log('products', products)
  console.log('carts', carts)
  console.log('users', users)

  // decidere cos'è "ultimo mese" — quanto sono distribuite le date?
  console.log('cart dates', carts.map((c: any) => c.date).sort())
}

main()
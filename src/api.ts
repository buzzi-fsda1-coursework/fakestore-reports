import type { Cart, Product, User } from './types'

const BASE_URL = 'https://fakestoreapi.com'

// il generico non verifica niente a runtime ma dice solo a TS cosa aspettarsi
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  // fetch rifiuta solo su errori di rete non su 404/500
  if (!res.ok) {
    throw new Error(`GET ${path}: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export function fetchProducts() {
  return getJson<Product[]>('/products')
}

export function fetchCarts() {
  return getJson<Cart[]>('/carts')
}

export function fetchUsers() {
  return getJson<User[]>('/users')
}

export async function fetchAll() {
  const [products, carts, users] = await Promise.all([
    fetchProducts(),
    fetchCarts(),
    fetchUsers(),
  ])
  return { products, carts, users }
}
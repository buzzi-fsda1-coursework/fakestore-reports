import type { Cart, Product, User } from './types'

const BASE_URL = 'https://fakestoreapi.com'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
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
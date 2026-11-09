import type { Cart, Product, User } from './types'

// id citati nei carrelli ma assenti da catalogo/anagrafica
export function findUnknownIds(carts: Cart[], products: Product[], users: User[]) {
  const knownProducts = new Set(products.map((p) => p.id))
  const knownUsers = new Set(users.map((u) => u.id))
  const productIds = new Set<number>()
  const userIds = new Set<number>()

  for (const cart of carts) {
    if (!knownUsers.has(cart.userId)) userIds.add(cart.userId)
    for (const item of cart.products) {
      if (!knownProducts.has(item.productId)) productIds.add(item.productId)
    }
  }

  return { productIds: [...productIds], userIds: [...userIds] }
}
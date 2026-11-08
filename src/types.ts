export interface Product {
  id: number
  title: string
  price: number
  category: string
}

export interface CartItem {
  productId: number
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  date: string
  products: CartItem[]
}

export interface User {
  id: number
  email: string
  username: string
  name: {
    firstname: string
    lastname: string
  }
}
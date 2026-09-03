// Cart state lives in sessionStorage so it survives full-page navigation
// between the homepage, /menu, a product detail page, and the checkout
// page — all of which are separate page loads in this app's routing.
const CART_KEY = 'casamisu_cart'

function keyFor(item) {
  return `${item.name}__${item.size || ''}__${item.dietaryPreference || ''}__${item.message || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function readCart() {
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY)) || {}
  } catch {
    return {}
  }
}

function writeCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new CustomEvent('casamisu:cart-changed'))
}

export function getCart() {
  return readCart()
}

const MAX_QUANTITY = 5

// Adds a fully-configured item (name, category, size, price, quantity,
// dietaryPreference, message, image) and opens the cart drawer.
export function addToCart(item) {
  const cart = readCart()
  const id = keyFor(item)
  const existing = cart[id]
  const quantity = Math.min(MAX_QUANTITY, (existing?.quantity || 0) + (item.quantity || 1))
  cart[id] = { ...item, id, quantity }
  writeCart(cart)
  window.dispatchEvent(new CustomEvent('casamisu:open-cart'))
}

export function updateQuantity(id, quantity) {
  const cart = readCart()
  if (!cart[id]) return
  if (quantity <= 0) {
    delete cart[id]
  } else {
    cart[id] = { ...cart[id], quantity: Math.min(MAX_QUANTITY, quantity) }
  }
  writeCart(cart)
}

export function removeFromCart(id) {
  const cart = readCart()
  delete cart[id]
  writeCart(cart)
}

export function clearCart() {
  writeCart({})
}

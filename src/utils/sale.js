// Applies a product's discount to a base price. Never used for delivery
// fees or the cake-topper add-on — those are always full price.
export function applyDiscount(price, discountPercent) {
  const pct = Number(discountPercent) || 0
  if (pct <= 0) return price
  return Math.round(price * (1 - pct / 100))
}

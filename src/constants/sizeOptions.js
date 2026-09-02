// Shared weight/size tiers used by the order flow, the "Select Options"
// popup, the product detail page, and the menu card price ("From ₹X").
export const SIZE_OPTIONS = {
  tiramisu: [
    { label: 'Small (2-3 servings)', price: 350 },
    { label: 'Medium (4-6 servings)', price: 600 },
    { label: 'Large (8-10 servings)', price: 950 },
  ],
  cookies: [
    { label: 'Box of 6', price: 250 },
    { label: 'Box of 12', price: 450 },
    { label: 'Box of 24', price: 850 },
  ],
  desserts: [
    { label: 'Single serving', price: 180 },
    { label: 'Pack of 2', price: 320 },
    { label: 'Pack of 4', price: 580 },
  ],
  gifting: [
    { label: 'Small Gift Box', price: 600 },
    { label: 'Medium Gift Box', price: 950 },
    { label: 'Premium Gift Box', price: 1500 },
  ],
}

export function sizesForCategory(category) {
  return SIZE_OPTIONS[category] || SIZE_OPTIONS.tiramisu
}

export function minPriceForCategory(category) {
  const sizes = sizesForCategory(category)
  return Math.min(...sizes.map((s) => s.price))
}

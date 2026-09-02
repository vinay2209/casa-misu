// Descriptive copy for the product detail page and product modal.
// Keyed by uppercase product title. Products without an entry fall back
// to generic copy — see getProductDetails().
export const PRODUCT_DETAILS = {
  'CLASSIC TIRAMISU': {
    description: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream',
    ingredients: 'Mascarpone cheese, eggs, espresso, ladyfinger biscuits, sugar, cocoa powder',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.',
  },
  'PISTACHIO TIRAMISU': {
    description: 'Our signature creamy mascarpone infused with rich, roasted pistachio paste and topped with crushed pistachios.',
    ingredients: 'Mascarpone cheese, eggs, espresso, ladyfinger biscuits, pistachio paste, crushed pistachios, sugar',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.',
  },
  'STRAWBERRY TIRAMISU': {
    description: 'Fresh, fruity and perfectly balanced — a seasonal favourite',
    ingredients: 'Mascarpone cheese, eggs, fresh strawberries, ladyfinger biscuits, sugar, cream',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 2 days of delivery. Keep refrigerated.',
  },
  'SEASONAL TIRAMISU': {
    description: 'Made with seasonal love and ingredients — flavour changes with the season',
    ingredients: 'Mascarpone cheese, eggs, ladyfinger biscuits, seasonal flavouring, sugar, cream',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.',
  },
  'BROWN BUTTER & SEA SALT COOKIE': {
    description: 'Eggless cookies with nutty brown butter and a hint of sea salt',
    ingredients: 'Flour, brown butter, sea salt, sugar, chocolate chips',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 5 days. Store in a cool dry place.',
  },
  'TIRAMISU COOKIE': {
    description: 'All the flavour of tiramisu in a soft, chewy cookie',
    ingredients: 'Flour, butter, mascarpone, espresso, cocoa, sugar',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 5 days. Store in a cool dry place.',
  },
  'NUTELLA COOKIE TIN': {
    description: 'Rich Nutella-filled cookies in a beautiful gifting tin',
    ingredients: 'Flour, butter, Nutella, sugar, cocoa',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 7 days. Store in a cool dry place.',
  },
}

const GENERIC_BY_CATEGORY = {
  tiramisu: {
    description: 'Handcrafted in small batches with the same care as everything we make.',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.',
  },
  cookies: {
    description: 'Baked fresh to order, soft in the middle and just right at the edges.',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 5 days. Store in a cool, dry place.',
  },
  desserts: {
    description: 'A seasonal treat, made fresh in small batches.',
    contains: 'Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.',
  },
}

export function getProductDetails(name, category) {
  const specific = PRODUCT_DETAILS[(name || '').toUpperCase()]
  if (specific) return specific
  return GENERIC_BY_CATEGORY[category] || GENERIC_BY_CATEGORY.tiramisu
}

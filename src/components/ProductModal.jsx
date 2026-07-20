import React from 'react'
import './FeaturedDesserts.css'
import './OrderButtons.css'

const DETAILS = {
  'CLASSIC TIRAMISU': {
    title: 'CLASSIC TIRAMISU',
    description: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream',
    pricing: '₹450 (250g) | ₹590 (350g) | ₹1040 (700g)',
    ingredients: 'Mascarpone cheese, eggs, espresso, ladyfinger biscuits, sugar, cocoa powder',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.'
  },
  'PISTACHIO TIRAMISU': {
    title: 'PISTACHIO TIRAMISU',
    description: 'Our signature creamy mascarpone infused with rich, roasted pistachio paste and topped with crushed pistachios.',
    pricing: '₹520 (250g) | ₹660 (350g) | ₹1130 (700g)',
    ingredients: 'Mascarpone cheese, eggs, espresso, ladyfinger biscuits, pistachio paste, crushed pistachios, sugar',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.'
  },
  'STRAWBERRY TIRAMISU': {
    title: 'STRAWBERRY TIRAMISU',
    description: 'Fresh, fruity and perfectly balanced — a seasonal favourite',
    pricing: 'DM to ask for current availability and pricing',
    ingredients: 'Mascarpone cheese, eggs, fresh strawberries, ladyfinger biscuits, sugar, cream',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 2 days of delivery. Keep refrigerated.'
  },
  'SEASONAL TIRAMISU': {
    title: 'SEASONAL TIRAMISU',
    description: 'Made with seasonal love and ingredients — flavour changes with the season',
    pricing: '₹710 (350g) | ₹1290 (700g)',
    ingredients: 'Mascarpone cheese, eggs, ladyfinger biscuits, seasonal flavouring, sugar, cream',
    contains: 'Eggs | Alcohol Free | Eggless available on request',
    bestBefore: 'Consume within 3 days of delivery. Keep refrigerated.'
  },
  'BROWN BUTTER & SEA SALT COOKIE': {
    title: 'BROWN BUTTER & SEA SALT COOKIE',
    description: 'Eggless cookies with nutty brown butter and a hint of sea salt',
    pricing: '₹290 (pack of 2) | ₹560 (pack of 4) | ₹830 (pack of 6)',
    ingredients: 'Flour, brown butter, sea salt, sugar, chocolate chips',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 5 days. Store in a cool dry place.'
  },
  'TIRAMISU COOKIE': {
    title: 'TIRAMISU COOKIE',
    description: 'All the flavour of tiramisu in a soft, chewy cookie',
    pricing: '₹320 (pack of 2) | ₹620 (pack of 4) | ₹920 (pack of 6)',
    ingredients: 'Flour, butter, mascarpone, espresso, cocoa, sugar',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 5 days. Store in a cool dry place.'
  },
  'NUTELLA COOKIE TIN': {
    title: 'NUTELLA COOKIE TIN',
    description: 'Rich Nutella-filled cookies in a beautiful gifting tin',
    pricing: '₹460 (small) | ₹740 (medium) | ₹1290 (large)',
    ingredients: 'Flour, butter, Nutella, sugar, cocoa',
    contains: 'Eggless | Alcohol Free',
    bestBefore: 'Consume within 7 days. Store in a cool dry place.'
  }
}

function inferCategory(title) {
  return /COOKIE/i.test(title) ? 'cookies' : 'tiramisu'
}

export default function ProductModal({ productTitle, onClose }) {
  const info = DETAILS[productTitle] || {
    title: productTitle,
    description: '',
    pricing: '',
    ingredients: '',
    contains: '',
    bestBefore: ''
  }

  function orderNow(e) {
    e.stopPropagation()
    onClose()
    window.dispatchEvent(new CustomEvent('casamisu:order-now', { detail: { name: productTitle, category: inferCategory(productTitle) } }))
    const el = document.getElementById('order')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="product-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3 className="modal-title">{info.title}</h3>
        <p className="modal-desc">{info.description}</p>

        <div className="modal-divider" />

        <p className="modal-pricing"><strong>Pricing:</strong> {info.pricing}</p>

        <div className="modal-divider" />

        <p className="modal-ingredients"><strong>Ingredients:</strong> {info.ingredients}</p>
        <p className="modal-contains"><strong>Contains:</strong> {info.contains}</p>
        <p className="modal-best"><strong>Best Before:</strong> {info.bestBefore}</p>

        <div style={{ height: 12 }} />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button type="button" className="btn-order-now" onClick={orderNow}>
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  )
}

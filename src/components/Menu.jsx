import { useEffect, useState } from 'react'
import './Menu.css'
import './OrderButtons.css'
import SectionHeading from './SectionHeading'
import ProductOptionsModal from './ProductOptionsModal'
import { minPriceForCategory } from '../constants/sizeOptions'
import tiramisuIcon from '../assets/tiramisu-maroon.svg'
import cookieIcon from '../assets/cookie-maroon.svg'
import cakeIcon from '../assets/cake-maroon.svg'

const CATEGORY_ICONS = {
  tiramisu: tiramisuIcon,
  cookies: cookieIcon,
  desserts: cakeIcon,
}

const DEFAULT_PRODUCTS = [
  { id: 'default-1', name: 'Classic Tiramisu', price: 350, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', category: 'tiramisu' },
  { id: 'default-2', name: 'Pistachio Tiramisu', price: 420, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', category: 'tiramisu' },
  { id: 'default-3', name: 'Strawberry Tiramisu', price: 400, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', category: 'tiramisu' },
  { id: 'default-4', name: 'Seasonal Tiramisu', price: 380, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80', category: 'tiramisu' },
  { id: 'default-5', name: 'Cookies Box', price: 250, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80', category: 'cookies' },
]

export default function Menu() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    // Pull the real, admin-managed menu; fall back to the demo list only
    // if the backend has nothing yet, so the section is never empty.
    fetch('https://casa-misu.onrender.com/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((item) => ({
              id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              category: item.category,
              options: item.options,
              dietaryOptions: item.dietaryOptions,
              messageOnCake: item.messageOnCake,
              description: item.description,
              ingredients: item.ingredients,
              shelfLife: item.shelfLife,
            }))
          )
        }
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <section id="menu" className="menu-section">
      <div className="menu-bg-deco" aria-hidden="true">
        <svg className="menu-bg-sketch menu-bg-left" viewBox="0 0 120 120" fill="none">
          <path d="M20 100 Q60 20 100 100" stroke="#8B3A2A" strokeWidth="0.8" fill="none" opacity="0.25"/>
          <ellipse cx="60" cy="80" rx="30" ry="8" stroke="#8B3A2A" strokeWidth="0.8" fill="none" opacity="0.2"/>
        </svg>
        <svg className="menu-bg-sketch menu-bg-right" viewBox="0 0 120 120" fill="none">
          <rect x="30" y="40" width="60" height="8" rx="4" stroke="#8B3A2A" strokeWidth="0.8" fill="none" opacity="0.2"/>
          <line x1="40" y1="60" x2="80" y2="60" stroke="#8B3A2A" strokeWidth="0.8" opacity="0.2"/>
          <path d="M50 70 Q60 90 70 70" stroke="#8B3A2A" strokeWidth="0.8" fill="none" opacity="0.2"/>
        </svg>
      </div>

      <SectionHeading title="OUR MENU" subtitle="Something sweet for every craving" />

      <div className="menu-product-grid">
        {products.map((p) => (
          <article key={p.id} className="menu-product-card">
            {p.image ? (
              <div className="menu-product-img" style={{ backgroundImage: `url(${p.image})` }} />
            ) : (
              <div className="menu-product-img menu-product-img-placeholder">
                <img src={CATEGORY_ICONS[p.category] || cakeIcon} alt="" />
              </div>
            )}
            <div className="menu-product-body">
              <h3>{p.name}</h3>
              <p className="menu-product-price">From ₹{minimumProductPrice(p)}</p>
              <button
                type="button"
                className="btn-order-now"
                onClick={() => setSelectedProduct(p)}
              >
                SELECT OPTIONS
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct && (
        <ProductOptionsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}

function minimumProductPrice(product) {
  if (Array.isArray(product.options) && product.options.length > 0) {
    return Math.min(...product.options.map((option) => Number(option.price)))
  }
  return product.price || minPriceForCategory(product.category)
}

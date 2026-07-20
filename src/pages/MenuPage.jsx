import React, { useState, useEffect } from 'react'
import '../components/FeaturedDesserts.css'
import '../components/OrderButtons.css'
import SectionHeading from '../components/SectionHeading'

const initialProducts = [
  { id: 1, category: 'tiramisu', title: 'Classic Tiramisu', desc: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream', price: '₹450 (250g) / ₹590 (350g) / ₹1040 (700g)' },
  { id: 2, category: 'tiramisu', title: 'Pistachio Tiramisu', desc: 'Signature creamy mascarpone infused with roasted pistachio paste, topped with crushed pistachios', price: '₹520 (250g) / ₹660 (350g) / ₹1130 (700g)' },
  { id: 3, category: 'tiramisu', title: 'Seasonal Flavoured Tiramisu', desc: 'Fresh seasonal ingredients perfectly layered into our classic tiramisu', price: '₹710 (350g) / ₹1290 (700g)' },
  { id: 4, category: 'cookies', title: 'Brown Butter & Sea Salt Cookie', desc: 'Eggless. Nutty brown butter with a hint of sea salt', price: '₹290 (pack of 2) / ₹560 (pack of 4) / ₹830 (pack of 6)' },
  { id: 5, category: 'cookies', title: 'Tiramisu Cookie', desc: 'All the flavour of tiramisu in a soft chewy cookie', price: '₹320 (pack of 2) / ₹620 (pack of 4) / ₹920 (pack of 6)' },
  { id: 6, category: 'cookies', title: 'Nutella Cookie Tin', desc: 'Rich Nutella-filled cookies in a beautiful gifting tin', price: '₹460 (small) / ₹740 (medium) / ₹1290 (large)' },
  { id: 7, category: 'desserts', title: 'Seasonal Dessert', desc: 'Ask us about our rotating seasonal dessert specials', price: 'Price on request' },
  { id: 8, category: 'gifting', title: 'Custom Gift Box', desc: 'Curated dessert gift boxes for every occasion', price: 'Price on request' }
]

export default function MenuPage() {
  const [category, setCategory] = useState('all')
  const [products, setProducts] = useState([])

  useEffect(() => {
    // read from localStorage if present else use initialProducts
    const stored = localStorage.getItem('casa_products')
    if (stored) setProducts(JSON.parse(stored))
    else { setProducts(initialProducts); localStorage.setItem('casa_products', JSON.stringify(initialProducts)) }

    // read URL param
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category') || 'all'
    setCategory(cat)
  }, [])

  const filtered = products.filter(p => category === 'all' ? true : p.category === category)

  return (
    <main className="site-body" style={{ padding: 36 }}>
      <SectionHeading title="OUR MENU" subtitle="Something sweet for every craving" />

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 18 }}>
        {['all','tiramisu','cookies','desserts','gifting'].map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 14px', borderRadius: 999, border: category===c ? 'none' : '1.5px solid var(--navy)', background: category===c ? 'var(--navy)' : 'transparent', color: category===c ? '#fff' : 'var(--navy)', fontWeight:600, letterSpacing:'0.08em' }}>{c.toUpperCase()}</button>
        ))}
      </div>

      <div className="featured-grid">
        {filtered.map(p => (
          <article key={p.id} className="featured-card">
            {p.imageBase64 ? (
              <div className="featured-card-img" style={{ backgroundImage: `url(${p.imageBase64})`, backgroundSize:'cover', backgroundPosition:'center' }} />
            ) : (
              <div className="featured-card-img" style={{ background: 'linear-gradient(180deg,#FAF6EE,#fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B3A2A', fontWeight:700 }}>
                {p.title}
              </div>
            )}
            <div className="featured-card-body">
              <h3>{p.title}</h3>
              <p className="featured-card-desc">{p.desc}</p>
              <p style={{ fontWeight:700, color:'var(--navy)', marginTop:8 }}>{p.price}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button
                  type="button"
                  className="btn-order-now"
                  onClick={() => {
                    window.location.href = `${import.meta.env.BASE_URL}?order=${encodeURIComponent(p.title)}&category=${encodeURIComponent(p.category)}#order`
                  }}
                >
                  ORDER NOW
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

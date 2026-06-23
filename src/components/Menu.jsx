import './Menu.css'
import SectionHeading from './SectionHeading'
import tiramisuIcon from '../assets/tiramisu-maroon.svg'
import cookieIcon from '../assets/cookie-maroon.svg'
import cakeIcon from '../assets/cake-maroon.svg'
import giftIcon from '../assets/gift-maroon.svg'

const categories = [
  { title: 'TIRAMISU', desc: 'Classic, Pistachio, Seasonal & more.', icon: tiramisuIcon },
  { title: 'COOKIES', desc: 'Soft, chewy & baked to perfection.', icon: cookieIcon },
  { title: 'DESSERTS', desc: 'Delightful treats to brighten your day.', icon: cakeIcon },
  { title: 'GIFTING', desc: 'Perfect for every special occasion.', icon: giftIcon },
]

export default function Menu() {
  return (
    <section id="about" className="menu-section">
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

      <div className="menu-grid">
        {categories.map((c) => (
          <article key={c.title} className="menu-card">
            <div className="menu-card-arch">
              <img src={c.icon} alt="" className="menu-card-icon"/>
            </div>
            <div className="menu-card-body">
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <a className="btn-outline" href="https://wa.me/message/PZKEKYNNK527M1" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
                <a className="btn-outline" href="https://link.zomato.com/xqzv/rshare?id=13836735730563a0f" target="_blank" rel="noopener noreferrer" style={{ borderColor: '#E23744', color: '#E23744' }}>Order on Zomato</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

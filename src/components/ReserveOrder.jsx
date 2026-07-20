import './ReserveOrder.css'

function ReserveIllustrations() {
  return (
    <svg className="reserve-illustrations" viewBox="0 0 320 200" fill="none" aria-hidden="true">
      {/* Cake under glass dome */}
      <ellipse cx="80" cy="160" rx="50" ry="12" stroke="#fff" strokeWidth="1.2" opacity="0.5"/>
      <path d="M50 160 L50 100 Q80 70 110 100 L110 160" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <path d="M42 100 Q80 55 118 100" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <line x1="80" y1="55" x2="80" y2="42" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="80" cy="42" rx="8" ry="4" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <rect x="62" y="115" width="36" height="28" rx="3" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5"/>

      {/* Coffee cup */}
      <path d="M170 130 L170 90 Q185 80 200 90 L200 130" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.6"/>
      <ellipse cx="185" cy="90" rx="15" ry="5" stroke="#fff" strokeWidth="1.2" opacity="0.6"/>
      <path d="M200 105 Q220 100 220 115 Q220 125 200 120" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <line x1="175" y1="130" x2="195" y2="130" stroke="#fff" strokeWidth="1" opacity="0.4"/>
      <path d="M178 75 Q185 65 192 75" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>

      {/* Flowers in vase */}
      <path d="M260 160 L260 110" stroke="#fff" strokeWidth="1.2" opacity="0.5"/>
      <ellipse cx="260" cy="110" rx="12" ry="6" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <path d="M248 100 Q260 70 272 100" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M252 95 Q245 80 255 85" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M268 95 Q275 78 265 82" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="260" cy="72" r="6" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="248" cy="88" r="5" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="272" cy="88" r="5" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.4"/>
    </svg>
  )
}

export default function ReserveOrder() {
  return (
    <section className="reserve-section">
      <div className="reserve-inner">
        <div className="reserve-content">
          <h2>RESERVE YOUR ORDER</h2>
          <span className="reserve-heart" aria-hidden="true">♡</span>
          <p>DM us on Instagram or WhatsApp to reserve your dessert.</p>
          <div className="reserve-buttons">
            <a href="https://wa.me/message/PZKEKYNNK527M1" className="reserve-btn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              WHATSAPP
            </a>

            <a href="https://www.instagram.com/casa_misuuuuu/" className="reserve-btn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              INSTAGRAM DM
            </a>
          </div>

          <div className="reserve-custom">
            <p className="reserve-custom-text">For custom cakes, party orders &amp; corporate gifting:</p>
            <a
              href="https://wa.me/918591519345?text=Hi%20Casa%20Misu!%20I'd%20like%20to%20discuss%20a%20custom%20order."
              className="reserve-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <ReserveIllustrations />
      </div>
    </section>
  )
}

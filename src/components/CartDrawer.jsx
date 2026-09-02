import { useEffect, useState } from 'react'
import { getCart, updateQuantity, removeFromCart } from '../utils/cartStore'

const NAVY = '#1B2E70'
const RUST = '#8B3A2A'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [cart, setCart] = useState({})

  useEffect(() => {
    setCart(getCart())
    function refresh() {
      setCart(getCart())
    }
    function openDrawer() {
      setOpen(true)
      setCart(getCart())
    }
    window.addEventListener('casamisu:cart-changed', refresh)
    window.addEventListener('casamisu:open-cart', openDrawer)
    return () => {
      window.removeEventListener('casamisu:cart-changed', refresh)
      window.removeEventListener('casamisu:open-cart', openDrawer)
    }
  }, [])

  const items = Object.values(cart).filter((c) => c.quantity > 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function goToCheckout() {
    setOpen(false)
    window.location.href = `${import.meta.env.BASE_URL}?page=checkout`
  }

  return (
    <>
      <div
        style={{ ...styles.backdrop, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div style={{ ...styles.drawer, transform: open ? 'translateX(0)' : 'translateX(100%)' }} role="dialog" aria-modal="true" aria-label="Cart">
        <div style={styles.header}>
          <h3 style={styles.title}>Your Cart</h3>
          <button type="button" style={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div style={styles.body}>
          {items.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} style={styles.item}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                ) : (
                  <div style={styles.itemImgPlaceholder} />
                )}
                <div style={styles.itemInfo}>
                  <strong style={styles.itemName}>{item.name}</strong>
                  {item.size && <div style={styles.itemMeta}>{item.size}</div>}
                  {(item.dietaryPreference || item.message) && (
                    <div style={styles.itemMeta}>
                      {item.dietaryPreference}{item.dietaryPreference && item.message ? ' · ' : ''}
                      {item.message && `"${item.message}"`}
                    </div>
                  )}
                  <div style={styles.qtyRow}>
                    <button type="button" style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button type="button" style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    <button type="button" style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
                <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Subtotal</span>
              <span style={{ color: RUST, fontWeight: 700 }}>₹{total}</span>
            </div>
            <button type="button" style={styles.checkoutBtn} onClick={goToCheckout}>
              Checkout
            </button>
            <button type="button" style={styles.continueBtn} onClick={() => setOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 998,
    transition: 'opacity 0.25s ease',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: 'min(380px, 100vw)',
    background: '#FAF6EE',
    borderLeft: `2px solid ${NAVY}`,
    boxShadow: '-8px 0 24px rgba(0,0,0,0.15)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    fontFamily: 'Georgia, serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    borderBottom: `1px solid ${NAVY}`,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    color: NAVY,
    cursor: 'pointer',
    lineHeight: 1,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 20px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid rgba(27,46,112,0.12)',
  },
  itemImg: {
    width: 56,
    height: 56,
    objectFit: 'cover',
    borderRadius: 8,
    flexShrink: 0,
  },
  itemImgPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    background: '#eee',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 13,
    color: NAVY,
  },
  itemMeta: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: `1.5px solid ${NAVY}`,
    background: 'transparent',
    color: NAVY,
    fontSize: 13,
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
  },
  qtyNum: {
    fontSize: 12,
    fontWeight: 700,
    minWidth: 14,
    textAlign: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: 10,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: 6,
    padding: 0,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 700,
    color: RUST,
    flexShrink: 0,
  },
  footer: {
    padding: '16px 20px',
    borderTop: `1px solid ${NAVY}`,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 15,
    fontWeight: 600,
    color: NAVY,
    marginBottom: 12,
  },
  checkoutBtn: {
    width: '100%',
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '12px',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginBottom: 8,
  },
  continueBtn: {
    width: '100%',
    background: 'transparent',
    color: NAVY,
    border: 'none',
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '4px',
  },
}

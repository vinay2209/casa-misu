import { useEffect, useState } from 'react'
import { addToCart } from '../utils/cartStore'
import { CUSTOMER_PHONE_KEY, rememberCustomerPhone } from '../utils/customerPhone'

const API_BASE = 'https://casa-misu.onrender.com'
const NAVY = '#1B2E70'
const RUST = '#8B3A2A'
const CREAM = '#FAF6EE'
const PHONE_KEY = CUSTOMER_PHONE_KEY

function formatDate(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d)) return '-'
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
  const map = {
    pending: { bg: '#FFA726', label: 'Pending' },
    confirmed: { bg: '#1B2E70', label: 'Confirmed' },
    delivered: { bg: '#2F6B45', label: 'Delivered' },
    cancelled: { bg: '#8B3A2A', label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  return <span style={{ ...styles.badge, background: s.bg }}>{s.label}</span>
}

function paymentBadge(status) {
  const map = {
    pending: { bg: '#FFA726', label: 'Payment Pending' },
    verified: { bg: '#2F6B45', label: 'Payment Verified' },
    failed: { bg: '#8B3A2A', label: 'Payment Failed' },
  }
  const s = map[status] || map.pending
  return <span style={{ ...styles.badge, background: s.bg }}>{s.label}</span>
}

function parseItems(itemsJson) {
  try {
    const arr = JSON.parse(itemsJson)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('')
  const [savedPhone, setSavedPhone] = useState('')
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reordered, setReordered] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(PHONE_KEY)
    if (stored) {
      setSavedPhone(stored)
      lookup(stored)
    }
  }, [])

  async function lookup(number) {
    const digits = number.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Enter a valid phone number')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/orders/mine?phone=${digits}`, { cache: 'no-store' })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
      rememberCustomerPhone(digits)
      setSavedPhone(digits)
    } catch (err) {
      console.error(err)
      setError('Could not look up your orders right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    lookup(phone)
  }

  function changeNumber() {
    localStorage.removeItem(PHONE_KEY)
    setSavedPhone('')
    setOrders(null)
    setPhone('')
    setError('')
  }

  function orderAgain(order) {
    const items = parseItems(order.items)
    items.forEach((item) => addToCart(item))
    setReordered(order._id)
    setTimeout(() => {
      window.location.href = `${import.meta.env.BASE_URL}?page=checkout`
    }, 400)
  }

  const homeUrl = import.meta.env.BASE_URL

  if (!savedPhone) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>My Orders</h2>
          <p style={styles.lede}>Enter the phone number you used when ordering, and we'll show your past orders — no account or password needed.</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              style={styles.input}
              inputMode="tel"
            />
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Looking up…' : 'View My Orders'}
            </button>
          </form>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>My Orders</h2>
        <button type="button" onClick={changeNumber} style={styles.linkBtn}>Not you? Look up a different number</button>
      </div>

      {loading && <p style={styles.lede}>Loading your orders…</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {orders && orders.length === 0 && !loading && (
        <div style={styles.card}>
          <p style={styles.lede}>No orders found for this number yet.</p>
          <a href={`${homeUrl}#menu`} style={styles.btnPrimary}>Browse the Menu</a>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div style={styles.list}>
          {orders.map((order) => {
            const items = parseItems(order.items)
            return (
              <div key={order._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.orderDate}>{formatDate(order.createdAt)}</p>
                    <p style={styles.orderDelivery}>{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}{order.address ? ` · ${order.address}` : ''}</p>
                  </div>
                  <div style={styles.badgeCol}>
                    {statusBadge(order.status)}
                    {paymentBadge(order.paymentStatus)}
                  </div>
                </div>

                <div style={styles.itemsList}>
                  {items.map((item, i) => (
                    <div key={i} style={styles.itemRow}>
                      <span>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                      <span style={{ color: RUST, fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.cardBottom}>
                  <div style={styles.paymentInfo}>
                    <span>Paid via {order.paymentMethod || 'N/A'}</span>
                    <span style={styles.total}>Total: ₹{order.totalAmount}</span>
                  </div>
                  <button type="button" style={styles.btnPrimary} onClick={() => orderAgain(order)}>
                    {reordered === order._id ? 'Added — going to checkout…' : 'Order Again'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '32px 20px 60px',
    fontFamily: 'Georgia, serif',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 24,
    fontWeight: 700,
    color: NAVY,
    margin: 0,
  },
  lede: {
    color: '#555',
    fontSize: 14,
    lineHeight: 1.6,
    margin: '0 0 20px',
  },
  card: {
    background: CREAM,
    border: `2px solid ${NAVY}`,
    borderRadius: 12,
    padding: '24px 22px',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: 200,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  btnPrimary: {
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '10px 24px',
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: NAVY,
    fontSize: 12,
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: 600,
    margin: '10px 0 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: `1px solid rgba(27,46,112,0.15)`,
  },
  orderDate: {
    fontWeight: 700,
    color: NAVY,
    margin: '0 0 4px',
    fontSize: 15,
  },
  orderDelivery: {
    fontSize: 12,
    color: '#666',
    margin: 0,
  },
  badgeCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-end',
  },
  badge: {
    color: '#fff',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  itemsList: {
    marginBottom: 14,
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    padding: '4px 0',
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 12,
    borderTop: `1px solid rgba(27,46,112,0.15)`,
  },
  paymentInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    fontSize: 12,
    color: '#555',
  },
  total: {
    fontWeight: 700,
    color: NAVY,
    fontSize: 14,
  },
}

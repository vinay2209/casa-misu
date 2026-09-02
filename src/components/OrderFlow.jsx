import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { SIZE_OPTIONS } from '../constants/sizeOptions'

const NAVY = '#1B2E70'
const CREAM = '#FAF6EE'
const RUST = '#8B3A2A'
const WHATSAPP_GREEN = '#25D366'
const OWNER_PHONE = '918591519345'
const UPI_ID = '8591519345@kotakbank'

const DEFAULT_PRODUCTS = [
  { id: 'default-1', name: 'Classic Tiramisu', price: 350, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', category: 'tiramisu' },
  { id: 'default-2', name: 'Pistachio Tiramisu', price: 420, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', category: 'tiramisu' },
  { id: 'default-3', name: 'Strawberry Tiramisu', price: 400, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', category: 'tiramisu' },
  { id: 'default-4', name: 'Seasonal Tiramisu', price: 380, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80', category: 'tiramisu' },
  { id: 'default-5', name: 'Cookies Box', price: 250, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80', category: 'cookies' },
  { id: 'default-6', name: 'Gifting Box', price: 600, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', category: 'gifting' },
]

function formatCurrency(amount) {
  return `₹${amount}`
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getISTHours() {
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  const istMs = utcMs + 5.5 * 60 * 60000
  const ist = new Date(istMs)
  return ist.getHours() + ist.getMinutes() / 60
}

function isWithinOrderingHours() {
  const h = getISTHours()
  return h >= 11 && h < 21
}

function todayPlusDaysISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function ProgressSteps({ step }) {
  const steps = [
    { num: 1, label: 'Products' },
    { num: 2, label: 'Method' },
    { num: 3, label: 'Details' },
    { num: 4, label: 'Payment' },
    { num: 5, label: 'Done' },
  ]

  return (
    <div style={styles.progressWrap}>
      {steps.map((s, i) => {
        const completed = step > s.num
        const active = step === s.num
        return (
          <div key={s.num} style={styles.progressItem}>
            <div
              style={{
                ...styles.progressCircle,
                background: completed || active ? NAVY : 'transparent',
                color: completed || active ? '#fff' : NAVY,
                borderColor: NAVY,
              }}
            >
              {completed ? '✓' : s.num}
            </div>
            <span style={{ ...styles.progressLabel, fontWeight: active ? 700 : 400 }}>{s.label}</span>
            {i < steps.length - 1 && (
              <div style={{ ...styles.progressLine, background: completed ? NAVY : '#ccc' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function CartSummary({ cart, total }) {
  const items = Object.values(cart).filter((c) => c.quantity > 0)
  if (items.length === 0) return <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No items selected yet</p>

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} style={styles.cartRowWrap}>
          <div style={styles.cartRow}>
            <span>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
            <span style={{ color: RUST, fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
          </div>
          {(item.dietaryPreference || item.message) && (
            <p style={styles.cartRowNote}>
              {item.dietaryPreference}{item.dietaryPreference && item.message ? ' · ' : ''}
              {item.message && `"${item.message}"`}
            </p>
          )}
        </div>
      ))}
      <div style={styles.cartTotal}>
        <span>Total</span>
        <span style={{ color: RUST, fontWeight: 700 }}>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

function DisclaimerBanner() {
  const [withinHours, setWithinHours] = useState(isWithinOrderingHours())

  useEffect(() => {
    const t = setInterval(() => setWithinHours(isWithinOrderingHours()), 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={styles.disclaimerBanner}>
      <p style={styles.disclaimerTitle}>⏰ Please Note:</p>
      <ul style={styles.disclaimerList}>
        <li>Orders must be placed at least 24 hours in advance</li>
        <li>Order timings: 11:00 AM – 9:00 PM IST only</li>
        <li>Orders placed outside these hours will be confirmed the next business day</li>
      </ul>
      {withinHours ? (
        <p style={styles.disclaimerOk}>✓ We are currently accepting orders</p>
      ) : (
        <p style={styles.disclaimerWarn}>⚠️ You are ordering outside our active hours (11 AM – 9 PM IST). Your order will be confirmed the next business day.</p>
      )}
    </div>
  )
}

function GiftingCard() {
  const msg = encodeURIComponent("Hi! I'm interested in a gifting/custom order. Can you help me?")
  return (
    <div style={styles.giftCard}>
      <p style={styles.giftCardTitle}>🎁 For Gifting &amp; Bulk Orders</p>
      <p style={styles.giftCardText}>
        For personalized gifting boxes, party orders, or custom requests, please reach out to us directly on WhatsApp for the best customization options!
      </p>
      <a
        href={`https://wa.me/${OWNER_PHONE}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.giftWhatsappBtn}
      >
        Chat on WhatsApp
      </a>
    </div>
  )
}

function ScheduleSection({ schedule, setSchedule }) {
  const minDate = todayPlusDaysISO(1)
  const maxDate = todayPlusDaysISO(30)

  return (
    <div style={styles.scheduleBox}>
      <h4 style={styles.scheduleLabel}>When would you like your order?</h4>
      <div style={styles.scheduleToggleRow}>
        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(schedule.orderType === 'asap' ? styles.toggleActive : {}) }}
          onClick={() => setSchedule({ ...schedule, orderType: 'asap' })}
        >
          As Soon As Possible
        </button>
        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(schedule.orderType === 'scheduled' ? styles.toggleActive : {}) }}
          onClick={() => setSchedule({ ...schedule, orderType: 'scheduled' })}
        >
          Schedule for a Specific Date
        </button>
      </div>

      {schedule.orderType === 'asap' && (
        <p style={styles.scheduleHint}>Minimum 24 hours notice required.</p>
      )}

      {schedule.orderType === 'scheduled' && (
        <div style={styles.scheduleFields}>
          <label style={styles.label}>
            Delivery Date
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={schedule.deliveryDate}
              onChange={(e) => setSchedule({ ...schedule, deliveryDate: e.target.value })}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Preferred Time
            <select
              value={schedule.deliveryTimeSlot}
              onChange={(e) => setSchedule({ ...schedule, deliveryTimeSlot: e.target.value })}
              style={styles.input}
            >
              <option value="">Select a time slot</option>
              <option value="Morning (11AM–1PM)">Morning (11AM–1PM)</option>
              <option value="Afternoon (1PM–4PM)">Afternoon (1PM–4PM)</option>
              <option value="Evening (4PM–7PM)">Evening (4PM–7PM)</option>
              <option value="Night (7PM–9PM)">Night (7PM–9PM)</option>
            </select>
          </label>
          <p style={styles.scheduleHint}>We&apos;ll confirm your scheduled slot via phone/WhatsApp</p>
        </div>
      )}
    </div>
  )
}

export default function OrderFlow() {
  const [step, setStep] = useState(1)
  const [products, setProducts] = useState(DEFAULT_PRODUCTS)
  const [cart, setCart] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [schedule, setSchedule] = useState({ orderType: 'asap', deliveryDate: '', deliveryTimeSlot: '' })
  const [transactionId, setTransactionId] = useState('')
  const [txnError, setTxnError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryType: 'pickup',
    address: '',
    specialRequests: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('https://casa-misu-production.up.railway.app/api/menu')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setProducts(
          data.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image || DEFAULT_PRODUCTS[0].image,
            category: item.category,
          }))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Listen for "Order Now" clicks dispatched from product cards elsewhere on the page
  useEffect(() => {
    function handleExternalOrder(e) {
      try {
        const { name, category } = e.detail || {}
        if (!name) return
        addExternalItem(name, category)
        setStep(1)
        const el = document.getElementById('order')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } catch (err) {
        console.error(err)
      }
    }
    window.addEventListener('casamisu:order-now', handleExternalOrder)
    return () => window.removeEventListener('casamisu:order-now', handleExternalOrder)
  }, [products])

  // Listen for fully-configured items from the "Select Options" popup /
  // product detail page — size, dietary preference, message, and quantity
  // are already chosen, so this skips straight past the size-required check.
  useEffect(() => {
    function handleConfiguredItem(e) {
      try {
        const detail = e.detail || {}
        if (!detail.name) return
        addConfiguredItem(detail)
        setStep(1)
        const el = document.getElementById('order')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      } catch (err) {
        console.error(err)
      }
    }
    window.addEventListener('casamisu:add-configured-item', handleConfiguredItem)
    return () => window.removeEventListener('casamisu:add-configured-item', handleConfiguredItem)
  }, [products])

  // Pick up ?order=&category= from a cross-page "Order Now" link (e.g. from /menu)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('order')
    if (!name) return
    addExternalItem(name, params.get('category'))
    setStep(1)
    const el = document.getElementById('order')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [products])

  function addExternalItem(name, category) {
    const match = products.find((p) => p.name.toLowerCase() === name.toLowerCase())
    const id = match ? match.id : `ext-${slugify(name)}`
    const resolvedCategory = match ? match.category : (category || 'tiramisu')
    setCart((prev) => {
      const existing = prev[id]
      return {
        ...prev,
        [id]: {
          ...existing,
          id,
          name: match ? match.name : name,
          category: resolvedCategory,
          size: existing?.size || null,
          price: existing?.size ? existing.price : 0,
          quantity: Math.max(existing?.quantity || 0, 1),
        },
      }
    })
  }

  // From the "Select Options" popup / product detail page — size, price,
  // dietary preference, message, and quantity have already been chosen.
  function addConfiguredItem(detail) {
    const { name, category, size, price, quantity, dietaryPreference, message } = detail
    const match = products.find((p) => p.name.toLowerCase() === name.toLowerCase())
    const id = match ? match.id : `ext-${slugify(name)}`
    const resolvedCategory = match ? match.category : (category || 'tiramisu')
    setCart((prev) => ({
      ...prev,
      [id]: {
        id,
        name: match ? match.name : name,
        category: resolvedCategory,
        size,
        price,
        quantity: Math.max(quantity || 1, 1),
        dietaryPreference,
        message,
      },
    }))
  }

  const cartItems = Object.values(cart).filter((c) => c.quantity > 0)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasSelection = cartItems.length > 0
  const hasGiftingOrBulk = cartItems.some((item) => item.category === 'gifting' || item.quantity > 10)

  function getQty(productId) {
    return cart[productId]?.quantity || 0
  }

  function updateQty(product, delta) {
    setCart((prev) => {
      const current = prev[product.id]
      const currentQty = current?.quantity || 0
      const next = Math.max(0, currentQty + delta)
      if (next === 0) {
        const updated = { ...prev }
        delete updated[product.id]
        return updated
      }
      return {
        ...prev,
        [product.id]: {
          ...current,
          id: product.id,
          name: product.name,
          category: product.category,
          size: current?.size || null,
          price: current?.size ? current.price : 0,
          quantity: next,
        },
      }
    })
  }

  function selectSize(itemId, sizeOption) {
    setCart((prev) => {
      const item = prev[itemId]
      if (!item) return prev
      return { ...prev, [itemId]: { ...item, size: sizeOption.label, price: sizeOption.price } }
    })
    setSizeError(false)
  }

  function handleContinueFromStep1() {
    if (!hasSelection) return
    const missingSize = cartItems.some((item) => !item.size)
    if (missingSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    setStep(2)
  }

  function buildOrderMessage() {
    const lines = cartItems.map((item) => `${item.name}${item.size ? ` (${item.size})` : ''} × ${item.quantity} (${formatCurrency(item.price * item.quantity)})`)
    const scheduleLine = schedule.orderType === 'scheduled' && schedule.deliveryDate
      ? ` Scheduled for ${schedule.deliveryDate}${schedule.deliveryTimeSlot ? ` (${schedule.deliveryTimeSlot})` : ''}.`
      : ''
    return `Hi! I'd like to order: ${lines.join(', ')}. Total: ${formatCurrency(total)}.${scheduleLine} Please confirm my order.`
  }

  function openWhatsApp() {
    const text = encodeURIComponent(buildOrderMessage())
    window.open(`https://wa.me/${OWNER_PHONE}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  async function confirmPayment() {
    if (!transactionId.trim()) {
      setTxnError(true)
      return
    }
    setTxnError(false)
    setSubmitting(true)
    try {
      const res = await fetch('https://casa-misu-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          items: JSON.stringify(cartItems),
          totalAmount: total,
          deliveryType: form.deliveryType,
          address: form.deliveryType === 'delivery' ? form.address : '',
          specialRequests: form.specialRequests,
          deliveryDate: schedule.orderType === 'scheduled' ? schedule.deliveryDate : '',
          deliveryTimeSlot: schedule.orderType === 'scheduled' ? schedule.deliveryTimeSlot : '',
          orderType: schedule.orderType,
          transactionId: transactionId.trim(),
          paymentMethod: 'UPI',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomerName(form.customerName)
        setStep(5)
      } else {
        alert('There was an error confirming your payment. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('There was an error confirming your payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function goToPayment(e) {
    e.preventDefault()
    setStep(4)
  }

  function goHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(1)
    setCart({})
    setForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      deliveryType: 'pickup',
      address: '',
      specialRequests: '',
    })
    setSchedule({ orderType: 'asap', deliveryDate: '', deliveryTimeSlot: '' })
    setTransactionId('')
    setSizeError(false)
    setTxnError(false)
    setCopied(false)
  }

  return (
    <section id="order" className="order-flow-section">
      <div style={styles.wrapper}>
        <ProgressSteps step={step} />

        <DisclaimerBanner />

        {/* STEP 1 */}
        {step === 1 && (
          <div style={styles.stepBox} className="order-step-enter">
            <h2 style={styles.stepTitle}>What would you like to order?</h2>
            <div style={styles.productList}>
              {products.map((product, i) => {
                const qty = getQty(product.id)
                const selected = qty > 0
                return (
                  <article
                    key={product.id}
                    style={{
                      ...styles.productRow,
                      background: selected ? '#fdf6f4' : 'transparent',
                      borderBottom: i === products.length - 1 ? 'none' : '1px solid rgba(27,46,112,0.15)',
                    }}
                  >
                    <img src={product.image} alt={product.name} style={styles.productRowImg} />
                    <div style={styles.productRowBody}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productPrice}>{formatCurrency(product.price)}</p>
                    </div>
                    <div style={styles.qtyRow}>
                      <button type="button" style={styles.qtyBtn} onClick={() => updateQty(product, -1)} aria-label="Decrease quantity">−</button>
                      <span style={styles.qtyNum}>{qty}</span>
                      <button type="button" style={styles.qtyBtn} onClick={() => updateQty(product, 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </article>
                )
              })}
            </div>

            {cartItems.length > 0 && (
              <div style={styles.summaryBox}>
                <h4 style={{ margin: '0 0 12px', color: NAVY }}>Your Selections</h4>
                {cartItems.map((item) => {
                  const sizeList = SIZE_OPTIONS[item.category] || SIZE_OPTIONS.tiramisu
                  return (
                    <div key={item.id} style={styles.selectionItem}>
                      <div style={styles.cartRow}>
                        <span>{item.name} × {item.quantity}</span>
                        <span style={{ color: RUST, fontWeight: 600 }}>
                          {item.size ? formatCurrency(item.price * item.quantity) : 'Select size'}
                        </span>
                      </div>
                      {(item.dietaryPreference || item.message) && (
                        <p style={styles.cartRowNote}>
                          {item.dietaryPreference}{item.dietaryPreference && item.message ? ' · ' : ''}
                          {item.message && `"${item.message}"`}
                        </p>
                      )}
                      <div style={styles.sizeRow}>
                        {sizeList.map((sz) => {
                          const isSelected = item.size === sz.label
                          return (
                            <button
                              key={sz.label}
                              type="button"
                              style={{ ...styles.sizePill, ...(isSelected ? styles.sizePillActive : {}) }}
                              onClick={() => selectSize(item.id, sz)}
                            >
                              {sz.label}
                              <br />
                              ₹{sz.price}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                <div style={styles.cartTotal}>
                  <span>Total</span>
                  <span style={{ color: RUST, fontWeight: 700 }}>{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            {hasGiftingOrBulk ? (
              <GiftingCard />
            ) : (
              <>
                {sizeError && <p style={styles.errorText}>Please select a size to continue</p>}
                <button
                  type="button"
                  style={{ ...styles.btnPrimary, opacity: hasSelection ? 1 : 0.5, cursor: hasSelection ? 'pointer' : 'not-allowed' }}
                  disabled={!hasSelection}
                  onClick={handleContinueFromStep1}
                >
                  Continue
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={styles.stepBox} className="order-step-enter">
            <h2 style={styles.stepTitle}>How would you like to place your order?</h2>

            <ScheduleSection schedule={schedule} setSchedule={setSchedule} />

            <div style={{ ...styles.methodGrid, gridTemplateColumns: '1fr' }}>
              <div style={styles.methodCard}>
                <div style={{ ...styles.methodIcon, background: CREAM, border: `2px solid ${NAVY}` }}>
                  <img src={logo} alt="" style={{ width: 40, height: 'auto' }} />
                </div>
                <h3 style={styles.methodTitle}>Place Order Online</h3>
                <p style={styles.methodDesc}>Fill in your details and pay via UPI to confirm</p>
                <button
                  type="button"
                  style={styles.btnPrimary}
                  onClick={() => setStep(3)}
                >
                  Fill Order Form
                </button>
              </div>
            </div>

            <div style={styles.summaryBox}>
              <CartSummary cart={cart} total={total} />
            </div>

            <button type="button" style={styles.btnBack} onClick={() => setStep(1)}>← Back</button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={styles.stepBox} className="order-step-enter">
            <h2 style={styles.stepTitle}>Almost done! Tell us about yourself</h2>
            <div style={styles.detailsLayout} className="order-details-layout">
              <form onSubmit={goToPayment} style={styles.formCol}>
                <label style={styles.label}>
                  Full Name *
                  <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} style={styles.input} placeholder="Your full name" />
                </label>
                <label style={styles.label}>
                  Phone Number *
                  <input required type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} style={styles.input} placeholder="+91 XXXXX XXXXX" />
                </label>
                <label style={styles.label}>
                  Email (optional)
                  <input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} style={styles.input} placeholder="you@email.com" />
                </label>

                <div style={styles.label}>
                  Delivery Address or Pickup?
                  <div style={styles.toggleRow}>
                    <button
                      type="button"
                      style={{ ...styles.toggleBtn, ...(form.deliveryType === 'pickup' ? styles.toggleActive : {}) }}
                      onClick={() => setForm({ ...form, deliveryType: 'pickup', address: '' })}
                    >
                      Pickup
                    </button>
                    <button
                      type="button"
                      style={{ ...styles.toggleBtn, ...(form.deliveryType === 'delivery' ? styles.toggleActive : {}) }}
                      onClick={() => setForm({ ...form, deliveryType: 'delivery' })}
                    >
                      Delivery
                    </button>
                  </div>
                </div>

                {form.deliveryType === 'delivery' && (
                  <label style={styles.label}>
                    Address *
                    <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...styles.input, minHeight: 80 }} placeholder="Your delivery address" />
                  </label>
                )}

                <label style={styles.label}>
                  Special Requests (optional)
                  <textarea value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} style={{ ...styles.input, minHeight: 70 }} placeholder="Any allergies, preferences, or notes…" />
                </label>

                <button type="submit" style={{ ...styles.btnPrimary, width: '100%' }}>
                  Continue to Payment
                </button>
              </form>

              <div style={styles.summaryCol}>
                <h4 style={{ margin: '0 0 12px', color: NAVY }}>Order Summary</h4>
                <CartSummary cart={cart} total={total} />
              </div>
            </div>

            <button type="button" style={styles.btnBack} onClick={() => setStep(2)}>← Back</button>
          </div>
        )}

        {/* STEP 4 — PAYMENT */}
        {step === 4 && (
          <div style={styles.stepBox} className="order-step-enter">
            <h2 style={styles.stepTitle}>Complete Your Payment</h2>
            <p style={styles.paymentSubtitle}>Pay via UPI to confirm your order</p>

            <div style={styles.paymentBox}>
              <p style={styles.paymentAmount}>Pay {formatCurrency(total)}</p>

              <div style={styles.upiRow}>
                <span style={styles.upiId}>UPI ID: {UPI_ID}</span>
                <button type="button" style={styles.copyBtn} onClick={copyUpiId}>
                  {copied ? 'Copied!' : 'Copy UPI ID'}
                </button>
              </div>

              <div style={styles.orDivider}>— OR —</div>

              <div style={styles.qrBox}>
                <img
                  src={`${import.meta.env.BASE_URL}upi-qr.jpg`}
                  alt="Scan to pay via UPI"
                  style={styles.qrImage}
                />
              </div>
              <p style={styles.qrCaption}>Scan QR to Pay</p>

              <label style={{ ...styles.label, marginTop: 16 }}>
                Transaction ID / UTR *
                <input
                  required
                  value={transactionId}
                  onChange={(e) => { setTransactionId(e.target.value); setTxnError(false) }}
                  style={styles.input}
                  placeholder="Enter after completing payment"
                />
              </label>
              {txnError && <p style={styles.errorText}>Transaction ID is required</p>}

              <button
                type="button"
                style={{ ...styles.btnPrimary, width: '100%', marginTop: 12 }}
                disabled={submitting}
                onClick={confirmPayment}
              >
                {submitting ? 'Confirming…' : 'Confirm Payment'}
              </button>
            </div>

            <button type="button" style={styles.btnBack} onClick={() => setStep(3)}>← Back</button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={{ ...styles.stepBox, textAlign: 'center' }} className="order-step-enter order-confirmed">
            <div style={styles.checkmark} className="order-checkmark">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke={NAVY} strokeWidth="2.5" fill="none"/>
                <path d="M14 24 L21 31 L34 17" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="order-check-path"/>
              </svg>
            </div>
            <h2 style={styles.stepTitle}>Order Placed! 🎉</h2>
            <p style={{ color: '#444', lineHeight: 1.6, margin: '0 0 20px' }}>
              Thank you {customerName}! We&apos;ve received your order and will contact you on {form.customerPhone} to confirm.
            </p>
            <div style={{ ...styles.summaryBox, textAlign: 'left', marginBottom: 24 }}>
              <CartSummary cart={cart} total={total} />
            </div>
            <button type="button" style={styles.btnPrimary} onClick={goHome}>Back to Home</button>
            <div className="order-confetti" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="confetti-piece" style={{ '--i': i }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const styles = {
  wrapper: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '32px 20px 40px',
    fontFamily: 'Georgia, serif',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  progressItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `2px solid ${NAVY}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },
  progressLabel: {
    fontSize: 11,
    color: NAVY,
    letterSpacing: '0.04em',
  },
  progressLine: {
    width: 24,
    height: 2,
    margin: '0 4px',
  },
  disclaimerBanner: {
    background: '#FFF8E7',
    border: `1.5px solid ${RUST}`,
    borderRadius: 8,
    padding: '14px 20px',
    marginBottom: 20,
    fontFamily: 'Georgia, serif',
    color: RUST,
  },
  disclaimerTitle: {
    margin: '0 0 6px',
    fontWeight: 700,
  },
  disclaimerList: {
    margin: '0 0 8px',
    paddingLeft: 18,
    lineHeight: 1.6,
    fontSize: 13,
  },
  disclaimerOk: {
    margin: 0,
    color: '#2e7d32',
    fontWeight: 600,
    fontSize: 13,
  },
  disclaimerWarn: {
    margin: 0,
    color: '#c0392b',
    fontWeight: 600,
    fontSize: 13,
  },
  stepBox: {
    background: CREAM,
    border: `2px solid ${NAVY}`,
    borderRadius: 12,
    padding: '28px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  stepTitle: {
    color: NAVY,
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 20px',
    textAlign: 'center',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    border: `2px solid ${NAVY}`,
    borderRadius: 10,
    background: '#fff',
    overflow: 'hidden',
    marginBottom: 20,
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 14px',
    transition: 'background 0.15s',
  },
  productRowImg: {
    width: 76,
    height: 76,
    objectFit: 'cover',
    borderRadius: 8,
    flexShrink: 0,
  },
  productRowBody: {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
  },
  productName: {
    color: NAVY,
    fontWeight: 700,
    fontSize: 14,
    margin: '0 0 4px',
  },
  productPrice: {
    color: RUST,
    fontWeight: 600,
    margin: 0,
    fontSize: 15,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexShrink: 0,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: `2px solid ${NAVY}`,
    background: 'transparent',
    color: NAVY,
    fontSize: 18,
    cursor: 'pointer',
    lineHeight: 1,
  },
  qtyNum: {
    fontWeight: 700,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryBox: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  selectionItem: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: '1px solid #eee',
  },
  sizeRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  sizePill: {
    flex: '1 1 auto',
    minWidth: 90,
    background: 'transparent',
    border: `1.5px solid ${NAVY}`,
    color: NAVY,
    borderRadius: 999,
    padding: '6px 10px',
    fontFamily: 'Georgia, serif',
    fontSize: 11,
    lineHeight: 1.4,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.2s, color 0.2s',
  },
  sizePillActive: {
    background: NAVY,
    color: '#fff',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
    textAlign: 'center',
    margin: '0 0 12px',
    fontWeight: 600,
  },
  cartRowWrap: {
    padding: '6px 0',
  },
  cartRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  cartRowNote: {
    margin: '2px 0 0',
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 6,
    fontWeight: 700,
    fontSize: 16,
    color: NAVY,
    borderTop: `1px solid ${NAVY}`,
  },
  giftCard: {
    background: '#fff',
    border: `2px solid ${NAVY}`,
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  giftCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: NAVY,
    margin: '0 0 10px',
  },
  giftCardText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.5,
    margin: '0 0 16px',
  },
  giftWhatsappBtn: {
    display: 'inline-block',
    background: WHATSAPP_GREEN,
    color: '#fff',
    padding: '10px 28px',
    borderRadius: 999,
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
  },
  scheduleBox: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  scheduleLabel: {
    margin: '0 0 10px',
    color: NAVY,
    fontSize: 15,
  },
  scheduleToggleRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  scheduleHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    margin: '10px 0 0',
  },
  scheduleFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 14,
  },
  btnPrimary: {
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '12px 32px',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
  },
  btnBack: {
    background: 'transparent',
    border: 'none',
    color: NAVY,
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 16,
    padding: 0,
  },
  methodGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 20,
  },
  methodCard: {
    background: '#fff',
    border: `2px solid ${NAVY}`,
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  methodTitle: {
    color: NAVY,
    fontSize: 16,
    fontWeight: 700,
    margin: '0 0 8px',
  },
  methodDesc: {
    color: '#555',
    fontSize: 14,
    margin: '0 0 16px',
    lineHeight: 1.5,
  },
  detailsLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  summaryCol: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 16,
    alignSelf: 'start',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 13,
    color: NAVY,
    fontWeight: 600,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: `1px solid #ccc`,
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  toggleRow: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  toggleBtn: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: 999,
    border: `2px solid ${NAVY}`,
    background: 'transparent',
    color: NAVY,
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
    fontSize: 13,
  },
  toggleActive: {
    background: NAVY,
    color: '#fff',
  },
  paymentSubtitle: {
    textAlign: 'center',
    color: '#555',
    margin: '-12px 0 20px',
    fontSize: 14,
  },
  paymentBox: {
    background: '#fff',
    border: `2px solid ${NAVY}`,
    borderRadius: 10,
    padding: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 700,
    color: NAVY,
    margin: '0 0 16px',
  },
  upiRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  upiId: {
    fontSize: 14,
    color: '#444',
  },
  copyBtn: {
    background: 'transparent',
    border: `1.5px solid ${NAVY}`,
    color: NAVY,
    borderRadius: 999,
    padding: '6px 14px',
    fontFamily: 'Georgia, serif',
    fontSize: 12,
    cursor: 'pointer',
  },
  orDivider: {
    color: '#999',
    fontSize: 12,
    letterSpacing: '0.1em',
    margin: '8px 0',
  },
  qrBox: {
    width: 200,
    height: 200,
    border: `1.5px solid ${NAVY}`,
    borderRadius: 8,
    margin: '4px auto 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 8,
    boxSizing: 'border-box',
  },
  qrImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  qrCaption: {
    color: NAVY,
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    textAlign: 'center',
    margin: '8px 0 0',
  },
  checkmark: {
    margin: '0 auto 16px',
    animation: 'none',
  },
}

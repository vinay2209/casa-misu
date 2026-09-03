import { useEffect, useState } from 'react'
import { STORE_ADDRESS, DELIVERY_FEE } from '../constants/store'
import { getCart, updateQuantity, removeFromCart, clearCart } from '../utils/cartStore'

const API_BASE = 'https://casa-misu.onrender.com'
const NAVY = '#1B2E70'
const CREAM = '#FAF6EE'
const RUST = '#8B3A2A'

function todayPlusDaysISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function ScheduleSection({ schedule, setSchedule }) {
  const minDate = todayPlusDaysISO(1)
  const maxDate = todayPlusDaysISO(30)

  return (
    <div style={styles.scheduleBox}>
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
            Date
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

export default function CheckoutPage() {
  const [cart, setCart] = useState({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('pickup')
  const [pincode, setPincode] = useState('')
  const [pincodeCheck, setPincodeCheck] = useState({ status: 'idle', eligible: null, distanceKm: null })
  const [schedule, setSchedule] = useState({ orderType: 'asap', deliveryDate: '', deliveryTimeSlot: '' })
  const [checkoutError, setCheckoutError] = useState('')
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', address: '', specialRequests: '' })
  const [settings, setSettings] = useState({ pickupAddresses: [], acceptingOrders: true })
  const [pickupAddress, setPickupAddress] = useState('')

  useEffect(() => {
    setCart(getCart())
    function refresh() {
      setCart(getCart())
    }
    window.addEventListener('casamisu:cart-changed', refresh)
    return () => window.removeEventListener('casamisu:cart-changed', refresh)
  }, [])

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const addresses = Array.isArray(data.pickupAddresses) && data.pickupAddresses.length > 0
          ? data.pickupAddresses
          : [STORE_ADDRESS]
        setSettings({ pickupAddresses: addresses, acceptingOrders: data.acceptingOrders !== false })
        setPickupAddress(addresses[0])
      })
      .catch((err) => {
        console.error(err)
        setPickupAddress(STORE_ADDRESS)
      })
  }, [])

  const cartItems = Object.values(cart).filter((c) => c.quantity > 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = shippingMethod === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (shippingMethod !== 'delivery' || pincode.length !== 6) {
      setPincodeCheck({ status: 'idle', eligible: null, distanceKm: null })
      return
    }
    setPincodeCheck({ status: 'checking', eligible: null, distanceKm: null })
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/delivery/check?pincode=${pincode}`)
        const data = await res.json()
        setPincodeCheck({ status: 'done', eligible: !!data.eligible, distanceKm: data.distanceKm })
      } catch (err) {
        console.error(err)
        setPincodeCheck({ status: 'error', eligible: null, distanceKm: null })
      }
    }, 600)
    return () => clearTimeout(t)
  }, [pincode, shippingMethod])

  async function finalizeOrder(razorpayResponse) {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          items: JSON.stringify(cartItems),
          totalAmount: total,
          deliveryType: shippingMethod,
          address: shippingMethod === 'delivery' ? form.address : pickupAddress,
          deliveryFee,
          deliveryPincode: shippingMethod === 'delivery' ? pincode : '',
          specialRequests: form.specialRequests,
          deliveryDate: schedule.orderType === 'scheduled' ? schedule.deliveryDate : '',
          deliveryTimeSlot: schedule.orderType === 'scheduled' ? schedule.deliveryTimeSlot : '',
          orderType: schedule.orderType,
          transactionId: razorpayResponse.razorpay_payment_id,
          paymentMethod: 'Razorpay',
          razorpayOrderId: razorpayResponse.razorpay_order_id,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
          paymentStatus: 'verified',
        }),
      })
      const data = await res.json()
      if (data.success) {
        clearCart()
        setDone(true)
      } else {
        setCheckoutError(`Payment succeeded but we could not save your order. Please message us on WhatsApp with payment ID: ${razorpayResponse.razorpay_payment_id}`)
      }
    } catch (err) {
      console.error(err)
      setCheckoutError(`Payment succeeded but something went wrong saving your order. Please message us on WhatsApp with payment ID: ${razorpayResponse.razorpay_payment_id}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePayAndPlaceOrder() {
    if (!settings.acceptingOrders) {
      setCheckoutError("We're not currently accepting orders. Please check back soon.")
      return
    }
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setCheckoutError('Please fill in your name and phone number')
      return
    }
    if (shippingMethod === 'delivery') {
      if (pincodeCheck.eligible !== true) {
        setCheckoutError('Please enter a postal code eligible for delivery, or switch to store pickup')
        return
      }
      if (!form.address.trim()) {
        setCheckoutError('Please enter your delivery address')
        return
      }
    }
    if (schedule.orderType === 'scheduled' && (!schedule.deliveryDate || !schedule.deliveryTimeSlot)) {
      setCheckoutError('Please choose a date and time slot')
      return
    }

    setCheckoutError('')
    setSubmitting(true)

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setCheckoutError('Could not load the payment gateway. Please check your connection and try again.')
        setSubmitting(false)
        return
      }

      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })

      if (orderRes.status === 503) {
        setCheckoutError("Online payment isn't set up yet — please message us on WhatsApp to complete your order.")
        setSubmitting(false)
        return
      }

      const orderData = await orderRes.json()
      if (!orderData.orderId) {
        setCheckoutError('Could not start payment. Please try again.')
        setSubmitting(false)
        return
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Casa Misu',
        description: 'Dessert order',
        handler: function (response) {
          finalizeOrder(response)
        },
        prefill: {
          name: form.customerName,
          contact: form.customerPhone,
          email: form.customerEmail,
        },
        theme: { color: NAVY },
        modal: {
          ondismiss: function () {
            setSubmitting(false)
          },
        },
      })
      rzp.on('payment.failed', function () {
        setCheckoutError('Payment failed. Please try again.')
        setSubmitting(false)
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      setCheckoutError('Something went wrong starting payment. Please try again.')
      setSubmitting(false)
    }
  }

  const homeUrl = import.meta.env.BASE_URL

  if (done) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.stepBox, textAlign: 'center' }}>
          <div style={{ margin: '0 auto 16px' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke={NAVY} strokeWidth="2.5" fill="none"/>
              <path d="M14 24 L21 31 L34 17" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={styles.stepTitle}>Order Placed! 🎉</h2>
          <p style={{ color: '#444', lineHeight: 1.6, margin: '0 0 20px' }}>
            Thank you {form.customerName}! We&apos;ve received your order and will contact you on {form.customerPhone} to confirm.
          </p>
          <a href={homeUrl} style={styles.btnPrimary}>Back to Home</a>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.stepBox, textAlign: 'center' }}>
          <h2 style={styles.stepTitle}>Your cart is empty</h2>
          <p style={{ color: '#444', margin: '0 0 20px' }}>Add something delicious before checking out.</p>
          <a href={`${homeUrl}#menu`} style={styles.btnPrimary}>Browse the Menu</a>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.stepBox}>
        <h2 style={styles.stepTitle}>Checkout</h2>
        {!settings.acceptingOrders && (
          <p style={styles.pausedBanner}>
            We&apos;re not currently accepting orders online. Please check back soon, or message us on WhatsApp.
          </p>
        )}
        <div style={styles.checkoutLayout} className="order-details-layout">
          <div style={styles.formCol}>
            <h4 style={styles.sectionTitle}>Contact</h4>
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

            <h4 style={styles.sectionTitle}>Shipping Method</h4>
            <div style={styles.shippingOptions}>
              <button
                type="button"
                style={{ ...styles.shippingCard, ...(shippingMethod === 'pickup' ? styles.shippingCardActive : {}) }}
                onClick={() => setShippingMethod('pickup')}
              >
                <span style={styles.shippingCardTitle}>Store Pickup</span>
                <span style={styles.shippingCardFee}>Free</span>
              </button>
              <button
                type="button"
                style={{ ...styles.shippingCard, ...(shippingMethod === 'delivery' ? styles.shippingCardActive : {}) }}
                onClick={() => setShippingMethod('delivery')}
              >
                <span style={styles.shippingCardTitle}>Local Delivery</span>
                <span style={styles.shippingCardFee}>₹{DELIVERY_FEE}</span>
              </button>
            </div>

            {shippingMethod === 'pickup' && (
              settings.pickupAddresses.length > 1 ? (
                <label style={styles.label}>
                  📍 Pick up from:
                  <select value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} style={styles.input}>
                    {settings.pickupAddresses.map((addr) => (
                      <option key={addr} value={addr}>{addr}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <p style={styles.pickupNote}>📍 Pick up from: {pickupAddress}</p>
              )
            )}

            {shippingMethod === 'delivery' && (
              <>
                <label style={styles.label}>
                  Enter your postal code to check if you are eligible for local delivery:
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={styles.input}
                    placeholder="e.g. 400097"
                    inputMode="numeric"
                    maxLength={6}
                  />
                </label>
                {pincodeCheck.status === 'checking' && <p style={styles.pincodeHint}>Checking…</p>}
                {pincodeCheck.status === 'done' && pincodeCheck.eligible && (
                  <p style={styles.pincodeEligible}>✓ Delivery available to this area ({pincodeCheck.distanceKm} km away)</p>
                )}
                {pincodeCheck.status === 'done' && !pincodeCheck.eligible && (
                  <p style={styles.pincodeIneligible}>Not eligible for delivery — please pick up from store instead</p>
                )}
                {pincodeCheck.status === 'error' && (
                  <p style={styles.pincodeIneligible}>Could not check this postal code right now. Please try again.</p>
                )}

                {pincodeCheck.eligible && (
                  <label style={styles.label}>
                    Delivery Address *
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      style={{ ...styles.input, minHeight: 80 }}
                      placeholder="Flat/House no., street, landmark"
                    />
                  </label>
                )}
              </>
            )}

            <h4 style={styles.sectionTitle}>{shippingMethod === 'delivery' ? 'Delivery' : 'Pickup'} Date &amp; Time</h4>
            <ScheduleSection schedule={schedule} setSchedule={setSchedule} />

            <label style={styles.label}>
              Special Requests (optional)
              <textarea value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} style={{ ...styles.input, minHeight: 60 }} placeholder="Any allergies, preferences, or notes…" />
            </label>

            {checkoutError && <p style={styles.errorText}>{checkoutError}</p>}

            <button
              type="button"
              style={{ ...styles.btnPrimary, width: '100%', display: 'block', ...(submitting || !settings.acceptingOrders ? styles.btnDisabled : {}) }}
              disabled={submitting || !settings.acceptingOrders}
              onClick={handlePayAndPlaceOrder}
            >
              {submitting ? 'Processing…' : `Pay ₹${total}`}
            </button>
          </div>

          <div style={styles.summaryCol}>
            <h4 style={{ margin: '0 0 12px', color: NAVY }}>Order Summary</h4>
            {cartItems.map((item) => (
              <div key={item.id} style={styles.cartRowWrap}>
                <div style={styles.cartRow}>
                  <span>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                  <span style={{ color: RUST, fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                </div>
                {(item.dietaryPreference || item.message) && (
                  <p style={styles.cartRowNote}>
                    {item.dietaryPreference}{item.dietaryPreference && item.message ? ' · ' : ''}
                    {item.message && `"${item.message}"`}
                  </p>
                )}
                <div style={styles.qtyRow}>
                  <button type="button" style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button
                    type="button"
                    style={{ ...styles.qtyBtn, ...(item.quantity >= 5 ? styles.qtyBtnDisabled : {}) }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                    disabled={item.quantity >= 5}
                  >
                    +
                  </button>
                  <button type="button" style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div style={styles.cartRow}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={styles.cartRow}>
              <span>Delivery Fee</span>
              <span>{shippingMethod === 'delivery' ? `₹${DELIVERY_FEE}` : 'Free'}</span>
            </div>
            <div style={styles.cartTotal}>
              <span>Total</span>
              <span style={{ color: RUST, fontWeight: 700 }}>₹{total}</span>
            </div>
          </div>
        </div>

        <a href={`${homeUrl}#menu`} style={styles.btnBack}>← Back to Menu</a>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 20px 60px',
    fontFamily: 'Georgia, serif',
  },
  stepBox: {
    background: CREAM,
    border: `2px solid ${NAVY}`,
    borderRadius: 12,
    padding: '28px 24px',
    position: 'relative',
  },
  stepTitle: {
    color: NAVY,
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 20px',
    textAlign: 'center',
  },
  pausedBanner: {
    background: '#FBF0DD',
    color: '#7A4A12',
    border: '1px solid #E4C588',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
    margin: '0 0 20px',
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 15,
    fontWeight: 700,
    margin: '10px 0 0',
    paddingBottom: 6,
    borderBottom: `1px solid ${NAVY}`,
  },
  shippingOptions: {
    display: 'flex',
    gap: 10,
  },
  shippingCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '12px 10px',
    borderRadius: 10,
    border: `2px solid ${NAVY}`,
    background: '#fff',
    color: NAVY,
    fontFamily: 'Georgia, serif',
    cursor: 'pointer',
  },
  shippingCardActive: {
    background: NAVY,
    color: '#fff',
  },
  shippingCardTitle: {
    fontWeight: 700,
    fontSize: 13,
  },
  shippingCardFee: {
    fontSize: 12,
  },
  pickupNote: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: NAVY,
    margin: 0,
  },
  pincodeHint: {
    fontSize: 12,
    color: '#666',
    margin: 0,
  },
  pincodeEligible: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: 600,
    margin: 0,
  },
  pincodeIneligible: {
    fontSize: 13,
    color: '#c0392b',
    fontWeight: 600,
    margin: 0,
  },
  scheduleBox: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 16,
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
    border: '1px solid #ccc',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
    textAlign: 'center',
    margin: '0 0 4px',
    fontWeight: 600,
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
    display: 'inline-block',
    textAlign: 'center',
    textDecoration: 'none',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  btnBack: {
    display: 'inline-block',
    color: NAVY,
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    textDecoration: 'underline',
    marginTop: 16,
  },
  summaryCol: {
    background: '#fff',
    border: `1px solid ${NAVY}`,
    borderRadius: 8,
    padding: 16,
    alignSelf: 'start',
  },
  cartRowWrap: {
    padding: '6px 0',
    borderBottom: '1px solid #eee',
    marginBottom: 6,
  },
  cartRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    padding: '4px 0',
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
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
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
  qtyBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
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
}

import { useState } from 'react'
import { sizesForCategory } from '../constants/sizeOptions'

const NAVY = '#1B2E70'

export default function ProductOptionsForm({ product, onAdd, submitLabel = 'Add to Order' }) {
  const sizes = sizesForCategory(product.category)
  const [size, setSize] = useState(sizes[0])
  const [dietaryPreference, setDietaryPreference] = useState('Contains Egg')
  const [message, setMessage] = useState('')
  const [quantity, setQuantity] = useState(1)

  function handleAdd() {
    onAdd({
      name: product.name,
      category: product.category,
      size: size.label,
      price: size.price,
      quantity,
      dietaryPreference,
      message: message.trim(),
    })
  }

  return (
    <div style={styles.wrap}>
      <p style={styles.price}>₹{size.price}</p>

      <div style={styles.field}>
        <span style={styles.label}>Weight: {size.label}</span>
        <div style={styles.pillRow}>
          {sizes.map((s) => {
            const active = s.label === size.label
            return (
              <button
                key={s.label}
                type="button"
                style={{ ...styles.pill, ...(active ? styles.pillActive : {}) }}
                onClick={() => setSize(s)}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Dietary Preference: {dietaryPreference}</span>
        <div style={styles.pillRow}>
          {['Contains Egg', 'Eggless'].map((opt) => {
            const active = opt === dietaryPreference
            return (
              <button
                key={opt}
                type="button"
                style={{ ...styles.pill, ...(active ? styles.pillActive : {}) }}
                onClick={() => setDietaryPreference(opt)}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Message on the cake (optional)</span>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Happy Birthday Riya!"
          style={styles.input}
          maxLength={60}
        />
      </label>

      <div style={styles.field}>
        <span style={styles.label}>Quantity</span>
        <div style={styles.qtyRow}>
          <button type="button" style={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span style={styles.qtyNum}>{quantity}</span>
          <button type="button" style={styles.qtyBtn} onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
        </div>
      </div>

      <button type="button" style={styles.addBtn} onClick={handleAdd}>
        {submitLabel}
      </button>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    fontFamily: 'Georgia, serif',
  },
  price: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 700,
    fontSize: 26,
    color: NAVY,
    margin: 0,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: NAVY,
  },
  pillRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    background: 'transparent',
    border: `1.5px solid ${NAVY}`,
    color: NAVY,
    borderRadius: 999,
    padding: '7px 14px',
    fontFamily: 'Georgia, serif',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  pillActive: {
    background: NAVY,
    color: '#fff',
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
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
  addBtn: {
    background: NAVY,
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '13px 28px',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: 4,
  },
}

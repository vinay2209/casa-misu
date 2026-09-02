import { useState } from 'react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div style={styles.bar}>
      <span style={styles.text}>🕐&nbsp; Please Order At Least 24 Hours In Advance</span>
      <button type="button" onClick={() => setVisible(false)} style={styles.close} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}

const styles = {
  bar: {
    background: '#1B2E70',
    color: '#fff',
    textAlign: 'center',
    position: 'relative',
    padding: '10px 44px',
  },
  text: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  close: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 18,
    lineHeight: 1,
    cursor: 'pointer',
    padding: 4,
    opacity: 0.85,
  },
}

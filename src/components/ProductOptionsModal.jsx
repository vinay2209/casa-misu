import ProductOptionsForm from './ProductOptionsForm'
import { addToCart } from '../utils/cartStore'

const NAVY = '#1B2E70'

export default function ProductOptionsModal({ product, onClose }) {
  function goToDetails() {
    let url = `${import.meta.env.BASE_URL}?page=product&name=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`
    if (product.image) url += `&image=${encodeURIComponent(product.image)}`
    window.location.href = url
  }

  function handleAdd(configuredItem) {
    onClose()
    addToCart({ ...configuredItem, image: product.image })
  }

  return (
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" style={styles.close} onClick={onClose} aria-label="Close">×</button>

        {product.image && (
          <div style={{ ...styles.image, backgroundImage: `url(${product.image})` }} />
        )}

        <div style={styles.body}>
          <h3 style={styles.title}>{product.name}</h3>
          <button type="button" style={styles.viewDetails} onClick={goToDetails}>
            View details
          </button>

          <ProductOptionsForm product={product} onAdd={handleAdd} submitLabel="Add to Order" />
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 16,
  },
  modal: {
    background: '#FAF6EE',
    maxWidth: 420,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 10,
    border: `1.5px solid ${NAVY}`,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    right: 12,
    top: 12,
    border: 'none',
    background: '#fff',
    color: NAVY,
    fontSize: 20,
    lineHeight: 1,
    width: 32,
    height: 32,
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 2,
  },
  image: {
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '10px 10px 0 0',
  },
  body: {
    padding: 20,
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 19,
    fontWeight: 700,
    color: NAVY,
    margin: '0 0 6px',
  },
  viewDetails: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: NAVY,
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginBottom: 16,
    display: 'block',
  },
}

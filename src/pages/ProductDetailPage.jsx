import { useEffect, useState } from 'react'
import './ProductDetailPage.css'
import ProductOptionsForm from '../components/ProductOptionsForm'
import { getProductDetails } from '../constants/productDetails'
import { addToCart } from '../utils/cartStore'
import tiramisuIcon from '../assets/tiramisu-maroon.svg'
import cookieIcon from '../assets/cookie-maroon.svg'
import cakeIcon from '../assets/cake-maroon.svg'

const NAVY = '#1B2E70'

const CATEGORY_ICONS = {
  tiramisu: tiramisuIcon,
  cookies: cookieIcon,
  desserts: cakeIcon,
}

export default function ProductDetailPage() {
  const params = new URLSearchParams(window.location.search)
  const name = params.get('name') || ''
  const category = params.get('category') || 'tiramisu'
  const [image, setImage] = useState(params.get('image') || null)
  const [product, setProduct] = useState({ name, category, isAvailable: true })

  useEffect(() => {
    fetch('https://casa-misu.onrender.com/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const match = data.find((item) => item.name?.toLowerCase() === name.toLowerCase())
          if (match) {
            setProduct(match)
            if (match.image) setImage(match.image)
          }
        }
      })
      .catch((err) => console.error(err))
  }, [name])

  const info = getProductDetails(name, category)
  const description = product.description || info.description
  const ingredients = product.ingredients || info.ingredients || 'Ask us for full ingredient details.'
  const contains = product.dietaryOptions?.length ? product.dietaryOptions.join(' | ') : info.contains
  const shelfLife = product.shelfLife || info.bestBefore
  const homeUrl = import.meta.env.BASE_URL
  const menuUrl = `${homeUrl}#menu`

  function handleAdd(configuredItem) {
    addToCart({ ...configuredItem, image })
  }

  return (
    <main style={styles.page}>
      <nav style={styles.breadcrumb}>
        <a href={homeUrl} style={styles.breadcrumbLink}>Home</a>
        <span style={styles.breadcrumbSep}>/</span>
        <a href={menuUrl} style={styles.breadcrumbLink}>Menu</a>
        <span style={styles.breadcrumbSep}>/</span>
        <span>{name}</span>
      </nav>

      <div style={styles.layout} className="product-detail-layout">
        <div style={styles.imageWrap}>
          {image ? (
            <img src={image} alt={name} style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              <img src={CATEGORY_ICONS[category] || cakeIcon} alt="" style={{ width: '35%', opacity: 0.5 }} />
            </div>
          )}
        </div>

        <div style={styles.info}>
          <h1 style={styles.title}>{name}</h1>
          <p style={styles.description}>{description}</p>

          <ProductOptionsForm key={product._id || `${product.name}-${JSON.stringify(product.options || [])}`} product={product} onAdd={handleAdd} submitLabel="Add to Order" />

          <div style={styles.details}>
            <p><strong>Ingredients:</strong> {ingredients}</p>
            <p><strong>Contains:</strong> {contains}</p>
            <p><strong>Shelf Life:</strong> {shelfLife}</p>
          </div>
        </div>
      </div>

      <a href={menuUrl} style={styles.backLink}>← Back to Menu</a>
    </main>
  )
}

const styles = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 20px 60px',
    fontFamily: 'Georgia, serif',
  },
  breadcrumb: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  breadcrumbLink: {
    color: NAVY,
    textDecoration: 'underline',
  },
  breadcrumbSep: {
    margin: '0 8px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 32,
    alignItems: 'start',
  },
  imageWrap: {
    border: `2px solid ${NAVY}`,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    display: 'block',
    width: '100%',
    height: 380,
    objectFit: 'cover',
  },
  imagePlaceholder: {
    height: 380,
    background: 'var(--cream, #FAF6EE)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 28,
    fontWeight: 700,
    color: NAVY,
    margin: '0 0 10px',
  },
  description: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle: 'italic',
    fontSize: 17,
    color: '#555',
    lineHeight: 1.5,
    margin: '0 0 20px',
  },
  details: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid rgba(27,46,112,0.15)',
    fontSize: 14,
    color: '#444',
    lineHeight: 1.7,
  },
  backLink: {
    display: 'inline-block',
    marginTop: 32,
    color: NAVY,
    textDecoration: 'underline',
    fontSize: 14,
  },
}

import { useEffect, useState } from 'react'
import SectionHeading from './SectionHeading'

const CATEGORY_LABELS = {
  all: 'All',
  tiramisu: 'Tiramisu',
  cookies: 'Cookies',
  desserts: 'Desserts',
  gifting: 'Gifting',
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    try {
      const res = await fetch('http://localhost:5050/api/gallery')
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="gallery" className="gallery-section">
      <SectionHeading title="GALLERY" subtitle="A glimpse of our creations" />

      {loading ? (
        <p className="gallery-empty">Loading gallery…</p>
      ) : images.length === 0 ? (
        <p className="gallery-empty">Gallery coming soon…</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <article key={img._id} className="gallery-card">
              <img src={img.imageUrl} alt={img.title || 'Gallery image'} className="gallery-card-img" />
              <div className="gallery-card-overlay">
                {img.category && (
                  <span className="gallery-category-badge">
                    {CATEGORY_LABELS[img.category] || img.category}
                  </span>
                )}
                {img.title && <p className="gallery-card-title">{img.title}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

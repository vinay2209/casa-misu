import './App.css'
import AnnouncementBar from './components/AnnouncementBar'
import HeroSection from './components/HeroSection'
import Menu from './components/Menu'
import ReserveOrder from './components/ReserveOrder'
import CartDrawer from './components/CartDrawer'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import MenuPage from './pages/MenuPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import GalleryPage from './pages/GalleryPage'

export default function App() {
  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()
  const path = typeof window !== 'undefined'
    ? window.location.pathname.replace(new RegExp(`^${import.meta.env.BASE_URL.replace(/\/$/, '')}`), '') || '/'
    : '/'
  const isAdmin = path === '/admin' || path.startsWith('/admin')
  const isMenuPage = path === '/menu' || params.get('page') === 'menu'
  const isProductPage = params.get('page') === 'product'
  const isCheckoutPage = params.get('page') === 'checkout'
  const isGalleryPage = params.get('page') === 'gallery'

  if (isAdmin) {
    return <AdminDashboard />
  }

  if (isGalleryPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection showBanner={false} />
        <div className="site-body">
          <GalleryPage />
          <Footer />
        </div>
        <CartDrawer />
      </div>
    )
  }

  if (isCheckoutPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection showBanner={false} />
        <div className="site-body">
          <CheckoutPage />
          <Footer />
        </div>
        <CartDrawer />
      </div>
    )
  }

  if (isProductPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection showBanner={false} />
        <div className="site-body">
          <ProductDetailPage />
          <Footer />
        </div>
        <CartDrawer />
      </div>
    )
  }

  if (isMenuPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection showBanner={false} />
        <div className="site-body">
          <MenuPage />
          <Footer />
        </div>
        <CartDrawer />
      </div>
    )
  }

  return (
    <div className="site-page">
      <AnnouncementBar />
      <HeroSection />
      <div className="site-body">
        <Menu />
        <FAQ />
        <Footer />
        <ReserveOrder />
      </div>
      <CartDrawer />
    </div>
  )
}

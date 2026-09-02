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

  if (isAdmin) {
    return <AdminDashboard />
  }

  if (isCheckoutPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection />
        <CheckoutPage />
        <Footer />
        <CartDrawer />
      </div>
    )
  }

  if (isProductPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection />
        <ProductDetailPage />
        <Footer />
        <CartDrawer />
      </div>
    )
  }

  if (isMenuPage) {
    return (
      <div className="site-page">
        <AnnouncementBar />
        <HeroSection />
        <MenuPage />
        <Footer />
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

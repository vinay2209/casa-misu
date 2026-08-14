import './App.css'
import HeroSection from './components/HeroSection'
import Gallery from './components/Gallery'
import FeaturedDesserts from './components/FeaturedDesserts'
import Menu from './components/Menu'
import ReserveOrder from './components/ReserveOrder'
import OrderFlow from './components/OrderFlow'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import MenuPage from './pages/MenuPage'

export default function App() {
  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()
  const path = typeof window !== 'undefined'
    ? window.location.pathname.replace(new RegExp(`^${import.meta.env.BASE_URL.replace(/\/$/, '')}`), '') || '/'
    : '/'
  const isAdmin = path === '/admin' || path.startsWith('/admin')
  const isMenuPage = path === '/menu' || params.get('page') === 'menu'

  if (isAdmin) {
    return <AdminDashboard />
  }

  if (isMenuPage) {
    return (
      <div className="site-page">
        <HeroSection />
        <MenuPage />
        <Footer />
      </div>
    )
  }

  return (
    <div className="site-page">
      <HeroSection />
      <div className="site-body">
        <Gallery />
        <FeaturedDesserts />
        <Menu />
        <OrderFlow />
        <FAQ />
        <Footer />
        <ReserveOrder />
      </div>
    </div>
  )
}

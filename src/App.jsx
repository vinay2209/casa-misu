import './App.css'
import HeroSection from './components/HeroSection'
import FeaturedDesserts from './components/FeaturedDesserts'
import Menu from './components/Menu'
import ReserveOrder from './components/ReserveOrder'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import MenuPage from './pages/MenuPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const isAdmin = typeof window !== 'undefined' && window.location.pathname === '/admin'
  const isMenuPage = typeof window !== 'undefined' && window.location.pathname === '/menu'

  if (isAdmin) {
    return <AdminPage />
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
        <FeaturedDesserts />
        <Menu />
        <ReserveOrder />
        <Footer />
      </div>
    </div>
  )
}

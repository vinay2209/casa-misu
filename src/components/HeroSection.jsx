import { useEffect, useState } from 'react'
import './HeroSection.css'
import logo from '../assets/logo.png'
import sketchCake from '../assets/sketch-cake.png'
import sketchMix from '../assets/sketch-mix.png'
import { homeHref, sectionHref, pagePath, galleryHref, myOrdersHref, navigateHome } from '../utils/navLinks'

const RUST = '#8B3A2A'

function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function HeroSection({ showBanner = true }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('https://casa-misu.onrender.com/api/menu', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories([...new Set(data.map((item) => item.category).filter(Boolean))])
        }
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <header id={showBanner ? 'home' : undefined} className={`hero${showBanner ? '' : ' hero-compact'}`}>
      <div className="hero-stripes">
        <nav className="hero-nav">
          <div className="hero-nav-links hero-nav-left">
            <a href={homeHref()} onClick={navigateHome}>Home</a>

            <div className="nav-item-dropdown">
              <a href={sectionHref('menu')} className="nav-main-link">Menu</a>
              <div className="nav-dropdown" aria-hidden="true">
                <a href={pagePath('?page=menu&category=all')}>All</a>
                {categories.map((c) => (
                  <a key={c} href={pagePath(`?page=menu&category=${encodeURIComponent(c)}`)}>{titleCase(c)}</a>
                ))}
              </div>
            </div>

            <a href={pagePath('about.html')}>About Us</a>
            <a href={galleryHref()}>Gallery</a>
          </div>

          <div className="hero-logo-badge">
            <img
              src={logo}
              alt="Casa Misu"
              className="hero-logo-badge-img"
            />
          </div>

          <div className="hero-nav-links hero-nav-right">
            <a href={sectionHref('menu')}>Order</a>
            {['FAQ', 'Contact'].map((l) => (
              <a key={l} href={sectionHref(l.toLowerCase())}>{l}</a>
            ))}
            <a href={myOrdersHref()}>My Orders</a>
            <button
              type="button"
              className="hero-cart"
              aria-label="Open cart"
              onClick={() => window.dispatchEvent(new CustomEvent('casamisu:open-cart'))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.6" fill="none"/>
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {showBanner && (
      <div className="hero-arch-wrap">
        <img
          src={sketchCake}
          alt=""
          className="hero-sketch hero-sketch-left"
          aria-hidden="true"
        />
        <img
          src={sketchMix}
          alt=""
          className="hero-sketch hero-sketch-right"
          aria-hidden="true"
        />

        <div className="hero-arch">
          <div className="hero-content">
            <h1 className="hero-title">
              <img
                src={logo}
                alt="Casa Misu — Crafted fresh at home, with care & love."
                className="hero-logo-full"
              />
            </h1>

            <div className="hero-ornament">
              <span className="hero-ornament-line"/>
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none" aria-hidden="true">
                <circle cx="12" cy="7" r="2.5" stroke={RUST} strokeWidth="1"/>
                <path d="M2 7 Q7 2 12 7 Q17 12 22 7" stroke={RUST} strokeWidth="0.8" fill="none"/>
                <path d="M2 7 Q7 12 12 7 Q17 2 22 7" stroke={RUST} strokeWidth="0.8" fill="none"/>
              </svg>
              <span className="hero-ornament-line"/>
            </div>

            <p className="hero-tagline">
              Non-Alcoholic Homemade<br/>Tiramisu &amp; Desserts
            </p>

            <div className="hero-icons">
              <div className="hero-icon-item">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path d="M21 4C12 4 8 14 8 20C8 30 14 38 21 38C28 38 34 30 34 20C34 14 30 4 21 4Z" stroke={RUST} strokeWidth="1.5" fill="none"/>
                </svg>
                <span>CONTAINS EGGS</span>
              </div>
              <div className="hero-icon-item">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path d="M21 37C21 37 6 27 6 15C6 8 13 5 21 7C29 5 36 8 36 15C36 27 21 37 21 37Z" stroke={RUST} strokeWidth="1.5" fill="none"/>
                  <line x1="21" y1="37" x2="21" y2="12" stroke={RUST} strokeWidth="1.1"/>
                  <path d="M14 18C16 15 26 15 28 18" stroke={RUST} strokeWidth="1" fill="none"/>
                </svg>
                <span>ALCOHOL FREE</span>
              </div>
              <div className="hero-icon-item">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                  <path d="M7 16Q21 34 35 16" stroke={RUST} strokeWidth="1.5" fill="none"/>
                  <line x1="7" y1="16" x2="35" y2="16" stroke={RUST} strokeWidth="1.5"/>
                  <line x1="15" y1="30" x2="27" y2="30" stroke={RUST} strokeWidth="1.4"/>
                  <line x1="16" y1="30" x2="15" y2="38" stroke={RUST} strokeWidth="1.2"/>
                  <line x1="26" y1="30" x2="27" y2="38" stroke={RUST} strokeWidth="1.2"/>
                  <line x1="11" y1="38" x2="31" y2="38" stroke={RUST} strokeWidth="1.4"/>
                </svg>
                <span>EGGLESS AVAILABLE<br/>ON REQUEST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </header>
  )
}

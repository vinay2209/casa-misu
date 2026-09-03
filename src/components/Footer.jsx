import './Footer.css'
import floralSketch from '../assets/floral-maroon.svg'
import { homeHref, sectionHref, pagePath, galleryHref, navigateHome } from '../utils/navLinks'

function WhatsAppIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 3.6A11.7 11.7 0 0 0 12.1.2C5.7.2.5 5.4.5 11.8c0 2.1.6 4.1 1.6 5.9L.4 24l6.5-1.7a11.5 11.5 0 0 0 5.2 1.3h.1c6.4 0 11.6-5.2 11.6-11.6 0-3.1-1.2-6-3.4-8.4Zm-8.3 18c-1.7 0-3.4-.5-4.9-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.5 9.5 0 0 1-1.4-5C2.5 6.5 6.8 2.2 12.1 2.2c2.6 0 5 1 6.8 2.8a9.5 9.5 0 0 1 2.8 6.8c0 5.4-4.3 9.8-9.6 9.8Zm5.3-7.2c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4a5.3 5.3 0 0 1-5.3 5.3H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm0 2A3.3 3.3 0 0 0 4 7.3v9.4A3.3 3.3 0 0 0 7.3 20h9.4a3.3 3.3 0 0 0 3.3-3.3V7.3A3.3 3.3 0 0 0 16.7 4H7.3Zm4.7 3.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 2a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.5-2.7a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1Z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2.24V6l8 5.99L20 6v-.01L12 12 4 6.24Zm0 2.52V18h16V8.76l-7.4 5.55a1 1 0 0 1-1.2 0L4 8.76Z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <ul>
            <li><a href={homeHref()} onClick={navigateHome}>Home</a></li>
            <li><a href={sectionHref('menu')}>Menu</a></li>
            <li><a href={pagePath('about.html')}>About Us</a></li>
            <li><a href={galleryHref()}>Gallery</a></li>
            <li><a href={sectionHref('faq')}>FAQ</a></li>
            <li><a href={sectionHref('contact')}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>OUR MENU</h4>
          <ul>
            <li><a href={sectionHref('menu')}>Tiramisu</a></li>
            <li><a href={sectionHref('menu')}>Cookies</a></li>
            <li><a href={sectionHref('menu')}>Desserts</a></li>
          </ul>
        </div>

        <div className="footer-col footer-center">
          <p className="footer-location">📍 Goregaon, Mumbai</p>
          <p className="footer-fssai">
            <a className="footer-fssai-link" href={pagePath('fssai-license.pdf')} target="_blank" rel="noopener noreferrer">
              ✓ FSSAI Registered · 21526009000496
            </a>
          </p>
        </div>

        <div className="footer-col footer-contact">
          <h4>CONTACT US</h4>
          <ul>
            <li><a className="footer-social-link" href="https://wa.me/message/PZKEKYNNK527M1" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp to reserve</a></li>
            <li><a className="footer-social-link" href="https://www.instagram.com/casa_misuuuuu/" target="_blank" rel="noopener noreferrer"><InstagramIcon /> @casa_misuuuu</a></li>
            <li><a className="footer-social-link" href="mailto:casamisuuuuu2026@gmail.com"><EmailIcon /> casamisuuuuu2026@gmail.com</a></li>
          </ul>
          <img src={floralSketch} alt="" className="footer-floral" aria-hidden="true"/>
        </div>
      </div>

      <div className="footer-bottom">
        © Casa Misu. All Rights Reserved. ♡
      </div>
    </footer>
  )
}

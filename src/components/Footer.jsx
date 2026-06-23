import './Footer.css'
import floralSketch from '../assets/floral-maroon.svg'

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>OUR MENU</h4>
          <ul>
            <li><a href="#menu">Tiramisu</a></li>
            <li><a href="#menu">Cookies</a></li>
            <li><a href="#menu">Desserts</a></li>
            <li><a href="#menu">Gifting</a></li>
          </ul>
        </div>

        <div className="footer-col footer-center">
          <div className="footer-logo-badge">
            <span className="footer-logo-casa">CASA</span>
            <span className="footer-logo-misu">MISU</span>
          </div>
          <p className="footer-location">📍 Goregaon, Mumbai</p>
          <p className="footer-fssai">✓ FSSAI Registered</p>
        </div>

        <div className="footer-col footer-contact">
          <h4>CONTACT US</h4>
          <ul>
            <li><a href="https://wa.me/message/PZKEKYNNK527M1" target="_blank" rel="noopener noreferrer">📱 WhatsApp to reserve</a></li>
            <li><a href="https://www.instagram.com/casa_misuuuuu/" target="_blank" rel="noopener noreferrer">📷 @casa_misuuuu</a></li>
            <li>Goregaon, Mumbai</li>
          </ul>
          <img src={floralSketch} alt="" className="footer-floral" aria-hidden="true"/>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 Casa Misu. All Rights Reserved. ♡
      </div>
    </footer>
  )
}

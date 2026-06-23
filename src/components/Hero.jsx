import React from "react";
import "./Hero.css";

export default function HeroSection() {
  const containerStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "relative",
  };

  const navbarStyle = {
    background: "#FAF6EE",
    border: "2px solid #1B2E70",
    borderRadius: "50px",
    width: "90%",
    maxWidth: "900px",
    padding: "12px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 10,
    marginTop: "16px",
  };

  const navLinkStyle = {
    color: "#1B2E70",
    fontSize: "13px",
    letterSpacing: "0.05em",
    textDecoration: "none",
    fontWeight: 500,
    margin: "0 8px",
  };

  const logoStyle = {
    display: "inline-block",
    border: "2px solid #1B2E70",
    borderRadius: "50px",
    padding: "8px 20px",
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    fontSize: "18px",
    color: "#1B2E70",
    lineHeight: 1.1,
    textAlign: "center",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%) translateY(18px)",
    zIndex: 12,
  };

  const stripeBandStyle = {
    width: "100%",
    height: "180px",
    background:
      "repeating-linear-gradient(90deg, #1B2E70 0px, #1B2E70 36px, #FFFFFF 36px, #FFFFFF 72px)",
    overflow: "hidden",
    zIndex: 1,
    marginTop: "18px",
  };

  const archStyle = {
    width: "82%",
    margin: "0 auto",
    background: "#FAF6EE",
    border: "2px solid #1B2E70",
    borderRadius: "50% 50% 0 0 / 80px 80px 0 0",
    padding: "60px 140px 50px 140px",
    position: "relative",
    marginTop: "-120px",
    minHeight: "400px",
    zIndex: 5,
    boxSizing: "border-box",
  };

  const headingStyle = {
    fontFamily: "Georgia, Times New Roman, serif",
    fontWeight: 900,
    fontSize: "80px",
    color: "#1B2E70",
    textAlign: "center",
    lineHeight: 0.95,
    marginBottom: "16px",
  };

  const misuStyle = {
    letterSpacing: "0.35em",
  };

  const subtitleStyle = {
    fontSize: "12px",
    letterSpacing: "0.18em",
    color: "#1B2E70",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: "8px",
  };

  const taglineStyle = {
    fontFamily: "Georgia, serif",
    fontSize: "26px",
    color: "#1B2E70",
    textAlign: "center",
    fontWeight: 400,
    marginBottom: "28px",
  };

  const iconsRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "20px",
  };

  const iconLabelStyle = {
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#1B2E70",
    textAlign: "center",
  };

  const archInnerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const leftIllustrationStyle = {
    position: "absolute",
    left: "-10px",
    top: "50%",
    transform: "translateY(-60%)",
    width: "130px",
    opacity: 1,
    pointerEvents: "none",
  };

  const rightIllustrationStyle = {
    position: "absolute",
    right: "-10px",
    top: "50%",
    transform: "translateY(-60%)",
    width: "130px",
    opacity: 1,
    pointerEvents: "none",
  };

  return (
    <div style={containerStyle} className="hero-section">
      {/* LAYER 1: NAVBAR (inside hero section) */}
      <nav style={navbarStyle} className="hero-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a style={navLinkStyle} href="#">
            Home
          </a>
          <a style={navLinkStyle} href="#">
            Menu
          </a>
          <a style={navLinkStyle} href="#">
            About Us
          </a>
          <a style={navLinkStyle} href="#">
            Gallery
          </a>
        </div>

        <div style={logoStyle} className="hero-logo">
          <div>CASA</div>
          <div>MISU</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a style={navLinkStyle} href="#">
            Order
          </a>
          <a style={navLinkStyle} href="#">
            FAQ
          </a>
          <a style={navLinkStyle} href="#">
            Contact
          </a>
          <button
            aria-label="Cart"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "18px",
            }}
          >
            🛒
          </button>
        </div>
      </nav>

      {/* LAYER 2: STRIPE BAND (constrained to container width) */}
      <div style={stripeBandStyle} className="hero-stripes" aria-hidden></div>

      {/* LAYER 3: ARCH PANEL */}
      <div style={archStyle} className="hero-arch">
        {/* LEFT ILLUSTRATION (absolute SVG) */}
        <div
          style={leftIllustrationStyle}
          className="hero-left-illustration"
          aria-hidden
        >
          <svg
            width="130"
            height="160"
            viewBox="0 0 130 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 50C20 50 10 35 25 28C25 28 22 44 20 50Z"
              stroke="#8B3A2A"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M15 44C15 44 4 32 14 22C14 22 18 36 15 44Z"
              stroke="#8B3A2A"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M28 42C28 42 22 28 34 24C34 24 32 38 28 42Z"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <line
              x1="20"
              y1="50"
              x2="18"
              y2="35"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
            <rect
              x="18"
              y="90"
              width="88"
              height="38"
              rx="3"
              stroke="#8B3A2A"
              strokeWidth="1.3"
              fill="none"
            />
            <line
              x1="24"
              y1="96"
              x2="100"
              y2="96"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
            <line
              x1="24"
              y1="100"
              x2="100"
              y2="100"
              stroke="#8B3A2A"
              strokeWidth="0.6"
            />
            <line
              x1="24"
              y1="104"
              x2="100"
              y2="104"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
            <line
              x1="18"
              y1="110"
              x2="106"
              y2="110"
              stroke="#8B3A2A"
              strokeWidth="1.1"
            />
            <circle
              cx="32"
              cy="120"
              r="3.5"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="48"
              cy="120"
              r="3.5"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="64"
              cy="120"
              r="3.5"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="80"
              cy="120"
              r="3.5"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="96"
              cy="120"
              r="3.5"
              stroke="#8B3A2A"
              strokeWidth="1"
              fill="none"
            />
            <ellipse
              cx="62"
              cy="132"
              rx="50"
              ry="8"
              stroke="#8B3A2A"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>

        {/* RIGHT ILLUSTRATION (absolute SVG) */}
        <div
          style={rightIllustrationStyle}
          className="hero-right-illustration"
          aria-hidden
        >
          <svg
            width="130"
            height="160"
            viewBox="0 0 130 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="95"
              y1="10"
              x2="72"
              y2="58"
              stroke="#8B3A2A"
              strokeWidth="1.6"
            />
            <path
              d="M62 55C54 44 54 70 63 70C72 70 73 44 65 55"
              stroke="#8B3A2A"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M68 57C77 46 79 72 70 73C61 73 60 46 68 57"
              stroke="#8B3A2A"
              strokeWidth="1.1"
              fill="none"
            />
            <line
              x1="22"
              y1="88"
              x2="108"
              y2="88"
              stroke="#8B3A2A"
              strokeWidth="1.4"
            />
            <path
              d="M22 88Q65 138 108 88"
              stroke="#8B3A2A"
              strokeWidth="1.4"
              fill="none"
            />
            <line
              x1="50"
              y1="132"
              x2="80"
              y2="132"
              stroke="#8B3A2A"
              strokeWidth="1.3"
            />
            <line
              x1="54"
              y1="132"
              x2="52"
              y2="142"
              stroke="#8B3A2A"
              strokeWidth="1.3"
            />
            <line
              x1="76"
              y1="132"
              x2="78"
              y2="142"
              stroke="#8B3A2A"
              strokeWidth="1.3"
            />
            <line
              x1="46"
              y1="142"
              x2="84"
              y2="142"
              stroke="#8B3A2A"
              strokeWidth="1.3"
            />
            <line
              x1="90"
              y1="72"
              x2="100"
              y2="66"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
            <line
              x1="92"
              y1="80"
              x2="103"
              y2="78"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
            <line
              x1="88"
              y1="88"
              x2="96"
              y2="92"
              stroke="#8B3A2A"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* ARCH INNER CONTENT */}
        <div style={archInnerStyle} className="arch-inner-content">
          <h1 style={headingStyle} className="arch-title">
            <span className="arch-casa">CASA</span>
            <br />
            <span className="arch-misu" style={misuStyle}>
              MISU
            </span>
          </h1>

          <div style={subtitleStyle}>
            CRAFTED FRESH AT HOME, WITH CARE &amp; LOVE.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: "8px 0",
            }}
          >
            <div
              style={{ height: "1px", width: "60px", background: "#1B2E70" }}
            />
            <span style={{ color: "#1B2E70", fontSize: "10px" }}>✦</span>
            <div
              style={{ height: "1px", width: "60px", background: "#1B2E70" }}
            />
          </div>

          <div style={taglineStyle} className="arch-tagline">
            <div>Non-Alcoholic Homemade</div>
            <div>Tiramisu &amp; Desserts</div>
          </div>

          <div style={iconsRowStyle} className="arch-icons-row">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4C11 4 8 12 8 18C8 27 13 34 19 34C25 34 30 27 30 18C30 12 27 4 19 4Z"
                  stroke="#8B3A2A"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
              <div style={iconLabelStyle}>Contains Eggs</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 33C19 33 6 24 6 14C6 8 12 5 19 7C26 5 32 8 32 14C32 24 19 33 19 33Z"
                  stroke="#8B3A2A"
                  strokeWidth="1.4"
                  fill="none"
                />
                <line x1="19" y1="33" x2="19" y2="11" stroke="#8B3A2A" strokeWidth="1" />
                <path d="M13 17C15 14 23 14 25 17" stroke="#8B3A2A" strokeWidth="1" fill="none" />
              </svg>
              <div style={iconLabelStyle}>Alcohol Free</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 15Q19 32 31 15"
                  stroke="#8B3A2A"
                  strokeWidth="1.4"
                  fill="none"
                />
                <line x1="7" y1="15" x2="31" y2="15" stroke="#8B3A2A" strokeWidth="1.4" />
                <line x1="15" y1="29" x2="23" y2="29" stroke="#8B3A2A" strokeWidth="1.4" />
                <line x1="16" y1="29" x2="15" y2="35" stroke="#8B3A2A" strokeWidth="1.2" />
                <line x1="22" y1="29" x2="23" y2="35" stroke="#8B3A2A" strokeWidth="1.2" />
                <line x1="12" y1="35" x2="26" y2="35" stroke="#8B3A2A" strokeWidth="1.4" />
              </svg>
              <div style={iconLabelStyle}>Eggless Available on Request</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <div className="section-heading-row">
        <span className="section-flourish-line"/>
        <svg className="section-flourish-deco" width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
          <path d="M1 5 Q5 1 9 5 Q13 9 17 5" stroke="#8B3A2A" strokeWidth="0.8" fill="none"/>
          <circle cx="9" cy="5" r="1.5" fill="#8B3A2A"/>
        </svg>
        <h2 className="section-title">{title}</h2>
        <svg className="section-flourish-deco" width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
          <path d="M1 5 Q5 1 9 5 Q13 9 17 5" stroke="#8B3A2A" strokeWidth="0.8" fill="none"/>
          <circle cx="9" cy="5" r="1.5" fill="#8B3A2A"/>
        </svg>
        <span className="section-flourish-line"/>
      </div>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  )
}

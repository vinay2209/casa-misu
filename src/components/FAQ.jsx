import './FAQ.css'
import SectionHeading from './SectionHeading'
import { useState } from 'react'

const FAQS = [
  {
    q: 'How far in advance do I need to order?',
    a: 'At least 24 hours in advance. We accept orders between 11:00 AM – 9:00 PM IST — anything placed outside those hours is confirmed the next business day.',
  },
  {
    q: 'Is everything eggless?',
    a: 'Eggless is available on request for most items — just let us know when you place your order.',
  },
  {
    q: 'Is your tiramisu alcohol-free?',
    a: 'Yes, completely non-alcoholic and safe for everyone to enjoy.',
  },
  {
    q: 'How do I pay?',
    a: 'Payments are processed securely through Razorpay. You can use UPI, credit or debit cards, net banking, wallets, and any other payment option available at checkout.',
  },
  {
    q: 'Do you deliver, or is it pickup only?',
    a: 'Both — you can choose pickup or delivery while filling out your order details.',
  },
  {
    q: 'Can I order in bulk, for a party, or for gifting?',
    a: 'Yes — for gifting boxes, party orders, or custom requests, message us directly on WhatsApp for the best options.',
  },
  {
    q: 'Are you FSSAI registered?',
    a: 'Yes — registration number 21526009000496. You can view the certificate linked in the footer below.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="faq-section">
      <SectionHeading title="FAQ" subtitle="Everything you need to know before you order" />
      <div className="faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={item.q} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="faq-toggle-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="faq-answer">{item.a}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

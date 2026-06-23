import './FeaturedDesserts.css'
import './OrderButtons.css'
import SectionHeading from './SectionHeading'
import { useState } from 'react'
import ProductModal from './ProductModal'

const products = [
	{
		title: 'CLASSIC TIRAMISU',
		desc: 'Timeless. Creamy. Irresistible.',
		img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80',
	},
	{
		title: 'PISTACHIO TIRAMISU',
		desc: 'Rich mascarpone with roasted pistachios.',
		img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80',
	},
	{
		title: 'STRAWBERRY TIRAMISU',
		desc: 'Fresh, fruity & perfectly balanced.',
		img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80',
	},
	{
		title: 'SEASONAL TIRAMISU',
		desc: 'Made with seasonal love & ingredients.',
		img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=80',
	},
]

export default function FeaturedDesserts() {
	const [open, setOpen] = useState(null)

	return (
		<section id="menu" className="featured-section">
			<SectionHeading
				title="FEATURED DESSERTS"
				subtitle="Handmade with the finest ingredients"
			/>

			<div className="featured-grid">
				{products.map((p) => (
					<article key={p.title} className="featured-card" onClick={() => setOpen(p.title)}>
						<div
							className="featured-card-img"
							style={{ backgroundImage: `url(${p.img})` }}
						/>
						<div className="featured-card-body">
							<h3>{p.title}</h3>
							<p className="featured-card-desc">{p.desc}</p>

							<div
								style={{
									display: 'flex',
									gap: 8,
									marginTop: 'auto',
								}}
							>
								<a
									className="btn-order btn-whatsapp"
									href="https://wa.me/message/PZKEKYNNK527M1"
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>
									ORDER ON WHATSAPP
								</a>

								<a
									className="btn-order btn-zomato"
									href="https://link.zomato.com/xqzv/rshare?id=13836735730563a0f"
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
								>
									<span className="z-dot" aria-hidden>
										Z
									</span>
									ORDER ON ZOMATO
								</a>
							</div>
						</div>
					</article>
				))}
			</div>

			<div className="featured-cta">
				<button type="button" className="btn-primary">
					EXPLORE FULL MENU
				</button>
			</div>

			{open && <ProductModal productTitle={open} onClose={() => setOpen(null)} />}
		</section>
	)
}

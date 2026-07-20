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
		category: 'tiramisu',
	},
	{
		title: 'PISTACHIO TIRAMISU',
		desc: 'Rich mascarpone with roasted pistachios.',
		img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80',
		category: 'tiramisu',
	},
	{
		title: 'STRAWBERRY TIRAMISU',
		desc: 'Fresh, fruity & perfectly balanced.',
		img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80',
		category: 'tiramisu',
	},
	{
		title: 'SEASONAL TIRAMISU',
		desc: 'Made with seasonal love & ingredients.',
		img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&q=80',
		category: 'tiramisu',
	},
]

function orderNow(e, product) {
	e.stopPropagation()
	window.dispatchEvent(new CustomEvent('casamisu:order-now', { detail: { name: product.title, category: product.category } }))
}

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
								<button
									type="button"
									className="btn-order-now"
									onClick={(e) => orderNow(e, p)}
								>
									ORDER NOW
								</button>
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

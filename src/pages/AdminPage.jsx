import React, { useState, useEffect, useRef } from 'react'
import '../components/FeaturedDesserts.css'

const initialProducts = [
  { id: 1, category: 'tiramisu', title: 'Classic Tiramisu', desc: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream', price: '₹450 (250g) / ₹590 (350g) / ₹1040 (700g)' },
  { id: 2, category: 'tiramisu', title: 'Pistachio Tiramisu', desc: 'Signature creamy mascarpone infused with roasted pistachio paste, topped with crushed pistachios', price: '₹520 (250g) / ₹660 (350g) / ₹1130 (700g)' },
  { id: 3, category: 'tiramisu', title: 'Seasonal Flavoured Tiramisu', desc: 'Fresh seasonal ingredients perfectly layered into our classic tiramisu', price: '₹710 (350g) / ₹1290 (700g)' },
  { id: 4, category: 'cookies', title: 'Brown Butter & Sea Salt Cookie', desc: 'Eggless. Nutty brown butter with a hint of sea salt', price: '₹290 (pack of 2) / ₹560 (pack of 4) / ₹830 (pack of 6)' },
  { id: 5, category: 'cookies', title: 'Tiramisu Cookie', desc: 'All the flavour of tiramisu in a soft chewy cookie', price: '₹320 (pack of 2) / ₹620 (pack of 4) / ₹920 (pack of 6)' },
  { id: 6, category: 'cookies', title: 'Nutella Cookie Tin', desc: 'Rich Nutella-filled cookies in a beautiful gifting tin', price: '₹460 (small) / ₹740 (medium) / ₹1290 (large)' },
  { id: 7, category: 'desserts', title: 'Seasonal Dessert', desc: 'Ask us about our rotating seasonal dessert specials', price: 'Price on request' },
  { id: 8, category: 'gifting', title: 'Custom Gift Box', desc: 'Curated dessert gift boxes for every occasion', price: 'Price on request' }
]

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: 'tiramisu', desc: '', price: '', imageBase64: '' })
  const fileRef = useRef(null)

  useEffect(() => {
    const auth = sessionStorage.getItem('casamisu_admin')
    if (auth === '1') setLoggedIn(true)

    const stored = localStorage.getItem('casa_products')
    if (stored) setProducts(JSON.parse(stored))
    else { localStorage.setItem('casa_products', JSON.stringify(initialProducts)); setProducts(initialProducts) }
  }, [])

  function doLogin() {
    if (password === 'casamisu2024') {
      sessionStorage.setItem('casamisu_admin', '1')
      setLoggedIn(true)
      setError('')
    } else setError('Invalid password')
  }

  function logout() {
    sessionStorage.removeItem('casamisu_admin')
    setLoggedIn(false)
    setPassword('')
  }

  function saveProducts(arr) { localStorage.setItem('casa_products', JSON.stringify(arr)); setProducts(arr) }

  function addNew() { setEditing('new'); setForm({ title: '', category: 'tiramisu', desc: '', price: '', imageBase64: '' }) }
  function editItem(it) { setEditing(it.id); setForm({ title: it.title, category: it.category, desc: it.desc, price: it.price, imageBase64: it.imageBase64 || '' }) }
  function deleteItem(id) { if (confirm('Delete this product?')) { const arr = products.filter(p=>p.id!==id); saveProducts(arr) } }
  function saveForm() {
    if (editing === 'new') {
      const id = Date.now(); const arr = [...products, { id, ...form }]; saveProducts(arr); setEditing(null)
    } else {
      const arr = products.map(p => p.id === editing ? { ...p, ...form } : p); saveProducts(arr); setEditing(null)
    }
  }

  // handle file selection and convert to base64
  function onChooseFile(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(ev) {
      const base64 = ev.target.result
      setForm(prev => ({ ...prev, imageBase64: base64 }))
    }
    reader.readAsDataURL(file)
  }

  if (!loggedIn) {
    return (
      <main style={{ padding: 36 }}>
        <div style={{ maxWidth: 520, margin: '40px auto', background: 'var(--cream)', padding: 24, border: '1px solid var(--navy)', borderRadius:6 }}>
          <img src="/src/assets/logo.png" alt="Casa Misu" style={{ display:'block', margin:'0 auto 12px', maxWidth:220 }} />
          <h3 style={{ textAlign:'center' }}>Admin Login</h3>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{ width:'100%', padding:10, margin:'10px 0', border:'1px solid #ccc' }} />
          {error && <div style={{ color:'crimson', marginBottom:8 }}>{error}</div>}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button className="btn-outline" onClick={()=>setPassword('')}>Cancel</button>
            <button className="btn-primary" onClick={doLogin}>Enter Dashboard</button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ padding: 36 }}>
      <div style={{ display:'flex', gap:24, maxWidth:1200, margin:'0 auto' }}>
        <aside style={{ width:240, background: 'var(--cream)', padding:16, border:'1px solid var(--navy)', borderRadius:6 }}>
          <div style={{ marginBottom:12, fontWeight:700 }}>Admin</div>
          <nav style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button className="btn-outline">Products</button>
            <button className="btn-outline">Orders</button>
            <button className="btn-outline">Settings</button>
          </nav>
          <div style={{ marginTop:24 }}>
            <button className="btn-outline" onClick={logout}>Logout</button>
          </div>
        </aside>

        <section style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <h2 style={{ margin:0 }}>Products</h2>
            <div>
              <button className="btn-primary" onClick={addNew}>+ Add New Product</button>
            </div>
          </div>

          <div>
            {editing && (
              <div style={{ marginBottom:12, padding:12, background:'var(--cream)', border:'1px solid var(--navy)' }}>
                <div style={{ display:'flex', gap:8 }}>
                  <input placeholder="Product Name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{ flex:1 }} />
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    <option value="tiramisu">Tiramisu</option>
                    <option value="cookies">Cookies</option>
                    <option value="desserts">Desserts</option>
                    <option value="gifting">Gifting</option>
                  </select>
                </div>
                <textarea placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{ width:'100%', height:80, marginTop:8 }} />

                {/* PRODUCT IMAGE UPLOAD FIELD */}
                <div style={{ marginTop:8 }}>
                  <label style={{ display:'block', fontFamily:'Montserrat, system-ui', fontSize:11, textTransform:'uppercase', letterSpacing:'1.5px', color:'var(--navy)', marginBottom:6 }}>PRODUCT IMAGE</label>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onChooseFile} style={{ display:'none' }} />
                    <button type="button" className="btn-outline" onClick={()=>fileRef.current && fileRef.current.click()}>Choose Image</button>
                    {form.imageBase64 && (
                      <img src={form.imageBase64} alt="Preview" style={{ maxHeight:120, objectFit:'contain', border:'1px solid rgba(0,0,0,0.06)', padding:4 }} />
                    )}
                  </div>
                </div>

                <input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={{ width:'100%', marginTop:8 }} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 }}>
                  <button className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
                  <button className="btn-primary" onClick={saveForm}>Save</button>
                </div>
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {products.map(p=> (
                <div key={p.id} style={{ background:'#fff', border:'1px solid var(--navy)', padding:12, borderRadius:6 }}>
                  {/* show uploaded image if present */}
                  {p.imageBase64 ? (
                    <img src={p.imageBase64} alt={p.title} style={{ width:'100%', height:110, objectFit:'cover' }} />
                  ) : (
                    <div style={{ height:110, background:'#FAF6EE', display:'flex', alignItems:'center', justifyContent:'center', color:'#8B3A2A', fontWeight:700 }}>{p.title}</div>
                  )}

                  <h4 style={{ margin:'8px 0 0' }}>{p.title}</h4>
                  <div style={{ fontSize:13, color:'#555' }}>{p.desc}</div>
                  <div style={{ marginTop:8, display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button className="btn-outline" onClick={()=>editItem(p)}>Edit</button>
                    <button className="btn-outline" onClick={()=>deleteItem(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

import React, { useEffect, useState } from 'react'

const CATEGORY_LABELS = {
  all: 'All',
  tiramisu: 'Tiramisu',
  cookies: 'Cookies',
  desserts: 'Desserts',
  gifting: 'Gifting',
}

export default function AdminDashboard(){
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [menuItems, setMenuItems] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryForm, setGalleryForm] = useState({ title: '', imageUrl: '', category: 'all' })
  const [loginForm, setLoginForm] = useState({ username:'', password:'' })

  useEffect(()=>{ if(token) fetchStats(); if(token) fetchOrders(); if(token) fetchMenu(); if(token) fetchGallery(); }, [token])

  async function fetchStats(){
    try{
      const res = await fetch('http://localhost:5050/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json(); setStats(data)
    }catch(err){ console.error(err) }
  }
  async function fetchOrders(){
    try{
      const url = filter==='all' ? 'http://localhost:5050/api/orders' : `http://localhost:5050/api/orders?status=${filter}`
      const res = await fetch(url, { headers:{ Authorization: `Bearer ${token}` } })
      const data = await res.json(); setOrders(data)
    }catch(err){ console.error(err) }
  }
  async function fetchMenu(){
    try{ const res = await fetch('http://localhost:5050/api/menu'); const data = await res.json(); setMenuItems(data) }catch(err){ console.error(err) }
  }
  async function fetchGallery(){
    try{
      const res = await fetch('http://localhost:5050/api/gallery', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setGalleryImages(Array.isArray(data) ? data : [])
    }catch(err){ console.error(err) }
  }

  async function handleLogin(e){
    e.preventDefault(); setLoading(true);
    try{
      const res = await fetch('http://localhost:5050/api/admin/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(loginForm) })
      const data = await res.json();
      if(res.ok && data.token){ localStorage.setItem('admin_token', data.token); setToken(data.token); }
      else alert(data.message || 'Login failed')
    }catch(err){ console.error(err); alert('Login error') }
    setLoading(false);
  }

  function logout(){ localStorage.removeItem('admin_token'); setToken(null); setStats(null); setOrders([]); setGalleryImages([]); }

  async function updateOrderStatus(id, status){
    try{
      await fetch(`http://localhost:5050/api/orders/${id}/status`, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
      fetchOrders(); fetchStats();
    }catch(err){ console.error(err) }
  }

  async function deleteOrder(id){ if(!confirm('Delete order?')) return; try{ await fetch(`http://localhost:5050/api/orders/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchOrders(); fetchStats(); }catch(err){ console.error(err) } }

  async function markPaymentVerified(id){
    try{
      await fetch(`http://localhost:5050/api/orders/${id}/payment`, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ paymentStatus: 'verified' }) })
      fetchOrders()
    }catch(err){ console.error(err) }
  }

  function formatScheduledDate(dateStr){
    if(!dateStr) return '-'
    const d = new Date(dateStr)
    if(isNaN(d)) return '-'
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  function formatItemsWithSize(itemsJson){
    try{
      const arr = JSON.parse(itemsJson)
      if(!Array.isArray(arr)) return itemsJson
      return arr.map(i => `${i.name}${i.size ? ` (${i.size})` : ''} × ${i.quantity}`).join(', ')
    }catch{
      return itemsJson
    }
  }

  function paymentStatusBadge(status){
    const map = {
      pending: { bg:'#FFA726', label:'Pending' },
      verified: { bg:'#43A047', label:'Verified' },
      failed: { bg:'#E53935', label:'Failed' },
    }
    const s = map[status] || map.pending
    return <span style={{ background:s.bg, color:'#fff', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}>{s.label}</span>
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const aScheduled = a.orderType === 'scheduled' ? 0 : 1
    const bScheduled = b.orderType === 'scheduled' ? 0 : 1
    return aScheduled - bScheduled
  })

  async function addMenuItem(e){ e.preventDefault(); const form = e.target; const body = { name: form.name.value, category: form.category.value, description: form.description.value, price: Number(form.price.value), image: form.image.value, isFeatured: form.isFeatured.checked }; try{ await fetch('http://localhost:5050/api/menu', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(body) }); fetchMenu(); form.reset(); }catch(err){ console.error(err) } }

  async function deleteMenuItem(id){ if(!confirm('Delete item?')) return; try{ await fetch(`http://localhost:5050/api/menu/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

  async function toggleAvailability(id){ try{ await fetch(`http://localhost:5050/api/menu/${id}/availability`, { method:'PATCH', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

  async function addGalleryImage(e){
    e.preventDefault()
    if(!galleryForm.imageUrl.trim()){ alert('Image URL is required'); return }
    try{
      await fetch('http://localhost:5050/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(galleryForm),
      })
      setGalleryForm({ title: '', imageUrl: '', category: 'all' })
      fetchGallery()
    }catch(err){ console.error(err) }
  }

  async function toggleGalleryVisibility(id, currentVisible){
    try{
      await fetch(`http://localhost:5050/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isVisible: !currentVisible }),
      })
      fetchGallery()
    }catch(err){ console.error(err) }
  }

  async function deleteGalleryImage(id){
    if(!confirm('Delete this gallery image?')) return
    try{
      await fetch(`http://localhost:5050/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      fetchGallery()
    }catch(err){ console.error(err) }
  }

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    borderRadius: 999,
    border: '2px solid #1B2E70',
    background: activeTab === tab ? '#1B2E70' : 'transparent',
    color: activeTab === tab ? '#fff' : '#1B2E70',
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 13,
    letterSpacing: '0.06em',
  })

  return (
    <div style={{ padding:24, fontFamily:'Georgia, serif' }}>
      {!token && (
        <div style={{ maxWidth:420, margin:'80px auto', padding:24, border:'1px solid #ccc', borderRadius:8, background:'#FAF6EE' }}>
          <h2 style={{ textAlign:'center', color:'#1B2E70' }}>Casa Misu Admin</h2>
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input name="username" placeholder="Username" value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username:e.target.value})} style={{ padding:8 }} />
            <input name="password" type="password" placeholder="Password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} style={{ padding:8 }} />
            <button style={{ background:'#1B2E70', color:'#fff', padding:10, borderRadius:6 }} disabled={loading}>{loading? 'Loading...':'Login'}</button>
          </form>
        </div>
      )}

      {token && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h2 style={{ color:'#1B2E70' }}>Casa Misu Admin</h2>
            <button onClick={logout} style={{ background:'#8B3A2A', color:'#fff', padding:'8px 12px', borderRadius:6 }}>Logout</button>
          </div>

          <div style={{ display:'flex', gap:12, marginBottom:16 }}>
            <div style={{ padding:12, background:'#FAF6EE', border:'1px solid #ddd', minWidth:120 }}>
              <div style={{ fontSize:12 }}>Total Orders</div>
              <div style={{ fontSize:18, fontWeight:700 }}>{stats?.totalOrders ?? '-'}</div>
            </div>
            <div style={{ padding:12, background:'#FAF6EE', border:'1px solid #ddd', minWidth:120 }}>
              <div style={{ fontSize:12 }}>Pending</div>
              <div style={{ fontSize:18, fontWeight:700 }}>{stats?.pendingOrders ?? '-'}</div>
            </div>
            <div style={{ padding:12, background:'#FAF6EE', border:'1px solid #ddd', minWidth:120 }}>
              <div style={{ fontSize:12 }}>Confirmed</div>
              <div style={{ fontSize:18, fontWeight:700 }}>{stats?.confirmedOrders ?? '-'}</div>
            </div>
            <div style={{ padding:12, background:'#FAF6EE', border:'1px solid #ddd', minWidth:120 }}>
              <div style={{ fontSize:12 }}>Delivered</div>
              <div style={{ fontSize:18, fontWeight:700 }}>{stats?.deliveredOrders ?? '-'}</div>
            </div>
          </div>

          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            <button type="button" style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>ORDERS</button>
            <button type="button" style={tabStyle('menu')} onClick={() => setActiveTab('menu')}>MENU</button>
            <button type="button" style={tabStyle('gallery')} onClick={() => setActiveTab('gallery')}>GALLERY</button>
          </div>

          {activeTab === 'orders' && (
            <div>
              <h3>Orders</h3>
              <div style={{ marginBottom:8 }}>
                <button onClick={()=>{ setFilter('all'); fetchOrders(); }} style={{ marginRight:8 }}>All</button>
                <button onClick={()=>{ setFilter('pending'); fetchOrders(); }} style={{ marginRight:8 }}>Pending</button>
                <button onClick={()=>{ setFilter('confirmed'); fetchOrders(); }} style={{ marginRight:8 }}>Confirmed</button>
                <button onClick={()=>{ setFilter('delivered'); fetchOrders(); }} style={{ marginRight:8 }}>Delivered</button>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>
                    <th>Name</th><th>Phone</th><th>Items+Size</th><th>Scheduled Date</th><th>Time Slot</th><th>Amount</th><th>Transaction ID</th><th>Payment Status</th><th>Order Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map(o=> (
                    <tr key={o._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                      <td>{o.customerName}</td>
                      <td>{o.customerPhone}</td>
                      <td style={{ maxWidth:220 }}>{formatItemsWithSize(o.items)}</td>
                      <td>{o.orderType === 'scheduled' ? formatScheduledDate(o.deliveryDate) : '-'}</td>
                      <td>
                        {o.orderType === 'scheduled' && o.deliveryTimeSlot ? (
                          <span style={{ background:'#1B2E70', color:'#fff', padding:'3px 10px', borderRadius:999, fontSize:11, whiteSpace:'nowrap' }}>{o.deliveryTimeSlot}</span>
                        ) : '-'}
                      </td>
                      <td>{o.totalAmount != null ? `₹${o.totalAmount}` : '-'}</td>
                      <td>{o.transactionId || '-'}</td>
                      <td>{paymentStatusBadge(o.paymentStatus)}</td>
                      <td>
                        <select defaultValue={o.status} onChange={e=>updateOrderStatus(o._id, e.target.value)}>
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {o.paymentStatus !== 'verified' && (
                            <button onClick={()=>markPaymentVerified(o._id)} style={{ background:'#1B2E70', color:'#fff', border:'none', padding:'6px 8px', borderRadius:6 }}>Mark Payment Verified</button>
                          )}
                          <button onClick={()=>deleteOrder(o._id)} style={{ background:'#8B3A2A', color:'#fff', border:'none', padding:'6px 8px', borderRadius:6 }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <h3>Menu Management</h3>
              <form onSubmit={addMenuItem} style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                <input name="name" placeholder="Name" required style={{ padding:6 }} />
                <select name="category" defaultValue="tiramisu" style={{ padding:6 }}>
                  <option value="tiramisu">Tiramisu</option>
                  <option value="cookies">Cookies</option>
                  <option value="desserts">Desserts</option>
                  <option value="gifting">Gifting</option>
                </select>
                <input name="description" placeholder="Description" style={{ padding:6 }} />
                <input name="price" type="number" placeholder="Price" required style={{ padding:6 }} />
                <input name="image" placeholder="Image URL" style={{ padding:6 }} />
                <label style={{ display:'flex', alignItems:'center', gap:6 }}><input type="checkbox" name="isFeatured" /> Featured</label>
                <button style={{ background:'#1B2E70', color:'#fff', padding:'6px 10px', borderRadius:6 }}>Add</button>
              </form>

              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ borderBottom:'1px solid #ddd' }}><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {menuItems.map(m=> (
                    <tr key={m._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                      <td>{m.name}</td>
                      <td>{m.category}</td>
                      <td>{m.price}</td>
                      <td><button onClick={()=>toggleAvailability(m._id)} style={{ padding:6 }}>{m.isAvailable ? 'Yes':'No'}</button></td>
                      <td><button onClick={()=>deleteMenuItem(m._id)} style={{ background:'#8B3A2A', color:'#fff', padding:'6px 8px', borderRadius:6 }}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ margin: 0 }}>Gallery</h3>
                <span style={{ fontSize: 13, color: '#666' }}>Toggle visibility to show/hide on website</span>
              </div>

              <form onSubmit={addGalleryImage} style={{ background:'#FAF6EE', border:'1px solid #1B2E70', borderRadius:8, padding:16, marginBottom:20 }}>
                <div style={{ fontWeight:700, color:'#1B2E70', marginBottom:12 }}>Add New Image</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'flex-end' }}>
                  <label style={{ display:'flex', flexDirection:'column', gap:4, flex:1, minWidth:180 }}>
                    <span style={{ fontSize:12 }}>Image URL *</span>
                    <input required value={galleryForm.imageUrl} onChange={e=>setGalleryForm({...galleryForm, imageUrl:e.target.value})} placeholder="https://..." style={{ padding:8 }} />
                  </label>
                  <label style={{ display:'flex', flexDirection:'column', gap:4, flex:1, minWidth:140 }}>
                    <span style={{ fontSize:12 }}>Title</span>
                    <input value={galleryForm.title} onChange={e=>setGalleryForm({...galleryForm, title:e.target.value})} placeholder="Image title" style={{ padding:8 }} />
                  </label>
                  <label style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <span style={{ fontSize:12 }}>Category</span>
                    <select value={galleryForm.category} onChange={e=>setGalleryForm({...galleryForm, category:e.target.value})} style={{ padding:8 }}>
                      <option value="all">All</option>
                      <option value="tiramisu">Tiramisu</option>
                      <option value="cookies">Cookies</option>
                      <option value="desserts">Desserts</option>
                      <option value="gifting">Gifting</option>
                    </select>
                  </label>
                  <button type="submit" style={{ background:'#1B2E70', color:'#fff', padding:'10px 20px', borderRadius:999, border:'none', fontFamily:'Georgia, serif', fontWeight:600, cursor:'pointer' }}>
                    Add to Gallery
                  </button>
                </div>
              </form>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
                {galleryImages.map(img => (
                  <div key={img._id} style={{ background:'#fff', border:'1px solid #ddd', borderRadius:8, overflow:'hidden' }}>
                    <img src={img.imageUrl} alt={img.title || 'Gallery'} style={{ width:'100%', height:150, objectFit:'cover', display:'block' }} />
                    <div style={{ padding:10 }}>
                      <div style={{ fontWeight:600, marginBottom:4 }}>{img.title || 'Untitled'}</div>
                      <div style={{ fontSize:12, color:'#666', marginBottom:8 }}>{CATEGORY_LABELS[img.category] || img.category}</div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, cursor:'pointer' }}>
                          <input
                            type="checkbox"
                            checked={img.isVisible}
                            onChange={() => toggleGalleryVisibility(img._id, img.isVisible)}
                          />
                          Visible
                        </label>
                        <button onClick={() => deleteGalleryImage(img._id)} style={{ background:'#c0392b', color:'#fff', border:'none', padding:'4px 10px', borderRadius:4, fontSize:12, cursor:'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {galleryImages.length === 0 && (
                  <p style={{ gridColumn:'1 / -1', color:'#666', fontStyle:'italic' }}>No gallery images yet. Add one above.</p>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

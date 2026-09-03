import React, { useEffect, useState } from 'react'

const CATEGORY_LABELS = {
  all: 'All',
  tiramisu: 'Tiramisu',
  cookies: 'Cookies',
  desserts: 'Desserts',
  gifting: 'Gifting',
}

const EMPTY_MENU_FORM = {
  name: '',
  category: 'tiramisu',
  description: '',
  options: [{ label: '', price: '' }],
  dietaryOptions: ['Contains Egg', 'Eggless'],
  messageOnCake: true,
  ingredients: '',
  shelfLife: '',
  isFeatured: false,
}

export default function AdminDashboard(){
  const [token, setToken] = useState(null)
  const [authState, setAuthState] = useState('checking') // 'checking' | true | false
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [menuItems, setMenuItems] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryForm, setGalleryForm] = useState({ title: '', imageUrl: '', category: 'all' })
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState('')
  const [menuImageUploading, setMenuImageUploading] = useState(false)
  const [menuImagePreview, setMenuImagePreview] = useState('')
  const [menuImageUrl, setMenuImageUrl] = useState('')
  const [menuForm, setMenuForm] = useState(EMPTY_MENU_FORM)
  const [editingMenuItem, setEditingMenuItem] = useState(null)
  const [loginForm, setLoginForm] = useState({ username:'', password:'' })
  const [settings, setSettings] = useState({ pickupAddresses: [''], acceptingOrders: true })
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Verify any saved token against the backend on mount so the dashboard
  // never sits blank — it always resolves to loading, login, or the dashboard.
  useEffect(() => {
    const stored = localStorage.getItem('admin_token')
    if (!stored) {
      setAuthState(false)
      return
    }
    fetch('https://casa-misu.onrender.com/api/admin/stats', {
      headers: { Authorization: `Bearer ${stored}` }
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('unauthorized')
      })
      .then(data => {
        setToken(stored)
        setStats(data)
        setAuthState(true)
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        setAuthState(false)
      })
  }, [])

  useEffect(()=>{ if(token) fetchStats(); if(token) fetchOrders(); if(token) fetchMenu(); if(token) fetchGallery(); if(token) fetchSettings(); }, [token])

  async function fetchStats(){
    try{
      const res = await fetch('https://casa-misu.onrender.com/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json(); setStats(data)
    }catch(err){ console.error(err) }
  }
  async function fetchOrders(){
    try{
      const url = filter==='all' ? 'https://casa-misu.onrender.com/api/orders' : `https://casa-misu.onrender.com/api/orders?status=${filter}`
      const res = await fetch(url, { headers:{ Authorization: `Bearer ${token}` } })
      const data = await res.json(); setOrders(Array.isArray(data) ? data : [])
    }catch(err){ console.error(err) }
  }
  async function fetchMenu(){
    try{ const res = await fetch('https://casa-misu.onrender.com/api/menu', { cache: 'no-store' }); const data = await res.json(); setMenuItems(Array.isArray(data) ? data : []) }catch(err){ console.error(err) }
  }
  async function fetchGallery(){
    try{
      const res = await fetch('https://casa-misu.onrender.com/api/gallery', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setGalleryImages(Array.isArray(data) ? data : [])
    }catch(err){ console.error(err) }
  }
  async function fetchSettings(){
    try{
      const res = await fetch('https://casa-misu.onrender.com/api/settings', { cache: 'no-store' })
      const data = await res.json()
      setSettings({
        pickupAddresses: data.pickupAddresses?.length ? data.pickupAddresses : [''],
        acceptingOrders: data.acceptingOrders !== false,
      })
    }catch(err){ console.error(err) }
  }
  async function saveSettings(){
    setSettingsSaving(true)
    setSettingsSaved(false)
    try{
      const body = {
        pickupAddresses: settings.pickupAddresses.map(a => a.trim()).filter(Boolean),
        acceptingOrders: settings.acceptingOrders,
      }
      await fetch('https://casa-misu.onrender.com/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      setSettingsSaved(true)
      fetchSettings()
    }catch(err){ console.error(err); alert('Could not save settings. Please try again.') }
    finally{ setSettingsSaving(false) }
  }

  async function handleLogin(e){
    e.preventDefault(); setLoading(true);
    try{
      const res = await fetch('https://casa-misu.onrender.com/api/admin/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(loginForm) })
      const data = await res.json();
      if(res.ok && data.token){ localStorage.setItem('admin_token', data.token); setToken(data.token); setAuthState(true) }
      else alert(data.message || 'Login failed')
    }catch(err){ console.error(err); alert('Login error') }
    setLoading(false);
  }

  function logout(){ localStorage.removeItem('admin_token'); setToken(null); setAuthState(false); setStats(null); setOrders([]); setGalleryImages([]); }

  async function updateOrderStatus(id, status){
    try{
      await fetch(`https://casa-misu.onrender.com/api/orders/${id}/status`, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
      fetchOrders(); fetchStats();
    }catch(err){ console.error(err) }
  }

  async function deleteOrder(id){ if(!confirm('Delete order?')) return; try{ await fetch(`https://casa-misu.onrender.com/api/orders/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchOrders(); fetchStats(); }catch(err){ console.error(err) } }

  async function markPaymentVerified(id){
    try{
      await fetch(`https://casa-misu.onrender.com/api/orders/${id}/payment`, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ paymentStatus: 'verified' }) })
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
      return arr.map(i => {
        let line = `${i.name}${i.size ? ` (${i.size})` : ''} × ${i.quantity}`
        if(i.dietaryPreference) line += ` [${i.dietaryPreference}]`
        if(i.message) line += ` — "${i.message}"`
        return line
      }).join(', ')
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

  async function handleMenuImageUpload(e){
    const file = e.target.files[0]
    if(!file) return
    const localPreview = URL.createObjectURL(file)
    setMenuImagePreview(localPreview)
    setMenuImageUploading(true)
    try{
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('https://casa-misu.onrender.com/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if(data.imageUrl){ setMenuImageUrl(data.imageUrl) }
      else { alert('Upload failed. Try again.') }
    }catch(err){ console.error(err); alert('Upload failed. Try again.') }
    finally{ setMenuImageUploading(false) }
  }

  function resetMenuForm(){
    setMenuForm(EMPTY_MENU_FORM)
    setEditingMenuItem(null)
    setMenuImageUrl('')
    setMenuImagePreview('')
  }

  function updateMenuOption(index, field, value){
    setMenuForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => optionIndex === index ? { ...option, [field]: value } : option),
    }))
  }

  function toggleDietaryOption(option){
    setMenuForm((current) => ({
      ...current,
      dietaryOptions: current.dietaryOptions.includes(option)
        ? current.dietaryOptions.filter((item) => item !== option)
        : [...current.dietaryOptions, option],
    }))
  }

  function editMenuItem(item){
    setEditingMenuItem(item)
    setMenuForm({
      name: item.name || '',
      category: item.category || 'tiramisu',
      description: item.description || '',
      options: item.options?.length ? item.options.map(({ label, price }) => ({ label, price: String(price) })) : [{ label: '', price: String(item.price || '') }],
      dietaryOptions: item.dietaryOptions?.length ? item.dietaryOptions : ['Contains Egg', 'Eggless'],
      messageOnCake: item.messageOnCake !== false,
      ingredients: item.ingredients || '',
      shelfLife: item.shelfLife || '',
      isFeatured: Boolean(item.isFeatured),
    })
    setMenuImageUrl(item.image || '')
    setMenuImagePreview(item.image || '')
  }

  async function addMenuItem(e){
    e.preventDefault()
    const options = menuForm.options
      .map((option) => ({ label: option.label.trim(), price: Number(option.price) }))
      .filter((option) => option.label && Number.isFinite(option.price) && option.price >= 0)
    if (!options.length) { alert('Add at least one size or weight with its price.'); return }

    const body = {
      ...menuForm,
      options,
      price: options[0].price,
      image: menuImageUrl,
    }
    try{
      const url = editingMenuItem ? `https://casa-misu.onrender.com/api/menu/${editingMenuItem._id}` : 'https://casa-misu.onrender.com/api/menu'
      const res = await fetch(url, {
        method: editingMenuItem ? 'PUT' : 'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Unable to save menu item')
      fetchMenu()
      resetMenuForm()
    }catch(err){ console.error(err); alert('Unable to save menu item. Please try again.') }
  }

  async function deleteMenuItem(id){ if(!confirm('Delete item?')) return; try{ await fetch(`https://casa-misu.onrender.com/api/menu/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

  async function toggleAvailability(id){ try{ await fetch(`https://casa-misu.onrender.com/api/menu/${id}/availability`, { method:'PATCH', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

  async function handleGalleryImageUpload(e){
    const file = e.target.files[0]
    if(!file) return
    const localPreview = URL.createObjectURL(file)
    setGalleryPreviewUrl(localPreview)
    setGalleryUploading(true)
    try{
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('https://casa-misu.onrender.com/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if(data.imageUrl){ setGalleryForm(prev => ({ ...prev, imageUrl: data.imageUrl })) }
      else { alert('Upload failed. Try again.') }
    }catch(err){ console.error(err); alert('Upload failed. Try again.') }
    finally{ setGalleryUploading(false) }
  }

  async function addGalleryImage(e){
    e.preventDefault()
    if(!galleryForm.imageUrl.trim()){ alert('Please choose an image'); return }
    try{
      await fetch('https://casa-misu.onrender.com/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(galleryForm),
      })
      setGalleryForm({ title: '', imageUrl: '', category: 'all' })
      setGalleryPreviewUrl('')
      fetchGallery()
    }catch(err){ console.error(err) }
  }

  async function toggleGalleryVisibility(id, currentVisible){
    try{
      await fetch(`https://casa-misu.onrender.com/api/gallery/${id}`, {
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
      await fetch(`https://casa-misu.onrender.com/api/gallery/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
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

  if (authState === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
        color: '#1B2E70',
        fontSize: '20px',
        background: '#FAF6EE'
      }}>
        Loading Casa Misu Admin...
      </div>
    )
  }

  if (authState !== true) {
    return (
      <div style={{ padding:24, fontFamily:'Georgia, serif' }}>
        <div style={{ maxWidth:420, margin:'80px auto', padding:24, border:'1px solid #ccc', borderRadius:8, background:'#FAF6EE' }}>
          <h2 style={{ textAlign:'center', color:'#1B2E70' }}>Casa Misu Admin</h2>
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input name="username" placeholder="Username" value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username:e.target.value})} style={{ padding:8 }} />
            <input name="password" type="password" placeholder="Password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} style={{ padding:8 }} />
            <button style={{ background:'#1B2E70', color:'#fff', padding:10, borderRadius:6 }} disabled={loading}>{loading? 'Loading...':'Login'}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:24, fontFamily:'Georgia, serif' }}>
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

          {!settings.acceptingOrders && (
            <div style={{ background:'#FBF0DD', color:'#7A4A12', border:'1px solid #E4C588', borderRadius:8, padding:'10px 16px', marginBottom:16, fontWeight:600, fontSize:13 }}>
              ⏸ Orders are currently paused on the website. Customers cannot check out. Go to Settings to turn them back on.
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            <button type="button" style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>ORDERS</button>
            <button type="button" style={tabStyle('menu')} onClick={() => setActiveTab('menu')}>MENU</button>
            <button type="button" style={tabStyle('gallery')} onClick={() => setActiveTab('gallery')}>GALLERY</button>
            <button type="button" style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>SETTINGS</button>
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
                    <th>Name</th><th>Phone</th><th>Items+Size</th><th>Delivery</th><th>Special Requests</th><th>Scheduled Date</th><th>Time Slot</th><th>Amount</th><th>Transaction ID</th><th>Payment Status</th><th>Order Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map(o=> (
                    <tr key={o._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                      <td>{o.customerName}</td>
                      <td>{o.customerPhone}</td>
                      <td style={{ maxWidth:220 }}>{formatItemsWithSize(o.items)}</td>
                      <td style={{ maxWidth:200 }}>
                        {o.deliveryType === 'delivery' ? (
                          <>
                            <span style={{ background:'#8B3A2A', color:'#fff', padding:'3px 10px', borderRadius:999, fontSize:11, whiteSpace:'nowrap' }}>
                              Delivery{o.deliveryFee ? ` (₹${o.deliveryFee})` : ''}
                            </span>
                            {o.address && <div style={{ fontSize:11, color:'#555', marginTop:4 }}>{o.address}{o.deliveryPincode ? ` — ${o.deliveryPincode}` : ''}</div>}
                          </>
                        ) : (
                          <span style={{ background:'#1B2E70', color:'#fff', padding:'3px 10px', borderRadius:999, fontSize:11, whiteSpace:'nowrap' }}>Pickup</span>
                        )}
                      </td>
                      <td style={{ maxWidth:180, fontSize:12, color:'#555' }}>{o.specialRequests || '-'}</td>
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
              <form onSubmit={addMenuItem} style={{ background:'#FAF6EE', border:'1px solid #1B2E70', borderRadius:8, padding:16, marginBottom:20 }}>
                <div style={{ fontWeight:700, color:'#1B2E70', marginBottom:12 }}>{editingMenuItem ? 'Edit menu item' : 'Add menu item'}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10 }}>
                  <input value={menuForm.name} onChange={e=>setMenuForm({ ...menuForm, name:e.target.value })} placeholder="Name" required style={{ padding:8 }} />
                  <input
                    value={menuForm.category}
                    onChange={e=>setMenuForm({ ...menuForm, category:e.target.value })}
                    placeholder="Category, e.g. Tiramisu"
                    list="menu-categories"
                    required
                    style={{ padding:8 }}
                  />
                  <datalist id="menu-categories">
                    {[...new Set(menuItems.map(m => m.category).filter(Boolean))].map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <input value={menuForm.description} onChange={e=>setMenuForm({ ...menuForm, description:e.target.value })} placeholder="Description" style={{ padding:8 }} />
                  <input value={menuForm.ingredients} onChange={e=>setMenuForm({ ...menuForm, ingredients:e.target.value })} placeholder="Ingredients (optional)" style={{ padding:8 }} />
                  <input value={menuForm.shelfLife} onChange={e=>setMenuForm({ ...menuForm, shelfLife:e.target.value })} placeholder="Shelf life (optional)" style={{ padding:8 }} />
                </div>
                <p style={{ fontSize:12, color:'#666', margin:'6px 0 0' }}>Pick an existing category from the list, or type a brand new one to start a new product range — it'll appear on the website automatically.</p>

                <div style={{ marginTop:16 }}>
                  <div style={{ fontWeight:600, color:'#1B2E70', marginBottom:6 }}>Sizes / weights and prices</div>
                  <div style={{ fontSize:12, color:'#666', marginBottom:8 }}>Add one option for a single-size product, or add as many as you need (for example, 350g and 400g).</div>
                  {menuForm.options.map((option, index) => (
                    <div key={index} style={{ display:'flex', gap:8, marginBottom:8, maxWidth:520 }}>
                      <input value={option.label} onChange={e=>updateMenuOption(index, 'label', e.target.value)} placeholder="Size / weight, e.g. 350g" required style={{ padding:8, flex:1 }} />
                      <input value={option.price} onChange={e=>updateMenuOption(index, 'price', e.target.value)} type="number" min="0" placeholder="Price ₹" required style={{ padding:8, width:120 }} />
                      {menuForm.options.length > 1 && <button type="button" onClick={()=>setMenuForm({ ...menuForm, options: menuForm.options.filter((_, optionIndex) => optionIndex !== index) })} style={{ padding:'6px 10px' }}>Remove</button>}
                    </div>
                  ))}
                  <button type="button" onClick={()=>setMenuForm({ ...menuForm, options:[...menuForm.options, { label:'', price:'' }] })} style={{ padding:'6px 10px' }}>+ Add another size</button>
                </div>

                <div style={{ marginTop:16 }}>
                  <div style={{ fontWeight:600, color:'#1B2E70', marginBottom:6 }}>Dietary options customers can choose</div>
                  {['Contains Egg', 'Eggless', 'Vegan', 'Sugar Free'].map((option) => (
                    <label key={option} style={{ marginRight:16 }}><input type="checkbox" checked={menuForm.dietaryOptions.includes(option)} onChange={()=>toggleDietaryOption(option)} /> {option}</label>
                  ))}
                </div>

                <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', marginTop:16 }}>
                  <div style={{
                    border: '2px dashed #1B2E70', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', cursor: 'pointer', background: '#FAF6EE'
                  }}>
                    <input type="file" accept="image/*" onChange={handleMenuImageUpload} style={{ display: 'none' }} id="menuImageUpload" />
                    <label htmlFor="menuImageUpload" style={{ cursor: 'pointer', color: '#1B2E70', fontSize: 13 }}>
                      {menuImageUploading ? 'Uploading...' : menuImagePreview ? '✓ Image selected (click to change)' : '📷 Choose image from your device'}
                    </label>
                    {menuImagePreview && <img src={menuImagePreview} alt="Selected menu item" style={{ width:60, height:60, objectFit:'cover', borderRadius:6, display:'block', margin:'8px auto 0' }} />}
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:6 }}><input type="checkbox" checked={menuForm.messageOnCake} onChange={e=>setMenuForm({ ...menuForm, messageOnCake:e.target.checked })} /> Allow topper option (+₹10)</label>
                  <label style={{ display:'flex', alignItems:'center', gap:6 }}><input type="checkbox" checked={menuForm.isFeatured} onChange={e=>setMenuForm({ ...menuForm, isFeatured:e.target.checked })} /> Featured</label>
                  <button style={{ background:'#1B2E70', color:'#fff', padding:'8px 14px', borderRadius:6 }}>{editingMenuItem ? 'Save changes' : 'Add item'}</button>
                  {editingMenuItem && <button type="button" onClick={resetMenuForm} style={{ padding:'8px 14px' }}>Cancel</button>}
                </div>
              </form>

              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ borderBottom:'1px solid #ddd' }}><th>Name</th><th>Category</th><th>Sizes / prices</th><th>Dietary</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {menuItems.map(m=> (
                    <tr key={m._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                      <td>{m.name}</td>
                      <td>{m.category}</td>
                      <td>{m.options?.length ? m.options.map(option => `${option.label} — ₹${option.price}`).join(', ') : `₹${m.price}`}</td>
                      <td>{m.dietaryOptions?.length ? m.dietaryOptions.join(', ') : 'Contains Egg, Eggless'}</td>
                      <td><button onClick={()=>toggleAvailability(m._id)} style={{ padding:6 }}>{m.isAvailable ? 'In stock' : 'Out of stock'}</button></td>
                      <td><div style={{ display:'flex', gap:6 }}><button onClick={()=>editMenuItem(m)} style={{ padding:'6px 8px' }}>Edit</button><button onClick={()=>deleteMenuItem(m._id)} style={{ background:'#8B3A2A', color:'#fff', padding:'6px 8px', borderRadius:6 }}>Delete</button></div></td>
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
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{
                      border: '2px dashed #1B2E70',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#FAF6EE'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        style={{ display: 'none' }}
                        id="galleryImageUpload"
                      />
                      <label htmlFor="galleryImageUpload"
                        style={{ cursor: 'pointer', color: '#1B2E70' }}>
                        {galleryUploading ? 'Uploading...' :
                         galleryPreviewUrl ? '✓ Image selected (click to change)' :
                         '📷 Click to choose image from your device'}
                      </label>
                      {galleryPreviewUrl && (
                        <img src={galleryPreviewUrl}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            marginTop: '10px',
                            borderRadius: '8px',
                            display: 'block',
                            margin: '10px auto 0'
                          }}
                        />
                      )}
                    </div>
                  </div>
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

          {activeTab === 'settings' && (
            <div>
              <h3>Settings</h3>

              <div style={{ background:'#FAF6EE', border:'1px solid #1B2E70', borderRadius:8, padding:16, marginBottom:20, maxWidth:520 }}>
                <div style={{ fontWeight:700, color:'#1B2E70', marginBottom:6 }}>Accepting orders</div>
                <p style={{ fontSize:13, color:'#666', margin:'0 0 12px' }}>
                  Turn this off to immediately stop customers from checking out — for example if you're fully booked, closed for a holiday, or need a break. The menu stays visible; only payment is blocked, with a message shown to customers.
                </p>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.acceptingOrders}
                    onChange={e => setSettings({ ...settings, acceptingOrders: e.target.checked })}
                    style={{ width:18, height:18 }}
                  />
                  <span style={{ fontWeight:600, color: settings.acceptingOrders ? '#2F6B45' : '#8B3A2A' }}>
                    {settings.acceptingOrders ? 'Currently accepting orders' : 'Currently NOT accepting orders'}
                  </span>
                </label>
              </div>

              <div style={{ background:'#FAF6EE', border:'1px solid #1B2E70', borderRadius:8, padding:16, marginBottom:20, maxWidth:520 }}>
                <div style={{ fontWeight:700, color:'#1B2E70', marginBottom:6 }}>Pickup location(s)</div>
                <p style={{ fontSize:13, color:'#666', margin:'0 0 12px' }}>
                  Shown to customers at checkout when they choose Store Pickup. Add more than one if you ever operate from multiple locations — customers will get to pick which one.
                </p>
                {settings.pickupAddresses.map((addr, index) => (
                  <div key={index} style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <input
                      value={addr}
                      onChange={e => setSettings({ ...settings, pickupAddresses: settings.pickupAddresses.map((a, i) => i === index ? e.target.value : a) })}
                      placeholder="e.g. JP Decks, Goregaon East, Mumbai, Maharashtra 400097"
                      style={{ padding:8, flex:1 }}
                    />
                    {settings.pickupAddresses.length > 1 && (
                      <button type="button" onClick={() => setSettings({ ...settings, pickupAddresses: settings.pickupAddresses.filter((_, i) => i !== index) })} style={{ padding:'6px 10px' }}>Remove</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setSettings({ ...settings, pickupAddresses: [...settings.pickupAddresses, ''] })} style={{ padding:'6px 10px' }}>+ Add another pickup location</button>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button type="button" onClick={saveSettings} disabled={settingsSaving} style={{ background:'#1B2E70', color:'#fff', padding:'10px 20px', borderRadius:999, border:'none', fontFamily:'Georgia, serif', fontWeight:600, cursor:'pointer' }}>
                  {settingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
                {settingsSaved && <span style={{ color:'#2F6B45', fontWeight:600, fontSize:13 }}>✓ Saved</span>}
              </div>
            </div>
          )}

        </div>
    </div>
  )
}

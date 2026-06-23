import React, { useEffect, useState } from 'react'

export default function AdminDashboard(){
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [menuItems, setMenuItems] = useState([])
  const [loginForm, setLoginForm] = useState({ username:'', password:'' })

  useEffect(()=>{ if(token) fetchStats(); if(token) fetchOrders(); if(token) fetchMenu(); }, [token])

  async function fetchStats(){
    try{
      const res = await fetch('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json(); setStats(data)
    }catch(err){ console.error(err) }
  }
  async function fetchOrders(){
    try{
      const url = filter==='all' ? 'http://localhost:5000/api/orders' : `http://localhost:5000/api/orders?status=${filter}`
      const res = await fetch(url, { headers:{ Authorization: `Bearer ${token}` } })
      const data = await res.json(); setOrders(data)
    }catch(err){ console.error(err) }
  }
  async function fetchMenu(){
    try{ const res = await fetch('http://localhost:5000/api/menu'); const data = await res.json(); setMenuItems(data) }catch(err){ console.error(err) }
  }

  async function handleLogin(e){
    e.preventDefault(); setLoading(true);
    try{
      const res = await fetch('http://localhost:5000/api/admin/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(loginForm) })
      const data = await res.json();
      if(res.ok && data.token){ localStorage.setItem('admin_token', data.token); setToken(data.token); }
      else alert(data.message || 'Login failed')
    }catch(err){ console.error(err); alert('Login error') }
    setLoading(false);
  }

  function logout(){ localStorage.removeItem('admin_token'); setToken(null); setStats(null); setOrders([]); }

  async function updateOrderStatus(id, status){
    try{
      await fetch(`http://localhost:5000/api/orders/${id}/status`, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
      fetchOrders(); fetchStats();
    }catch(err){ console.error(err) }
  }

  async function deleteOrder(id){ if(!confirm('Delete order?')) return; try{ await fetch(`http://localhost:5000/api/orders/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchOrders(); fetchStats(); }catch(err){ console.error(err) } }

  async function addMenuItem(e){ e.preventDefault(); const form = e.target; const body = { name: form.name.value, category: form.category.value, description: form.description.value, price: Number(form.price.value), image: form.image.value, isFeatured: form.isFeatured.checked }; try{ await fetch('http://localhost:5000/api/menu', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(body) }); fetchMenu(); }catch(err){ console.error(err) } }

  async function deleteMenuItem(id){ if(!confirm('Delete item?')) return; try{ await fetch(`http://localhost:5000/api/menu/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

  async function toggleAvailability(id){ try{ await fetch(`http://localhost:5000/api/menu/${id}/availability`, { method:'PATCH', headers:{ Authorization:`Bearer ${token}` } }); fetchMenu(); }catch(err){ console.error(err) } }

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
                  <th>Name</th><th>Phone</th><th>Items</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o=> (
                  <tr key={o._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                    <td>{o.customerName}</td>
                    <td>{o.customerPhone}</td>
                    <td style={{ maxWidth:220 }}>{o.items}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>
                      <select defaultValue={o.status} onChange={e=>updateOrderStatus(o._id, e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={()=>deleteOrder(o._id)} style={{ background:'#8B3A2A', color:'#fff', border:'none', padding:'6px 8px', borderRadius:6 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop:24 }}>
            <h3>Menu Management</h3>
            <form onSubmit={addMenuItem} style={{ display:'flex', gap:8, marginBottom:12 }}>
              <input name="name" placeholder="Name" required style={{ padding:6 }} />
              <select name="category" defaultValue="tiramisu" style={{ padding:6 }}>
                <option value="tiramisu">Tiramisu</option>
                <option value="cookies">Cookies</option>
                <option value="desserts">Desserts</option>
                <option value="gifting">Gifting</option>
              </select>
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

        </div>
      )}
    </div>
  )
}

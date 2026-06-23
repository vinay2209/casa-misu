import React, { useState } from 'react'

export default function OrderForm(){
  const [form, setForm] = useState({ customerName:'', customerPhone:'', customerEmail:'', items:'', quantity:1, specialRequests:'' });
  const [status, setStatus] = useState(null);

  function update(e){
    const { name, value } = e.target;
    setForm(prev=>({ ...prev, [name]: value }));
  }

  async function submit(e){
    e.preventDefault();
    setStatus('loading');
    try{
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if(data.success){
        setStatus('success');
        setForm({ customerName:'', customerPhone:'', customerEmail:'', items:'', quantity:1, specialRequests:'' });
      } else {
        setStatus('error');
      }
    } catch(err){
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submit} style={{ background:'#FAF6EE', padding:'18px', borderRadius:8, border:'2px solid #1B2E70', margin:'18px 0' }}>
      <h3 style={{ color:'#1B2E70' }}>Place an Order</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <input name="customerName" value={form.customerName} onChange={update} placeholder="Full Name*" required style={inputStyle} />
        <input name="customerPhone" value={form.customerPhone} onChange={update} placeholder="Phone*" required style={inputStyle} />
        <input name="customerEmail" value={form.customerEmail} onChange={update} placeholder="Email" style={inputStyle} />
        <input name="quantity" type="number" value={form.quantity} onChange={update} min={1} style={inputStyle} />
        <textarea name="items" value={form.items} onChange={update} placeholder="What would you like to order?*" required style={{ gridColumn:'1 / -1', padding:8 }} />
        <textarea name="specialRequests" value={form.specialRequests} onChange={update} placeholder="Special Requests" style={{ gridColumn:'1 / -1', padding:8 }} />
      </div>
      <div style={{ marginTop:12 }}>
        <button type="submit" style={{ background:'#1B2E70', color:'#fff', padding:'10px 18px', borderRadius:24, border:'none' }}>PLACE ORDER</button>
      </div>

      {status==='success' && <div style={{ marginTop:12, color:'green' }}>Your order has been placed! We'll contact you soon.</div>}
      {status==='error' && <div style={{ marginTop:12, color:'red' }}>There was an error placing your order. Please try again.</div>}

    </form>
  )
}

const inputStyle = { padding:10, borderRadius:6, border:'1px solid #ccc', boxSizing:'border-box' }

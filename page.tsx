'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [viewMode, setViewMode] = useState('dashboard')
  const [bookings, setBookings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  const [gName, setGName] = useState(''); const [gMob, setGMob] = useState('')
  const [gRoom, setGRoom] = useState(''); const [gBill, setGBill] = useState('')

  async function fetchData() {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (data) setBookings(data)
  }

  useEffect(() => { if(isLoggedIn) fetchData() }, [isLoggedIn])

  const handleGuestEntry = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('bookings').insert([{ 
      guest_name: gName, mobile: gMob, room_no: gRoom, total_bill: gBill, status: 'Active' 
    }])
    if (!error) {
      alert("Bill Created! ✅");
      setGName(''); setGMob(''); setGRoom(''); setGBill('');
      fetchData();
    }
  }

  const deleteBooking = async (id: any) => {
    if(confirm("Kya aap is bill ko delete karna chahte hain?")) {
      const { error } = await supabase.from('bookings').delete().eq('id', id)
      if(!error) fetchData()
    }
  }

  const sendWhatsApp = (guest: any) => {
    const message = `*👑 GRAND RESORT INVOICE*%0A---------------------------%0A*Guest:* ${guest.guest_name}%0A*Room:* ${guest.room_no}%0A*Total Bill:* ₹${guest.total_bill}%0A*Status:* Paid ✅%0A---------------------------%0A_Thank you for visiting!_`;
    window.open(`https://wa.me/91${guest.mobile}?text=${message}`, '_blank');
  }

  // Search Filter
  const filteredBookings = bookings.filter(b => 
    b.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.mobile?.includes(searchTerm)
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <button onClick={() => setIsLoggedIn(true)} className="px-10 py-5 bg-amber-600 text-white font-bold rounded-2xl shadow-xl uppercase">👑 Open Management System</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white p-4 shadow-md flex justify-between border-b-4 border-amber-600 sticky top-0 z-50">
        <h1 className="font-black text-amber-800 italic">👑 GRAND RESORT</h1>
        <nav className="flex gap-4 text-[11px] font-bold uppercase">
          <button onClick={() => setViewMode('dashboard')} className={viewMode === 'dashboard' ? 'text-amber-600' : 'text-slate-400'}>➕ New Entry</button>
          <button onClick={() => setViewMode('reports')} className={viewMode === 'reports' ? 'text-amber-600' : 'text-slate-400'}>📊 Bills List</button>
        </nav>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {viewMode === 'dashboard' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-t-8 border-green-600">
            <h2 className="text-xl font-black mb-6 italic uppercase underline decoration-green-200">New Guest Check-In</h2>
            <form onSubmit={handleGuestEntry} className="space-y-4">
              <input placeholder="Guest Full Name" className="w-full p-4 bg-slate-100 rounded-xl outline-none border focus:border-green-500" value={gName} onChange={e => setGName(e.target.value)} required />
              <input placeholder="Mobile Number" className="w-full p-4 bg-slate-100 rounded-xl outline-none" value={gMob} onChange={e => setGMob(e.target.value)} maxLength={10} />
              <div className="flex gap-2">
                <input placeholder="Room No" className="w-1/2 p-4 bg-slate-100 rounded-xl outline-none" value={gRoom} onChange={e => setGRoom(e.target.value)} />
                <input placeholder="Total Bill (₹)" type="number" className="w-1/2 p-4 bg-slate-100 rounded-xl outline-none font-bold text-green-700" value={gBill} onChange={e => setGBill(e.target.value)} required />
              </div>
              <button className="w-full py-5 bg-green-600 text-white font-black rounded-xl shadow-lg uppercase active:scale-95 transition-all">Save & Generate Bill</button>
            </form>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black italic text-slate-500 uppercase">Recent Bills</h2>
              <input 
                placeholder="🔍 Search Guest..." 
                className="p-2 text-xs border rounded-lg outline-none w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredBookings.map(b => (
              <div key={b.id} className="bg-white p-5 rounded-2xl shadow border-l-8 border-amber-500 flex justify-between items-center relative overflow-hidden">
                <div>
                  <p className="font-black uppercase text-sm text-slate-700">{b.guest_name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">ROOM: {b.room_no} | {b.mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-green-600 font-black text-xl leading-none italic">₹{b.total_bill}</p>
                  <div className="flex gap-2">
                    <button onClick={() => sendWhatsApp(b)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-[9px] font-black shadow-sm">💬 SEND</button>
                    <button onClick={() => deleteBooking(b.id)} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[9px] font-black border border-red-100">🗑️ DEL</button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBookings.length === 0 && <p className="text-center text-slate-300 font-bold py-10">No match found!</p>}
          </div>
        )}
      </main>
    </div>
  )
}

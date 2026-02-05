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
  
  // Guest Form States
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
      alert("Bill Created Successfully! ✅");
      setGName(''); setGMob(''); setGRoom(''); setGBill('');
      fetchData();
    } else {
      alert("Error: " + error.message);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-amber-600">
           <h1 className="text-3xl font-black text-amber-800 mb-6 uppercase">👑 Grand Resort Login</h1>
           <button onClick={() => setIsLoggedIn(true)} className="px-10 py-5 bg-amber-600 text-white font-bold rounded-2xl shadow-lg uppercase tracking-wider">Open Management System</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] pb-10">
      <header className="bg-white p-4 shadow-xl flex justify-between items-center sticky top-0 z-50 border-b-4 border-amber-600">
        <h1 className="font-black text-amber-800 text-xl tracking-tighter">👑 GRAND RESORT</h1>
        <nav className="flex gap-4 text-[11px] font-black uppercase">
          <button onClick={() => setViewMode('dashboard')} className={viewMode === 'dashboard' ? 'text-amber-600' : 'text-slate-400'}>➕ New Entry</button>
          <button onClick={() => setViewMode('reports')} className={viewMode === 'reports' ? 'text-amber-600' : 'text-slate-400'}>📊 Bills</button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-4">
        {viewMode === 'dashboard' && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-8 border-green-600">
            <h2 className="text-2xl font-black mb-6 italic text-slate-700">NEW GUEST CHECK-IN 🏨</h2>
            <form onSubmit={handleGuestEntry} className="space-y-4">
              <input placeholder="Guest Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-green-400" value={gName} onChange={e => setGName(e.target.value)} required />
              <input placeholder="Mobile Number" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-green-400" value={gMob} onChange={e => setGMob(e.target.value)} />
              <div className="flex gap-4">
                <input placeholder="Room/Tent No" className="w-1/2 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-green-400" value={gRoom} onChange={e => setGRoom(e.target.value)} />
                <input placeholder="Total Bill Amount (₹)" type="number" className="w-1/2 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 outline-none focus:border-green-400 font-bold text-green-700" value={gBill} onChange={e => setGBill(e.target.value)} required />
              </div>
              <button className="w-full py-6 bg-green-600 text-white font-black rounded-3xl shadow-xl uppercase text-lg hover:bg-green-700 transition-all">Generate Bill & Save</button>
            </form>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black italic text-slate-500 mb-4 px-2 uppercase tracking-widest">Recent Bookings</h2>
            {bookings.length === 0 ? <p className="text-center py-10 text-slate-400 font-bold">No bookings found yet.</p> : 
              bookings.map(b => (
                <div key={b.id} className="bg-white p-6 rounded-[2rem] shadow-lg border-l-[12px] border-amber-500 flex justify-between items-center transition-transform active:scale-95">
                  <div>
                    <p className="font-black uppercase text-slate-800">{b.guest_name}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">Room: {b.room_no || 'N/A'} | {b.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600 italic">₹{b.total_bill}</p>
                    <span className="text-[9px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Active</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  )
}

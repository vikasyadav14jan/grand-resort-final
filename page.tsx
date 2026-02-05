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
      alert("Bill Created! ✅");
      setGName(''); setGMob(''); setGRoom(''); setGBill('');
      fetchData();
    }
  }

  // WhatsApp पर मैसेज भेजने वाला फंक्शन
  const sendWhatsApp = (guest: any) => {
    const message = `*👑 GRAND RESORT INVOICE*%0A---------------------------%0A*Guest:* ${guest.guest_name}%0A*Room:* ${guest.room_no}%0A*Total Bill:* ₹${guest.total_bill}%0A*Status:* Paid ✅%0A---------------------------%0A_Thank you for visiting!_`;
    window.open(`https://wa.me/91${guest.mobile}?text=${message}`, '_blank');
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <button onClick={() => setIsLoggedIn(true)} className="px-10 py-5 bg-amber-600 text-white font-bold rounded-2xl shadow-xl uppercase">👑 Enter Resort System</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white p-4 shadow-md flex justify-between border-b-4 border-amber-600 sticky top-0 z-50">
        <h1 className="font-black text-amber-800 italic">👑 GRAND RESORT</h1>
        <nav className="flex gap-4 text-[11px] font-bold uppercase">
          <button onClick={() => setViewMode('dashboard')} className={viewMode === 'dashboard' ? 'text-amber-600' : 'text-slate-400'}>➕ New Entry</button>
          <button onClick={() => setViewMode('reports')} className={viewMode === 'reports' ? 'text-amber-600' : 'text-slate-400'}>📊 Bills</button>
        </nav>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {viewMode === 'dashboard' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-t-8 border-green-600">
            <h2 className="text-xl font-black mb-6 italic uppercase">Guest Check-In</h2>
            <form onSubmit={handleGuestEntry} className="space-y-4">
              <input placeholder="Guest Name" className="w-full p-4 bg-slate-100 rounded-xl outline-none" value={gName} onChange={e => setGName(e.target.value)} required />
              <input placeholder="Mobile Number (10 digit)" className="w-full p-4 bg-slate-100 rounded-xl outline-none" value={gMob} onChange={e => setGMob(e.target.value)} maxLength={10} />
              <div className="flex gap-2">
                <input placeholder="Room No" className="w-1/2 p-4 bg-slate-100 rounded-xl outline-none" value={gRoom} onChange={e => setGRoom(e.target.value)} />
                <input placeholder="Total Bill (₹)" type="number" className="w-1/2 p-4 bg-slate-100 rounded-xl outline-none font-bold" value={gBill} onChange={e => setGBill(e.target.value)} required />
              </div>
              <button className="w-full py-5 bg-green-600 text-white font-black rounded-xl shadow-lg uppercase">Save & Print Bill</button>
            </form>
          </div>
        )}

        {viewMode === 'reports' && (
          <div className="space-y-4">
            <h2 className="font-black italic text-slate-500 uppercase">Recent Bills</h2>
            {bookings.map(b => (
              <div key={b.id} className="bg-white p-5 rounded-2xl shadow border-l-8 border-amber-500 flex justify-between items-center">
                <div>
                  <p className="font-black uppercase text-sm">{b.guest_name}</p>
                  <p className="text-[10px] text-slate-400">Room: {b.room_no} | {b.mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-green-600 font-black text-lg leading-none">₹{b.total_bill}</p>
                  {/* WhatsApp Button */}
                  <button 
                    onClick={() => sendWhatsApp(b)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 shadow-sm active:scale-90"
                  >
                    <span>💬 SEND BILL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

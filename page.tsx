'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null) 
  const [pin, setPin] = useState('')

  const [viewMode, setViewMode] = useState('dashboard') 
  const [bookings, setBookings] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  
  // Dashboard Form States
  const [guest, setGuest] = useState(''); const [bType, setBType] = useState('Hotel Room')
  const [roomNo, setRoomNo] = useState(''); const [price, setPrice] = useState('')
  
  // Staff Form States
  const [sName, setSName] = useState(''); const [sRole, setSRole] = useState('')
  const [sMobile, setSMobile] = useState(''); const [sId, setSId] = useState(''); const [sAddress, setSAddress] = useState('')

  async function fetchData() {
    const { data: bk } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (bk) setBookings(bk)
    const { data: st } = await supabase.from('staff_records').select('*').order('id', { ascending: false })
    if (st) setStaff(st)
  }

  useEffect(() => { if(isLoggedIn) fetchData() }, [isLoggedIn])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (pin === '1234') { setUserRole('admin'); setIsLoggedIn(true) } 
    else if (pin === '5555') { setUserRole('staff'); setIsLoggedIn(true); setViewMode('dashboard') } 
    else { alert("Wrong PIN!"); }
    setPin('')
  }
  </RESORT>
  const handleAddBooking = async (e: any) => {
    e.preventDefault();
    const payload = { 
        guest_name: guest, booking_type: bType, price: parseInt(price) || 0, 
        room_no: roomNo, status: 'Active',
        checked_by: userRole 
    };
    const { error } = await supabase.from('bookings').insert([payload]);
    if (!error) { setGuest(''); setRoomNo(''); setPrice(''); fetchData(); alert("Entry Saved!"); }
  }

  const handleCheckout = async (id: any) => {
    const time = new Date().toLocaleTimeString();
    const { error } = await supabase.from('bookings').update({ 
        status: `Checked Out at ${time}` 
    }).eq('id', id);
    if (!error) fetchData();
  }

  // --- LOGIN SCREEN (GRAND RESORT Name Updated) ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-amber-600">
          <h1 className="text-4xl font-black text-amber-800 mb-2 italic uppercase tracking-tighter">👑 Grand Resort</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mb-8">Secure Management Login</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER PIN" className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none focus:ring-4 ring-amber-200" value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl shadow-lg hover:bg-amber-700 uppercase tracking-widest">Login Now</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-800 font-sans">
      {/* HEADER (GRAND RESORT Updated) */}
      <header className="bg-white shadow-xl border-b-4 border-amber-600 sticky top-0 z-50 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-amber-800 italic">👑 RAJNI SHANKAR GRAND RESORT</h1>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${userRole === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
               ● {userRole} Access
            </span>
            <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-bold text-slate-400 border px-3 py-1 rounded-lg hover:bg-slate-50">LOGOUT</button>
          </div>
        </div>
        <nav className="flex gap-6 mt-4 max-w-7xl mx-auto border-t pt-3 font-black text-[11px] uppercase tracking-wider text-slate-400">
          <button onClick={() => setViewMode('dashboard')} className={viewMode === 'dashboard' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}>🏠 Entry Counter</button>
          <button onClick={() => setViewMode('reports')} className={viewMode === 'reports' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}>📊 Live Status</button>
          {userRole === 'admin' && (
             <button onClick={() => setViewMode('staff')} className={viewMode === 'staff' ? 'text-amber-600 border-b-2 border-amber-600 pb-1' : ''}>👨‍💼 Staff Hub</button>
          )}
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        {/* DASHBOARD: Entry Form */}
        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
               <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500" className="rounded-3xl h-64 w-full object-cover shadow-lg border-4 border-white" />
               <div className="bg-amber-100 p-4 rounded-2xl text-[10px] font-bold text-amber-800 uppercase tracking-widest text-center">Grand Resort Gallery</div>
            </div>

            <div className="lg:col-span-2 bg-white p-10 rounded-[4rem] shadow-2xl border-t-8 border-amber-600">
               <h2 className="text-2xl font-black text-center mb-8 text-amber-900 uppercase tracking-tighter italic underline decoration-amber-200 underline-offset-8">New Guest Registration</h2>
               <form onSubmit={handleAddBooking} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Service Type</label>
                    <select className="w-full p-5 bg-amber-50 rounded-3xl font-black text-amber-900 border-none outline-none shadow-sm" value={bType} onChange={e => setBType(e.target.value)}>
                      <option>Hotel Room</option><option>Restaurant</option><option>Pool Side</option><option>Event Hall</option>
                    </select>
                 </div>
                 <input placeholder="Enter Guest Full Name" className="w-full p-5 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-amber-400 transition-all font-bold" value={guest} onChange={e => setGuest(e.target.value)} required />
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Room/Table No." className="w-full p-5 bg-slate-50 rounded-3xl outline-none" value={roomNo} onChange={e => setRoomNo(e.target.value)} />
                    <input placeholder="Price ₹" className="w-full p-5 bg-slate-50 rounded-3xl font-black text-green-600 outline-none" value={price} onChange={e => setPrice(e.target.value)} />
                 </div>
                 <button className="w-full py-6 bg-amber-800 text-white font-black rounded-3xl shadow-xl uppercase tracking-[0.2em] transition-all hover:bg-amber-900 active:scale-95">Confirm & Save Entry</button>
               </form>
            </div>

            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-black rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative">
                <iframe className="w-full h-full object-cover scale-150" src={`https://www.youtube.com/embed/AXeVCu6aKZk?autoplay=1&mute=1&loop=1&playlist=AXeVCu6aKZk&controls=0`}></iframe>
                <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black animate-pulse">LIVE VIEW</div>
              </div>
            </div>
          </div>
        )}

        {/* LIVE STATUS: With Checkout & Activity Log */}
        {viewMode === 'reports' && (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-amber-100">
             <div className="p-8 bg-amber-800 text-white flex justify-between items-center font-black">
                <h2 className="uppercase tracking-widest text-xl italic">Live Resort Status</h2>
                <p className="text-[10px] opacity-70 uppercase tracking-tighter">Real-time Guest Tracking</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-[10px] font-black uppercase text-slate-400">
                          <th className="p-6">Guest Detail</th>
                          <th className="p-6">Status</th>
                          <th className="p-6">Entry By</th>
                          <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-6">
                               <p className="font-black text-sm uppercase text-slate-700">{b.guest_name}</p>
                               <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">{b.booking_type} • Room {b.room_no}</p>
                            </td>
                            <td className="p-6">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${b.status === 'Active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                                  {b.status}
                               </span>
                            </td>
                            <td className="p-6 text-[10px] font-black text-slate-400 uppercase italic">
                               {b.checked_by || 'Unknown'}
                            </td>
                            <td className="p-6">
                               {b.status === 'Active' && (
                                 <button onClick={() => handleCheckout(b.id)} className="bg-red-600 text-white text-[9px] font-black px-5 py-2.5 rounded-2xl shadow-lg hover:bg-red-700 transition-all uppercase tracking-widest">Mark Checkout</button>
                               )}
                            </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
             </div>
          </div>
        )}

        {/* STAFF: Professional Profiles */}
        {viewMode === 'staff' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-blue-600">
               <h2 className="text-xl font-black mb-8 uppercase text-slate-700 italic">Add New Staff Member</h2>
               <form onSubmit={async (e) => {
                  e.preventDefault();
                  await supabase.from('staff_records').insert([{ name: sName, roll: sRole, status: `Mob: ${sMobile} | ID: ${sId} | Addr: ${sAddress}` }]);
                  setSName(''); setSRole(''); setSMobile(''); setSId(''); setSAddress(''); fetchData(); alert("Staff Profile Created!");
               }} className="space-y-4 text-xs font-bold">
                  <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sName} onChange={e => setSName(e.target.value)} required />
                  <input placeholder="Job Role (e.g. Receptionist)" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sRole} onChange={e => setSRole(e.target.value)} />
                  <input placeholder="Phone Number" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sMobile} onChange={e => setSMobile(e.target.value)} />
                  <input placeholder="Aadhar/ID Number" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sId} onChange={e => setSId(e.target.value)} />
                  <textarea placeholder="Home Address" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sAddress} onChange={e => setSAddress(e.target.value)} />
                  <button className="w-full py-5 bg-blue-700 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest">Register Profile</button>
               </form>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               {staff.map(s => (
                 <div key={s.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border-b-8 border-blue-100 flex items-center gap-5 hover:scale-[1.02] transition-transform">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-blue-100">👤</div>
                    <div className="flex-1 min-w-0">
                       <p className="font-black text-sm uppercase text-slate-800 truncate">{s.name}</p>
                       <p className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">{s.roll}</p>
                       <div className="text-[8px] text-slate-400 font-bold bg-slate-50 p-3 rounded-2xl leading-relaxed">
                          {s.status}
                       </div>
                    </div>
                    <button onClick={async () => { if(confirm("Remove?")) { await supabase.from('staff_records').delete().eq('id', s.id); fetchData(); } }} className="bg-red-50 text-red-300 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all">✕</button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
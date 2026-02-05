'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(null)
  const [pin, setPin] = useState('')
  const [viewMode, setViewMode] = useState('dashboard')
  const [bookings, setBookings] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])

  // Entry Form States
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

  useEffect(() => { if (isLoggedIn) fetchData() }, [isLoggedIn])

  const handleLogin = (role: 'admin' | 'staff') => {
    if (role === 'admin' && pin === '1234') {
      setUserRole('admin'); setIsLoggedIn(true); setViewMode('dashboard');
    } else if (role === 'staff' && pin === '5555') {
      setUserRole('staff'); setIsLoggedIn(true); setViewMode('dashboard');
    } else {
      alert("Wrong PIN for " + role + "! ❌");
    }
    setPin('')
  }

  const handleAddBooking = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('bookings').insert([{ 
      guest_name: guest, booking_type: bType, price: parseInt(price) || 0, room_no: roomNo, status: 'Active' 
    }]);
    if (!error) { setGuest(''); setRoomNo(''); setPrice(''); fetchData(); alert("Entry Saved! ✅"); }
  }

  const handleAddStaff = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('staff_records').insert([{ 
      name: sName, roll: sRole, status: `Mob: ${sMobile} | ID: ${sId} | Addr: ${sAddress}` 
    }]);
    if (!error) { setSName(''); setSRole(''); setSMobile(''); setSId(''); setSAddress(''); fetchData(); alert("Staff Added! 👨‍💼"); }
  }

  // 1. SHANDAR LOGIN SCREEN WITH TWO BUTTONS
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl w-full max-w-sm text-center border-t-8 border-amber-600">
          <div className="text-4xl mb-2">👑</div>
          <h1 className="text-3xl font-black text-amber-900 mb-1 italic uppercase tracking-tighter">Grand Resort</h1>
          <p className="text-[10px] text-slate-400 font-bold mb-8 tracking-[0.4em] uppercase">Security Portal</p>
          <input 
            type="password" placeholder="ENTER PIN" 
            className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none mb-6 border-2 focus:border-amber-500" 
            value={pin} onChange={(e) => setPin(e.target.value)} 
          />
          <div className="flex flex-col gap-3">
            <button onClick={() => handleLogin('admin')} className="py-4 bg-amber-800 text-white font-black rounded-2xl shadow-lg uppercase text-xs tracking-widest active:scale-95 transition-all">Admin Login</button>
            <button onClick={() => handleLogin('staff')} className="py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg uppercase text-xs tracking-widest active:scale-95 transition-all">Staff Login</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-800 font-sans pb-10">
      {/* HEADER */}
      <header className="bg-white shadow-xl border-b-4 border-amber-600 sticky top-0 z-50 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-black text-amber-800 italic uppercase">👑 GRAND RESORT</h1>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${userRole === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              ● {userRole}
            </span>
            <button onClick={() => {setIsLoggedIn(false); setUserRole(null)}} className="text-[9px] font-bold text-slate-400 border px-3 py-1.5 rounded-xl uppercase">Logout</button>
          </div>
        </div>
        <nav className="flex gap-8 mt-5 max-w-7xl mx-auto border-t pt-3 overflow-x-auto no-scrollbar">
          <button onClick={() => setViewMode('dashboard')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${viewMode === 'dashboard' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>🏠 Entry</button>
          {userRole === 'admin' && (
            <>
              <button onClick={() => setViewMode('staff')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${viewMode === 'staff' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>👨‍💼 Staff Hub</button>
              <button onClick={() => setViewMode('reports')} className={`text-[10px] font-black uppercase tracking-widest pb-2 ${viewMode === 'reports' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>📊 Reports</button>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-[1500px] mx-auto p-6 mt-4">
        {/* DASHBOARD ENTRY */}
        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4 hidden lg:block">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500" className="rounded-[2.5rem] h-56 w-full object-cover shadow-xl border-4 border-white" alt="resort" />
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500" className="rounded-[2.5rem] h-56 w-full object-cover shadow-xl border-4 border-white" alt="resort" />
            </div>

            <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-2xl border-t-8 border-amber-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🏩</div>
              <h2 className="text-2xl font-black text-center mb-8 text-amber-900 uppercase italic underline decoration-amber-100 underline-offset-8">New Registration</h2>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <label className="text-[9px] font-black text-amber-800 uppercase tracking-widest ml-1">Select Service</label>
                  <select className="w-full bg-transparent font-bold outline-none text-slate-700 mt-1" value={bType} onChange={e => setBType(e.target.value)}>
                    <option>Hotel Room</option><option>Restaurant</option><option>Pool Side</option>
                  </select>
                </div>
                <input placeholder="Enter Guest Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-50 focus:border-amber-200 outline-none font-bold" value={guest} onChange={e => setGuest(e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Room / Table No." className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold shadow-inner" value={roomNo} onChange={e => setRoomNo(e.target.value)} />
                  <input placeholder="Price ₹" type="number" className="w-full p-5 bg-slate-50 rounded-2xl font-black text-green-700 outline-none shadow-inner" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <button className="w-full py-5 bg-amber-900 text-white font-black rounded-[2rem] shadow-xl uppercase tracking-[0.3em] active:scale-95 transition-all text-sm mt-4">Confirm Entry</button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-black rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl relative">
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-[8px] text-white font-black px-3 py-1 rounded-full animate-pulse">LIVE FEED</div>
                <iframe className="w-full h-full object-cover scale-[1.7]" src={`https://www.youtube.com/embed/AXeVCu6aKZk?autoplay=1&mute=1&loop=1&playlist=AXeVCu6aKZk&controls=0`}></iframe>
              </div>
            </div>
          </div>
        )}

        {/* STAFF LISTING */}
        {viewMode === 'staff' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-blue-600">
              <h2 className="text-xl font-black mb-6 uppercase text-slate-700">Add Staff</h2>
              <form onSubmit={handleAddStaff} className="space-y-3">
                <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sName} onChange={e => setSName(e.target.value)} required />
                <input placeholder="Role" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sRole} onChange={e => setSRole(e.target.value)} />
                <input placeholder="Mobile" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sMobile} onChange={e => setSMobile(e.target.value)} />
                <input placeholder="ID Number" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sId} onChange={e => setSId(e.target.value)} />
                <textarea placeholder="Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sAddress} onChange={e => setSAddress(e.target.value)} />
                <button className="w-full py-4 bg-blue-700 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg">Save Staff Member</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest ml-4 italic">Registered Personnel</h3>
              {staff.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border-l-8 border-blue-500 flex justify-between items-center transition-all hover:translate-x-1">
                  <div>
                    <p className="font-black text-sm uppercase text-slate-700">{s.name}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase">{s.roll}</p>
                    <p className="text-[9px] text-slate-400 mt-2 italic">{s.status}</p>
                  </div>
                  <button onClick={async () => { if(confirm("Remove?")) { await supabase.from('staff_records').delete().eq('id', s.id); fetchData(); } }} className="text-red-400 hover:text-red-600 font-black text-[9px] uppercase border px-3 py-2 rounded-xl border-red-50 transition-colors">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT REPORTS */}
        {viewMode === 'reports' && userRole === 'admin' && (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-t-8 border-amber-900 animate-in zoom-in duration-300">
             <div className="p-8 bg-amber-900 text-white flex justify-between items-center">
                <h2 className="font-black uppercase tracking-[0.2em] italic">Grand Resort Audit</h2>
                <span className="text-[10px] opacity-60 font-black">PRIVATE & CONFIDENTIAL</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b">
                      <th className="p-6">Arrival Date</th>
                      <th className="p-6">Guest Detail</th>
                      <th className="p-6 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="p-6 text-[10px] font-bold text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                        <td className="p-6">
                           <p className="font-black text-xs uppercase text-slate-700 tracking-tighter">{b.guest_name}</p>
                           <p className="text-[9px] text-slate-400 font-bold">{b.room_no} | {b.booking_type}</p>
                        </td>
                        <td className="p-6 font-black text-base text-green-700 text-right italic">₹{b.price}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}

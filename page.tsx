'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null) 
  const [pin, setPin] = useState('')
  const [viewMode, setViewMode] = useState('dashboard')
  const [bookings, setBookings] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  
  const [guest, setGuest] = useState(''); const [bType, setBType] = useState('Hotel Room')
  const [roomNo, setRoomNo] = useState(''); const [price, setPrice] = useState('')
  
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
    if (pin === '1234') {
      setUserRole('admin'); setIsLoggedIn(true)
    } else if (pin === '5555') {
      setUserRole('staff'); setIsLoggedIn(true); setViewMode('dashboard')
    } else {
      alert("Wrong PIN!");
    }
    setPin('')
  }

  const handleAddBooking = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('bookings').insert([{ 
        guest_name: guest, booking_type: bType, price: parseInt(price) || 0, room_no: roomNo, status: 'Active'
    }]);
    if (!error) { setGuest(''); setRoomNo(''); setPrice(''); fetchData(); alert("Entry Done!"); }
  }

  const handleAddStaff = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('staff_records').insert([{ 
      name: sName, roll: sRole, status: `Mob: ${sMobile} | ID: ${sId} | Addr: ${sAddress}` 
    }]);
    if (!error) { setSName(''); setSRole(''); setSMobile(''); setSId(''); setSAddress(''); fetchData(); alert("Staff Registered!"); }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-amber-600">
          <h1 className="text-4xl font-black text-amber-800 mb-2 italic uppercase">👑 Grand Resort</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Secure Access Portal</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER PIN" className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none" value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl shadow-lg hover:bg-amber-700 uppercase transition-all active:scale-95">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-800 font-sans">
      <header className="bg-white shadow-xl border-b-4 border-amber-600 sticky top-0 z-50 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-amber-800 italic uppercase tracking-tighter">👑 GRAND RESORT</h1>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${userRole === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {userRole}
            </span>
            <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-bold text-slate-400 border px-3 py-1 rounded-lg hover:bg-slate-50">LOGOUT</button>
          </div>
        </div>
        <nav className="flex gap-6 mt-4 max-w-7xl mx-auto border-t pt-3">
          <button onClick={() => setViewMode('dashboard')} className={`text-[11px] font-black uppercase tracking-widest ${viewMode === 'dashboard' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>🏠 Entry</button>
          {userRole === 'admin' && (
            <>
              <button onClick={() => setViewMode('staff')} className={`text-[11px] font-black uppercase tracking-widest ${viewMode === 'staff' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>👨‍💼 Staff</button>
              <button onClick={() => setViewMode('reports')} className={`text-[11px] font-black uppercase tracking-widest ${viewMode === 'reports' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>📊 Reports</button>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-[1400px] mx-auto p-6">
        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 space-y-4 hidden lg:block">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500" className="rounded-[2rem] h-64 w-full object-cover shadow-lg border-4 border-white" alt="resort view" />
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500" className="rounded-[2rem] h-64 w-full object-cover shadow-lg border-4 border-white" alt="resort interior" />
            </div>
            
            <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-2xl border-t-8 border-amber-600">
              <h2 className="text-2xl font-black text-center mb-8 text-amber-900 uppercase italic">New Guest Entry</h2>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                  <label className="text-[10px] font-black text-amber-800 uppercase ml-1">Category</label>
                  <select className="w-full bg-transparent font-bold outline-none" value={bType} onChange={e => setBType(e.target.value)}>
                    <option>Hotel Room</option><option>Restaurant</option><option>Pool Side</option>
                  </select>
                </div>
                <input placeholder="Full Guest Name" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-50 focus:border-amber-200 outline-none font-bold" value={guest} onChange={e => setGuest(e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Room / Table No." className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" value={roomNo} onChange={e => setRoomNo(e.target.value)} />
                  <input placeholder="Total Bill ₹" type="number" className="w-full p-5 bg-slate-50 rounded-2xl font-black text-green-700 outline-none" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <button className="w-full py-5 bg-amber-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] transition-transform active:scale-95">Confirm Registration</button>
              </form>
            </div>

            <div className="lg:col-span-1 h-full">
              <div className="aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative">
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-[8px] text-white font-black px-3 py-1 rounded-full animate-pulse">LIVE VIEW</div>
                <iframe className="w-full h-full object-cover scale-[1.6]" src={`https://www.youtube.com/embed/AXeVCu6aKZk?autoplay=1&mute=1&loop=1&playlist=AXeVCu6aKZk&controls=0`}></iframe>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'staff' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-blue-500">
              <h2 className="text-xl font-black mb-6 text-slate-700 uppercase italic">Add Staff</h2>
              <form onSubmit={handleAddStaff} className="space-y-3">
                <input placeholder="Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sName} onChange={e => setSName(e.target.value)} required />
                <input placeholder="Role" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sRole} onChange={e => setSRole(e.target.value)} />
                <input placeholder="Mobile" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sMobile} onChange={e => setSMobile(e.target.value)} />
                <input placeholder="ID Number" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sId} onChange={e => setSId(e.target.value)} />
                <textarea placeholder="Full Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100" value={sAddress} onChange={e => setSAddress(e.target.value)} />
                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl uppercase text-xs tracking-widest shadow-lg">Register</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-black text-slate-400 uppercase text-[10px] tracking-widest ml-4">Current Staff Roster</h2>
              {staff.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[2rem] shadow-sm border-l-8 border-blue-500 flex justify-between items-center transition-all hover:shadow-md">
                  <div>
                    <p className="font-black text-sm uppercase text-slate-700">{s.name}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{s.roll}</p>
                    <p className="text-[9px] text-slate-400 mt-2 italic font-medium">{s.status}</p>
                  </div>
                  <button onClick={async () => { if(confirm("Remove this member?")) { await supabase.from('staff_records').delete().eq('id', s.id); fetchData(); } }} className="text-red-400 hover:text-red-600 font-black text-[9px] uppercase border px-3 py-2 rounded-xl border-red-50">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'reports' && userRole === 'admin' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 bg-amber-800 text-white flex justify-between items-center">
                <h2 className="font-black uppercase tracking-[0.2em] italic text-lg">Grand Resort Audit</h2>
                <div className="text-[10px] font-bold opacity-70">CONFIDENTIAL REPORT</div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b-2">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Arrival Date</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Guest Name</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-6 text-[11px] font-bold text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                        <td className="p-6 font-black text-xs uppercase text-slate-700 tracking-tighter">{b.guest_name}</td>
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

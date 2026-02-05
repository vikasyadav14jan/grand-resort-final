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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-amber-600">
          <h1 className="text-4xl font-black text-amber-800 mb-2 italic uppercase">👑 Grand</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mb-8">Management Login</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER PIN" className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none" value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl shadow-lg hover:bg-amber-700 uppercase">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-800 font-sans">
      <header className="bg-white shadow-xl border-b-4 border-amber-600 sticky top-0 z-50 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-amber-800">👑 GRAND RESORT</h1>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${userRole === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              ● {userRole}
            </span>
            <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-bold text-slate-400 border px-3 py-1 rounded-lg">LOGOUT</button>
          </div>
        </div>
        <nav className="flex gap-6 mt-4 max-w-7xl mx-auto border-t pt-3">
          <button onClick={() => setViewMode('dashboard')} className={`text-[11px] font-bold uppercase ${viewMode === 'dashboard' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>🏠 Entry</button>
          {userRole === 'admin' && (
            <>
              <button onClick={() => setViewMode('staff')} className={`text-[11px] font-bold uppercase ${viewMode === 'staff' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>👨‍💼 Staff</button>
              <button onClick={() => setViewMode('reports')} className={`text-[11px] font-bold uppercase ${viewMode === 'reports' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}`}>📊 Reports</button>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500" className="rounded-3xl h-48 w-full object-cover shadow-lg border-4 border-white" />
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500" className="rounded-3xl h-48 w-full object-cover shadow-lg border-4 border-white" />
            </div>
            <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-2xl border-t-8 border-amber-600">
               <h2 className="text-2xl font-black text-center mb-6 text-amber-900 uppercase">New Entry</h2>
               <form onSubmit={handleAddBooking} className="space-y-4">
                 <select className="w-full p-4 bg-amber-50 rounded-2xl font-bold" value={bType} onChange={e => setBType(e.target.value)}>
                   <option>Hotel Room</option><option>Restaurant</option><option>Pool Side</option>
                 </select>
                 <input placeholder="Guest Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={guest} onChange={e => setGuest(e.target.value)} required />
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Room/Table No." className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={roomNo} onChange={e => setRoomNo(e.target.value)} />
                    <input placeholder="Price ₹" className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-green-600 outline-none" value={price} onChange={e => setPrice(e.target.value)} />
                 </div>
                 <button className="w-full py-5 bg-amber-800 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest transition-transform active:scale-95">Save Entry</button>
               </form>
            </div>
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-black rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <iframe className="w-full h-full object-cover scale-150" src={`https://www.youtube.com/embed/AXeVCu6aKZk?autoplay=1&mute=1&loop=1&playlist=AXeVCu6aKZk&controls=0`}></iframe>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'staff' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] shadow-xl border-t-4 border-blue-500">
              <h2 className="text-xl font-black mb-6 text-slate-700">Add New Staff</h2>
              <form onSubmit={handleAddStaff} className="space-y-3">
                <input placeholder="Full Name" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={sName} onChange={e => setSName(e.target.value)} required />
                <input placeholder="Role" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={sRole} onChange={e => setSRole(e.target.value)} />
                <input placeholder="Mobile" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={sMobile} onChange={e => setSMobile(e.target.value)} />
                <input placeholder="ID Number" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={sId} onChange={e => setSId(e.target.value)} />
                <textarea placeholder="Address" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={sAddress} onChange={e => setSAddress(e.target.value)} />
                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl uppercase text-xs">Register Staff</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-black text-slate-400 uppercase text-xs ml-2">Active Staff Members</h2>
              {staff.map(s => (
                <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                  <div>
                    <p className="font-black text-sm uppercase text-slate-700">{s.name}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase">{s.roll}</p>
                    <p className="text-[10px] text-slate-400 mt-2 italic">{s.status}</p>
                  </div>
                  <button onClick={async () => { if(confirm("Remove Staff?")) { await supabase.from('staff_records').delete().eq('id', s.id); fetchData(); } }} className="text-red-300 hover:text-red-600 font-bold text-[10px] uppercase transition-colors">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'reports' && userRole === 'admin' && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
             <div className="p-6 bg-amber-800 text-white flex justify-between items-center"><h2 className="font-black uppercase tracking-widest">Grand Audit Report</h2></div>
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr><th className="p-5 text-[10px] font-black uppercase text-slate-400">Date</th><th className="p-5 text-[10px] font-black uppercase text-slate-400">Guest</th><th className="p-5 text-[10px] font-black uppercase text-slate-400">Amount</th></tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-amber-50/50"><td className="p-5 text-[10px] font-bold">{new Date(b.created_at).toLocaleDateString()}</td><td className="p-5 font-black text-xs uppercase">{b.guest_name}</td><td className="p-5 font-black text-sm text-green-700">₹{b.price}</td></tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  )
}



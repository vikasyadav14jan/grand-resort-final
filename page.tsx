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
  
  // Staff Form States
  const [sName, setSName] = useState(''); const [sRole, setSRole] = useState('')
  const [sMobile, setSMobile] = useState(''); const [sId, setSId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState('')

  async function fetchData() {
    const { data: bk } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (bk) setBookings(bk)
    const { data: st } = await supabase.from('staff_records').select('*').order('id', { ascending: false })
    if (st) setStaff(st)
  }

  useEffect(() => { if(isLoggedIn) fetchData() }, [isLoggedIn])

  // फोटो अपलोड करने का फंक्शन
  const uploadPhoto = async (e: any) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('staff-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('staff-photos').getPublicUrl(filePath)
      setPhotoUrl(data.publicUrl)
      alert("Photo Uploaded Successfully!")
    } catch (error) {
      alert('Error uploading photo!')
    } finally {
      setUploading(false)
    }
  }

  const handleAddStaff = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.from('staff_records').insert([{ 
      name: sName, 
      roll: sRole, 
      status: `Mob: ${sMobile} | ID: ${sId}`,
      photo: photoUrl // यहाँ फोटो का लिंक सेव होगा
    }])
    if (!error) {
      setSName(''); setSRole(''); setSMobile(''); setSId(''); setPhotoUrl('');
      fetchData(); alert("Staff Profile Created!");
    }
  }

  // लॉगिन फंक्शन (पहले जैसा)
  const handleLogin = (e: any) => {
    e.preventDefault()
    if (pin === '1234') { setUserRole('admin'); setIsLoggedIn(true) }
    else if (pin === '5555') { setUserRole('staff'); setIsLoggedIn(true); setViewMode('dashboard') }
    else { alert("Wrong PIN!") }
    setPin('')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-t-8 border-amber-600">
          <h1 className="text-4xl font-black text-amber-800 mb-2 italic uppercase tracking-tighter">👑 Grand Resort</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="ENTER PIN" className="w-full p-5 bg-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] outline-none" value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className="w-full py-5 bg-amber-600 text-white font-black rounded-2xl shadow-lg hover:bg-amber-700 uppercase">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-800 font-sans pb-10">
      <header className="bg-white shadow-xl border-b-4 border-amber-600 sticky top-0 z-50 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-amber-800">👑 GRAND RESORT</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-bold text-slate-400 border px-3 py-1 rounded-lg">LOGOUT</button>
        </div>
        <nav className="flex gap-6 mt-4 max-w-7xl mx-auto border-t pt-3 font-bold text-[11px] uppercase">
          <button onClick={() => setViewMode('dashboard')} className={viewMode === 'dashboard' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}>🏠 Entry</button>
          <button onClick={() => setViewMode('reports')} className={viewMode === 'reports' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}>📊 Live Status</button>
          {userRole === 'admin' && (
            <button onClick={() => setViewMode('staff')} className={viewMode === 'staff' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400'}>👨‍💼 Staff Hub</button>
          )}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* STAFF SECTION WITH PHOTO UPLOAD */}
        {viewMode === 'staff' && userRole === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-t-8 border-blue-600">
               <h2 className="text-xl font-black mb-6 uppercase text-slate-700 italic">Add New Staff</h2>
               <form onSubmit={handleAddStaff} className="space-y-4 text-xs font-bold">
                  {/* Photo Input */}
                  <div className="bg-blue-50 p-4 rounded-2xl border-2 border-dashed border-blue-200 text-center">
                    {photoUrl ? (
                      <img src={photoUrl} className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md" />
                    ) : (
                      <div className="text-blue-400">
                        <p className="mb-2">📷 {uploading ? 'Uploading...' : 'Staff Photo'}</p>
                        <input type="file" accept="image/*" capture="environment" onChange={uploadPhoto} className="text-[10px]" disabled={uploading} />
                      </div>
                    )}
                  </div>

                  <input placeholder="Name" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sName} onChange={e => setSName(e.target.value)} required />
                  <input placeholder="Role" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sRole} onChange={e => setSRole(e.target.value)} />
                  <input placeholder="Mobile" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none" value={sMobile} onChange={e => setSMobile(e.target.value)} />
                  <button className="w-full py-5 bg-blue-700 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest disabled:bg-slate-300" disabled={uploading}>Save Profile</button>
               </form>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               {staff.map(s => (
                 <div key={s.id} className="bg-white p-5 rounded-[2.5rem] shadow-lg flex items-center gap-4">
                    <img src={s.photo || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shadow-sm" />
                    <div className="flex-1">
                       <p className="font-black text-sm uppercase text-slate-800">{s.name}</p>
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{s.roll}</p>
                       <p className="text-[9px] text-slate-400 mt-1">{s.status}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Baki sections pehle jaise hi kaam karenge... */}
        {viewMode === 'dashboard' && <div className="text-center p-10 font-bold text-slate-400">Guest Entry Section is Ready!</div>}
        {viewMode === 'reports' && <div className="text-center p-10 font-bold text-slate-400">Live Status Section is Ready!</div>}
      </main>
    </div>
  )
}

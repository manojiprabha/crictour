"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Profile(){

const [clubId,setClubId] = useState("")
const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [role,setRole] = useState("")
const [playCricket,setPlayCricket] = useState("")

useEffect(()=>{

async function loadClub(){

const { data:userData } = await supabase.auth.getUser()

const user = userData?.user

if(!user) return

const { data } = await supabase
.from("clubs")
.select("*")
.eq("created_by",user.id)
.single()

if(data){

setClubId(data.id)
setClubName(data.club_name)
setCity(data.city)
setRole(data.role)
setPlayCricket(data.play_cricket_url || "")

}

}

loadClub()

},[])

async function updateClub(){

await supabase
.from("clubs")
.update({
club_name:clubName,
city,
role,
play_cricket_url:playCricket
})
.eq("id",clubId)

alert("Club updated")

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Edit Club Profile
</h1>

<div className="space-y-4">

<input
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
className="w-full border p-2 rounded"
/>

<input
value={city}
onChange={(e)=>setCity(e.target.value)}
className="w-full border p-2 rounded"
/>

<input
value={role}
onChange={(e)=>setRole(e.target.value)}
className="w-full border p-2 rounded"
/>

<input
value={playCricket}
onChange={(e)=>setPlayCricket(e.target.value)}
className="w-full border p-2 rounded"
placeholder="Play Cricket URL"
/>

<button
onClick={updateClub}
className="bg-emerald-600 text-white px-4 py-2 rounded"
>
Save Changes
</button>

</div>

</div>

</div>

</div>

)

}
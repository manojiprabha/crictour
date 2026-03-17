"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

export default function PostMatch(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [clubId,setClubId] = useState<string | null>(null) // ✅ NEW
const [city,setCity] = useState("")
const [matchType,setMatchType] = useState("")
const [format,setFormat] = useState("")
const [date,setDate] = useState("")
const [description,setDescription] = useState("")
const [email,setEmail] = useState("")

/* ---------------- LOAD CLUB ---------------- */

useEffect(()=>{

async function loadClub(){

const { data:userData } = await supabase.auth.getUser()
const user = userData?.user

if(!user) return

const { data:club } = await supabase
.from("clubs")
.select("id, club_name, city") // ✅ include id
.eq("created_by",user.id)
.single()

if(club){

setClubName(club.club_name)
setCity(club.city)
setClubId(club.id) // ✅ IMPORTANT

}

setEmail(user.email || "")

}

loadClub()

},[])

/* ---------------- SUBMIT ---------------- */

async function submitMatch(){

if(!date){
alert("Please select a match date")
return
}

if(!clubId){
alert("Club not loaded properly")
return
}

const { error } = await supabase
.from("matches")
.insert([
{
club_id: clubId,              // 🔥 FIX (CRITICAL)
club_name: clubName,
city: city,
match_type: matchType,
format: format,
match_date: date,
description: description,
contact_email: email
}
])

if(error){
console.log("Match insert error:", error)
alert(error.message)
return
}

alert("Match posted successfully!")

router.push("/matches")

}

/* ---------------- UI ---------------- */

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Post Match
</h1>

<div className="space-y-4">

<input
value={clubName}
readOnly
className="w-full border p-2 rounded bg-gray-100"
/>

<input
value={city}
readOnly
className="w-full border p-2 rounded bg-gray-100"
/>

<input
placeholder="Match Type (Friendly / Tour)"
className="w-full border p-2 rounded"
value={matchType}
onChange={(e)=>setMatchType(e.target.value)}
/>

<input
placeholder="Format (T20 / 40 overs)"
className="w-full border p-2 rounded"
value={format}
onChange={(e)=>setFormat(e.target.value)}
/>

<input
type="date"
className="w-full border p-2 rounded"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

<textarea
placeholder="Match Details"
className="w-full border p-2 rounded"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<input
value={email}
readOnly
className="w-full border p-2 rounded bg-gray-100"
/>

<button
onClick={submitMatch}
className="bg-emerald-600 text-white px-4 py-2 rounded"
>
Submit Match
</button>

</div>

</div>

</div>

</div>

)

}
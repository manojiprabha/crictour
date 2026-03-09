"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

export default function PostMatch(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [matchType,setMatchType] = useState("")
const [format,setFormat] = useState("")
const [date,setDate] = useState("")
const [description,setDescription] = useState("")
const [email,setEmail] = useState("")

async function submitMatch(){

await supabase.from("matches").insert({
club_name:clubName,
city,
match_type:matchType,
format,
match_date:date,
description,
contact_email:email
})

router.push("/matches")

}

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
placeholder="Club Name"
className="w-full border p-2 rounded"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
/>

<input
placeholder="City"
className="w-full border p-2 rounded"
value={city}
onChange={(e)=>setCity(e.target.value)}
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
placeholder="Description"
className="w-full border p-2 rounded"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<input
placeholder="Contact Email"
className="w-full border p-2 rounded"
value={email}
onChange={(e)=>setEmail(e.target.value)}
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
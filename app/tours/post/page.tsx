"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function PostTour(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [dates,setDates] = useState("")
const [description,setDescription] = useState("")
const [email,setEmail] = useState("")

async function submitTour(){

await supabase.from("tours").insert({
club_name:clubName,
city,
tour_dates:dates,
description,
contact_email:email
})

router.push("/tours")

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Host a Touring Team
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
placeholder="Tour Dates (e.g. July 10–15)"
className="w-full border p-2 rounded"
value={dates}
onChange={(e)=>setDates(e.target.value)}
/>

<textarea
placeholder="Tour details"
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
onClick={submitTour}
className="bg-emerald-600 text-white px-4 py-2 rounded"
>
Submit Tour Request
</button>

</div>

</div>

</div>

</div>

)

}
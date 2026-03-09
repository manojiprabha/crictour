"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useParams } from "next/navigation"

export default function MatchDetails(){

const params = useParams()

const [match,setMatch] = useState<any>(null)

useEffect(()=>{

async function loadMatch(){

const { data } = await supabase
.from("matches")
.select("*")
.eq("id",params.id)
.single()

setMatch(data)

}

loadMatch()

},[])

if(!match) return <p>Loading...</p>

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-4">
{match.club_name}
</h1>

<p className="text-slate-600 mb-4">
{match.city}
</p>

<p><strong>Match Type:</strong> {match.match_type}</p>
<p><strong>Date:</strong> {match.match_date}</p>
<p><strong>Format:</strong> {match.format}</p>

<p className="mt-4">
{match.description}
</p>

<a
href={`mailto:${match.contact_email}`}
className="inline-block mt-6 bg-emerald-600 text-white px-4 py-2 rounded"
>
Email Club
</a>

</div>

</div>

</div>

)

}
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

type Match = {
 id:string
 club_name:string
 city:string
 match_type:string
 match_date:string
 format:string
 description:string
 contact_email:string
}

export default function Matches(){

const router = useRouter()
const [matches,setMatches] = useState<Match[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

async function loadMatches(){

const { data } = await supabase
.from("matches")
.select("*")
.order("match_date",{ascending:true})

if(data) setMatches(data)

setLoading(false)

}

loadMatches()

},[])

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10">

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">
Match Board
</h1>

<button
onClick={()=>router.push("/matches/post")}
className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
>
Post Match
</button>

</div>

{loading && <p>Loading matches...</p>}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{matches.map((match)=>(
<div
key={match.id}
className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
>

<h3 className="text-lg font-bold mb-2">
{match.club_name}
</h3>

<p className="text-sm text-slate-500 mb-3">
{match.city}
</p>

<div className="text-sm space-y-1">

<p><strong>Type:</strong> {match.match_type}</p>
<p><strong>Date:</strong> {match.match_date}</p>
<p><strong>Format:</strong> {match.format}</p>

</div>

<p className="text-sm text-slate-600 mt-3">
{match.description}
</p>

<button
onClick={()=>router.push(`/matches/${match.id}`)}
className="mt-4 text-emerald-600 text-sm font-semibold"
>
Contact Club →
</button>

</div>
))}

</div>

</div>

</div>

</div>

)

}
"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Match = {
 id:string
 club_name:string
 match_date:string
 format:string
 city:string
}

export default function Dashboard(){

const router = useRouter()

const [matches,setMatches] = useState<Match[]>([])

useEffect(()=>{

async function loadMatches(){

const { data } = await supabase
.from("matches")
.select("*")
.order("created_at",{ascending:false})
.limit(4)

if(data){

setMatches(data)

}

}

loadMatches()

},[])

function ActionCard({
title,
desc,
icon,
path
}:{title:string,desc:string,icon:string,path:string}){

return(

<div
onClick={()=>router.push(path)}
className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
>

<div>

<div className="text-2xl mb-4">
{icon}
</div>

<h3 className="font-bold text-lg mb-2">
{title}
</h3>

<p className="text-sm text-slate-500">
{desc}
</p>

</div>

<button className="mt-6 text-sm font-semibold text-emerald-600 hover:underline text-left">
Open →
</button>

</div>

)

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-8">

<div className="max-w-6xl">

<header className="mb-10">

<h1 className="text-3xl font-bold text-slate-900">
Welcome back 🏏
</h1>

<p className="text-slate-500">
Here is what's happening on CricTour today.
</p>

</header>


{/* ACTION CARDS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

<ActionCard
title="Post Match"
desc="Create a friendly match request."
icon="➕"
path="/matches/post"
/>

<ActionCard
title="Find Opponents"
desc="Browse clubs looking for matches."
icon="🔎"
path="/matches"
/>

<ActionCard
title="Host Tour"
desc="Invite touring teams to your club."
icon="🚌"
path="/tours/post"
/>

</div>


{/* REAL MATCH FEED */}

<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

<div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">

<h2 className="font-bold text-slate-800">
Recent Match Requests
</h2>

<button
onClick={()=>router.push("/matches")}
className="text-emerald-600 text-sm font-semibold hover:underline"
>
View All
</button>

</div>

<div className="divide-y divide-slate-50">

{matches.map((match)=>(

<div
key={match.id}
className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
>

<div>

<p className="font-semibold text-slate-900">
{match.match_date} • {match.format}
</p>

<p className="text-sm text-slate-500">
{match.club_name} • {match.city}
</p>

</div>

<button
onClick={()=>router.push(`/matches/${match.id}`)}
className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-50"
>
View
</button>

</div>

))}

</div>

</div>

</div>

</div>

</div>

</div>

)

}
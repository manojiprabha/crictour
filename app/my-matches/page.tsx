"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Match = {
id:string
club_name:string
match_date:string
format:string
match_type:string
}

export default function MyMatches(){

const [matches,setMatches] = useState<Match[]>([])

useEffect(() => {

  async function loadMatches() {

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) return

    // ✅ get club id first
    const { data: club } = await supabase
      .from("clubs")
      .select("id")
      .eq("created_by", user.id)
      .single()

    if (!club) return

    const today = new Date().toISOString().split("T")[0]

    // ✅ now fetch matches
    const { data } = await supabase
      .from("matches")
      .select("*")
      .eq("club_id", club.id)   // ✅ FIXED
      .gte("match_date", today)
      .order("match_date", { ascending: true })

    if (data) {
      setMatches(data)
    }

  }

  loadMatches()

}, [])

async function deleteMatch(id:string){

await supabase
.from("matches")
.delete()
.eq("id",id)

setMatches(matches.filter(m=>m.id!==id))

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10">

<h1 className="text-3xl font-bold mb-8">
My Matches
</h1>

<div className="space-y-4">

{matches.map((match)=>(

<div
key={match.id}
className="bg-white border rounded-lg p-4 flex justify-between"
>

<div>

<p className="font-semibold">
{match.match_date}
</p>

<p className="text-sm text-slate-500">
{match.format} • {match.match_type}
</p>

</div>

<button
onClick={()=>deleteMatch(match.id)}
className="text-red-500"
>
Delete
</button>

</div>

))}

</div>

</div>

</div>

</div>

)

}
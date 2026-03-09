"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {

const router = useRouter()
const [loading,setLoading] = useState(true)
const [userEmail,setUserEmail] = useState<string | null>(null)

useEffect(()=>{

 async function checkUser(){

  const { data } = await supabase.auth.getSession()

  if(!data.session){
   router.push("/")
  }else{
   setUserEmail(data.session.user.email ?? null)
   setLoading(false)
  }

 }

 checkUser()

},[])

async function signOut(){

 await supabase.auth.signOut()

 router.push("/")

}

if(loading){

 return (
  <div className="min-h-screen flex items-center justify-center">
   Loading...
  </div>
 )

}

return (

<div className="min-h-screen bg-gray-100">

{/* TOP BAR */}

<div className="bg-[#0a2540] text-white">

<div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">

<h1 className="text-2xl font-bold">
CricTour
</h1>

<div className="flex items-center gap-6">

<span className="text-sm opacity-80">
{userEmail}
</span>

<button
onClick={signOut}
className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
>
Sign Out
</button>

</div>

</div>

</div>

{/* MAIN */}

<div className="max-w-6xl mx-auto py-10 px-6">

<h2 className="text-3xl font-bold mb-8">
Dashboard
</h2>

<p className="text-gray-600 mb-10">
Welcome to CricTour. Connect with clubs, arrange matches, and organise tours.
</p>

{/* FEATURE GRID */}

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

{/* MATCH BOARD */}

<div
onClick={()=>router.push("/matches")}
className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
>

<h3 className="text-xl font-semibold mb-2">
Match Board
</h3>

<p className="text-gray-600 text-sm">
Find clubs looking for friendly matches.
</p>

</div>


{/* CLUB DISCOVERY */}

<div
onClick={()=>router.push("/clubs")}
className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
>

<h3 className="text-xl font-semibold mb-2">
Club Discovery
</h3>

<p className="text-gray-600 text-sm">
Search cricket clubs by city and league.
</p>

</div>


{/* TOUR REQUESTS */}

<div
onClick={()=>router.push("/tours")}
className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
>

<h3 className="text-xl font-semibold mb-2">
Tour Requests
</h3>

<p className="text-gray-600 text-sm">
Find or host touring cricket teams.
</p>

</div>


{/* MESSAGES */}

<div
onClick={()=>router.push("/messages")}
className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg"
>

<h3 className="text-xl font-semibold mb-2">
Messages
</h3>

<p className="text-gray-600 text-sm">
Chat with other cricket clubs.
</p>

</div>

</div>

</div>

</div>

)

}
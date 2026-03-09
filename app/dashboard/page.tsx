"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Dashboard(){

const router = useRouter()

const [loading,setLoading] = useState(true)
const [userEmail,setUserEmail] = useState<string | null>(null)

useEffect(()=>{

 async function loadUser(){

  const { data } = await supabase.auth.getSession()

  if(!data.session){
   router.push("/")
   return
  }

  const user = data.session.user

  setUserEmail(user.email ?? null)

  setLoading(false)

 }

 loadUser()

},[])

if(loading){

 return(
  <div className="min-h-screen flex items-center justify-center">
   Loading...
  </div>
 )

}

return(

<div>

<Navbar email={userEmail || ""} />

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10">

<h1 className="text-3xl font-bold mb-6">
Dashboard
</h1>

<p className="text-gray-600 mb-10">
Welcome to CricTour.
</p>

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-lg font-semibold mb-2">
Post Match
</h3>
<p className="text-gray-600 text-sm">
Create a friendly match request.
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-lg font-semibold mb-2">
Find Opponents
</h3>
<p className="text-gray-600 text-sm">
Browse clubs looking for matches.
</p>
</div>

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-lg font-semibold mb-2">
Host Tour
</h3>
<p className="text-gray-600 text-sm">
Invite touring teams to your club.
</p>
</div>

</div>

</div>

</div>

</div>

)

}
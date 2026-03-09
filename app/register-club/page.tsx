"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RegisterClub(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [role,setRole] = useState("")
const [playCricket,setPlayCricket] = useState("")

async function createClub(){

 const { data } = await supabase.auth.getSession()

 const user = data.session?.user

 if(!user){
  router.push("/")
  return
 }

 const { error } = await supabase
  .from("clubs")
  .insert({
   club_name:clubName,
   city:city,
   role:role,
   play_cricket_url:playCricket,
   created_by:user.id
  })

 if(error){
  alert(error.message)
 }else{
  router.push("/dashboard")
 }

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

<h1 className="text-2xl font-bold mb-6">
Register Your Club
</h1>

<input
placeholder="Club Name"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
className="w-full border p-2 rounded mb-3"
/>

<input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
className="w-full border p-2 rounded mb-3"
/>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="w-full border p-2 rounded mb-3"
>

<option value="">Your Role</option>
<option>Captain</option>
<option>Player</option>
<option>Manager</option>

</select>

<input
placeholder="Play-Cricket URL"
value={playCricket}
onChange={(e)=>setPlayCricket(e.target.value)}
className="w-full border p-2 rounded mb-4"
/>

<button
onClick={createClub}
className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
>
Create Club
</button>

</div>

</div>

)

}
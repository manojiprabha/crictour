"use client"

import Navbar from "@/components/Navbar"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RegisterClub(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [address,setAddress] = useState("")
const [role,setRole] = useState("")
const [phone,setPhone] = useState("")
const [playCricket,setPlayCricket] = useState("")

async function createClub(){

console.log("Creating club...")

const { data:userData, error:userError } = await supabase.auth.getUser()

if(userError){
console.log("User error:",userError)
alert("User error")
return
}

const user = userData?.user

if(!user){
alert("You must be logged in")
return
}

const { error } = await supabase
.from("clubs")
.insert({
club_name:clubName,
city:city,
address:address,
role:role,
contact_phone:phone,
play_cricket_url:playCricket,
created_by:user.id
})

if(error){
console.log("Insert error:",error)
alert(error.message)
return
}

alert("Club created!")

window.location.href = "/dashboard"

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="max-w-xl mx-auto p-10">

<div className="bg-white border rounded-xl p-8 shadow-sm">

<h1 className="text-2xl font-bold mb-6">
Register Your Club
</h1>

<div className="space-y-4">

<input
placeholder="Club Name"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
className="w-full border rounded-lg p-2"
/>

<input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
className="w-full border rounded-lg p-2"
/>

<input
placeholder="Club Address"
value={address}
onChange={(e)=>setAddress(e.target.value)}
className="w-full border rounded-lg p-2"
/>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="w-full border rounded-lg p-2"
>
<option value="">Your Role</option>
<option>Captain</option>
<option>Vice Captain</option>
<option>Secretary</option>
<option>Manager</option>
<option>Player</option>
</select>

<input
placeholder="Contact Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full border rounded-lg p-2"
/>

<input
placeholder="Play Cricket URL"
value={playCricket}
onChange={(e)=>setPlayCricket(e.target.value)}
className="w-full border rounded-lg p-2"
/>

<button
onClick={createClub}
className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold 
hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
>
Create Club
</button>

</div>

</div>

</div>

</div>

)

}
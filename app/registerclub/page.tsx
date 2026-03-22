"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterClub(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [address,setAddress] = useState("")
const [role,setRole] = useState("")
const [phone,setPhone] = useState("")
const [playCricket,setPlayCricket] = useState("")
const [loading,setLoading] = useState(false)

useEffect(() => {
  async function checkAuth() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      router.push("/")
    }
  }
  checkAuth()
}, [router])

async function createClub(){

if(!clubName || !city){
alert("Club name and city are required")
return
}

setLoading(true)

const { data:userData, error:userError } = await supabase.auth.getUser()

if(userError){
console.log("User error:",userError)
alert("Authentication error")
setLoading(false)
return
}

const user = userData?.user

if(!user){
alert("You must be logged in")
setLoading(false)
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
setLoading(false)
return
}

alert("Club created successfully!")

// force navigation
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

<Input
placeholder="Club Name"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
className="w-full h-12 rounded-lg"
/>

<Input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
className="w-full h-12 rounded-lg"
/>

<Input
placeholder="Club Address"
value={address}
onChange={(e)=>setAddress(e.target.value)}
className="w-full h-12 rounded-lg"
/>

<Select value={role} onValueChange={setRole}>
  <SelectTrigger className="w-full h-12 rounded-lg text-slate-500">
    <SelectValue placeholder="Your Role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Captain">Captain</SelectItem>
    <SelectItem value="Vice Captain">Vice Captain</SelectItem>
    <SelectItem value="Secretary">Secretary</SelectItem>
    <SelectItem value="Manager">Manager</SelectItem>
    <SelectItem value="Player">Player</SelectItem>
  </SelectContent>
</Select>

<Input
placeholder="Contact Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full h-12 rounded-lg"
/>

<Input
placeholder="Play Cricket URL"
value={playCricket}
onChange={(e)=>setPlayCricket(e.target.value)}
className="w-full h-12 rounded-lg"
/>

<Button
onClick={createClub}
disabled={loading}
className="w-full h-12 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
>
{loading ? "Creating Club..." : "Create Club"}
</Button>

</div>

</div>

</div>

</div>

)

}
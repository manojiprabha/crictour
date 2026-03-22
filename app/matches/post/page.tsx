"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function PostMatch(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [matchType,setMatchType] = useState("")
const [format,setFormat] = useState("")
const [date,setDate] = useState("")
const [description,setDescription] = useState("")
const [email,setEmail] = useState("")

useEffect(()=>{

async function loadClub(){

const { data:userData } = await supabase.auth.getUser()

const user = userData?.user

if(!user) {
  router.push("/")
  return
}

const { data:club } = await supabase
.from("clubs")
.select("*")
.eq("created_by",user.id)
.single()

if(club){

setClubName(club.club_name)
setCity(club.city)

}

setEmail(user.email || "")

}

loadClub()

},[])

async function submitMatch(){

if(!date){
alert("Please select a match date")
return
}

const { error } = await supabase
.from("matches")
.insert([
{
club_name: clubName,
city: city,
match_type: matchType,
format: format,
match_date: date,
description: description,
contact_email: email
}
])

if(error){
console.log("Match insert error:", error)
alert(error.message)
return
}

alert("Match posted successfully!")

router.push("/matches")

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Post Match
</h1>

<div className="space-y-4">

<Input
value={clubName}
readOnly
className="w-full h-12 rounded-lg bg-gray-100"
/>

<Input
value={city}
readOnly
className="w-full h-12 rounded-lg bg-gray-100"
/>

<Input
placeholder="Match Type (Friendly / Tour)"
className="w-full h-12 rounded-lg"
value={matchType}
onChange={(e)=>setMatchType(e.target.value)}
/>

<Input
placeholder="Format (T20 / 40 overs)"
className="w-full h-12 rounded-lg"
value={format}
onChange={(e)=>setFormat(e.target.value)}
/>

<Input
type="date"
className="w-full h-12 rounded-lg"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

<Textarea
placeholder="Match Details"
className="w-full rounded-lg min-h-[100px]"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<Input
value={email}
readOnly
className="w-full h-12 rounded-lg bg-gray-100"
/>

<Button
onClick={submitMatch}
className="bg-emerald-600 text-white w-full h-12 rounded-lg hover:bg-emerald-700"
>
Submit Match
</Button>

</div>

</div>

</div>

</div>

)

}
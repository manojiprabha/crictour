"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function PostTour(){

const router = useRouter()

const [clubName,setClubName] = useState("")
const [city,setCity] = useState("")
const [dates,setDates] = useState("")
const [description,setDescription] = useState("")
const [email,setEmail] = useState("")

useEffect(() => {
  async function checkAuth() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      router.push("/")
    }
  }
  checkAuth()
}, [router])

async function submitTour(){

await supabase.from("tours").insert({
club_name:clubName,
city,
tour_dates:dates,
description,
contact_email:email
})

router.push("/tours")

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-xl">

<h1 className="text-2xl font-bold mb-6">
Host a Touring Team
</h1>

<div className="space-y-4">

<Input
placeholder="Club Name"
className="w-full h-12 rounded-lg"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
/>

<Input
placeholder="City"
className="w-full h-12 rounded-lg"
value={city}
onChange={(e)=>setCity(e.target.value)}
/>

<Input
placeholder="Tour Dates (e.g. July 10–15)"
className="w-full h-12 rounded-lg"
value={dates}
onChange={(e)=>setDates(e.target.value)}
/>

<Textarea
placeholder="Tour details"
className="w-full rounded-lg min-h-[100px]"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<Input
placeholder="Contact Email"
className="w-full h-12 rounded-lg"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<Button
onClick={submitTour}
className="bg-emerald-600 text-white w-full h-12 rounded-lg hover:bg-emerald-700"
>
Submit Tour Request
</Button>

</div>

</div>

</div>

</div>

)

}
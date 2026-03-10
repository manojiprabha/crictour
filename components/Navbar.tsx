"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Navbar(){

const router = useRouter()

const [email,setEmail] = useState<string | null>(null)

useEffect(()=>{

async function loadUser(){

const { data } = await supabase.auth.getUser()

if(data?.user){

setEmail(data.user.email || null)

}

}

loadUser()

},[])

async function signOut(){

await supabase.auth.signOut()

router.push("/")

}

return(

<div className="w-full bg-[#12372A] text-white px-8 py-4 flex justify-between items-center">

<div
className="font-bold text-lg cursor-pointer"
onClick={()=>router.push("/dashboard")}
>
🏏 CricTour
</div>

<div className="flex items-center gap-4">

{email && (

<span className="text-sm text-emerald-100">
{email}
</span>

)}

<button
onClick={signOut}
className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
>
Sign Out
</button>

</div>

</div>

)

}
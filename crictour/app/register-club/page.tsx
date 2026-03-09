"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterClub(){

const router = useRouter()

const [clubName,setClubName]=useState("")
const [city,setCity]=useState("")
const [league,setLeague]=useState("")
const [description,setDescription]=useState("")

async function createClub(){

const { data:{user} } = await supabase.auth.getUser()

const { error } = await supabase
.from("clubs")
.insert({
owner_id:user?.id,
club_name:clubName,
city,
league,
description
})

if(error){
alert(error.message)
}else{
router.push("/dashboard")
}

}

return(

<div style={{padding:"60px"}}>

<h1>Register Your Club</h1>

<input
placeholder="Club Name"
value={clubName}
onChange={(e)=>setClubName(e.target.value)}
/>

<br/>

<input
placeholder="City"
value={city}
onChange={(e)=>setCity(e.target.value)}
/>

<br/>

<input
placeholder="League"
value={league}
onChange={(e)=>setLeague(e.target.value)}
/>

<br/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<br/>

<button onClick={createClub}>
Create Club
</button>

</div>

)

}
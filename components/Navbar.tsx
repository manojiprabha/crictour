"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Navbar({email}:{email?:string}){

const router = useRouter()

async function signOut(){
 await supabase.auth.signOut()
 router.push("/")
}

return(

<div className="bg-[#0f3d2e] text-white">

<div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">

<h1
onClick={()=>router.push("/dashboard")}
className="text-2xl font-bold cursor-pointer"
>
🏏 CricTour
</h1>

<div className="flex items-center gap-6">

{email && (
<span className="text-sm opacity-80">
{email}
</span>
)}

{email && (

<button
onClick={signOut}
className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
>
Sign Out
</button>

)}

</div>

</div>

</div>

)

}
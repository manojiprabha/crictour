"use client"

import { useRouter } from "next/navigation"

export default function Sidebar(){

const router = useRouter()

return(

<div className="w-60 bg-white border-r min-h-screen p-6">

<h2 className="font-semibold mb-6 text-gray-600">
Navigation
</h2>

<div className="space-y-4">

<button
onClick={()=>router.push("/dashboard")}
className="block text-left w-full hover:text-green-700"
>
Dashboard
</button>

<button
onClick={()=>router.push("/matches")}
className="block text-left w-full hover:text-green-700"
>
Match Board
</button>

<button
onClick={()=>router.push("/clubs")}
className="block text-left w-full hover:text-green-700"
>
Clubs
</button>

<button
onClick={()=>router.push("/tours")}
className="block text-left w-full hover:text-green-700"
>
Tours
</button>

<button
onClick={()=>router.push("/messages")}
className="block text-left w-full hover:text-green-700"
>
Messages
</button>

</div>

</div>

)

}
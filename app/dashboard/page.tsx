"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

export default function Dashboard(){

const router = useRouter()

function Card({
title,
description,
path
}:{title:string,description:string,path:string}){

return(

<div
onClick={()=>router.push(path)}
className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer"
>

<h3 className="font-bold text-lg mb-2">
{title}
</h3>

<p className="text-sm text-gray-500">
{description}
</p>

</div>

)

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10">

<h1 className="text-3xl font-bold mb-2">
Dashboard
</h1>

<p className="text-slate-600 mb-8">
Welcome to CricTour.
</p>

<div className="grid md:grid-cols-3 gap-6">

<Card
title="Post Match"
description="Create a friendly match request."
path="/matches/post"
/>

<Card
title="Find Opponents"
description="Browse clubs looking for matches."
path="/matches"
/>

<Card
title="Host Tour"
description="Invite touring teams to your club."
path="/tours/post"
/>

</div>

</div>

</div>

</div>

)

}
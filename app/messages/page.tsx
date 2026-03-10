"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Messages(){

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10">

<h1 className="text-3xl font-bold">
Messages
</h1>

<p className="text-slate-500 mt-4">
Messaging between clubs will appear here.
</p>

</div>

</div>

</div>

)

}
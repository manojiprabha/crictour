"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Dashboard(){

return(

<div>

<Navbar email="user@email.com" />

<div className="flex">

<Sidebar />

<div className="flex-1 p-10">

<h1 className="text-3xl font-bold mb-6">
Dashboard
</h1>

<p className="text-gray-600">
Welcome to CricTour.
</p>

</div>

</div>

</div>

)

}
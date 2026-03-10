"use client"

import { useRouter, usePathname } from "next/navigation"

export default function Sidebar(){

const router = useRouter()
const pathname = usePathname()

function NavItem({label, path, icon}:{label:string,path:string,icon:string}){

const active = pathname === path

return(

<button
onClick={()=>router.push(path)}
className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm transition
${active
 ? "bg-emerald-50 text-emerald-700 font-semibold"
 : "text-slate-600 hover:bg-slate-100"}
`}
>

<span className="text-lg">{icon}</span>

{label}

</button>

)

}

return(

<div className="w-64 bg-white border-r min-h-screen p-6">

<h2 className="text-xs font-bold tracking-widest text-slate-400 mb-6 uppercase">
Navigation
</h2>

<div className="space-y-2">

<NavItem label="Dashboard" path="/dashboard" icon="🏠"/>

<NavItem label="Match Board" path="/matches" icon="🏏"/>

<NavItem label="My Matches" path="/my-matches" icon="📅"/>

<NavItem label="Clubs" path="/clubs" icon="👥"/>

<NavItem label="Tours" path="/tours" icon="🚌"/>

<NavItem label="Messages" path="/messages" icon="💬"/>

<NavItem label="Club Profile" path="/profile" icon="⚙️"/>

</div>

</div>

)

}
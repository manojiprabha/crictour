"use client"

import { useRouter, usePathname } from "next/navigation"

export default function MobileNav(){

const router = useRouter()
const pathname = usePathname()

function Item({icon,label,path}:{icon:string,label:string,path:string}){

const active = pathname === path

return(

<button
onClick={()=>router.push(path)}
className={`flex flex-col items-center text-xs ${
active ? "text-emerald-600" : "text-slate-500"
}`}
>

<span className="text-xl">{icon}</span>
<span>{label}</span>

</button>

)

}

return(

<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center z-50">

<Item icon="🏠" label="Home" path="/dashboard"/>

<Item icon="🏏" label="Matches" path="/matches"/>

<Item icon="💬" label="Messages" path="/messages"/>

<Item icon="👥" label="Clubs" path="/clubs"/>

<Item icon="⚙️" label="Profile" path="/profile"/>

</div>

)

}
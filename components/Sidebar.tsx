"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar(){

const router = useRouter()
const pathname = usePathname()

const [unreadCount,setUnreadCount] = useState(0)
const [myClubId,setMyClubId] = useState<string | null>(null)

async function loadUnread(clubId:string){

const { data } = await supabase
.from("messages")
.select("id")
.eq("to_club",clubId)
.eq("is_read",false)

setUnreadCount(data?.length || 0)

}

useEffect(()=>{

async function init(){

const { data:userData } = await supabase.auth.getUser()
if(!userData?.user) return

const { data:club } = await supabase
.from("clubs")
.select("id")
.eq("created_by",userData.user.id)
.single()

if(club){
setMyClubId(club.id)
loadUnread(club.id)
}

}

init()

},[])


/* realtime listener */

useEffect(()=>{

if(!myClubId) return

const channel = supabase
.channel("sidebar-realtime")
.on(
"postgres_changes",
{ event:"*", schema:"public", table:"messages" },
()=>{ loadUnread(myClubId) }
)
.subscribe()

return ()=> supabase.removeChannel(channel)

},[myClubId])


/* refresh when route changes */

useEffect(()=>{

if(myClubId) loadUnread(myClubId)

},[pathname,myClubId])


function NavItem({label,path,icon}:{label:string,path:string,icon:string}){

const active = pathname === path

return(

<button
onClick={()=>router.push(path)}
className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition
${active
? "bg-emerald-50 text-emerald-700 font-semibold"
: "text-slate-600 hover:bg-slate-100"}
`}
>

<div className="flex items-center gap-3">
<span className="text-lg">{icon}</span>
<span>{label}</span>
</div>

{label==="Messages" && unreadCount>0 &&(
<span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
{unreadCount}
</span>
)}

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
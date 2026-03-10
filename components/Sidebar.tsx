"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar(){

const router = useRouter()
const pathname = usePathname()

const [unreadCount,setUnreadCount] = useState(0)
const [myClubId,setMyClubId] = useState<string | null>(null)


useEffect(()=>{

async function init(){

const { data:userData } = await supabase.auth.getUser()
const user = userData?.user

if(!user) return

const { data:club } = await supabase
.from("clubs")
.select("id")
.eq("created_by",user.id)
.single()

if(!club) return

setMyClubId(club.id)

loadUnread(club.id)

}

/* Load unread count */

async function loadUnread(clubId:string){

const { count } = await supabase
.from("messages")
.select("*",{count:"exact",head:true})
.eq("to_club",clubId)
.eq("is_read",false)

if(count){
setUnreadCount(count)
}else{
setUnreadCount(0)
}

}

init()

},[])



/* Realtime notification */

useEffect(()=>{

if(!myClubId) return

const channel = supabase
.channel("messages-notifications")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"messages"
},
(payload)=>{

const newMsg:any = payload.new

if(newMsg.to_club === myClubId){
setUnreadCount(prev => prev + 1)
}

}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[myClubId])



function NavItem({label, path, icon}:{label:string,path:string,icon:string}){

const active = pathname === path

return(

<button
onClick={()=>router.push(path)}
className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition
${active
 ? "bg-emerald-50 text-emerald-700 font-semibold"
 : "text-slate-600 hover:bg-slate-100"}
`}
>

<div className="flex items-center gap-3">

<span className="text-lg">{icon}</span>

<span>{label}</span>

</div>


{label === "Messages" && unreadCount > 0 && (

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
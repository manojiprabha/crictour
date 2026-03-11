"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar() {

  const router = useRouter()
  const pathname = usePathname()

  const [unreadMessages,setUnreadMessages] = useState<number>(0)

  useEffect(()=>{

let clubId:string | null = null

async function init(){

  const { data:userData } = await supabase.auth.getUser()

  if(!userData?.user) return

  const { data:club } = await supabase
  .from("clubs")
  .select("id")
  .eq("created_by",userData.user.id)
  .single()

  if(!club) return

  clubId = club.id

  const { count } = await supabase
  .from("messages")
  .select("*",{ count:"exact", head:true })
  .eq("to_club",club.id)
  .eq("is_read",false)

  setUnreadMessages(count || 0)

}

init()

const channel = supabase
.channel("sidebar-unread")
.on(
"postgres_changes",
{ event:"INSERT", schema:"public", table:"messages" },
(payload)=>{

const msg:any = payload.new

if(msg.to_club === clubId){

setUnreadMessages(prev => prev + 1)

}

})
.subscribe()

return ()=>{

supabase.removeChannel(channel)

}

},[])

  function NavItem({
    label,
    path,
    icon,
    badge
  }: {
    label:string
    path:string
    icon:string
    badge?:number
  }){

    const active = pathname === path

    return(

      <button
        onClick={()=>router.push(path)}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm transition
        ${
          active
          ? "bg-emerald-50 text-emerald-700 font-bold shadow-sm"
          : "text-slate-600 hover:bg-slate-50"
        }`}
      >

        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </div>

        {badge && badge > 0 && (
          <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}

      </button>

    )

  }

  return (

    <div className="w-64 bg-white border-r h-screen sticky top-0 p-6 flex flex-col shadow-sm">

      <h2 className="text-[10px] font-black tracking-widest text-slate-400 mb-8 uppercase">
        Navigation
      </h2>

      <div className="space-y-1.5 flex-1">

        <NavItem label="Dashboard" path="/dashboard" icon="🏠" />

        <NavItem label="Match Board" path="/matches" icon="🏏" />

        <NavItem label="My Matches" path="/my-matches" icon="📅" />

        <NavItem label="Clubs" path="/clubs" icon="👥" />

        <NavItem label="Tours" path="/tours" icon="🚌" />

        <NavItem
          label="Messages"
          path="/messages"
          icon="💬"
          badge={unreadMessages > 0 ? unreadMessages : undefined}
        />

        <NavItem label="Club Profile" path="/profile" icon="⚙️" />

      </div>

    </div>

  )

}
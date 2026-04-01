"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MobileNav(){

  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser(){
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      setLoading(false)
    }
    getUser()
  }, [])

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

  // ✅ hide nav if not logged in
  if (loading) return null
  if (!user) return null

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
"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [myClubId, setMyClubId] = useState<string | null>(null)

  // 1. Centralized Refresh Function
  async function loadUnread(clubId: string) {
    const { data } = await supabase
      .from("messages")
      .select("id")
      .eq("to_club", clubId)
      .eq("is_read", false)

    setUnreadCount(data?.length || 0)
  }

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      const { data: club } = await supabase.from("clubs").select("id").eq("created_by", userData.user.id).single()
      if (club) {
        setMyClubId(club.id)
        loadUnread(club.id)
      }
    }
    init()
  }, [])

  // 2. The Global Listener: Refreshes on ANY change to messages
  useEffect(() => {
    if (!myClubId) return

    const channel = supabase
      .channel("sidebar-notif-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        // If ANYTHING happens (Insert or Update), just recount.
        loadUnread(myClubId)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [myClubId])

  // 3. Re-check whenever you change pages
  useEffect(() => {
    if (myClubId) loadUnread(myClubId)
  }, [pathname, myClubId])

  function NavItem({ label, path, icon }: { label: string, path: string, icon: string }) {
    const active = pathname === path
    return (
      <button
        onClick={() => router.push(path)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </div>
        {label === "Messages" && unreadCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col p-6 shadow-sm">
      <h2 className="text-[10px] font-black tracking-widest text-slate-400 mb-6 uppercase">Navigation</h2>
      <div className="space-y-1.5 flex-1">
        <NavItem label="Dashboard" path="/dashboard" icon="🏠" />
        <NavItem label="Match Board" path="/matches" icon="🏏" />
        <NavItem label="My Matches" path="/my-matches" icon="📅" />
        <NavItem label="Clubs" path="/clubs" icon="👥" />
        <NavItem label="Tours" path="/tours" icon="🚌" />
        <NavItem label="Messages" path="/messages" icon="💬" />
        <NavItem label="Club Profile" path="/profile" icon="⚙️" />
      </div>
    </div>
  )
}
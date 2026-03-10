"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [unreadCount, setUnreadCount] = useState(0)
  const [myClubId, setMyClubId] = useState<string | null>(null)

  /* ---------------- LOAD UNREAD ---------------- */
  // Optimized to count only messages sent TO your club that are NOT read
  async function loadUnread(clubId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("id", { count: 'exact' })
      .eq("to_club", clubId)
      .eq("is_read", false)

    if (!error) {
      setUnreadCount(data?.length || 0)
    }
  }

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) return

      const { data: club } = await supabase
        .from("clubs")
        .select("id")
        .eq("created_by", user.id)
        .single()

      if (!club) return

      setMyClubId(club.id)
      loadUnread(club.id)
    }
    init()
  }, [])

  /* ---------------- REALTIME LISTENER (FIXED) ---------------- */
  useEffect(() => {
    if (!myClubId) return

    // We change "INSERT" to "*" to catch UPDATE events 
    // (when messages are marked as read)
    const channel = supabase
      .channel("sidebar-notifications")
      .on(
        "postgres_changes",
        {
          event: "*", 
          schema: "public",
          table: "messages"
        },
        (payload) => {
          // If a new message is sent TO us, or an existing message TO us is UPDATED
          const newMsg: any = payload.new
          const oldMsg: any = payload.old

          if (newMsg?.to_club === myClubId || oldMsg?.to_club === myClubId) {
            loadUnread(myClubId)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [myClubId])

  /* ---------------- REFRESH ON NAVIGATION ---------------- */
  useEffect(() => {
    if (myClubId) {
      loadUnread(myClubId)
    }
  }, [pathname, myClubId])

  /* ---------------- NAV ITEM COMPONENT ---------------- */
  function NavItem({ label, path, icon }: { label: string, path: string, icon: string }) {
    const active = pathname === path

    return (
      <button
        onClick={() => router.push(path)}
        className={`group flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all
        ${active
            ? "bg-emerald-50 text-emerald-700 font-bold shadow-sm"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
        `}
      >
        <div className="flex items-center gap-3">
          <span className={`text-lg transition-transform group-hover:scale-110 ${active ? "scale-110" : "opacity-70"}`}>
            {icon}
          </span>
          <span>{label}</span>
        </div>

        {label === "Messages" && unreadCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="mb-8">
        <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          Main Menu
        </h2>
      </div>

      <nav className="flex-1 space-y-1.5">
        <NavItem label="Dashboard" path="/dashboard" icon="🏠" />
        <NavItem label="Match Board" path="/matches" icon="🏏" />
        <NavItem label="My Matches" path="/my-matches" icon="📅" />
        <NavItem label="Clubs" path="/clubs" icon="👥" />
        <NavItem label="Tours" path="/tours" icon="🚌" />
        <NavItem label="Messages" path="/messages" icon="💬" />
        <NavItem label="Club Profile" path="/profile" icon="⚙️" />
      </nav>

      {/* Optional: Add a subtle logout or user card here later */}
    </div>
  )
}
"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  function NavItem({ label, path, icon }: { label: string, path: string, icon: string }) {
    const active = pathname === path

    return (
      <button
        onClick={() => router.push(path)}
        className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition
        ${active
          ? "bg-emerald-50 text-emerald-700 font-bold shadow-sm"
          : "text-slate-600 hover:bg-slate-50"}
        `}
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
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
        <NavItem label="Messages" path="/messages" icon="💬" />
        <NavItem label="Club Profile" path="/profile" icon="⚙️" />
      </div>
    </div>
  )
}
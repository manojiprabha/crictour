"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  Home01Icon,
  Location01Icon,
  Calendar01Icon,
  UserGroupIcon,
  Bus01Icon,
  Message01Icon,
  Settings01Icon
} from "hugeicons-react"

export default function Sidebar() {

  const router = useRouter()
  const pathname = usePathname()

  const [unreadMessages, setUnreadMessages] = useState<number>(0)

  useEffect(() => {

    let clubId: string | null = null

    async function init() {
      /*
      const { data:userData } = await supabase.auth.getUser()

      if(!userData?.user) return

      const { data:club } = await supabase
      .from("clubs")
      .select("id")
      .eq("created_by",userData.user.id)
      .single()

      if(!club) return

      clubId = club.id

      // initial unread count
      const { count } = await supabase
      .from("messages")
      .select("*",{ count:"exact", head:true })
      .eq("to_club",club.id)
      .eq("is_read",false)

      setUnreadMessages(count || 0)
      */
    }

    init()

    const channel = supabase
      .channel("sidebar-unread")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg: any = payload.new
          if (msg.to_club === clubId && !msg.is_read) {
            setUnreadMessages(prev => prev + 1)
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        async () => {
          if (!clubId) return
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("to_club", clubId)
            .eq("is_read", false)
          setUnreadMessages(count || 0)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [])

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home01Icon },
    { label: "Match Board", path: "/matches", icon: Location01Icon },
    { label: "My Matches", path: "/my-matches", icon: Calendar01Icon },
    { label: "Clubs", path: "/clubs", icon: UserGroupIcon },
    { label: "Tours", path: "/tours", icon: Bus01Icon },
    { label: "Messages", path: "/messages", icon: Message01Icon, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { label: "Club Profile", path: "/profile", icon: Settings01Icon },
  ]

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-4 pt-6">
        <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2 mb-2">
          Navigation
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const active = pathname === item.path
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.path)}
                      isActive={active}
                      size="lg"
                      className="font-medium text-[15px] text-slate-600 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 data-[active=true]:font-bold transition-all py-6 rounded-xl hover:bg-slate-50"
                    >
                      <item.icon className="size-[22px]" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full animate-pulse flex items-center justify-center min-w-[20px] right-2 mt-2">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  )
}
"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useSearchParams, useRouter } from "next/navigation"

type Message = {
  id: string
  message: string
  from_club: string
  to_club: string
  match_id: string
  created_at: string
  is_read: boolean
  fromClub?: { club_name: string }
  toClub?: { club_name: string }
}

export default function MessagesClient() {
  const params = useSearchParams()
  const router = useRouter()

  const clubId = params.get("club")
  const matchId = params.get("match")

  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Message[]>([])
  const [chatClubName, setChatClubName] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [myClubId, setMyClubId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) { setLoading(false); return }

      const { data: club } = await supabase.from("clubs").select("id").eq("created_by", userData.user.id).single()
      if (club) setMyClubId(club.id)

      await loadConversations(club?.id)
      if (matchId) await loadMessages(club?.id)
      setLoading(false)
    }
    init()
  }, [matchId])

  async function loadMessages(currentClubId: string) {
    if (!matchId) return

    // 1. Mark as read in DB first
    await supabase.from("messages").update({ is_read: true }).eq("match_id", matchId).eq("to_club", currentClubId).eq("is_read", false)

    // 2. Load Chat
    const { data } = await supabase.from("messages").select(`*, fromClub:clubs!messages_from_club_fkey (club_name), toClub:clubs!messages_to_club_fkey (club_name)`).eq("match_id", matchId).order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
      const first = data[0]
      if (first) {
        setChatClubName(first.from_club === currentClubId ? first.toClub?.club_name || "" : first.fromClub?.club_name || "")
      }
    }

    // 3. Refresh Inbox state locally so Bold/Dot goes away instantly
    await loadConversations(currentClubId)
  }

  async function loadConversations(clubId: string) {
    if (!clubId) return
    const { data } = await supabase.from("messages").select(`*, fromClub:clubs!messages_from_club_fkey (club_name), toClub:clubs!messages_to_club_fkey (club_name)`).or(`from_club.eq.${clubId},to_club.eq.${clubId}`).order("created_at", { ascending: false })
    if (data) {
      const unique: any = {}
      data.forEach(msg => { if (!unique[msg.match_id]) unique[msg.match_id] = msg })
      setConversations(Object.values(unique))
    }
  }

  useEffect(() => {
    if (!myClubId) return
    const channel = supabase.channel("chat-realtime").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const newMsg = payload.new as Message
      if (newMsg.match_id === matchId) setMessages(prev => [...prev, newMsg])
      loadConversations(myClubId)
    }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [matchId, myClubId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  async function sendMessage() {
    if (!newMessage.trim() || !clubId || !matchId || !myClubId) return
    const { data, error } = await supabase.from("messages").insert({ match_id: matchId, from_club: myClubId, to_club: clubId, message: newMessage, is_read: false }).select()
    if (!error && data) {
      setMessages(prev => [...prev, data[0]])
      setNewMessage("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
      loadConversations(myClubId) // Update inbox for the latest snippet
    }
  }

  if (loading) return <div className="p-10 text-center font-bold">Loading CricTour Messages...</div>

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 overflow-hidden border-t">
          {/* INBOX */}
          <div className="w-80 border-r bg-white flex flex-col">
            <div className="p-4 border-b font-bold text-slate-800">Inbox</div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => {
                const otherClub = conv.from_club === myClubId ? conv.toClub?.club_name : conv.fromClub?.club_name
                const otherId = conv.from_club === myClubId ? conv.to_club : conv.from_club
                const unread = conv.to_club === myClubId && !conv.is_read
                const active = matchId === conv.match_id

                return (
                  <div key={conv.id} onClick={() => router.push(`/messages?club=${otherId}&match=${conv.match_id}`)}
                    className={`p-4 border-b cursor-pointer transition ${active ? "bg-emerald-50 border-r-4 border-r-emerald-600" : "hover:bg-gray-50"}`}>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${unread ? "font-black text-slate-900" : "text-slate-500 font-medium"}`}>{otherClub}</p>
                      {unread && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></span>}
                    </div>
                    <p className={`text-xs mt-1 truncate ${unread ? "text-slate-700 font-bold" : "text-slate-400"}`}>{conv.message}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 flex flex-col bg-slate-50 relative">
            {matchId ? (
              <>
                <div className="p-4 bg-white border-b font-bold text-slate-800 shadow-sm">{chatClubName}</div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from_club === myClubId ? "justify-end" : "justify-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm max-w-[70%] ${msg.from_club === myClubId ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white border text-slate-800 rounded-tl-none"}`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>

                {/* INPUT - Fixed "Black Line" Glitch */}
                <div className="p-4 bg-white border-t border-slate-200">
                  <div className="flex gap-2 items-end max-w-4xl mx-auto">
                    <textarea ref={textareaRef} value={newMessage} onChange={(e) => { setNewMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} rows={1} placeholder="Type message..." 
                      className="flex-1 border border-slate-300 rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-emerald-500 max-h-32 text-sm" />
                    <button onClick={sendMessage} className="bg-emerald-600 text-white px-6 rounded-xl font-bold h-[48px] hover:bg-emerald-700 transition-colors">Send</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-slate-400 font-medium italic">Select a conversation to start coordinating</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
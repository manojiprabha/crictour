"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Sidebar from "@/components/Sidebar"

export default function MessagesClient() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedClub, setSelectedClub] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [myClub, setMyClub] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return

    const { data: club } = await supabase
      .from("clubs")
      .select("id, name")
      .eq("created_by", userData.user.id)
      .single()

    if (club) {
      setMyClub(club)
      loadConversations(club.id)
    }
  }

  // Set up Realtime for instant messages
  useEffect(() => {
    if (!myClub || !selectedClub) return

    const channel = supabase
      .channel('realtime-chat')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          const newMsg = payload.new
          // Only add if it belongs to the current open chat
          if (
            (newMsg.from_club === selectedClub.id && newMsg.to_club === myClub.id) ||
            (newMsg.from_club === myClub.id && newMsg.to_club === selectedClub.id)
          ) {
            setMessages((prev) => [...prev, newMsg])
            // Mark as read immediately if it's for us
            if (newMsg.to_club === myClub.id) {
               markAsRead(selectedClub.id)
            }
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedClub, myClub])

  async function loadConversations(myClubId: string) {
    const { data } = await supabase
      .from("messages")
      .select(`
        from_club, 
        to_club, 
        content, 
        created_at, 
        sender:clubs!messages_from_club_fkey(id, name),
        receiver:clubs!messages_to_club_fkey(id, name)
      `)
      .or(`from_club.eq.${myClubId},to_club.eq.${myClubId}`)
      .order("created_at", { ascending: false })

    const uniqueClubs: any[] = []
    const seen = new Set()

    data?.forEach((msg: any) => {
      const other = msg.from_club === myClubId ? msg.receiver : msg.sender
      if (other && !seen.has(other.id)) {
        seen.add(other.id)
        uniqueClubs.push({ id: other.id, name: other.name, lastMsg: msg.content })
      }
    })
    setConversations(uniqueClubs)
  }

  async function markAsRead(otherClubId: string) {
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("to_club", myClub.id)
      .eq("from_club", otherClubId)
      .eq("is_read", false)
  }

  async function openChat(otherClub: any) {
    setSelectedClub(otherClub)
    await markAsRead(otherClub.id)

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(from_club.eq.${myClub.id},to_club.eq.${otherClub.id}),and(from_club.eq.${otherClub.id},to_club.eq.${myClub.id})`)
      .order("created_at", { ascending: true })

    setMessages(data || [])
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !selectedClub) return

    const { error } = await supabase.from("messages").insert([{
      from_club: myClub.id,
      to_club: selectedClub.id,
      content: newMessage,
      is_read: false
    }])

    if (!error) setNewMessage("")
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex min-w-0 bg-slate-50">
        {/* Inbox Column */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-6 border-b"><h1 className="text-xl font-bold">Inbox</h1></div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <div 
                key={c.id} 
                onClick={() => openChat(c)}
                className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${selectedClub?.id === c.id ? 'bg-emerald-50 border-r-4 border-r-emerald-600' : ''}`}
              >
                <p className="font-bold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-500 truncate">{c.lastMsg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Column */}
        <div className="flex-1 flex flex-col">
          {selectedClub ? (
            <>
              <div className="p-4 bg-white border-b font-bold">{selectedClub.name}</div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from_club === myClub.id ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-sm text-sm ${m.from_club === myClub.id ? "bg-[#12372A] text-white rounded-tr-none" : "bg-white border rounded-tl-none"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                <input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border rounded-xl px-4 py-2 outline-none" 
                  placeholder="Type a message..."
                />
                <button className="bg-[#12372A] text-white px-6 py-2 rounded-xl font-bold">Send</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 italic">Select a club to view messages</div>
          )}
        </div>
      </main>
    </div>
  )
}
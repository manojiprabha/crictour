"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Message = {
  id: string
  match_id: string
  from_club: string
  to_club: string
  message: string
  created_at: string
  is_read: boolean
}

type Conversation = {
  match_id: string
  club_id: string
  last_message: string
  created_at: string
  unread_count: number
}

export default function MessagesPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedClub = searchParams.get("club")
  const matchId = searchParams.get("match")

  const [myClubId, setMyClubId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [clubMap, setClubMap] = useState<Record<string,string>>({})
  const [newMessage, setNewMessage] = useState("")

  const bottomRef = useRef<HTMLDivElement | null>(null)

  /* INIT */
  useEffect(() => {
    async function init() {
      const { data:userData } = await supabase.auth.getUser()
      if (!userData?.user) return

      const { data:club } = await supabase
        .from("clubs")
        .select("id")
        .eq("created_by", userData.user.id)
        .single()

      if (club) setMyClubId(club.id)
    }

    init()
  }, [])

  /* LOAD CLUBS */
  useEffect(() => {
    async function loadClubs() {
      const { data } = await supabase
        .from("clubs")
        .select("id, club_name")

      if (!data) return

      const map: Record<string,string> = {}
      data.forEach(c => map[c.id] = c.club_name)

      setClubMap(map)
    }

    loadClubs()
  }, [])

  /* FETCH */
  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`from_club.eq.${myClubId},to_club.eq.${myClubId}`)
      .order("created_at", { ascending: true })

    if (data) {
      setMessages(data)
      buildConversations(data)
    }
  }

  useEffect(() => {
    if (!myClubId) return
    fetchMessages()
  }, [myClubId])

  /* BUILD */
  function buildConversations(allMessages: Message[]) {

    const map: Record<string, Conversation> = {}

    allMessages.forEach((msg) => {

      const otherClubId =
        msg.from_club === myClubId ? msg.to_club : msg.from_club

      if (!map[otherClubId]) {
        map[otherClubId] = {
          match_id: msg.match_id,
          club_id: otherClubId,
          last_message: msg.message,
          created_at: msg.created_at,
          unread_count: 0
        }
      }

      if (new Date(msg.created_at) > new Date(map[otherClubId].created_at)) {
        map[otherClubId].last_message = msg.message
        map[otherClubId].created_at = msg.created_at
        map[otherClubId].match_id = msg.match_id
      }

      if (msg.to_club === myClubId && !msg.is_read) {
        map[otherClubId].unread_count += 1
      }

    })

    setConversations(
      Object.values(map).sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
    )
  }

  /* FILTER */
  const chatMessages = messages.filter((msg) => {

    if (!selectedClub) return false

    return (
      (msg.from_club === myClubId && msg.to_club === selectedClub) ||
      (msg.from_club === selectedClub && msg.to_club === myClubId)
    )
  })

  /* MARK READ */
  useEffect(() => {
    if (!selectedClub || !myClubId) return

    async function markRead() {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("to_club", myClubId)
        .eq("from_club", selectedClub)
        .eq("is_read", false)

      await fetchMessages()
    }

    markRead()
  }, [selectedClub, myClubId])

  /* SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  /* SEND */
  async function sendMessage() {
    if (!newMessage.trim()) return

    await supabase.from("messages").insert({
      match_id: matchId,
      from_club: myClubId,
      to_club: selectedClub,
      message: newMessage,
      is_read: false
    })

    setNewMessage("")
    await fetchMessages()
  }

  /* UI */

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar/>

      <div className="flex">

        <Sidebar/>

        {/* MOBILE LOGIC */}
        <div className="flex-1 flex">

          {/* SIDEBAR (hidden on mobile when chat open) */}
          <div className={`bg-white border-r w-full md:w-80 ${
            selectedClub ? "hidden md:block" : "block"
          }`}>

            <div className="p-4 font-bold border-b">
              Inbox
            </div>

            {conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() =>
                  router.push(`/messages?club=${conv.club_id}&match=${conv.match_id}`)
                }
                className="p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {clubMap[conv.club_id] || "Club"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {conv.last_message}
                  </p>
                </div>

                {conv.unread_count > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {conv.unread_count}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* CHAT */}
          {selectedClub && (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">

              {/* HEADER (BACK BUTTON MOBILE) */}
              <div className="p-3 border-b flex items-center gap-2 bg-white">
                <button
                  onClick={() => router.push("/messages")}
                  className="md:hidden text-sm"
                >
                  ← Back
                </button>

                <span className="font-semibold">
                  {clubMap[selectedClub] || "Chat"}
                </span>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">

                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                      msg.from_club === myClubId
                        ? "bg-emerald-600 text-white ml-auto"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}

                <div ref={bottomRef} />
              </div>

              {/* INPUT (STICKY) */}
              <div className="border-t p-3 flex gap-2 sticky bottom-16 bg-white">

                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={1}
                  placeholder="Type message..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm resize-none"
                />

                <button
                  onClick={sendMessage}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full"
                >
                  Send
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
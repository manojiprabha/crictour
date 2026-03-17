"use client"

import { useEffect, useState } from "react"
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
  const [newMessage, setNewMessage] = useState("")

  /* ---------------- INIT ---------------- */

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

  /* ---------------- FETCH ALL MESSAGES ---------------- */

  useEffect(() => {

    if (!myClubId) return

    async function loadMessages() {

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

    loadMessages()

  }, [myClubId])

  /* ---------------- BUILD CONVERSATIONS ---------------- */

  function buildConversations(allMessages: Message[]) {

    const map: Record<string, Conversation> = {}

    allMessages.forEach((msg) => {

      const clubs = [msg.from_club, msg.to_club].sort()
      const key = `${msg.match_id}-${clubs.join("-")}`

      const otherClubId =
        msg.from_club === myClubId ? msg.to_club : msg.from_club

      if (!map[key]) {
        map[key] = {
          match_id: msg.match_id,
          club_id: otherClubId,
          last_message: msg.message,
          created_at: msg.created_at,
          unread_count: 0
        }
      }

      // latest message
      if (new Date(msg.created_at) > new Date(map[key].created_at)) {
        map[key].last_message = msg.message
        map[key].created_at = msg.created_at
      }

      // unread
      if (msg.to_club === myClubId && !msg.is_read) {
        map[key].unread_count += 1
      }

    })

    const convs = Object.values(map).sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )

    setConversations(convs)
  }

  /* ---------------- FILTER CHAT ---------------- */

  const chatMessages = messages.filter((msg) => {

    if (!selectedClub || !matchId) return false

    return (
      msg.match_id === matchId &&
      (
        (msg.from_club === myClubId && msg.to_club === selectedClub) ||
        (msg.from_club === selectedClub && msg.to_club === myClubId)
      )
    )
  })

  /* ---------------- MARK AS READ ---------------- */

  useEffect(() => {

    if (!selectedClub || !matchId || !myClubId) return

    async function markRead() {

      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("match_id", matchId)
        .eq("to_club", myClubId)
        .eq("from_club", selectedClub)
        .eq("is_read", false)

    }

    markRead()

  }, [selectedClub, matchId, myClubId])

  /* ---------------- SEND MESSAGE ---------------- */

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

    // reload
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

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar/>

      <div className="flex">

        <Sidebar/>

        {/* LEFT */}

        <div className="w-80 border-r bg-white">

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
                  {conv.club_id}
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

        {/* RIGHT */}

        <div className="flex-1 flex flex-col">

          <div className="flex-1 overflow-y-auto p-6 space-y-4">

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

          </div>

          {/* INPUT */}

          {selectedClub && (

            <div className="p-4 border-t flex gap-2">

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                rows={1}
                placeholder="Type message..."
                className="flex-1 border rounded-xl p-2 resize-none outline-none text-sm"
              />

              <button
                onClick={sendMessage}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}
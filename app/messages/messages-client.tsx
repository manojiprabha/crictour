"use client"

import { useEffect, useState, useRef, useCallback } from "react"
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

  /* helpers */

  const loadConversations = useCallback(
    async (cId?: string | null) => {
      if (!cId) return

      const { data } = await supabase
        .from("messages")
        .select(`
          *,
          fromClub:clubs!messages_from_club_fkey (club_name),
          toClub:clubs!messages_to_club_fkey (club_name)
        `)
        .or(`from_club.eq.${cId},to_club.eq.${cId}`)
        .order("created_at", { ascending: false })

      if (!data) return

      const unique: Record<string, Message> = {}
      data.forEach((msg) => {
        if (!unique[msg.match_id]) unique[msg.match_id] = msg
      })

      setConversations(Object.values(unique))
    },
    []
  )

  const loadMessages = useCallback(
    async (currentClubId: string, mMatchId: string) => {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("match_id", mMatchId)
        .eq("to_club", currentClubId)
        .eq("is_read", false)

      const { data } = await supabase
        .from("messages")
        .select(`
          *,
          fromClub:clubs!messages_from_club_fkey (club_name),
          toClub:clubs!messages_to_club_fkey (club_name)
        `)
        .eq("match_id", mMatchId)
        .order("created_at", { ascending: true })

      if (data) {
        setMessages(data)

        const first = data[0]
        if (first) {
          setChatClubName(
            first.from_club === currentClubId
              ? first.toClub?.club_name || ""
              : first.fromClub?.club_name || ""
          )
        }
      }

      await loadConversations(currentClubId)
    },
    [loadConversations]
  )

  /* INIT */

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        setLoading(false)
        return
      }

      const { data: club } = await supabase
        .from("clubs")
        .select("id")
        .eq("created_by", userData.user.id)
        .single()

      if (club?.id) {
        setMyClubId(club.id)
        await loadConversations(club.id)

        if (matchId) {
          await loadMessages(club.id, matchId)
        }
      }

      setLoading(false)
    }

    init()
  }, [matchId, loadConversations, loadMessages])

  /* REALTIME */

  useEffect(() => {
    if (!myClubId) return

    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message

          if (newMsg.match_id === matchId) {
            setMessages((prev) => [...prev, newMsg])
          }

          loadConversations(myClubId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, myClubId, loadConversations])

  /* AUTOSCROLL */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* SEND MESSAGE */

  async function sendMessage() {
    if (!newMessage.trim() || !clubId || !matchId || !myClubId) return

    const { data, error } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        from_club: myClubId,
        to_club: clubId,
        message: newMessage,
        is_read: false,
      })
      .select()

    if (!error && data) {
      setMessages((prev) => [...prev, data[0]])
      setNewMessage("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
    }
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-1 overflow-hidden">
          {/* inbox */}
          <div className="w-80 border-r bg-white">
            <div className="p-4 border-b font-bold">Inbox</div>
            {conversations.map((conv) => {
              const other =
                conv.from_club === myClubId
                  ? conv.toClub?.club_name
                  : conv.fromClub?.club_name
              const otherId =
                conv.from_club === myClubId ? conv.to_club : conv.from_club
              const unread = conv.to_club === myClubId && !conv.is_read

              return (
                <div
                  key={conv.id}
                  onClick={() =>
                    router.push(
                      `/messages?club=${otherId}&match=${conv.match_id}`
                    )
                  }
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    matchId === conv.match_id ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <p className={`${unread ? "font-bold" : "text-gray-600"}`}>
                      {other}
                    </p>
                    {unread && (
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.message}
                  </p>
                </div>
              )
            })}
          </div>
          {/* chat */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {matchId ? (
              <>
                <div className="p-4 bg-white border-b font-bold">
                  {chatClubName}
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        m.from_club === myClubId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
                          m.from_club === myClubId
                            ? "bg-emerald-600 text-white"
                            : "bg-white border text-gray-800"
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>
                <div className="p-4 bg-white border-t">
                  <div className="flex gap-2">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        e.target.style.height = "auto"
                        e.target.style.height = e.target.scrollHeight + "px"
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      rows={1}
                      placeholder="Type message..."
                      className="flex-1 border rounded-lg p-3 resize-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-emerald-600 text-white px-5 rounded-lg font-semibold hover:bg-emerald-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useSearchParams } from "next/navigation"

type Message = {
  id: string
  message: string
  from_club: string
  to_club: string
  created_at: string
}

export default function MessagesPage() {

  const params = useSearchParams()

  const clubId = params.get("club")
  const matchId = params.get("match")

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [myClubId, setMyClubId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function init() {

      const { data:userData } = await supabase.auth.getUser()
      const user = userData?.user

      if(!user){
        setLoading(false)
        return
      }

      const { data:club } = await supabase
        .from("clubs")
        .select("id")
        .eq("created_by", user.id)
        .single()

      if(club){
        setMyClubId(club.id)
      }

      await loadMessages()

      setLoading(false)
    }

    async function loadMessages(){

      if(!matchId) return

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at",{ ascending:true })

      if(data){
        setMessages(data)
      }

    }

    init()

  },[matchId])



  async function sendMessage(){

    if(!newMessage.trim()) return
    if(!clubId || !matchId || !myClubId) return

    const { error } = await supabase
      .from("messages")
      .insert({
        match_id: matchId,
        from_club: myClubId,
        to_club: clubId,
        message: newMessage
      })

    if(error){
      alert(error.message)
      return
    }

    setNewMessage("")

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at",{ ascending:true })

    if(data){
      setMessages(data)
    }

  }


  if(!clubId || !matchId){

    return(
      <div className="min-h-screen bg-slate-50">
        <Navbar/>
        <div className="flex">
          <Sidebar/>
          <div className="flex-1 p-10">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <p className="text-slate-500">
              Open a conversation from a match page.
            </p>
          </div>
        </div>
      </div>
    )

  }


  if(loading){

    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading conversation...
      </div>
    )

  }



  return(

    <div className="min-h-screen bg-slate-50">

      <Navbar/>

      <div className="flex">

        <Sidebar/>

        <div className="flex-1 p-10 max-w-2xl">

          <h1 className="text-2xl font-bold mb-6">
            Match Conversation
          </h1>


          <div className="bg-white border rounded-xl p-6 mb-6 h-[420px] overflow-y-auto">

            {messages.length === 0 && (
              <p className="text-slate-500">
                No messages yet. Start the conversation.
              </p>
            )}


            {messages.map((msg)=>(

              <div
                key={msg.id}
                className={`mb-4 ${
                  msg.from_club === myClubId
                    ? "text-right"
                    : "text-left"
                }`}
              >

                <div
                  className={`inline-block px-4 py-2 rounded-lg max-w-[70%] ${
                    msg.from_club === myClubId
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-slate-800"
                  }`}
                >
                  {msg.message}
                </div>

              </div>

            ))}

          </div>


          <div className="flex gap-2">

            <input
              value={newMessage}
              onChange={(e)=>setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded-lg p-3"
            />

            <button
              onClick={sendMessage}
              className="bg-emerald-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-emerald-700"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}
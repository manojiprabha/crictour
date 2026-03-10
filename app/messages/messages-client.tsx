"use client"

import { useEffect, useState } from "react"
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
}

export default function MessagesClient(){

const params = useSearchParams()
const router = useRouter()

const clubId = params.get("club")
const matchId = params.get("match")

const [messages,setMessages] = useState<Message[]>([])
const [conversations,setConversations] = useState<any[]>([])
const [newMessage,setNewMessage] = useState("")
const [myClubId,setMyClubId] = useState<string | null>(null)
const [loading,setLoading] = useState(true)

useEffect(()=>{

async function init(){

const { data:userData } = await supabase.auth.getUser()
const user = userData?.user

if(!user){
setLoading(false)
return
}

const { data:club } = await supabase
.from("clubs")
.select("id")
.eq("created_by",user.id)
.single()

if(club){
setMyClubId(club.id)
}

if(matchId){
await loadMessages()
}else{
await loadConversations()
}

setLoading(false)

}

async function loadMessages(){

const { data } = await supabase
.from("messages")
.select("*")
.eq("match_id",matchId)
.order("created_at",{ascending:true})

if(data){
setMessages(data)
}

}

async function loadConversations(){

if(!myClubId) return

const { data } = await supabase
.from("messages")
.select("*")
.or(`from_club.eq.${myClubId},to_club.eq.${myClubId}`)
.order("created_at",{ascending:false})

if(data){

const uniqueMatches:any = {}

data.forEach((msg)=>{
if(!uniqueMatches[msg.match_id]){
uniqueMatches[msg.match_id] = msg
}
})

setConversations(Object.values(uniqueMatches))

}

}

init()

},[matchId,myClubId])

async function sendMessage(){

if(!newMessage.trim()) return
if(!clubId || !matchId || !myClubId) return

const { error } = await supabase
.from("messages")
.insert({
match_id:matchId,
from_club:myClubId,
to_club:clubId,
message:newMessage
})

if(error){
alert(error.message)
return
}

setNewMessage("")

const { data } = await supabase
.from("messages")
.select("*")
.eq("match_id",matchId)
.order("created_at",{ascending:true})

if(data){
setMessages(data)
}

}

if(loading){

return(
<div className="p-10">
Loading...
</div>
)

}

return(

<div className="min-h-screen bg-slate-50">

<Navbar/>

<div className="flex">

<Sidebar/>

<div className="flex-1 p-10 max-w-2xl">

{/* Conversation List */}

{!matchId && (

<>

<h1 className="text-2xl font-bold mb-6">
Messages
</h1>

{conversations.length === 0 && (
<p className="text-slate-500">
No conversations yet.
</p>
)}

<div className="space-y-4">

{conversations.map((conv)=>{

const otherClub =
conv.from_club === myClubId
? conv.to_club
: conv.from_club

return(

<div
key={conv.id}
onClick={()=>router.push(`/messages?club=${otherClub}&match=${conv.match_id}`)}
className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
>

<p className="font-semibold">
Conversation
</p>

<p className="text-sm text-slate-500 truncate">
{conv.message}
</p>

</div>

)

})}

</div>

</>

)}

{/* Chat Window */}

{matchId && (

<>

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

</>

)}

</div>

</div>

</div>

)

}
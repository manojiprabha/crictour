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

  fromClub?: {
    club_name: string
  }

  toClub?: {
    club_name: string
  }
}

export default function MessagesClient(){

const params = useSearchParams()
const router = useRouter()

const clubId = params.get("club")
const matchId = params.get("match")

const [messages,setMessages] = useState<Message[]>([])
const [conversations,setConversations] = useState<Message[]>([])
const [newMessage,setNewMessage] = useState("")
const [myClubId,setMyClubId] = useState<string | null>(null)
const [loading,setLoading] = useState(true)

const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
await loadConversations(club?.id)
}

setLoading(false)

}

async function loadMessages(){

const { data } = await supabase
.from("messages")
.select(`
  *,
  fromClub:clubs!messages_from_club_fkey (club_name),
  toClub:clubs!messages_to_club_fkey (club_name)
`)
.eq("match_id",matchId)
.order("created_at",{ascending:true})

if(data){
setMessages(data)

await supabase
.from("messages")
.update({is_read:true})
.eq("match_id",matchId)
.eq("to_club",myClubId)
.eq("is_read",false)

}

}

async function loadConversations(clubId:any){

if(!clubId) return

const { data } = await supabase
.from("messages")
.select(`
  *,
  fromClub:clubs!messages_from_club_fkey (club_name),
  toClub:clubs!messages_to_club_fkey (club_name)
`)
.or(`from_club.eq.${clubId},to_club.eq.${clubId}`)
.order("created_at",{ascending:false})

if(data){

const unique:any = {}

data.forEach((msg)=>{
if(!unique[msg.match_id]){
unique[msg.match_id] = msg
}
})

setConversations(Object.values(unique))

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
match_id:matchId,
from_club:myClubId,
to_club:clubId,
message:newMessage,
is_read:false
})

if(error){
alert(error.message)
return
}

setNewMessage("")

if(textareaRef.current){
textareaRef.current.style.height = "auto"
}

const { data } = await supabase
.from("messages")
.select(`
  *,
  fromClub:clubs!messages_from_club_fkey (club_name),
  toClub:clubs!messages_to_club_fkey (club_name)
`)
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

<div className="space-y-4">

{conversations.map((conv)=>{

const otherClub =
conv.from_club === myClubId
? conv.toClub?.club_name
: conv.fromClub?.club_name

const otherClubId =
conv.from_club === myClubId
? conv.to_club
: conv.from_club

return(

<div
key={conv.id}
onClick={()=>router.push(`/messages?club=${otherClubId}&match=${conv.match_id}`)}
className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
!conv.is_read && conv.to_club === myClubId
? "bg-emerald-50 border-emerald-400"
: "bg-white"
}`}
>

<div className="flex items-center justify-between">

<p className="font-semibold">

{otherClub}

</p>

{!conv.is_read && conv.to_club === myClubId && (

<span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
New
</span>

)}

</div>

<p className={`text-sm truncate ${
!conv.is_read && conv.to_club === myClubId
? "font-semibold text-slate-900"
: "text-slate-500"
}`}>
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

<textarea
ref={textareaRef}
value={newMessage}
onChange={(e)=>{

setNewMessage(e.target.value)

if(textareaRef.current){
textareaRef.current.style.height = "auto"
textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
}

}}
onKeyDown={(e)=>{
if(e.key === "Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}
}}
placeholder="Type message..."
rows={1}
className="flex-1 border rounded-lg p-3 resize-none overflow-hidden"
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
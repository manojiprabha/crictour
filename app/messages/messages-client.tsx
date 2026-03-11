"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useSearchParams, useRouter } from "next/navigation"

type Message = {
id:string
message:string
from_club:string
to_club:string
match_id:string
created_at:string
is_read:boolean
fromClub?:{club_name:string}
toClub?:{club_name:string}
}

type Conversation = Message & { unread_count?:number }

export default function MessagesClient(){

const params = useSearchParams()
const router = useRouter()

const clubId = params.get("club")
const matchId = params.get("match")

const [messages,setMessages] = useState<Message[]>([])
const [conversations,setConversations] = useState<Conversation[]>([])
const [chatClubName,setChatClubName] = useState("")
const [newMessage,setNewMessage] = useState("")
const [myClubId,setMyClubId] = useState<string | null>(null)
const [loading,setLoading] = useState(true)

const textareaRef = useRef<HTMLTextAreaElement | null>(null)
const bottomRef = useRef<HTMLDivElement | null>(null)

const formatTime=(dateString:string)=>{
const date=new Date(dateString)
return date.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})
}

/* INIT */

useEffect(()=>{

async function init(){

const {data:userData}=await supabase.auth.getUser()

if(!userData?.user){
setLoading(false)
return
}

const {data:club}=await supabase
.from("clubs")
.select("id")
.eq("created_by",userData.user.id)
.single()

if(club){

setMyClubId(club.id)

await loadConversations(club.id)

if(matchId) await loadMessages(club.id)

}

setLoading(false)

}

init()

},[matchId])

/* LOAD CHAT */

async function loadMessages(currentClubId:string){

if(!matchId) return

const {data}=await supabase
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

const first=data[0]

if(first){
setChatClubName(
first.from_club===currentClubId
? first.toClub?.club_name || ""
: first.fromClub?.club_name || ""
)
}

}

await supabase
.from("messages")
.update({is_read:true})
.eq("match_id",matchId)
.eq("to_club",currentClubId)

setConversations(prev =>
prev.map(conv =>
conv.match_id===matchId
? {...conv,unread_count:0}
: conv
)
)

await loadConversations(currentClubId)

}

/* LOAD INBOX */

async function loadConversations(clubId:string){

const {data}=await supabase
.from("messages")
.select(`
*,
fromClub:clubs!messages_from_club_fkey (club_name),
toClub:clubs!messages_to_club_fkey (club_name)
`)
.or(`from_club.eq.${clubId},to_club.eq.${clubId}`)
.order("created_at",{ascending:false})

if(!data) return

const map:any={}

data.forEach(msg=>{

if(!map[msg.match_id]){
map[msg.match_id]={...msg,unread_count:0}
}

if(msg.to_club===clubId && !msg.is_read){
map[msg.match_id].unread_count++
}

})

setConversations(Object.values(map))

}

/* REALTIME */

useEffect(()=>{

if(!myClubId) return

const channel=supabase
.channel("chat-realtime")
.on(
"postgres_changes",
{event:"INSERT",schema:"public",table:"messages"},
(payload)=>{

const newMsg=payload.new as Message

if(newMsg.match_id===matchId){

setMessages(prev=>{
if(prev.some(m=>m.id===newMsg.id)) return prev
return [...prev,newMsg]
})

if(newMsg.to_club===myClubId){

supabase
.from("messages")
.update({is_read:true})
.eq("id",newMsg.id)

}

}

setConversations(prev=>{

const existing=prev.find(c=>c.match_id===newMsg.match_id)

if(existing){

return prev.map(c=>{

if(c.match_id!==newMsg.match_id) return c

const unread =
newMsg.to_club===myClubId
? (c.unread_count || 0)+1
: c.unread_count

return {
...c,
message:newMsg.message,
unread_count:unread
}

})

}

return [{...newMsg,unread_count:1},...prev]

})

}
)
.subscribe()

return()=>{
supabase.removeChannel(channel)
}

},[matchId,myClubId])

/* AUTOSCROLL */

useEffect(()=>{
bottomRef.current?.scrollIntoView({behavior:"smooth"})
},[messages])

/* SEND MESSAGE */

async function sendMessage(){

if(!newMessage.trim() || !clubId || !matchId || !myClubId) return

const messageText=newMessage
setNewMessage("")

const {data,error}=await supabase
.from("messages")
.insert({
match_id:matchId,
from_club:myClubId,
to_club:clubId,
message:messageText,
is_read:false
})
.select()

if(!error && data){

setMessages(prev=>[...prev,data[0]])

setConversations(prev =>
prev.map(conv =>
conv.match_id===matchId
? {...conv,message:messageText}
: conv
)
)

}

if(textareaRef.current) textareaRef.current.style.height="auto"

}

/* LOADING */

if(loading){
return <div className="p-10 text-center font-bold">Connecting...</div>
}

/* UI */

return(

<div className="flex flex-col h-screen bg-white overflow-hidden">

<Navbar/>

<div className="flex flex-1 overflow-hidden">

<Sidebar/>

<div className="flex flex-1 overflow-hidden border-t border-slate-200">

{/* INBOX */}

<div className="w-80 border-r bg-white flex flex-col">

<div className="p-4 border-b font-bold text-slate-800">
Inbox
</div>

<div className="flex-1 overflow-y-auto">

{conversations.map(conv=>{

const otherClub =
conv.from_club===myClubId
? conv.toClub?.club_name
: conv.fromClub?.club_name

const otherId =
conv.from_club===myClubId
? conv.to_club
: conv.from_club

const unread = conv.unread_count && conv.unread_count>0
const active = matchId===conv.match_id

return(

<div
key={conv.id}
onClick={()=>router.push(`/messages?club=${otherId}&match=${conv.match_id}`)}
className={`p-4 border-b cursor-pointer transition ${
active
? "bg-emerald-50 border-r-4 border-r-emerald-600"
: "hover:bg-gray-50"
}`}
>

<div className="flex justify-between items-center">

<p className={`text-sm ${unread?"font-bold text-slate-900":"text-slate-500"}`}>
{otherClub}
</p>

{conv.unread_count && conv.unread_count>0 && (
<span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
{conv.unread_count}
</span>
)}

</div>

<p className={`text-xs mt-1 truncate ${
unread ? "font-bold text-slate-700" : "text-slate-400"
}`}>
{conv.message}
</p>

</div>

)

})}

</div>

</div>

{/* CHAT */}

<div className="flex-1 flex flex-col bg-slate-50">

{matchId ? (

<>
<div className="p-4 bg-white border-b font-bold text-slate-800">
{chatClubName}
</div>

<div className="flex-1 overflow-y-auto p-6 space-y-6">

{messages.map(msg=>(
<div key={msg.id} className={`flex flex-col ${msg.from_club===myClubId?"items-end":"items-start"}`}>

<div className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] ${
msg.from_club===myClubId
? "bg-emerald-600 text-white"
: "bg-white border border-slate-200 text-slate-800"
}`}>
{msg.message}
</div>

<span className="text-[10px] text-slate-400 mt-1">
{formatTime(msg.created_at)}
</span>

</div>
))}

<div ref={bottomRef}></div>

</div>

<div className="p-4 bg-white border-t border-slate-200">

<div className="flex items-end gap-3 max-w-4xl mx-auto">

<textarea
ref={textareaRef}
value={newMessage}
onChange={(e)=>{
setNewMessage(e.target.value)
e.target.style.height="auto"
e.target.style.height=e.target.scrollHeight+"px"
}}
onKeyDown={(e)=>{
if(e.key==="Enter" && !e.shiftKey){
e.preventDefault()
sendMessage()
}
}}
rows={1}
placeholder="Type message..."
className="flex-1 border border-slate-300 rounded-xl p-3 resize-none outline-none focus:ring-1 focus:ring-emerald-500 max-h-32 text-sm"
/>

<button
onClick={sendMessage}
className="bg-emerald-600 text-white px-6 rounded-xl font-bold h-[48px] hover:bg-emerald-700">
Send
</button>

</div>

</div>

</>

) : (

<div className="flex flex-1 items-center justify-center text-slate-400 italic">
Select a conversation to start coordinating
</div>

)}

</div>

</div>

</div>

</div>

)
}
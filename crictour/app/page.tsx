"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Home() {

const router = useRouter()

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [showEmail,setShowEmail]=useState(false)

async function googleLogin(){
const { error } = await supabase.auth.signInWithOAuth({
provider:"google"
})
if(error) alert(error.message)
}

async function emailSignup(){
const { error } = await supabase.auth.signUp({
email,
password
})

if(error){
alert(error.message)
}else{
alert("Check your email to confirm your account")
}
}

supabase.auth.onAuthStateChange((event,session)=>{
if(session){
router.push("/register-club")
}
})

return (

<div className="min-h-screen bg-gray-100">

{/* HERO */}

<div className="bg-[#0a2540] text-white py-20">

<div className="max-w-4xl mx-auto text-center">

<h1 className="text-5xl font-bold mb-4">
CricTour
</h1>

<p className="text-xl opacity-90 mb-10">
Find Friendly Cricket Matches & Plan Club Tours
</p>

<div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-md mx-auto">

<button
onClick={googleLogin}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
>
Sign in with Google
</button>

<p className="text-gray-500 my-4">or</p>

<button
onClick={()=>setShowEmail(true)}
className="w-full border py-3 rounded-lg hover:bg-gray-100"
>
Register with Email
</button>

{showEmail && (

<div className="mt-4 space-y-3">

<input
type="email"
placeholder="Email"
className="w-full border p-2 rounded"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-2 rounded"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={emailSignup}
className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
>
Create Account
</button>

</div>

)}

</div>

</div>

</div>

{/* PROBLEM */}

<section className="max-w-3xl mx-auto text-center py-20 px-6">

<h2 className="text-3xl font-bold mb-6">
The Problem
</h2>

<p className="text-gray-700 text-lg">
Finding friendly matches or arranging cricket tours often relies on
personal contacts, WhatsApp groups and manual coordination.
</p>

</section>

{/* FEATURES */}

<section className="max-w-5xl mx-auto py-10 px-6">

<h2 className="text-3xl font-bold text-center mb-12">
How CricTour Works
</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-2">
Post a Match
</h3>

<p className="text-gray-600">
Clubs can post friendly match requests or tour plans.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-2">
Find Opponents
</h3>

<p className="text-gray-600">
Browse clubs looking for matches in your area.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-2">
Plan Tours
</h3>

<p className="text-gray-600">
Organize cricket tours and connect with host clubs.
</p>

</div>

</div>

</section>

<footer className="bg-black text-white text-center py-6 mt-20">
© 2026 CricTour
</footer>

</div>

)

}
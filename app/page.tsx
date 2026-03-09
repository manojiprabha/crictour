"use client"

import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function Home() {

const [showEmail,setShowEmail] = useState(false)
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

async function googleLogin(){

 const redirectUrl =
  typeof window !== "undefined"
   ? `${window.location.origin}/dashboard`
   : "/dashboard"

 await supabase.auth.signInWithOAuth({
  provider:"google",
  options:{ redirectTo: redirectUrl }
 })

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

return (

<div>

<Navbar/>

{/* HERO */}

<section className="bg-gradient-to-b from-[#0f3d2e] to-[#1f7a54] text-white py-24">

<div className="max-w-4xl mx-auto text-center px-6">

<h1 className="text-5xl font-bold mb-4">
CricTour
</h1>

<p className="text-lg opacity-90 mb-10">
Find Friendly Cricket Matches & Plan Club Tours
</p>

<div className="bg-white text-black rounded-xl shadow-lg p-8 max-w-md mx-auto">

<button
onClick={googleLogin}
className="w-full bg-[#1f7a54] text-white py-3 rounded-lg font-semibold hover:bg-[#145c3e]"
>
Continue with Google
</button>

<div className="flex items-center my-4">
<div className="flex-1 border-t"></div>
<span className="px-3 text-gray-500 text-sm">or</span>
<div className="flex-1 border-t"></div>
</div>

<button
onClick={()=>setShowEmail(!showEmail)}
className="w-full border py-3 rounded-lg hover:bg-gray-100"
>
Register with Email
</button>

{showEmail && (

<div className="mt-4 space-y-3">

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border rounded p-2"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border rounded p-2"
/>

<button
onClick={emailSignup}
className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
>
Create Account
</button>

</div>

)}

</div>

</div>

</section>

{/* PROBLEM */}

<section className="py-20 text-center max-w-3xl mx-auto px-6">

<h2 className="text-3xl font-bold mb-4">
Why CricTour?
</h2>

<p className="text-gray-600 text-lg">
Finding friendly matches or arranging cricket tours often relies on
personal contacts, WhatsApp groups and manual coordination.
</p>

</section>

{/* HOW IT WORKS */}

<section className="bg-white py-20">

<h2 className="text-3xl font-bold text-center mb-12">
How CricTour Works
</h2>

<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 px-6">

<div className="p-6 rounded-xl shadow-sm border">
<h3 className="font-semibold text-xl mb-2">Post a Match</h3>
<p className="text-gray-600">
Clubs can post friendly match requests or tour plans.
</p>
</div>

<div className="p-6 rounded-xl shadow-sm border">
<h3 className="font-semibold text-xl mb-2">Find Opponents</h3>
<p className="text-gray-600">
Browse clubs looking for matches in your area.
</p>
</div>

<div className="p-6 rounded-xl shadow-sm border">
<h3 className="font-semibold text-xl mb-2">Plan Tours</h3>
<p className="text-gray-600">
Organize cricket tours and connect with host clubs.
</p>
</div>

</div>

</section>

</div>

)

}
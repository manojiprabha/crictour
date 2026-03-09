"use client"

import { supabase } from "@/lib/supabase"

export default function Home() {

async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: "google"
  })
}

return (

<div className="min-h-screen bg-gray-50">

{/* HERO */}

<section className="bg-[#0a2540] text-white py-24">

<div className="max-w-5xl mx-auto text-center px-6">

<h1 className="text-5xl font-bold mb-6">
CricTour
</h1>

<p className="text-xl mb-10 opacity-90">
Find Friendly Cricket Matches & Plan Club Tours
</p>

<button
onClick={signInWithGoogle}
className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold"
>
Sign in with Google
</button>

</div>

</section>

{/* PROBLEM */}

<section className="py-20 max-w-3xl mx-auto text-center px-6">

<h2 className="text-3xl font-bold mb-6">
The Problem
</h2>

<p className="text-lg text-gray-600">
Finding friendly matches or arranging cricket tours often relies on
personal contacts, WhatsApp groups and manual coordination.
</p>

</section>

{/* HOW IT WORKS */}

<section className="py-20 bg-white">

<h2 className="text-3xl font-bold text-center mb-12">
How CricTour Works
</h2>

<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">

<div className="p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-3">
Post a Match
</h3>

<p className="text-gray-600">
Clubs can post friendly match requests or tour plans.
</p>

</div>

<div className="p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-3">
Find Opponents
</h3>

<p className="text-gray-600">
Browse clubs looking for matches in your area.
</p>

</div>

<div className="p-6 rounded-xl shadow">

<h3 className="text-xl font-semibold mb-3">
Plan Tours
</h3>

<p className="text-gray-600">
Organize cricket tours and connect with host clubs.
</p>

</div>

</div>

</section>

{/* MATCH BOARD PREVIEW */}

<section className="py-20 bg-gray-50">

<h2 className="text-3xl font-bold text-center mb-12">
Match Board
</h2>

<div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 px-6">

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-bold text-lg">
Bristol Indians CC
</h3>

<p className="text-gray-600">
Looking for Friendly Match
</p>

<p className="text-sm text-gray-500 mt-2">
Date: 12 Aug
</p>

<p className="text-sm text-gray-500">
Format: T20
</p>

<p className="text-sm text-gray-500">
Location: Bristol
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="font-bold text-lg">
Oxford Lions CC
</h3>

<p className="text-gray-600">
Hosting Touring Team
</p>

<p className="text-sm text-gray-500 mt-2">
Date: 20 Aug
</p>

<p className="text-sm text-gray-500">
Format: 40 Overs
</p>

<p className="text-sm text-gray-500">
Location: Oxford
</p>

</div>

</div>

</section>

{/* CTA */}

<section className="bg-[#0a2540] text-white py-20 text-center">

<h2 className="text-3xl font-bold mb-6">
Start Finding Matches Today
</h2>

<button
onClick={signInWithGoogle}
className="bg-blue-600 px-8 py-4 rounded-lg text-lg"
>
Sign in with Google
</button>

</section>

<footer className="text-center py-8 text-gray-500">
© 2026 CricTour
</footer>

</div>

)

}
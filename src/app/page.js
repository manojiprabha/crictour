"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Home() {

const loginWithGoogle = async () => {
await supabase.auth.signInWithOAuth({
provider: "google"
});
};

return (

<div className="min-h-screen bg-slate-900 text-white">

<div className="text-center pt-28">

<h1 className="text-5xl font-bold mb-6">
CricTour
</h1>

<p className="text-xl text-gray-300 mb-10">
Find Friendly Cricket Matches & Plan Club Tours
</p>

<button
onClick={loginWithGoogle}
className="bg-blue-600 px-6 py-3 rounded-lg mr-4"
>
Sign in with Google
</button>

<button
className="bg-blue-500 px-6 py-3 rounded-lg"
>
Register with Email
</button>

</div>

<div className="bg-gray-100 text-black py-24 mt-20">

<h2 className="text-3xl text-center font-bold mb-6">
The Problem
</h2>

<p className="text-center max-w-xl mx-auto">
Finding friendly matches or arranging cricket tours often relies
on personal contacts, WhatsApp groups and manual coordination.
</p>

</div>

</div>

)
}
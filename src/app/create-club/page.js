"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreateClub() {

const [clubName,setClubName]=useState("");
const [city,setCity]=useState("");

const createClub = async () => {

const { data:userData } = await supabase.auth.getUser();

await supabase.from("clubs").insert({
club_name:clubName,
city:city,
created_by:userData.user.id
});

alert("Club created");

};

return (

<div className="min-h-screen flex items-center justify-center">

<div className="bg-white p-10 rounded-lg shadow-lg">

<h1 className="text-2xl font-bold mb-6">
Create Club Profile
</h1>

<input
placeholder="Club Name"
className="border p-2 mb-3 w-full"
onChange={(e)=>setClubName(e.target.value)}
/>

<input
placeholder="City"
className="border p-2 mb-3 w-full"
onChange={(e)=>setCity(e.target.value)}
/>

<button
onClick={createClub}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Create Club
</button>

</div>

</div>

)
}
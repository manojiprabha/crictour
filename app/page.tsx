import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"

export default function Home(){

async function googleLogin(){

 await supabase.auth.signInWithOAuth({
  provider:"google",
  options:{
   redirectTo:"/dashboard"
  }
 })

}

return(

<div>

<Navbar/>

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
Sign in with Google
</button>

<div className="flex items-center my-4">
<div className="flex-1 border-t"></div>
<span className="px-3 text-gray-500 text-sm">or</span>
<div className="flex-1 border-t"></div>
</div>

<button
className="w-full border py-3 rounded-lg hover:bg-gray-100"
>
Register with Email
</button>

</div>

</div>

</section>
"use client"

import Navbar from "@/components/Navbar"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function Home() {
  const [showEmail, setShowEmail] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function googleLogin() {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard"
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    })
  }

  async function emailSignup() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert("Check your email to confirm your account")
  }

  return (
    // min-h-screen + flex-col is the secret to removing the white gap
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
      <Navbar />

      {/* Main content expands to fill all available space, pushing footer down */}
      <main className="flex-grow flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-[#12372A] to-[#1f5a44] text-white py-12 lg:py-16 border-b border-[#1a4d3b]">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">CricTour</h1>
              <p className="text-base lg:text-lg text-emerald-100 mb-6 max-w-md leading-snug">
                The UK network for cricket clubs to fill fixture gaps and organise tours.
              </p>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs lg:text-sm text-emerald-50/80">
                <div className="flex items-center gap-2"><span>✔</span> Post gaps fast</div>
                <div className="flex items-center gap-2"><span>✔</span> Browse by region</div>
                <div className="flex items-center gap-2"><span>✔</span> Team strength filters</div>
                <div className="flex items-center gap-2"><span>✔</span> Direct chat</div>
              </div>
            </div>

            {/* AUTH CARD - Fixed Height Buttons */}
            <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 lg:p-8 w-full max-w-[360px] mx-auto lg:mr-0 border border-white/10 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-800 text-center">Join CricTour</h2>
              
              <button
                onClick={googleLogin}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm text-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
                Continue with Google
              </button>

              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-100"></div>
                <span className="px-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 border-t border-slate-100"></div>
              </div>

              {!showEmail ? (
                <button
                  onClick={() => setShowEmail(true)}
                  className="w-full h-12 bg-[#12372A] text-white rounded-lg font-bold hover:bg-[#1a4d3b] transition-all text-sm shadow-md"
                >
                  Register with Club Email
                </button>
              ) : (
                <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                  <input
                    type="email"
                    placeholder="Club Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    onClick={emailSignup}
                    className="w-full h-10 bg-emerald-600 text-white rounded-lg font-bold text-sm"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* WHY SECTION - Content centered to use vertical space effectively */}
        <section className="flex-grow flex items-center bg-slate-50 py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3 text-slate-900">Why CricTour?</h2>
              <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
                Finding friendly matches or arranging cricket tours often relies on personal contacts, WhatsApp groups and manual coordination.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard icon="🏏" title="Post Fixtures" description="Broadcast open dates instantly." />
              <FeatureCard icon="🔎" title="Find Opponents" description="Filter by region or strength." />
              <FeatureCard icon="✈️" title="Plan Tours" description="Connect with host clubs easily." />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - Pinned firmly at the bottom */}
      <footer className="py-6 bg-white border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 tracking-widest uppercase font-medium">
          © 2026 CricTour — Connecting Cricket Clubs Across the UK
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1 text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 leading-normal">{description}</p>
    </div>
  )
}
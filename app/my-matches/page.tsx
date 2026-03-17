"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Match = {
  id: string
  club_name: string
  city: string
  match_date: string
  format: string
}

export default function MyMatches() {

  const [upcoming, setUpcoming] = useState<Match[]>([])
  const [past, setPast] = useState<Match[]>([])
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {

    async function loadMatches() {

      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) return

      const { data: club } = await supabase
        .from("clubs")
        .select("id")
        .eq("created_by", user.id)
        .single()

      if (!club) return

      const today = new Date().toISOString().split("T")[0]

      // ✅ upcoming matches
      const { data: upcomingData } = await supabase
        .from("matches")
        .select("*")
        .eq("club_id", club.id)
        .gte("match_date", today)
        .order("match_date", { ascending: true })

      // ✅ past matches
      const { data: pastData } = await supabase
        .from("matches")
        .select("*")
        .eq("club_id", club.id)
        .lt("match_date", today)
        .order("match_date", { ascending: false })

      if (upcomingData) setUpcoming(upcomingData)
      if (pastData) setPast(pastData)

    }

    loadMatches()

  }, [])

  function MatchCard({ match }: { match: Match }) {
    return (
      <div className="border rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition">
        <div>
          <p className="font-semibold text-slate-900">
            {match.match_date} • {match.format}
          </p>
          <p className="text-sm text-slate-500">
            {match.club_name} • {match.city}
          </p>
        </div>
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <Sidebar />

        <div className="flex-1 p-4 md:p-8 pb-20">

          <h1 className="text-2xl font-bold mb-6">
            My Matches
          </h1>

          {/* ✅ TABS */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                activeTab === "upcoming"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border text-slate-600"
              }`}
            >
              Upcoming ({upcoming.length})
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                activeTab === "past"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border text-slate-600"
              }`}
            >
              Past ({past.length})
            </button>
          </div>

          {/* ✅ LIST */}
          <div className="space-y-3">

            {activeTab === "upcoming" &&
              (upcoming.length > 0 ? (
                upcoming.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No upcoming matches
                </p>
              ))
            }

            {activeTab === "past" &&
              (past.length > 0 ? (
                past.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No past matches
                </p>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  )
}
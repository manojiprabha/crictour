"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"

type Match = {
  id: string
  club_name: string
  city: string
  match_type: string
  format: string
  match_date: string
  description: string
  team_type: string
}

export default function MatchesPage() {

  const router = useRouter()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)

  const [format, setFormat] = useState("")
  const [date, setDate] = useState("")
  const [city, setCity] = useState("")
  const [teamType, setTeamType] = useState("") // ✅ NEW

  async function loadMatches() {

    setLoading(true)

    let query = supabase
      .from("matches")
      .select("*")
      .eq("status", "open")
      .order("match_date", { ascending: true })

    if (format) query = query.eq("format", format)
    if (city) query = query.ilike("city", `%${city}%`)
    if (date) query = query.eq("match_date", date)
    if (teamType) query = query.eq("team_type", teamType) // ✅ NEW

    const { data } = await query

    if (data) setMatches(data)

    setLoading(false)
  }

  useEffect(() => {
    loadMatches()
  }, [])

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-4 md:p-10">

          <h1 className="text-3xl font-bold mb-6">
            Match Board
          </h1>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              <option value="">All Types</option>
              <option value="T20">T20</option>
              <option value="40">40 Overs</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-4 py-2 rounded"
            />

            <input
              type="text"
              placeholder="City / County"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border px-4 py-2 rounded"
            />

            {/* ✅ TEAM FILTER */}
            <select
              value={teamType}
              onChange={(e) => setTeamType(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              <option value="">All Teams</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Junior">Junior</option>
            </select>

            <button
              onClick={loadMatches}
              className="bg-emerald-600 text-white px-5 py-2 rounded"
            >
              Search
            </button>

          </div>

          {loading && <p>Loading matches...</p>}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {matches.map((match) => (

              <div
                key={match.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >

                <h3 className="text-lg font-bold mb-2">
                  {match.club_name}
                </h3>

                {/* ✅ TEAM BADGE */}
                {match.team_type && (
                  <span className="text-xs bg-emerald-100 px-2 py-1 rounded mb-2 inline-block">
                    {match.team_type} Team
                  </span>
                )}

                <p className="text-sm text-slate-500 mb-1">
                  {match.city}
                </p>

                <p className="text-sm text-slate-500 mb-2">
                  {match.match_date} • {match.format}
                </p>

                <p className="text-sm text-slate-600 mb-4">
                  {match.description}
                </p>

                <div className="flex gap-2">

                  <button
                    onClick={() => router.push(`/matches/${match.id}`)}
                    className="px-4 py-2 border rounded text-sm"
                  >
                    View
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}
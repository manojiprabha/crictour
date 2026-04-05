"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Club = {
  id: string
  club_name: string
  city: string
  team_type: string
  play_cricket_url: string
}

export default function ClubsPage() {

  const router = useRouter()

  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [teamType, setTeamType] = useState("") // ✅ NEW

  async function loadClubs() {

    if (!search && !city && !teamType) {
      setClubs([])
      return
    }

    setLoading(true)

    let query = supabase
      .from("clubs")
      .select("*")
      .order("club_name")
      .limit(20)

    if (search) query = query.ilike("club_name", `%${search}%`)
    if (city) query = query.ilike("city", `%${city}%`)
    if (teamType) query = query.eq("team_type", teamType)

    const { data } = await query

    if (data) setClubs(data)

    setLoading(false)
  }

  function clearFilters() {
    setSearch("")
    setCity("")
    setTeamType("") // ✅ NEW
    setClubs([])
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search || city || teamType) loadClubs()
    }, 400)

    return () => clearTimeout(delay)
  }, [search, city, teamType])

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-4 md:p-10 max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">
            Clubs Directory
          </h1>

          {/* FILTER UI */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="Search club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded w-full md:w-60"
            />

            <input
              type="text"
              placeholder="City / County"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border px-4 py-2 rounded w-full md:w-60"
            />

            {/* ✅ TEAM FILTER */}
            <select
              value={teamType}
              onChange={(e) => setTeamType(e.target.value)}
              className="border px-4 py-2 rounded w-full md:w-40"
            >
              <option value="">All Teams</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Junior">Junior</option>
            </select>

            <div className="flex gap-2 w-full md:w-auto">

              <button
                onClick={loadClubs}
                className="bg-emerald-600 text-white px-5 py-2 rounded w-full md:w-auto"
              >
                Search
              </button>

              <button
                onClick={clearFilters}
                disabled={!search && !city && !teamType}
                className="border px-5 py-2 rounded w-full md:w-auto disabled:opacity-30"
              >
                Clear
              </button>

            </div>

          </div>

          {!search && !city && !teamType && (
            <p className="text-slate-500 mb-6">
              Start searching clubs
            </p>
          )}

          {loading && <p>Loading clubs...</p>}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {clubs.map((club) => (
              <div
                key={club.id}
                onClick={() => router.push(`/clubs/${club.id}`)}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
              >

                <h3 className="text-lg font-bold mb-2">
                  {club.club_name}
                </h3>

                {/* ✅ TEAM BADGE */}
                {club.team_type && (
                  <span className="text-xs bg-emerald-100 px-2 py-1 rounded mb-2 inline-block">
                    {club.team_type} Team
                  </span>
                )}

                <p className="text-sm text-slate-500 mb-3">
                  📍 {club.city}
                </p>

                {club.play_cricket_url && (
                  <a
                    href={club.play_cricket_url}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-600 text-sm font-semibold hover:underline"
                  >
                    View Play-Cricket →
                  </a>
                )}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}
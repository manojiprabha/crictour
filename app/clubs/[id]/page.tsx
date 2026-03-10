"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Club = {
  id: string
  club_name: string
  city: string
  role: string
  play_cricket_url: string
}

type Match = {
  id: string
  match_date: string
  format: string
  match_type: string
}

export default function ClubProfile() {

  const params = useParams()

  const [club, setClub] = useState<Club | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadClub() {

      const { data } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", params.id)
        .single()

      if (data) {
        setClub(data)
      }

      setLoading(false)

    }

    loadClub()

  }, [params.id])


  useEffect(() => {

    if (!club) return

    async function loadMatches() {

      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("club_name", club.club_name)

      if (data) {
        setMatches(data)
      }

    }

    loadMatches()

  }, [club])


  if (loading) {
    return (
      <div className="p-10">
        Loading club...
      </div>
    )
  }

  if (!club) {
    return (
      <div className="p-10">
        Club not found
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-10">

          {/* CLUB HEADER */}

          <div className="bg-white rounded-xl border p-8 mb-8">

            <h1 className="text-3xl font-bold mb-2">
              {club.club_name}
            </h1>

            <p className="text-slate-500 mb-2">
              📍 {club.city}
            </p>

            <p className="text-slate-600 mb-4">
              Role: {club.role}
            </p>

            {club.play_cricket_url && (

              <a
                href={club.play_cricket_url}
                target="_blank"
                className="text-emerald-600 font-semibold hover:underline"
              >
                View Play-Cricket →
              </a>

            )}

          </div>


          {/* MATCHES SECTION */}

          <div className="bg-white rounded-xl border p-6">

            <h2 className="text-xl font-bold mb-4">
              Matches Posted
            </h2>

            {matches.length === 0 && (
              <p className="text-slate-500">
                No matches posted yet.
              </p>
            )}

            <div className="space-y-4">

              {matches.map((match) => (

                <div
                  key={match.id}
                  className="border rounded-lg p-4 flex justify-between"
                >

                  <div>

                    <p className="font-semibold">
                      {match.match_date}
                    </p>

                    <p className="text-sm text-slate-500">
                      {match.format} • {match.match_type}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}
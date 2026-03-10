"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type Club = {
  id: string
  club_name: string
  city: string
}

export default function MatchDetailPage() {

  const params = useParams()
  const router = useRouter()

  const matchId = params?.id as string

  const [match, setMatch] = useState<any>(null)
  const [interests, setInterests] = useState<Club[]>([])

  useEffect(() => {

    async function loadMatch() {

      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single()

      if (data) {
        setMatch(data)
      }

    }

    async function loadInterests() {

      const { data } = await supabase
        .from("match_interests")
        .select(`
          club_id,
          clubs (
            id,
            club_name,
            city
          )
        `)
        .eq("match_id", matchId)

      if (data) {

        const clubs = data
          .map((item: any) => item.clubs)
          .filter((c: any) => c)

        setInterests(clubs)

      }

    }

    if (matchId) {
      loadMatch()
      loadInterests()
    }

  }, [matchId])


  function openMessage(clubId: string) {

    router.push(`/messages?club=${clubId}&match=${matchId}`)

  }


  if (!match) {

    return (
      <div className="p-10">
        Loading...
      </div>
    )

  }


  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <h1 className="text-3xl font-bold mb-6">
            Match Details
          </h1>


          {/* Match Info */}

          <div className="bg-white border rounded-xl p-6 mb-10">

            <h2 className="text-xl font-bold mb-2">
              {match.club_name}
            </h2>

            <p className="text-slate-500 mb-2">
              {match.city}
            </p>

            <p className="text-slate-500 mb-2">
              {match.match_date} • {match.format}
            </p>

            <p className="text-slate-600">
              {match.description}
            </p>

          </div>


          {/* Interested Clubs */}

          <h2 className="text-xl font-bold mb-4">
            Interested Clubs
          </h2>


          {interests.length === 0 && (

            <p className="text-slate-500">
              No clubs have shown interest yet.
            </p>

          )}


          <div className="space-y-4">

            {interests.map((club) => {

              if (!club) return null

              return (

                <div
                  key={club.id}
                  className="bg-white border rounded-lg p-4 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {club.club_name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {club.city}
                    </p>

                  </div>

                  <button
                    onClick={() => openMessage(club.id)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700"
                  >
                    Message
                  </button>

                </div>

              )

            })}

          </div>

        </div>

      </div>

    </div>

  )

}
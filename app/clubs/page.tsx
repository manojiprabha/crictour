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
  role: string
  play_cricket_url: string
}

export default function ClubsPage() {

  const router = useRouter()

  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadClubs() {

      const { data } = await supabase
        .from("clubs")
        .select("*")
        .order("club_name")

      if (data) setClubs(data)

      setLoading(false)

    }

    loadClubs()

  }, [])

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <h1 className="text-3xl font-bold mb-8">
            Clubs Directory
          </h1>

          {loading && (
            <p className="text-slate-500">
              Loading clubs...
            </p>
          )}

          {!loading && clubs.length === 0 && (
            <p className="text-slate-500">
              No clubs registered yet.
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {clubs.map((club) => (

              <div
                key={club.id}
                onClick={() => router.push(`/clubs/${club.id}`)}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer"
              >

                <h3 className="text-lg font-bold mb-2">
                  {club.club_name}
                </h3>

                <p className="text-sm text-slate-500 mb-2">
                  📍 {club.city}
                </p>

                <p className="text-sm text-slate-600 mb-3">
                  Role: {club.role}
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
"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import MobileNav from "@/components/MobileNav"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"

type Match = {
  id: string
  club_name: string
  match_date: string
  format: string
  city: string
}

export default function Dashboard() {

  const router = useRouter()

  const [matches, setMatches] = useState<Match[]>([])
  const [clubName, setClubName] = useState("")

  useEffect(() => {

    async function checkClub() {

      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) {
        window.location.href = "/"
        return
      }

      const { data: club } = await supabase
        .from("clubs")
        .select("club_name")
        .eq("created_by", user.id)
        .single()

      if (!club) {
        window.location.href = "/registerclub"
        return
      }

      setClubName(club.club_name)

    }

    checkClub()

    async function loadMatches() {

      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4)

      if (data) {
        setMatches(data)
      }

    }

    loadMatches()

  }, [])

  function ActionCard({
    title,
    desc,
    icon,
    path
  }: { title: string, desc: string, icon: string, path: string }) {

    return (

      <Card
        onClick={() => router.push(path)}
        className="p-6 cursor-pointer flex flex-col justify-between hover:border-emerald-500 transition shadow-sm hover:shadow-md h-full rounded-xl"
      >

        <div>

          <div className="text-2xl mb-4">
            {icon}
          </div>

          <CardTitle className="mb-2 text-lg">
            {title}
          </CardTitle>

          <CardDescription className="text-sm">
            {desc}
          </CardDescription>

        </div>

        <Button variant="link" className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 p-0 h-auto justify-start inline-flex">
          Open →
        </Button>

      </Card>

    )

  }

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col">

      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row">

        {/* Sidebar visible only on desktop */}
        <Sidebar />

        <div className="flex-1 p-4 md:p-8 pb-24">

          <div className="max-w-6xl mx-auto">

            <header className="mb-10">

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Welcome back {clubName} 🏏
              </h1>

              <p className="text-slate-500">
                Here is what's happening on CricTour today.
              </p>

            </header>


            {/* ACTION CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              <ActionCard
                title="Post Match"
                desc="Create a friendly match request."
                icon="➕"
                path="/matches/post"
              />

              <ActionCard
                title="Find Opponents"
                desc="Browse clubs looking for matches."
                icon="🔎"
                path="/matches"
              />

              <ActionCard
                title="Host Tour"
                desc="Invite touring teams to your club."
                icon="🚌"
                path="/tours/post"
              />

            </div>


            {/* RECENT MATCHES */}

            <Card className="rounded-xl overflow-x-auto shadow-sm">

              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">

                <h2 className="font-bold text-slate-800">
                  Recent Match Requests
                </h2>

                <Button
                  variant="link"
                  onClick={() => router.push("/matches")}
                  className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 p-0 h-auto"
                >
                  View All
                </Button>

              </div>

              <div className="divide-y divide-slate-50">

                {matches.map((match) => (

                  <div
                    key={match.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >

                    <div>

                      <p className="font-semibold text-slate-900">
                        {match.match_date} • {match.format}
                      </p>

                      <p className="text-sm text-slate-500">
                        {match.club_name} • {match.city}
                      </p>

                    </div>

                    <Button
                      variant="outline"
                      onClick={() => router.push(`/matches/${match.id}`)}
                      className="border-emerald-600 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-bold h-10 px-4"
                    >
                      View
                    </Button>

                  </div>

                ))}

              </div>

            </Card>

          </div>

        </div>

      </div>


    </div>

  )

}
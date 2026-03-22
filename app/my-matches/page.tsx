"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/authService"
import { getClubByUserId } from "@/services/clubService"
import { getMatchesByClubName, deleteMatch as deleteMatchService } from "@/services/matchService"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Match = {
  id: string
  club_name: string
  match_date: string
  format: string
  match_type: string
}

export default function MyMatches() {

  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {

    async function loadMatches() {

      const { user } = await getCurrentUser()

      if (!user) return

      const { club } = await getClubByUserId(user.id)

      if (!club) return

      const { matches: data } = await getMatchesByClubName(club.club_name)

      if (data) setMatches(data)

    }

    loadMatches()

  }, [])

  async function deleteMatch(id: string) {

    try {
      await deleteMatchService(id)
      setMatches(matches.filter(m => m.id !== id))
    } catch (error) {
      alert("Failed to delete match")
    }

  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <SidebarProvider className="flex flex-1 min-h-0">

        <Sidebar />

        <div className="flex-1 p-10">

          <h1 className="text-3xl font-bold mb-8">
            My Matches
          </h1>

          <div className="space-y-4">

            {matches.map((match) => (

              <Card
                key={match.id}
                className="p-4 flex justify-between items-center shadow-sm"
              >

                <div>

                  <p className="font-semibold text-slate-900">
                    {match.match_date}
                  </p>

                  <p className="text-sm text-slate-500">
                    {match.format} • {match.match_type}
                  </p>

                </div>

                <Button
                  variant="destructive"
                  onClick={() => deleteMatch(match.id)}
                  className="font-semibold"
                >
                  Delete
                </Button>

              </Card>

            ))}

          </div>

        </div>

      </SidebarProvider>

    </div>

  )

}
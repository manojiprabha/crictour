"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/authService"
import { getClubByUserId } from "@/services/clubService"
import { getAllMatches, expressInterest as expressInterestService } from "@/services/matchService"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

type Match = {
    id: string
    club_name: string
    city: string
    match_type: string
    format: string
    match_date: string
    description: string
}

export default function MatchesPage() {

    const router = useRouter()
    const [matches, setMatches] = useState<Match[]>([])

    useEffect(() => {

        async function loadMatches() {

            const { matches: data } = await getAllMatches()

            if (data) {
                setMatches(data)
            }

        }

        loadMatches()

    }, [])


    async function expressInterest(matchId: string) {

        const { user } = await getCurrentUser()

        if (!user) {
            alert("Login required")
            return
        }

        const { club } = await getClubByUserId(user.id)

        if (!club) {
            alert("Club not found")
            return
        }

        try {
            await expressInterestService(matchId, club.id)
            alert("Interest sent!")
        } catch (error: any) {
            alert(error.message || "Failed to send interest")
        }

    }


    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <SidebarProvider className="flex flex-1 min-h-0">

                <Sidebar />

                <div className="flex-1 p-10">

                    <h1 className="text-3xl font-bold mb-8">
                        Match Board
                    </h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {matches.map((match) => (

                            <Card
                                key={match.id}
                                className="shadow-sm hover:shadow-md transition flex flex-col pt-2"
                            >

                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold">
                                        {match.club_name}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-500">
                                        {match.city}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="text-sm text-slate-500 mb-2 font-medium">
                                        {match.match_date} • {match.format}
                                    </p>
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                                        {match.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="flex gap-2">

                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/matches/${match.id}`)}
                                        className="text-sm font-semibold hover:bg-slate-50 border-slate-300"
                                    >
                                        View
                                    </Button>

                                    <Button
                                        onClick={() => expressInterest(match.id)}
                                        className="bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                                    >
                                        I'm Interested
                                    </Button>

                                </CardFooter>

                            </Card>

                        ))}

                    </div>

                </div>

            </SidebarProvider>

        </div>

    )

}
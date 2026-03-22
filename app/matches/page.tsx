"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
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

            const { data } = await supabase
                .from("matches")
                .select("*")
                .order("match_date", { ascending: true })

            if (data) {
                setMatches(data)
            }

        }

        loadMatches()

    }, [])


    async function expressInterest(matchId: string) {

        const { data: userData } = await supabase.auth.getUser()
        const user = userData?.user

        if (!user) {
            alert("Login required")
            return
        }

        const { data: club } = await supabase
            .from("clubs")
            .select("id")
            .eq("created_by", user.id)
            .single()

        if (!club) {
            alert("Club not found")
            return
        }

        const { error } = await supabase
            .from("match_interests")
            .insert({
                match_id: matchId,
                club_id: club.id
            })

        if (error) {
            alert(error.message)
            return
        }

        alert("Interest sent!")

    }


    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <div className="flex">

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

            </div>

        </div>

    )

}
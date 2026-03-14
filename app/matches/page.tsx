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

                            <div
                                key={match.id}
                                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                            >

                                <h3 className="text-lg font-bold mb-2">
                                    {match.club_name}
                                </h3>

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
                                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => expressInterest(match.id)}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                                    >
                                        I'm Interested
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
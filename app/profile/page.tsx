"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function Profile() {

  const [clubId, setClubId] = useState("")
  const [clubName, setClubName] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [playCricket, setPlayCricket] = useState("")

  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadClub() {

      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) return

      // detect login type
      if (user.app_metadata?.provider === "google") {
        setIsGoogleUser(true)
      }

      const { data } = await supabase
        .from("clubs")
        .select("*")
        .eq("created_by", user.id)
        .single()

      if (data) {
        setClubId(data.id)
        setClubName(data.club_name)
        setCity(data.city)
        setRole(data.role)
        setPlayCricket(data.play_cricket_url || "")
      }

      setLoading(false)
    }

    loadClub()

  }, [])

  async function updateClub() {

    const { error } = await supabase
      .from("clubs")
      .update({
        club_name: clubName,
        city,
        role,
        play_cricket_url: playCricket
      })
      .eq("id", clubId)

    if (error) {
      alert(error.message)
    } else {
      alert("Club updated")
    }
  }

  async function changePassword() {

    if (isGoogleUser) {
      alert("You signed in with Google. Change password via Google account.")
      return
    }

    const newPassword = prompt("Enter new password")

    if (!newPassword) return

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Password updated successfully")
    }
  }

  function contactUs() {
    window.location.href = "mailto:support@crictour.app"
  }

  if (loading) {
    return <p className="p-10">Loading...</p>
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-4 md:p-10 max-w-xl">

          <h1 className="text-2xl font-bold mb-6">
            Edit Club Profile
          </h1>

          <div className="space-y-4">

            <input
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Club Name"
            />

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="City"
            />

            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Your Role"
            />

            <input
              value={playCricket}
              onChange={(e) => setPlayCricket(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Play Cricket URL"
            />

            <button
              onClick={updateClub}
              className="bg-emerald-600 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Save Changes
            </button>

            {/* EXTRA ACTIONS */}
            <div className="mt-6 flex gap-4 flex-wrap">

              <button
                onClick={changePassword}
                className="bg-slate-800 text-white px-5 py-2 rounded w-full md:w-auto"
              >
                Change Password
              </button>

              <button
                onClick={contactUs}
                className="border px-5 py-2 rounded w-full md:w-auto"
              >
                Contact Us
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
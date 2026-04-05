"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const roles = [
  "Captain",
  "Vice Captain",
  "Player",
  "Manager",
  "Secretary",
  "Other"
]

export default function Profile() {

  const [clubId, setClubId] = useState("")
  const [clubName, setClubName] = useState("")
  const [city, setCity] = useState("")
  const [role, setRole] = useState("")
  const [teamType, setTeamType] = useState("") // ✅ NEW
  const [playCricket, setPlayCricket] = useState("")

  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadClub() {

      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) return

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
        setTeamType(data.team_type || "") // ✅ NEW
        setPlayCricket(data.play_cricket_url || "")
      }

      setLoading(false)
    }

    loadClub()

  }, [])

  async function updateClub() {

    if (!role || !teamType) {
      alert("Role and team type required")
      return
    }

    const { error } = await supabase
      .from("clubs")
      .update({
        club_name: clubName,
        city,
        role,
        team_type: teamType, // ✅ NEW
        play_cricket_url: playCricket
      })
      .eq("id", clubId)

    if (error) alert(error.message)
    else alert("Club updated")
  }

  async function changePassword() {

    if (isGoogleUser) {
      alert("Change password via Google")
      return
    }

    const newPassword = prompt("Enter new password")
    if (!newPassword) return

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) alert(error.message)
    else alert("Password updated")
  }

  function contactUs() {
    window.location.href = "mailto:support@crictour.app"
  }

  if (loading) return <p className="p-10">Loading...</p>

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
            />

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* ROLE */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* ✅ TEAM TYPE */}
            <select
              value={teamType}
              onChange={(e) => setTeamType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Team</option>
              <option value="Men">Men's Team</option>
              <option value="Women">Women's Team</option>
              <option value="Junior">Junior Team</option>
            </select>

            <input
              value={playCricket}
              onChange={(e) => setPlayCricket(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={updateClub}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

            <div className="mt-6 flex gap-4 flex-wrap">

              <button
                onClick={changePassword}
                className="bg-slate-800 text-white px-5 py-2 rounded"
              >
                Change Password
              </button>

              <button
                onClick={contactUs}
                className="border px-5 py-2 rounded"
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
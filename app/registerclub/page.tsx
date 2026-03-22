"use client"

import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/services/authService"
import { createClubService } from "@/services/clubService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { clubSchema, ClubFormValues } from "@/lib/schemas"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

export default function RegisterClub() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      clubName: "",
      city: "",
      address: "",
      role: "",
      phone: "",
      playCricket: ""
    }
  })

  useEffect(() => {
    async function checkAuth() {
      const { user } = await getCurrentUser()
      if (!user) {
        router.push("/")
      }
    }
    checkAuth()
  }, [router])

  async function onSubmit(data: ClubFormValues) {

    setLoading(true)

    const { user, error: userError } = await getCurrentUser()

    if (userError || !user) {
      alert("Authentication error or not logged in")
      setLoading(false)
      return
    }

    try {
      await createClubService({
        clubName: data.clubName,
        city: data.city,
        address: data.address,
        role: data.role,
        phone: data.phone,
        playCricket: data.playCricket || "",
        userId: user.id
      })
    } catch (error: any) {
      console.log("Insert error:", error)
      alert(error?.message || "Error creating club")
      setLoading(false)
      return
    }

    alert("Club created successfully!")

    // force navigation
    window.location.href = "/dashboard"

  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-xl mx-auto p-10">

        <div className="bg-white border rounded-xl p-8 shadow-sm">

          <h1 className="text-2xl font-bold mb-6">
            Register Your Club
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="clubName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Club Name" {...field} className="w-full h-12 rounded-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="City" {...field} className="w-full h-12 rounded-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Club Address" {...field} className="w-full h-12 rounded-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-lg text-slate-500">
                          <SelectValue placeholder="Your Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Captain">Captain</SelectItem>
                        <SelectItem value="Vice Captain">Vice Captain</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Contact Phone" {...field} className="w-full h-12 rounded-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playCricket"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Play Cricket URL" {...field} className="w-full h-12 rounded-lg" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                {loading ? "Creating Club..." : "Create Club"}
              </Button>

            </form>
          </Form>

        </div>

      </div>

    </div>

  )

}
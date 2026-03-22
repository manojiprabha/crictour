"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/authService"
import { getClubByUserId } from "@/services/clubService"
import { createMatch } from "@/services/matchService"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { matchSchema, MatchFormValues } from "@/lib/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, Variants } from "framer-motion"
import {
  Building03Icon,
  Location01Icon,
  Activity01Icon,
  Layers01Icon,
  Calendar01Icon,
  Note01Icon,
  Mail01Icon,
  PlusSignIcon,
} from "hugeicons-react"

export default function PostMatch() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      clubName: "",
      city: "",
      matchType: "",
      format: "",
      date: "",
      description: "",
      email: ""
    }
  })

  useEffect(() => {
    async function loadClub() {
      const { user } = await getCurrentUser()
      if (!user) {
        router.push("/")
        return
      }
      const { club } = await getClubByUserId(user.id)
      if (club) {
        form.reset({
          ...form.getValues(),
          clubName: club.club_name,
          city: club.city,
          email: user.email || ""
        })
      }
    }
    loadClub()
  }, [])

  async function onSubmit(data: MatchFormValues) {
    setIsSubmitting(true)
    try {
      await createMatch({
        club_name: data.clubName,
        city: data.city,
        match_type: data.matchType,
        format: data.format,
        match_date: data.date,
        description: data.description || "",
        contact_email: data.email
      })
      alert("Match posted successfully!")
      router.push("/matches")
    } catch (error: any) {
      console.log("Match insert error:", error)
      alert(error?.message || "Error posting match")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <SidebarProvider className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                Post Match
                <PlusSignIcon className="w-8 h-8 text-emerald-500" />
              </h1>
              <p className="text-slate-500 mt-2 text-md">
                Find friendly opponents or challenge other clubs in your area.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-10"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* Club Section */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Your Club</h2>
                      <p className="text-slate-500 text-sm mb-4">Confirmed club identity for the match request.</p>
                      <hr className="border-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="clubName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Building03Icon className="w-4 h-4 text-emerald-600" />
                                Club Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} readOnly className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Location01Icon className="w-4 h-4 text-emerald-600" />
                                City location
                              </FormLabel>
                              <FormControl>
                                <Input {...field} readOnly className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Match Specifications Section */}
                  <div className="space-y-6 pt-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Match Specifications</h2>
                      <p className="text-slate-500 text-sm mb-4">Specify the details for your desired match.</p>
                      <hr className="border-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="matchType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Activity01Icon className="w-4 h-4 text-emerald-600" />
                                Match Type
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl shadow-xl">
                                  <SelectItem value="Friendly" className="cursor-pointer">Friendly</SelectItem>
                                  <SelectItem value="Tour" className="cursor-pointer">Tour Match</SelectItem>
                                  <SelectItem value="League" className="cursor-pointer">League Match</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="format"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Layers01Icon className="w-4 h-4 text-emerald-600" />
                                Format
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500">
                                    <SelectValue placeholder="Select format" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl shadow-xl">
                                  <SelectItem value="T20" className="cursor-pointer">T20</SelectItem>
                                  <SelectItem value="T30" className="cursor-pointer">T30</SelectItem>
                                  <SelectItem value="T40" className="cursor-pointer">40 Overs</SelectItem>
                                  <SelectItem value="T50" className="cursor-pointer">50 Overs</SelectItem>
                                  <SelectItem value="Multi-day" className="cursor-pointer">Multi-day/Test</SelectItem>
                                  <SelectItem value="Other" className="cursor-pointer">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Calendar01Icon className="w-4 h-4 text-emerald-600" />
                                Match Date
                              </FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500" />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Note01Icon className="w-4 h-4 text-emerald-600" />
                                Match Details
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide any additional match requirements, pitch type, or logistics." 
                                  {...field} 
                                  className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500 resize-y" 
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Contact Detail Section */}
                  <div className="space-y-6 pt-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                              <Mail01Icon className="w-4 h-4 text-emerald-600" />
                              Contact Email
                            </FormLabel>
                            <FormControl>
                              <Input {...field} readOnly className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Post Match"
                      )}
                    </Button>
                  </motion.div>

                </form>
              </Form>
            </motion.div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
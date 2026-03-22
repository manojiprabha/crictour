"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUser } from "@/services/authService"
import { createTour } from "@/services/tourService"
import { getClubByUserId } from "@/services/clubService"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { tourSchema, TourFormValues } from "@/lib/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { motion, Variants } from "framer-motion"
import {
  Building03Icon,
  Location01Icon,
  Calendar01Icon,
  Note01Icon,
  Mail01Icon,
  Bus01Icon,
} from "hugeicons-react"

export default function PostTour() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      clubName: "",
      city: "",
      dates: "",
      description: "",
      email: ""
    }
  })

  useEffect(() => {
    async function init() {
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
    init()
  }, [])

  async function onSubmit(data: TourFormValues) {
    setIsSubmitting(true)
    try {
      await createTour({
        club_name: data.clubName,
        city: data.city,
        tour_dates: data.dates,
        description: data.description,
        contact_email: data.email
      })
      alert("Tour posted successfully!")
      router.push("/tours")
    } catch (error) {
      alert("Error creating tour")
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
                Host a Touring Team
                <Bus01Icon className="w-8 h-8 text-emerald-500" />
              </h1>
              <p className="text-slate-500 mt-2 text-md">
                Invite teams from other areas to visit your club and play cricket.
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
                      <p className="text-slate-500 text-sm mb-4">Confirmed club identity for the tour invitation.</p>
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
                                <Input readOnly {...field} className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" />
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
                                City & Region
                              </FormLabel>
                              <FormControl>
                                <Input readOnly {...field} className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed" />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Tour Details Section */}
                  <div className="space-y-6 pt-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Tour Details</h2>
                      <p className="text-slate-500 text-sm mb-4">Specify when you can host and what to expect.</p>
                      <hr className="border-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="dates"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Calendar01Icon className="w-4 h-4 text-emerald-600" />
                                Tour Dates
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. July 10–15, 2026" {...field} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500" />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Note01Icon className="w-4 h-4 text-emerald-600" />
                                Tour Description
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide details about the tour: matches offered, facilities, hospitality, activities, etc." 
                                  {...field} 
                                  className="min-h-[140px] rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500 resize-y" 
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
                              <Input readOnly {...field} className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed max-w-md" />
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
                        "Submit Tour Request"
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
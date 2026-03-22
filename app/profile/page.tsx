"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/authService"
import { getClubByUserId, updateClub as updateClubService } from "@/services/clubService"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { clubSchema, ClubFormValues } from "@/lib/schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { motion, Variants } from "framer-motion"
import {
  Building03Icon,
  Location01Icon,
  MapsLocation01Icon,
  UserCircleIcon,
  SmartPhone01Icon,
  LinkSquare02Icon,
  CheckmarkBadge01Icon
} from "hugeicons-react"

export default function Profile() {
  const [clubId, setClubId] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

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
    async function loadClub() {
      const { user } = await getCurrentUser()
      if (!user) {
        window.location.href = "/"
        return
      }
      const { club } = await getClubByUserId(user.id)
      if (club) {
        setClubId(club.id)
        form.reset({
          clubName: club.club_name || "",
          city: club.city || "",
          address: club.address || "",
          role: club.role || "",
          phone: club.contact_phone || "",
          playCricket: club.play_cricket_url || ""
        })
      }
    }
    loadClub()
  }, [form])

  async function onSubmit(data: ClubFormValues) {
    if (!clubId) return;
    setIsUpdating(true)
    try {
      await updateClubService(clubId, {
        club_name: data.clubName,
        city: data.city,
        address: data.address,
        role: data.role,
        contact_phone: data.phone,
        play_cricket_url: data.playCricket
      })
      alert("Club profile updated successfully!")
    } catch (error) {
      alert("Failed to update club profile.")
    } finally {
      setIsUpdating(false)
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
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans">
      <Navbar />
      <SidebarProvider className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                Club Profile
                <CheckmarkBadge01Icon className="w-8 h-8 text-emerald-500" />
              </h1>
              <p className="text-slate-500 mt-2 text-lg">
                Manage your club's identity, contact information, and role.
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

                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Basic Information</h2>
                      <p className="text-slate-500 text-sm mb-4">The core details of your cricket club.</p>
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
                                <Input
                                  placeholder="e.g. Royal Strikers CC"
                                  {...field}
                                  className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <UserCircleIcon className="w-4 h-4 text-emerald-600" />
                                Your Role
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50">
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  <SelectItem value="Captain" className="cursor-pointer">Captain</SelectItem>
                                  <SelectItem value="Vice Captain" className="cursor-pointer">Vice Captain</SelectItem>
                                  <SelectItem value="Secretary" className="cursor-pointer">Secretary</SelectItem>
                                  <SelectItem value="Manager" className="cursor-pointer">Manager</SelectItem>
                                  <SelectItem value="Player" className="cursor-pointer">Player</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-6 pt-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Location & Contact</h2>
                      <p className="text-slate-500 text-sm mb-4">Where your club is based and how to reach you.</p>
                      <hr className="border-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <Location01Icon className="w-4 h-4 text-emerald-600" />
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. London"
                                  {...field}
                                  className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <SmartPhone01Icon className="w-4 h-4 text-emerald-600" />
                                Contact Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter 10-digit number"
                                  {...field}
                                  className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                                <MapsLocation01Icon className="w-4 h-4 text-emerald-600" />
                                Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Full street address, postal code"
                                  {...field}
                                  className="h-12 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Social & Web */}
                  <div className="space-y-6 pt-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 text-slate-800">Social & Web</h2>
                      <p className="text-slate-500 text-sm mb-4">External links associated with your club.</p>
                      <hr className="border-slate-100" />
                    </div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="playCricket"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                              <LinkSquare02Icon className="w-4 h-4 text-emerald-600" />
                              Play Cricket URL
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="https://yourclub.play-cricket.com"
                                  {...field}
                                  className="h-12 pl-4 rounded-xl border-slate-200 focus:ring-emerald-500 bg-slate-50/50"
                                />
                              </div>
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
                      disabled={isUpdating}
                      className="w-full sm:w-auto px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-base shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Save Changes"
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
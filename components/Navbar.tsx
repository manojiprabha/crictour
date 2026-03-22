"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
    const router = useRouter()
    const [email, setEmail] = useState<string | null>(null)

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser()
            if (data?.user) {
                setEmail(data.user.email || null)
            } else {
                setEmail(null)
            }
        }
        loadUser()
    }, [])

    async function signOut() {
        await supabase.auth.signOut()
        setEmail(null)
        router.push("/")
    }

    function handleLogoClick() {
        if (email) {
            router.push("/dashboard")
        } else {
            router.push("/")
        }
    }

    const firstLetter = email ? email.charAt(0).toUpperCase() : "U"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                    onClick={handleLogoClick}
                >
                    <span className="text-xl">🏏</span>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">CricTour</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {email ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-slate-200 shadow-sm transition-transform hover:scale-105 hover:shadow-md cursor-pointer">
                                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                                            {firstLetter}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-900">Signed in</p>
                                        <p className="text-xs leading-none text-slate-500 truncate">{email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 cursor-pointer font-medium">
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            onClick={() => router.push("/")} 
                            className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold h-10 px-5 rounded-xl shadow-sm"
                        >
                            Sign In
                        </Button>
                    )}
                </div>

            </div>
        </header>
    )
}
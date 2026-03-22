"use client"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Tours() {

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <SidebarProvider className="flex flex-1 min-h-0">

                <Sidebar />

                <div className="flex-1 p-10">

                    <h1 className="text-3xl font-bold">
                        Tours
                    </h1>

                    <p className="text-slate-500 mt-4">
                        Tour marketplace coming soon.
                    </p>

                </div>

            </SidebarProvider>

        </div>

    )

}
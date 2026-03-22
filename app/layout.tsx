import "./globals.css"
import MobileNav from "@/components/MobileNav"
import { Inter, Figtree } from "next/font/google"
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip"

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CricTour",
  description: "Find Friendly Cricket Matches & Plan Club Tours"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <html className={cn("font-sans", figtree.variable)}>
      <body className="min-h-screen">

        <TooltipProvider delayDuration={0}>
          {children}

          <MobileNav />
        </TooltipProvider>

      </body>
    </html>

  )

}
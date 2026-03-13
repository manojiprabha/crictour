import "./globals.css"
import MobileNav from "@/components/MobileNav"
import { Inter } from "next/font/google"

const inter = Inter({ subsets:["latin"] })

export const metadata = {
 title:"CricTour",
 description:"Find Friendly Cricket Matches & Plan Club Tours"
}

export default function RootLayout({
 children
}:{
 children:React.ReactNode
}){

return(

<html>
  <body className="min-h-screen">

    {children}

    <MobileNav/>

  </body>
</html>


)

}
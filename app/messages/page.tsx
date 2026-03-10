"use client"

import { Suspense } from "react"
import MessagesClient from "./messages-client"

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading conversation...</div>}>
      <MessagesClient />
    </Suspense>
  )
}
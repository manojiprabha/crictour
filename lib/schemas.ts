import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const clubSchema = z.object({
  clubName: z.string().min(2, "Club name is required (min 2 characters)"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Please provide a more detailed address"),
  role: z.string().min(1, "Please select your role"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  playCricket: z.string().optional()
})

export type ClubFormValues = z.infer<typeof clubSchema>

export const matchSchema = z.object({
  clubName: z.string(), // Extracted from DB, not usually edited by user but sent in form
  city: z.string(), // Extracted from DB
  matchType: z.string().min(2, "Please specify the match type (e.g. Friendly / Tour)"),
  format: z.string().min(2, "Please specify the format (e.g. T20 / 40 overs)"),
  date: z.string().min(1, "Please select a match date"),
  description: z.string().optional(),
  email: z.string().email("Valid contact email is required")
})

export type MatchFormValues = z.infer<typeof matchSchema>

export const tourSchema = z.object({
  clubName: z.string().min(2, "Club name is required"),
  city: z.string().min(2, "City is required"),
  dates: z.string().min(2, "Please specify the tour dates (e.g. July 10-15)"),
  description: z.string().min(10, "Please provide at least 10 characters of tour details"),
  email: z.string().email("Valid contact email is required")
})

export type TourFormValues = z.infer<typeof tourSchema>

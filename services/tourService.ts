import { supabase } from "@/lib/supabase"

export async function createTour(tourData: any) {
  const { error } = await supabase
    .from("tours")
    .insert(tourData)
    
  if (error) {
    throw error
  }
  
  return true
}

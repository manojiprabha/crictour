import { supabase } from "@/lib/supabase"

export type CreateClubParams = {
  clubName: string
  city: string
  address: string
  role: string
  phone: string
  playCricket: string
  userId: string
}

export async function createClubService(params: CreateClubParams) {
  const { error } = await supabase
    .from("clubs")
    .insert({
      club_name: params.clubName,
      city: params.city,
      address: params.address,
      role: params.role,
      contact_phone: params.phone,
      play_cricket_url: params.playCricket,
      created_by: params.userId
    })
    
  if (error) {
    throw error
  }
  
  return true
}

export async function getClubByUserId(userId: string) {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("created_by", userId)
    .single()
    
  if (error && error.code !== "PGRST116") {
    // PGRST116 is "No rows found"
    console.error("Error fetching club by user ID:", error)
  }
  
  return { club: data, error }
}

export async function updateClub(clubId: string, updates: any) {
  const { error } = await supabase
    .from("clubs")
    .update(updates)
    .eq("id", clubId)
    
  if (error) {
    throw error
  }
  
  return true
}

export async function getClubById(id: string) {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", id)
    .single()
    
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching club by ID:", error)
  }
  
  return { club: data, error }
}

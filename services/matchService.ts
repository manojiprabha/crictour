import { supabase } from "@/lib/supabase"

export async function getRecentMatches(limit: number = 4) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
    
  if (error) {
    console.error("Error fetching recent matches:", error)
    return { matches: [], error }
  }
  
  return { matches: data || [], error: null }
}

export async function getAllMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("match_date", { ascending: true })
    
  if (error) {
    console.error("Error fetching all matches:", error)
    return { matches: [], error }
  }
  
  return { matches: data || [], error: null }
}

export async function getMatchesByClubName(clubName: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("club_name", clubName)
    
  if (error) {
    console.error("Error fetching matches by club name:", error)
    return { matches: [], error }
  }
  
  return { matches: data || [], error: null }
}

export async function deleteMatch(id: string) {
  const { error } = await supabase
    .from("matches")
    .delete()
    .eq("id", id)
    
  if (error) {
    throw error
  }
  
  return true
}

export async function expressInterest(matchId: string, clubId: string) {
  const { error } = await supabase
    .from("match_interests")
    .insert({
      match_id: matchId,
      club_id: clubId
    })
    
  if (error) {
    throw error
  }
  
  return true
}

export async function createMatch(matchData: any) {
  const { error } = await supabase
    .from("matches")
    .insert([matchData])
    
  if (error) {
    throw error
  }
  
  return true
}

export async function getMatchById(id: string) {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .single()
    
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching match by id", error)
  }
  
  return { match: data, error }
}

export async function getMatchInterests(matchId: string) {
    const { data, error } = await supabase
        .from("match_interests")
        .select(`
          club_id,
          clubs (
            id,
            club_name,
            city
          )
        `)
        .eq("match_id", matchId)

    if (error) {
        console.error("Error fetching match interests", error)
        return { interests: [], error }
    }

    const clubs = data
        ? data.map((item: any) => item.clubs).filter((c: any) => c)
        : []

    return { interests: clubs, error: null }
}

import { supabase } from "@/lib/supabase"

export async function getMessagesByMatchId(matchId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      fromClub:clubs!messages_from_club_fkey (club_name),
      toClub:clubs!messages_to_club_fkey (club_name)
    `)
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })

  return { messages: data || [], error }
}

export async function markMessagesAsRead(matchId: string, currentClubId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("match_id", matchId)
    .eq("to_club", currentClubId)

  return { error }
}

export async function markSingleMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId)

  return { error }
}

export async function getConversations(clubId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      fromClub:clubs!messages_from_club_fkey (club_name),
      toClub:clubs!messages_to_club_fkey (club_name)
    `)
    .or(`from_club.eq.${clubId},to_club.eq.${clubId}`)
    .order("created_at", { ascending: false })

  return { conversations: data || [], error }
}

export async function sendMessageService(payload: { matchId: string, fromClubId: string, toClubId: string, message: string }) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      match_id: payload.matchId,
      from_club: payload.fromClubId,
      to_club: payload.toClubId,
      message: payload.message,
      is_read: false
    })
    .select()

  return { data, error }
}

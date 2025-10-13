import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { teamCode, gameId, points, reason, createdBy } = body

    // Verify admin code from localStorage (sent in request)
    const adminCode = request.headers.get('x-admin-code')
    if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
      return NextResponse.json(
        { error: 'Ungültiger Admin-Code' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!teamCode || !gameId || !points || !createdBy) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      )
    }

    // Validate team code format
    if (!/^[A-H]$/.test(teamCode)) {
      return NextResponse.json(
        { error: 'Ungültiger Team-Code. Muss A-H sein.' },
        { status: 400 }
      )
    }

    // Validate game ID
    const gameIdNum = parseInt(gameId)
    if (isNaN(gameIdNum) || gameIdNum < 1 || gameIdNum > 7) {
      return NextResponse.json(
        { error: 'Spiel-ID muss zwischen 1 und 7 liegen' },
        { status: 400 }
      )
    }

    // Validate points
    const pointsNum = parseInt(points)
    if (isNaN(pointsNum)) {
      return NextResponse.json(
        { error: 'Punkte müssen eine gültige Zahl sein' },
        { status: 400 }
      )
    }

    // Create server client with service role key
    const supabase = createServerClient()

    // Get team by code
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('code', teamCode)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Team nicht gefunden' },
        { status: 404 }
      )
    }

    // Insert into points ledger
    const { error: insertError } = await supabase
      .from('points_ledger')
      .insert({
        team_id: team.id,
        points: pointsNum,
        source: 'game',
        ref: `game:${gameIdNum}${reason ? ` - ${reason}` : ''}`,
        created_by: createdBy
      })

    if (insertError) {
      console.error('Error inserting into points_ledger:', insertError)
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Punkte' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}

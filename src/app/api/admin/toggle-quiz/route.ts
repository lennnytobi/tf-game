import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    // Verify admin code
    const adminCode = request.headers.get('x-admin-code')
    if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
      return NextResponse.json(
        { error: 'Ungültiger Admin-Code' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid enabled value' },
        { status: 400 }
      )
    }

    // Create server client with service role key
    const supabase = createServerClient()

    // Update the quiz_enabled setting
    const { error } = await supabase
      .from('app_settings')
      .update({ 
        value: enabled ? 'true' : 'false',
        updated_at: new Date().toISOString()
      })
      .eq('key', 'quiz_enabled')

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      enabled: enabled,
      message: enabled ? 'Quiz aktiviert' : 'Quiz deaktiviert'
    })
  } catch (error: unknown) {
    console.error('Error toggling quiz:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Fehler beim Umschalten des Quiz-Status', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin code
    const adminCode = request.headers.get('x-admin-code')
    if (!adminCode || adminCode !== process.env.ADMIN_CODE) {
      return NextResponse.json(
        { error: 'Ungültiger Admin-Code' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()

    // Get current quiz status
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'quiz_enabled')
      .single()

    if (error) throw error

    return NextResponse.json({
      enabled: data?.value === 'true'
    })
  } catch (error: unknown) {
    console.error('Error getting quiz status:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abrufen des Quiz-Status' },
      { status: 500 }
    )
  }
}


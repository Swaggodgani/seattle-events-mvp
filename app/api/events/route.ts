import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfDay, addDays, endOfDay } from 'date-fns'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const source = searchParams.get('source')
    const dateRange = searchParams.get('dateRange')
    const venue = searchParams.get('venue')

    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    // Apply category filter
    if (category && category !== '') {
      query = query.eq('category', category)
    }

    // Apply source filter
    if (source && source !== '') {
      query = query.eq('source', source)  // Changed from ilike to eq for exact matching
    }

    // Apply venue filter
    if (venue && venue !== '') {
      query = query.eq('venue_name', venue)
    }

    // Apply date range filter
    if (dateRange && dateRange !== '') {
      const now = new Date()
      let startDate: Date
      let endDate: Date

      switch (dateRange) {
        case 'today':
          startDate = startOfToday()
          endDate = endOfToday()
          break
        case 'this-week':
          startDate = startOfWeek(now)
          endDate = endOfWeek(now)
          break
        case 'this-weekend':
          // Weekend is considered Friday to Sunday
          const friday = addDays(startOfDay(now), 5 - now.getDay())
          startDate = friday
          endDate = addDays(friday, 2)
          break
        default:
          // If a specific date is selected
          startDate = startOfDay(new Date(dateRange))
          endDate = endOfDay(new Date(dateRange))
      }

      query = query
        .gte('event_date', startDate.toISOString())
        .lte('event_date', endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: data })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
} 
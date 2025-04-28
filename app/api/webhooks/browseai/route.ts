import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

// Helper to parse and format the event date
function parseEventDate(dateStr: string): string {
  try {
    // Store the original date string if we can't parse it
    if (!dateStr) return new Date().toISOString()

    // Remove "UTC" from the string if present
    dateStr = dateStr.replace(' UTC', '')
    
    // Get the current year
    const currentYear = new Date().getFullYear()
    
    // Parse different date formats
    if (dateStr.includes('•')) {
      // Format: "Saturday • 9:00 PM" or "Friday • 8:15 AM"
      const [day, time] = dateStr.split('•').map(s => s.trim())
      const [hour, minute] = time.split(':')
      const isPM = time.includes('PM')
      
      // Create a date for the next occurrence of this day
      const today = new Date()
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const targetDay = daysOfWeek.indexOf(day)
      const currentDay = today.getDay()
      let daysToAdd = targetDay - currentDay
      if (daysToAdd <= 0) daysToAdd += 7
      
      const date = new Date()
      date.setDate(date.getDate() + daysToAdd)
      date.setHours(isPM ? parseInt(hour) + 12 : parseInt(hour))
      date.setMinutes(parseInt(minute) || 0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      
      return date.toISOString()
    } else {
      // For other formats, store as is but in ISO format
      return new Date().toISOString()
    }
  } catch (e) {
    console.error('Error parsing date:', dateStr, e)
    return new Date().toISOString()
  }
}

// Helper to extract city and category from Eventbrite URL
function extractFromUrl(url: string): { city: string; category: string } {
  try {
    // Handle Eventbrite URLs like "https://www.eventbrite.com/d/wa--seattle/networking/"
    const matches = url.match(/eventbrite\.com\/d\/\w+--([^/]+)\/([^/]+)/)
    if (matches) {
      return {
        city: matches[1].charAt(0).toUpperCase() + matches[1].slice(1), // Capitalize city
        category: matches[2].toLowerCase()
      }
    }
    // Add Meetup URL pattern handling later
    return { city: 'Seattle', category: 'unknown' }
  } catch (e) {
    console.error('Error extracting from URL:', e)
    return { city: 'Seattle', category: 'unknown' }
  }
}

// Helper to extract city from location string as fallback
function extractCityFromLocation(location: string): string {
  return location?.split(',')[0]?.trim() || 'Seattle'
}

// Helper to determine the event source
function determineEventSource(task: any): string {
  const originUrl = task.inputParameters?.originUrl || ''
  if (originUrl.includes('meetup.com')) {
    return 'meetup'
  }
  return 'eventbrite'
}

// Helper to parse Meetup date format
function parseMeetupDate(dateStr: string): string {
  try {
    if (!dateStr) return new Date().toISOString()
    
    // Example format: "APR 25 @ 7 PM..."
    const parts = dateStr.split('@')
    const datePart = parts[0].trim()
    const timePart = parts[1]?.trim() || ''
    
    const [month, day] = datePart.split(' ')
    const [time, period] = timePart.split(' ')
    const [hour] = time.split(':')
    
    const date = new Date()
    date.setMonth(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(month))
    date.setDate(parseInt(day))
    date.setHours(period === 'PM' ? parseInt(hour) + 12 : parseInt(hour))
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    
    return date.toISOString()
  } catch (e) {
    console.error('Error parsing Meetup date:', dateStr, e)
    return new Date().toISOString()
  }
}

export async function POST(request: Request) {
  console.log('Received webhook request')
  
  // Temporarily disabled API key check for testing
  // const apiKey = request.headers.get('x-browseai-key')
  // if (apiKey !== process.env.BROWSEAI_API_KEY) {
  //   return NextResponse.json({ error: 'Invalid key' }, { status: 401 })
  // }

  try {
    const body = await request.json()
    console.log('Webhook request body:', JSON.stringify(body, null, 2))
    
    const { event, task } = body
    
    // Only process successful tasks
    if (event !== 'task.finishedSuccessfully') {
      console.log('Skipping non-successful task event:', event)
      return NextResponse.json({ success: true })
    }

    const robotId = task.robotId
    console.log('Processing data for robot:', robotId)
    
    const source = determineEventSource(task)
    console.log('Event source:', source)

    // Get all events and filter out removed ones
    const allEvents = task.capturedLists?.[source === 'meetup' ? 'Meetup Events' : 'Seattle Networking Events'] || []
    const activeEvents = allEvents.filter((e: any) => 
      e._STATUS !== 'REMOVED' && 
      (e['Event Name'] || e['Event Title']) && 
      (e['Event Date & Time'] || e['Event Date'])
    )
    
    console.log('Number of active events found:', activeEvents.length)
    
    // Extract info from the origin URL if available
    const urlInfo = task.inputParameters?.originUrl 
      ? extractFromUrl(task.inputParameters.originUrl)
      : { city: 'Seattle', category: 'networking' }
    
    // Force category to networking for now since we know these are networking events
    urlInfo.category = 'networking'
    
    console.log('URL info:', urlInfo)

    const rows = activeEvents.map((e: any) => {
      const isMeetup = source === 'meetup'
      const title = isMeetup ? e['Event Title'] : e['Event Name']
      const dateStr = isMeetup ? e['Event Date'] : e['Event Date & Time']
      const eventDate = isMeetup ? parseMeetupDate(dateStr) : parseEventDate(dateStr)
      
      let description = ''
      if (isMeetup) {
        description = `Group: ${e['Group Details'] || 'N/A'}\n`
        if (e['Event Type']) description += `Type: ${e['Event Type']}\n`
      } else {
        description = `Organized by: ${e.Organizer || 'N/A'}\n`
        description += `Price: ${e.Price || 'N/A'}\n`
      }
      description += e['Image Description'] || ''

      return {
        source: `${source}-${urlInfo.category}`,
        job_run_id: task.id,
        city: urlInfo.city,
        category: urlInfo.category,
        external_id: `${source}-${e.Position}-${task.id}`,
        title,
        event_date: eventDate,
        link: e['Event Link'],
        venue_name: e.Location || urlInfo.city,
        description
      }
    })

    console.log('Prepared rows for Supabase:', JSON.stringify(rows, null, 2))

    const { error } = await supabase
      .from('events')
      .upsert(rows, { onConflict: 'external_id' })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Successfully stored events in Supabase')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
} 
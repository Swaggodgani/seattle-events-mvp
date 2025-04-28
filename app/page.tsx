'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import EventCard from './components/EventCard'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type Event = {
  id: string
  title: string
  event_date: string
  venue_name: string
  source: string
  category: string
  description: string
  link: string
}

type GroupedEvents = {
  [key: string]: Event[]
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    source: '',
    venue: '',
    date: '',
    category: ''
  })

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'networking', label: 'Networking' },
    { value: 'dancing', label: 'Dancing' },
    { value: 'social', label: 'Social' },
    { value: 'professional', label: 'Professional' }
  ]

  const sources = [
    { value: '', label: 'All Sources' },
    { value: 'eventbrite', label: 'Eventbrite' },
    { value: 'meetup', label: 'Meetup' }
  ]

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (filterOptions.source) params.append('source', filterOptions.source)
      if (filterOptions.venue) params.append('venue', filterOptions.venue)
      if (filterOptions.date) params.append('dateRange', filterOptions.date)
      if (filterOptions.category) params.append('category', filterOptions.category)
      
      const response = await fetch(`/api/events?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch events')
      
      const { events } = await response.json()
      
      if (!Array.isArray(events)) {
        console.error('Expected array of events, received:', events)
        setEvents([])
        return
      }

      const sortedEvents = [...events].sort((a: Event, b: Event) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      )
      setEvents(sortedEvents)
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [filterOptions])

  const handleFilterChange = (key: keyof typeof filterOptions, value: string) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }))
  }

  const groupEventsByDate = (events: Event[]): GroupedEvents => {
    return events.reduce((groups: GroupedEvents, event) => {
      const dateKey = format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
      return groups
    }, {})
  }

  const filterEvents = (events: Event[]) => {
    return events.filter(event => {
      const searchLower = searchTerm.toLowerCase()
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.venue_name.toLowerCase().includes(searchLower)
      )
    })
  }

  const filteredEvents = filterEvents(events)
  const groupedEvents = groupEventsByDate(filteredEvents)

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 py-8 text-center">
          Seattle Events
        </h1>
        
        {/* Sticky Filters */}
        <div className="sticky top-0 bg-white p-4 rounded-lg shadow z-10 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterOptions.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={filterOptions.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                {sources.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>

              <select
                value={filterOptions.venue}
                onChange={(e) => handleFilterChange('venue', e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="">All Venues</option>
              </select>

              <input
                type="date"
                value={filterOptions.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No events found for your filters.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {date}
                </h2>
                <div className="space-y-4">
                  {dateEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      date={event.event_date}
                      venue={event.venue_name}
                      source={event.source}
                      category={event.category}
                      description={event.description}
                      link={event.link}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
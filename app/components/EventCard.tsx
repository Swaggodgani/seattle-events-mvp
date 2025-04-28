import { format } from 'date-fns'

type EventCardProps = {
  title: string
  date: string
  venue: string
  source: string
  category: string
  description: string
  link: string
}

export default function EventCard({
  title,
  date,
  venue,
  source,
  category,
  description,
  link
}: EventCardProps) {
  const getSourceInfo = (source: string) => {
    switch (source.toLowerCase()) {
      case 'eventbrite':
        return {
          classes: 'bg-blue-100 text-blue-800',
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.53 1.33a2.18 2.18 0 0 0-1.07 0L2.84 4.1a.5.5 0 0 0 0 .95l8.62 2.77a2.18 2.18 0 0 0 1.07 0l8.62-2.77a.5.5 0 0 0 0-.95l-8.62-2.77zM2.84 9.1l8.62 2.77a2.18 2.18 0 0 0 1.07 0l8.62-2.77a.5.5 0 0 0 0-.95l-1.72-.55-6.9 2.22a3.18 3.18 0 0 1-1.57 0L4.56 7.6l-1.72.55a.5.5 0 0 0 0 .95zm0 5l8.62 2.77a2.18 2.18 0 0 0 1.07 0l8.62-2.77a.5.5 0 0 0 0-.95l-1.72-.55-6.9 2.22a3.18 3.18 0 0 1-1.57 0L4.56 12.6l-1.72.55a.5.5 0 0 0 0 .95z"/>
            </svg>
          )
        }
      case 'meetup':
        return {
          classes: 'bg-green-100 text-green-800',
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.24 9.5c-.3-.3-.7-.5-1.1-.5h-1.3c-.5-2.1-2.4-3.7-4.7-3.7-1.9 0-3.6 1.2-4.3 2.9-.5-.2-1-.3-1.6-.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9C1.1 13.5 0 15 0 16.9c0 2.3 1.9 4.1 4.1 4.1h12.9c2.3 0 4.1-1.9 4.1-4.1 0-1.9-1.2-3.5-3-4.1.1-.4.2-.8.2-1.2 0-.8-.3-1.6-.9-2.1zM17 19H4.1c-1.1 0-2.1-.9-2.1-2.1 0-1.2.9-2.1 2.1-2.1h.9l.5-1.7c.2-.7.9-1.2 1.6-1.2.5 0 1 .2 1.3.6l.8 1h1.3l.4-1.5c.3-1.1 1.3-1.9 2.5-1.9s2.2.8 2.5 1.9l.4 1.5h2.1c.4 0 .7.2.9.5.2.3.3.7.3 1.1 0 .8-.7 1.5-1.5 1.5h-.5l-.3 1.5c-.2 1.1-1.2 1.9-2.3 1.9z"/>
            </svg>
          )
        }
      default:
        return {
          classes: 'bg-gray-100 text-gray-800',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        }
    }
  }

  const getCategoryInfo = (category: string) => {
    switch (category.toLowerCase()) {
      case 'networking':
        return {
          classes: 'bg-purple-100 text-purple-800',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        }
      case 'dancing':
        return {
          classes: 'bg-pink-100 text-pink-800',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )
        }
      case 'social':
        return {
          classes: 'bg-yellow-100 text-yellow-800',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          )
        }
      default:
        return {
          classes: 'bg-gray-100 text-gray-800',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        }
    }
  }

  const sourceInfo = getSourceInfo(source)
  const categoryInfo = getCategoryInfo(category)

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                {title}
              </a>
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={date}>{format(new Date(date), 'h:mm a')}</time>
              <span className="mx-2">•</span>
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {venue}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex flex-col gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sourceInfo.classes}`}>
              {sourceInfo.icon}
              <span className="ml-2">{source}</span>
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.classes}`}>
              {categoryInfo.icon}
              <span className="ml-2">{category}</span>
            </span>
          </div>
        </div>
        <div className="mt-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Details
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
} 
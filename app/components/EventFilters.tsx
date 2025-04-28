import { useState } from 'react'

export type FilterOptions = {
  dateRange: 'all' | 'today' | 'this-week' | 'this-weekend'
  category: 'all' | 'networking' | 'dancing'
  source: 'all' | 'meetup' | 'eventbrite'
}

type EventFiltersProps = {
  onFilterChange: (filters: FilterOptions) => void
}

export default function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    category: 'all',
    source: 'all'
  })

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const SelectInput = ({ 
    label, 
    value, 
    onChange, 
    options 
  }: { 
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500 text-sm shadow-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
        <button
          onClick={() => {
            const defaultFilters: FilterOptions = {
              dateRange: 'all',
              category: 'all',
              source: 'all'
            }
            setFilters(defaultFilters)
            onFilterChange(defaultFilters)
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectInput
          label="Date Range"
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          options={[
            { value: 'all', label: 'All Dates' },
            { value: 'today', label: 'Today' },
            { value: 'this-week', label: 'This Week' },
            { value: 'this-weekend', label: 'This Weekend' }
          ]}
        />

        <SelectInput
          label="Category"
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'networking', label: 'Networking' },
            { value: 'dancing', label: 'Dancing' }
          ]}
        />

        <SelectInput
          label="Source"
          value={filters.source}
          onChange={(value) => handleFilterChange('source', value)}
          options={[
            { value: 'all', label: 'All Sources' },
            { value: 'meetup', label: 'Meetup' },
            { value: 'eventbrite', label: 'Eventbrite' }
          ]}
        />
      </div>
    </div>
  )
} 
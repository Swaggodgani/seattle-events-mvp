# Seattle Events MVP

A web application that aggregates and displays events happening in Seattle. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- View events from multiple sources (Eventbrite, Meetup)
- Filter by category, source, venue, and date
- Search functionality
- Responsive design
- Real-time updates

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dance-events-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Set up your Supabase database with the following schema:
```sql
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  event_date timestamp with time zone not null,
  venue_name text not null,
  source text not null,
  category text not null,
  description text,
  link text not null,
  created_at timestamp with time zone default now()
);
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key
- `BROWSEAI_API_KEY`: Your BrowseAI API key (for event scraping)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

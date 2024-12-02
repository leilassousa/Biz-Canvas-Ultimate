# Self Assessment Application

A modern self-assessment application built with Vite, React, TypeScript, and Supabase.

## Features

- User authentication with Supabase
- Create and manage self-assessments
- Track confidence levels
- Visualize progress with charts
- Real-time updates
- Modern UI with Tailwind CSS and Shadcn UI

## Tech Stack

- Frontend:
  - Vite + React
  - TypeScript
  - Tailwind CSS + Shadcn UI
  - React Router
  - Zustand (State Management)
  - React Query
  - Recharts

- Backend:
  - Supabase (Authentication, Database, Real-time subscriptions)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── lib/           # Utility functions and configurations
  ├── store/         # Zustand store
  ├── pages/         # Route components
  ├── hooks/         # Custom hooks
  └── types/         # TypeScript type definitions
```

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Logging

The application includes comprehensive logging:
- State changes in Zustand store
- API calls and responses
- Error handling
- Authentication status

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

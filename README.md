# Krushme

A web application that helps you check if your local KFC Krushem machine is working. Features an interactive map showing the status of Krushem machines at KFC locations across the UK.

## Features

- Interactive map showing KFC restaurant locations
- Real-time status of Krushem machines (working, broken, or unknown)
- Store hours and opening status
- Statistics on machine availability

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS
- **Maps**: Leaflet, React Leaflet
- **Date/Time**: Luxon

## Getting Started

### Prerequisites

- Node.js v24
- npm

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
GIST_ID=your_gist_id_here
```

This is required to fetch restaurant data from the GitHub Gist API.

### Installation

Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit files.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - React components
- `src/util/` - Utility functions and helpers
- `src/context/` - React context providers
- `src/types.ts` - TypeScript type definitions
- `public/` - Static assets including custom fonts (FrizQuadrataStd)

## Data Source

Restaurant data is fetched from a GitHub Gist API. The app checks for the latest commit hash and fetches the corresponding restaurant data.

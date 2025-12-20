# DocQuery Client

A React-based document search application that allows users to search through PDF documents and access them via direct links.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Zustand (State Management)
- Axios
- Tailwind CSS
- shadcn/ui Components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:4000
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── ui/         # shadcn/ui components
├── config/         # App configuration (axios, etc.)
├── constants.ts    # App constants
├── interface/      # TypeScript interfaces
├── layout/         # Layout components
├── lib/            # Utility functions
├── routes/         # Route definitions
├── store/          # Zustand stores
└── views/          # Page components
    ├── app/        # Authenticated app views
    ├── auth/       # Authentication views
    └── public/     # Public views
```

## Features

- Google OAuth & Email/Password Authentication
- Document Search
- Search History
- Bookmarks
- Dark/Light Theme Toggle

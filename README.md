# NCCC Portal — Client

The web client for the **NCCC Portal**, a platform built to streamline the submission, review, and querying of Nigerian Content Compliance Certificate (NCCC) applications and contract documents for the NCDMB (Nigerian Content Development & Monitoring Board).

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- Zustand (State Management)
- Axios + Socket.IO Client
- Tailwind CSS v4
- shadcn/ui + Radix UI Components
- TanStack Table
- React Hook Form + Zod
- Three.js (interactive background)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:4000
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   └── reui/         # Custom reusable components (stepper, badge, etc.)
├── config/           # Axios and Socket.IO configuration
├── constants.ts      # App-wide constants (API URL, etc.)
├── interface/        # TypeScript interfaces (Application, Contract, User)
├── layout/           # Route layout wrappers (app, auth, admin, public)
├── lib/              # Utility functions
├── routes/           # Route definitions (app, auth, admin, public)
├── schemas/          # Zod validation schemas
├── store/            # Zustand stores
└── views/            # Page components
    ├── app/          # Authenticated user views
    ├── auth/         # Authentication views
    └── public/       # Public-facing views (landing, about)
```

## Features

### Authentication
- Google OAuth & Email/Password sign-in
- Password reset via email
- JWT-based session management (access + refresh tokens)

### NCCC Application Workflow
- Multi-step application form (Section A, B, C) with live completion progress
- Save as draft or submit for review
- Application status tracking: `DRAFT → SUBMITTED → REVIEWING → APPROVED / REJECTED / REVISION_REQUESTED`

### Contract & Document Management
- Search NCCC contract documents by keyword, operator, contractor, year, or month
- View contract details and direct PDF links
- Archive and bookmark contracts

### Admin Panel
- Application review queue with approval/rejection controls
- User management
- Contract management dashboard
- Operator compliance reports

### General
- Real-time updates via Socket.IO
- Search history
- Dark/Light theme toggle
- Responsive layout

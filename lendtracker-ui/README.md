# LendTracker UI

A beautiful, modern loan tracking dashboard built with React, Vite, and Tailwind CSS.

## Features

- 📊 **Dashboard** - Visual overview with charts and key metrics
- 💰 **Loan Management** - Add, edit, delete loans with all details
- 📅 **Interest Tracking** - Track interest payments by frequency (daily, weekly, monthly, etc.)
- 📈 **Reports** - Top lenders, payment frequency distribution
- 💳 **Payment Recording** - Record interest and principal payments
- 🎨 **Modern UI** - Dark theme with glass morphism effects

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Deployment

### Option 1: Vercel (Recommended - FREE)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts
4. Update `vercel.json` with your backend URL

Or simply:
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

### Option 2: Netlify (FREE)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Build settings are auto-detected from `netlify.toml`
6. Update `netlify.toml` with your backend URL

### Option 3: GitHub Pages (FREE)

1. Add to `vite.config.js`: `base: '/your-repo-name/'`
2. Run `npm run build`
3. Push the `dist` folder to `gh-pages` branch

## Backend Connection

The frontend expects a REST API at `/api/loans`. Update the proxy configuration in `vite.config.js` for local development.

For production, update the API URL in:
- `vercel.json` (for Vercel)
- `netlify.toml` (for Netlify)

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **Lucide React** - Icons

## API Endpoints Expected

```
GET    /api/loans           - List all loans
POST   /api/loans           - Create loan
GET    /api/loans/:id       - Get loan
PUT    /api/loans/:id       - Update loan
DELETE /api/loans/:id       - Delete loan
GET    /api/loans/dashboard - Dashboard stats
POST   /api/loans/:id/pay-interest?amount=X
POST   /api/loans/:id/pay-principal?amount=X
```

## License

MIT

















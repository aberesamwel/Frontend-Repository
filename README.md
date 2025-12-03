# TruckFlow Dashboard

A modern fleet management dashboard built with React and Tailwind CSS.

## Features

- 📊 Real-time KPI dashboard
- 🚛 Vehicle status tracking
- 🔧 Maintenance scheduling
- 📱 Fully responsive design
- 🔍 Real-time search functionality

## Tech Stack

- React 18
- Tailwind CSS
- Lucide React (icons)
- Recharts (charts)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js      # Main dashboard layout
│   ├── Header.js         # Top navigation header
│   ├── Sidebar.js        # Side navigation
│   ├── KPICards.js       # Key performance indicators
│   ├── VehicleTable.js   # Vehicle status table
│   └── MaintenanceChart.js # Maintenance schedule chart
├── data/
│   └── mockData.js       # Sample data
├── App.js                # Main app component
├── index.js              # React entry point
└── index.css             # Tailwind CSS imports
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
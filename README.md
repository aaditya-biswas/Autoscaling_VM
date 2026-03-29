# MAISON — Fashion Design Studio

An expressive, editorial-grade fashion design frontend built for Node.js.

## Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

## Features

- **Collection** — Browse, filter, and manage designs with grid/list views
- **Design Atelier** — Compose garments with silhouette, neckline, fabric & colour controls; live animated preview
- **Moodboard** — Build an inspiration board; add/remove colour story tiles
- **Lookbook** — Horizontal scroll editorial strip for your seasonal looks

## Stack

- **Node.js + Express** — static file server with a simple REST API stub
- **Vanilla HTML/CSS/JS** — zero-dependency frontend; pure CSS animations & transitions
- **Fonts** — Bebas Neue (display) + Cormorant Garamond (serif) + DM Sans (body)

## Project Structure

```
fashion-design-app/
├── server.js          # Express server
├── package.json
└── public/
    ├── index.html     # App shell
    ├── style.css      # All styles + animations
    └── app.js         # Frontend logic
```

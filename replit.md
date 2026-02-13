# Eazy to Sell - Retail Partnership Platform

## Overview
Dual-portal web application for retail partnership management. Client portal for retail partners to manage store launch journey (catalog, launch kit, payments). Admin backoffice for managing clients, inventory, kit approvals, and pipeline stages.

## Recent Changes
- Feb 13, 2026: Landing page upgraded with product-focused sections: quick filter carousel, product showcase with locked prices, categories bento grid, conversion USP strip. All fetching real API data.
- Feb 13, 2026: Yellow theme (hsl(45 93% 47%)) replacing red/pink. 9 category thumbnail images generated.
- Feb 13, 2026: Full-stack conversion complete. PostgreSQL database, Drizzle ORM, Express API, all frontend pages connected to real data.

## User Preferences
- Design matches Event-Hub-Planner1 reference: yellow primary (45 93% 47%), Inter Tight font, custom shadows, collapsible sidebar
- INR currency formatting throughout
- Image-heavy landing page with realistic photos, bento grids, product showcases

## Project Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter routing + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (Neon)
- **Schema**: shared/schema.ts (users, categories, products, clients, launchKitItems, launchKitSubmissions, payments, priceSettings)
- **API**: All routes prefixed /api in server/routes.ts
- **Storage**: DatabaseStorage class in server/storage.ts
- **Styling**: client/src/index.css with custom design tokens
- **Assets**: client/src/assets/images/ (must be imported as JS variables, not URL paths)

## Key Routes
- `/` - Landing page (hero, stats, quick filters, product showcase, categories, USPs, bento, 3D design, steps, features, stories, CTA)
- `/roi-calculator` - ROI Calculator
- `/login` - Login page
- `/client/*` - Client portal (dashboard, catalog, launch-kit, store, payments)
- `/admin/*` - Admin portal (dashboard, clients, products, reviews)

## Key API Endpoints
- GET/POST /api/products, /api/categories, /api/clients
- GET/POST /api/kit-items/:clientId, /api/submissions, /api/payments
- POST /api/seed - Seeds initial data
- GET/POST /api/settings - Price settings

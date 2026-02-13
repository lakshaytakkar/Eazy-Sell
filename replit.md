# Eazy to Sell - Retail Partnership Platform

## Overview
Dual-portal web application for retail partnership management. Client portal for retail partners to manage store launch journey (catalog, launch kit, payments). Admin backoffice for managing clients, inventory, kit approvals, and pipeline stages.

## Recent Changes
- Feb 13, 2026: Theme switched to red primary (hsl 358 89% 60%) + yellow secondary (hsl 45 93% 47%). Quick filter thumbnails regenerated as product images (no icons). Product images regenerated as boxed/packaged sets. Category images regenerated as shelf displays. Hover animations removed from filters and categories.
- Feb 13, 2026: Landing page upgraded with product-focused sections: quick filter carousel, product showcase with locked prices, categories bento grid, conversion USP strip. All fetching real API data.
- Feb 13, 2026: Full-stack conversion complete. PostgreSQL database, Drizzle ORM, Express API, all frontend pages connected to real data.

## User Preferences
- Design: red primary (358 89% 60%), yellow secondary/accent (45 93% 47%), Inter Tight font, custom shadows, collapsible sidebar
- INR currency formatting throughout
- Image-heavy landing page with realistic photos, bento grids, product showcases
- No hover animations on category/filter thumbnails
- Product images should show items in boxes/packages/sets (not standalone)

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

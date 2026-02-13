# Eazy to Sell - Retail Partnership Platform

## Overview
Dual-portal web application for retail partnership management. Client portal for retail partners to manage store launch journey (catalog, launch kit, payments). Admin backoffice for managing clients, inventory, kit approvals, and pipeline stages.

## Recent Changes
- Feb 13, 2026: Full-stack conversion complete. PostgreSQL database, Drizzle ORM, Express API, all frontend pages connected to real data.

## User Preferences
- Design matches Event-Hub-Planner1 reference: red/pink primary (358 89% 60%), Inter Tight font, custom shadows, collapsible sidebar
- INR currency formatting throughout

## Project Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter routing + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (Neon)
- **Schema**: shared/schema.ts (users, categories, products, clients, launchKitItems, launchKitSubmissions, payments, priceSettings)
- **API**: All routes prefixed /api in server/routes.ts
- **Storage**: DatabaseStorage class in server/storage.ts
- **Styling**: client/src/index.css with custom design tokens

## Key Routes
- `/` - Landing page
- `/roi-calculator` - ROI Calculator
- `/login` - Login page
- `/client/*` - Client portal (dashboard, catalog, launch-kit, store, payments)
- `/admin/*` - Admin portal (dashboard, clients, products, reviews)

## Key API Endpoints
- GET/POST /api/products, /api/categories, /api/clients
- GET/POST /api/kit-items/:clientId, /api/submissions, /api/payments
- POST /api/seed - Seeds initial data
- GET/POST /api/settings - Price settings

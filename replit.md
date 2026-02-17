# Eazy to Sell - Retail Partnership Platform

## Overview
Dual-portal web application for retail partnership management. Client portal for retail partners to manage store launch journey (catalog, launch kit, payments). Admin backoffice for managing clients, inventory, kit approvals, and pipeline stages. V2 includes China-sourcing price calculator engine.

## Recent Changes
- Feb 17, 2026: V2 Price Calculator Engine - Full pricing chain from EXW Yuan → FOB → CIF → landed cost → store price → MRP band assignment. Server-side auto-calculation on product create/update. Client-side live preview in admin form. Configurable global settings (exchange rate, freight, duties, markup). Category-level customs duty and IGST rates.
- Feb 17, 2026: Admin Product Form with Sheet panel, sourcing inputs, live price breakdown, MRP band selector, CSV bulk import. Admin Settings page for global price parameters and category duty/GST table with inline editing and recalculation triggers.
- Feb 17, 2026: Catalog upgraded with price band filters, MRP band filters, tag filters, working sort (price/margin/newest). Cards show computed pricing with fallback to legacy fields.
- Feb 17, 2026: Migrated from Neon PostgreSQL + Drizzle ORM to Supabase. Schema uses pure Zod validation + TypeScript interfaces. Storage layer uses @supabase/supabase-js with camelCase↔snake_case conversion.
- Feb 13, 2026: Theme switched to red primary (hsl 358 89% 60%) + yellow secondary (hsl 45 93% 47%). Landing page upgraded with product-focused sections.

## User Preferences
- Design: red primary (358 89% 60%), yellow secondary/accent (45 93% 47%), Inter Tight font, custom shadows, collapsible sidebar
- INR currency formatting throughout
- Image-heavy landing page with realistic photos, bento grids, product showcases
- No hover animations on category/filter thumbnails
- Product images should show items in boxes/packages/sets (not standalone)

## Project Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter routing + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + Supabase JS Client (@supabase/supabase-js)
- **Database**: Supabase (PostgreSQL), project ref: cnzzmbddkurnztfjhxpp, region: Oceania (Sydney)
- **Schema**: shared/schema.ts (Zod validation + TypeScript interfaces, no Drizzle)
- **Price Engine**: server/priceEngine.ts (server-side), client/src/lib/priceEngine.ts (client-side preview)
- **Supabase Client**: server/supabase.ts (initialized with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
- **API**: All routes prefixed /api in server/routes.ts
- **Storage**: DatabaseStorage class in server/storage.ts (camelCase↔snake_case conversion, auto price calculation)
- **Styling**: client/src/index.css with custom design tokens
- **Assets**: client/src/assets/images/ (must be imported as JS variables, not URL paths)
- **DB Tables**: users, categories, products, clients, launch_kit_items, launch_kit_submissions, payments, price_settings

## Price Engine Logic
- EXW (Yuan) + sourcing commission → FOB (Yuan) → FOB (INR via exchange rate)
- FOB + freight (per CBM) + insurance → CIF (INR)
- CIF + customs duty (category %) + social welfare surcharge → assessable value
- Assessable value + IGST (category %) → total landed cost
- Landed cost + our markup % → store landing price
- MRP = lowest standard band (₹29-999) giving target store margin %
- Settings: exchange_rate, sourcing_commission, freight_per_cbm, insurance_percent, sw_surcharge_percent, our_markup_percent, target_store_margin
- Category-level: customs_duty_percent, igst_percent, hs_code

## Key Routes
- `/` - Landing page (hero, stats, quick filters, product showcase, categories, USPs, bento, 3D design, steps, features, stories, CTA)
- `/roi-calculator` - ROI Calculator
- `/login` - Login page
- `/client/*` - Client portal (dashboard, catalog, launch-kit, store, payments)
- `/admin/*` - Admin portal (dashboard, clients, products, reviews, settings)

## Key API Endpoints
- GET/POST /api/products, /api/categories, /api/clients
- POST /api/products/bulk - CSV bulk import
- PATCH /api/products/:id, /api/categories/:id - Update with auto recalculation
- POST /api/recalculate-all - Recalculate all product prices from settings
- GET/POST /api/kit-items/:clientId, /api/submissions, /api/payments
- POST /api/seed - Seeds initial data with EXW pricing
- GET/POST /api/settings - Price settings CRUD
- GET /api/settings/map - Settings as key-value map
- POST /api/sync-airtable - Sync clients from Airtable

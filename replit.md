# Eazy to Sell - Retail Partnership Platform

## Overview
Dual-portal web application for retail partnership management. Client portal for retail partners to manage store launch journey (catalog, launch kit, payments). Admin backoffice with CRM (6-factor lead scoring, 9-stage pipeline, drag-and-drop kanban), inventory, kit approvals, WhatsApp templates, and store readiness checklists. V2 price calculator engine. V3 adds CRM upgrade, public qualification form, readiness checklists, timeline tracking, WhatsApp templates, enhanced ROI calculator, FAQ, and program scope page.

## Recent Changes
- Feb 17, 2026: V3 CRM Upgrade - 9-stage pipeline (New Inquiry→Launched/Lost), 6-factor lead scoring (Budget/Location/Operator/Timeline/Experience/Engagement rated 1-3), auto-calculated total score with Hot/Warm/Nurture badges, package tiers (Lite/Pro/Elite), enhanced kanban with drag-and-drop and score filter.
- Feb 17, 2026: Public qualification form at /qualify - 4-section wizard (Basic/Business/Location/Expectations), auto lead-scoring from answers, creates client record, thank-you screen with confetti animation.
- Feb 17, 2026: Store readiness checklist - 44 items across 7 categories (Infrastructure/Fixtures/Inventory/Billing/Staff/Legal/Launch Prep) in ClientDetail tab, per-client toggle with completion percentage.
- Feb 17, 2026: WhatsApp templates page at /admin/templates - 9 pre-seeded templates with stage badges, merge fields, copy-to-clipboard.
- Feb 17, 2026: Enhanced ROI calculator - 3 package cards, scenario toggle (Conservative/Base/Optimistic), 5 interactive sliders, live INR calculations, payback period and ROI%.
- Feb 17, 2026: FAQ accordion on landing page (fetched from /api/faqs), program scope page at /scope with included/excluded items.
- Feb 17, 2026: Launch phase timeline tracker in ClientDetail (5 phases: Planning→Interior Kit→Inventory→Setup→Launched).
- Feb 17, 2026: V2 Price Calculator Engine - Full pricing chain from EXW Yuan → FOB → CIF → landed cost → store price → MRP band assignment.
- Feb 17, 2026: Migrated from Neon PostgreSQL + Drizzle ORM to Supabase. Schema uses pure Zod validation + TypeScript interfaces.
- Feb 13, 2026: Theme switched to red primary (hsl 358 89% 60%) + yellow secondary (hsl 45 93% 47%).

## User Preferences
- Design: red primary (358 89% 60%), yellow secondary/accent (45 93% 47%), Inter Tight font, custom shadows, collapsible sidebar
- INR currency formatting throughout
- Image-heavy landing page with realistic photos, bento grids, product showcases
- No hover animations on category/filter thumbnails
- Product images should show items in boxes/packages/sets (not standalone)
- Never use "franchise" - use "Store Launch Program" / "Partner"

## Project Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter routing + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + Supabase JS Client (@supabase/supabase-js)
- **Database**: Supabase (PostgreSQL), project ref: cnzzmbddkurnztfjhxpp, region: Oceania (Sydney)
- **Schema**: shared/schema.ts (Zod validation + TypeScript interfaces, no Drizzle)
- **Price Engine**: server/priceEngine.ts (server-side), client/src/lib/priceEngine.ts (client-side preview)
- **Supabase Client**: server/supabase.ts (initialized with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
- **API**: All routes prefixed /api in server/routes.ts
- **Storage**: DatabaseStorage class in server/storage.ts (camelCase↔snake_case conversion, auto price/score calculation)
- **Styling**: client/src/index.css with custom design tokens
- **Assets**: client/src/assets/images/ (must be imported as JS variables, not URL paths)
- **DB Tables**: users, categories, products, clients, launch_kit_items, launch_kit_submissions, payments, price_settings, readiness_checklist_items, readiness_checklist_status, whatsapp_templates, faq_items

## CRM & Lead Scoring
- Pipeline stages: New Inquiry → Qualification Sent → Discovery Call → Proposal Sent → Negotiation → Token Paid → In Execution → Launched → Lost
- 6 scoring factors (Budget, Location, Operator, Timeline, Experience, Engagement) rated 1-3 each
- Total score auto-calculated on create/update: Hot (15+) 🔴, Warm (10-14) 🟡, Nurture (<10) 🟢
- Qualification form auto-maps answers to scores (investment→budget, hasLocation→location, etc.)
- Package tiers: Launch Lite (₹8-10L, ~2000 SKUs), Launch Pro (₹10-15L, ~3500 SKUs), Launch Elite (₹15L+, ~5000+ SKUs)

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
- `/` - Landing page (hero, stats, quick filters, product showcase, categories, USPs, bento, FAQ, CTA)
- `/roi-calculator` - ROI Calculator (3 packages, scenario toggle, live calculations)
- `/qualify` - Public partner qualification form (4-section wizard, auto lead-scoring)
- `/scope` - Program scope page (packages, included/excluded items)
- `/login` - Login page
- `/client/*` - Client portal (dashboard, catalog, launch-kit, store, checklist, payments, invoices, support)
- `/admin/*` - Admin portal (dashboard, clients, products, reviews, templates, payments, settings)

## Key API Endpoints
- GET/POST /api/products, /api/categories, /api/clients
- POST /api/products/bulk - CSV bulk import
- PATCH /api/products/:id, /api/categories/:id - Update with auto recalculation
- POST /api/recalculate-all - Recalculate all product prices from settings
- POST /api/qualify - Public qualification form submission with auto lead-scoring
- GET /api/checklist/items, GET/POST /api/checklist/:clientId - Readiness checklist CRUD
- GET /api/templates - WhatsApp message templates
- GET /api/faqs - FAQ items
- GET/POST /api/kit-items/:clientId, /api/submissions, /api/payments
- POST /api/seed - Seeds initial data with EXW pricing
- GET/POST /api/settings - Price settings CRUD
- GET /api/settings/map - Settings as key-value map
- POST /api/sync-airtable - Sync clients from Airtable

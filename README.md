# CARGOLINK — Turning Empty Trucks into Earning Assets

CARGOLINK is a connected logistics platform for businesses, freight and fleet
operators. It helps shippers book trucks and create shipments, and helps fleet
operators find suitable return loads so empty return journeys become earning
trips.

**Core message: Turn empty trucks into earning assets.**

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (optional animation layer)
- **Lucide React** icons

## Two connected layers

### Layer 1 — Corporate website

| Route | Purpose |
| --- | --- |
| `/` | Homepage — hero, service panel (Book a Truck / Find a Return Load / Track), problem, solution, services, industries, network, platform |
| `/solutions` · `/solutions/businesses` · `/solutions/fleet-operators` | Solutions |
| `/platform` | Platform capabilities |
| `/industries` | Industries we serve |
| `/matching` | Return-load matching with calculated scores |
| `/tracking` | Public shipment / trip tracking search |
| `/analytics` | Analytics overview |
| `/sustainability` | Efficiency-focused sustainability |
| `/company` · `/company/about` · `/company/contact` | Company pages |
| `/resources` | Documentation hub |
| `/faq` | Frequently asked questions |

### Layer 2 — CARGOLINK web platform

| Route | Purpose |
| --- | --- |
| `/sign-in` · `/signup` | Auth with role selection |
| `/dashboard` | Role-aware dashboard (business / driver / fleet operator) |
| `/dashboard/shipments` · `/create` | Business shipment management + Book a Truck |
| `/dashboard/loads` | Load marketplace with filters |
| `/dashboard/matching` | Return-load matching |
| `/dashboard/trip` | Active trip + pickup/delivery verification |
| `/dashboard/fleet` | Fleet overview + availability |
| `/dashboard/tracking` | Tracking by shipment/trip ID |
| `/dashboard/analytics` | Operational analytics + estimated impact |
| `/dashboard/earnings` | Earnings & payments |
| `/dashboard/settings` | Profile, vehicle, preferences |
| `/admin` | Admin panel — users, shipments, vehicles, trips, loads, analytics |

## The connected flow

Shipment created → appears in load marketplace → driver accepts → trip
created → pickup verified with a private code → trip tracked → delivery
verified → completed → return-load matches computed → next trip.

All state is persisted to `localStorage` (key `cargolink-state-v2`) so the
platform runs fully without external credentials. The web and mobile app are
designed to share one backend/data source; in this demo build the store is
client-side and clearly labelled as simulated.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Business / Shipper | `shipper@cargolink.demo` | `demo1234` |
| Driver | `driver@cargolink.demo` | `demo1234` |
| Fleet operator | `fleet@cargolink.demo` | `demo1234` |
| Admin | `admin@cargolink.demo` | `admin1234` |

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm test` — unit tests (matching engine, utils, flows)
- `npm run lint` — ESLint

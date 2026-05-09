# GetBooked.Live Implementation Plan

## Product Direction

GetBooked.Live will be rebuilt as a premium multi-role booking platform for **artists**, **promoters**, **venues**, **crews**, and **creatives**. The public experience will focus on trust, conversion, and role clarity, while the protected application will center on fast booking workflows, structured offers, deal management, and measurable reputation.

## Exact Route Architecture

| Area | Route | Purpose |
| --- | --- | --- |
| Public | `/` | Redesigned landing page with waitlist signup and multi-role value proposition |
| Public | `/signup/role` | Role-selection onboarding immediately after authentication |
| Protected | `/app` | Authenticated role router that reads the stored user role and redirects to the correct dashboard |
| Protected | `/app/artist` | Artist dashboard |
| Protected | `/app/promoter` | Promoter dashboard |
| Protected | `/app/venue` | Venue dashboard |
| Protected | `/app/crew` | Crew dashboard |
| Protected | `/app/creative` | Creative dashboard |
| Public | `/browse` | Master directory with role tabs |
| Public | `/browse/artists` | Artist directory with live filters |
| Public | `/browse/venues` | Venue directory with live filters |
| Public | `/browse/crews` | Crew directory with live filters |
| Public | `/browse/creatives` | Creative directory with live filters |
| Protected | `/offers` | Offer index page with tabs and filters |
| Protected | `/offers/new` | Six-step offer creation wizard |
| Protected | `/offers/:id` | Offer detail page with role-based actions |
| Protected | `/deals/:id` | Accepted-booking deal room with contract, payment, and messaging |
| Legacy Redirect | `/dashboard` | Permanent redirect target: `/app` |
| Legacy Redirect | `/offer` | Permanent redirect target: `/offers` |

## Experience Layers

### Public Experience

The landing page will establish the brand as a premium booking operating system rather than a simple marketplace. It will combine refined typography, dark luxury styling, strong role messaging, and a waitlist form that collects basic intent and desired role. The browse experience will act as both discovery and conversion, exposing high-quality listings while encouraging authentication for offers and booking actions.

### Onboarding Experience

After authentication, users who have not yet completed role setup will be routed to `/signup/role`. This screen will ask the user to select one of the five supported roles, confirm their profile path, and persist that selection in the database. Role persistence will drive all redirect logic, dashboard rendering, and future permissions.

### Protected App Experience

The authenticated app will begin at `/app`, where the server-backed user role determines the correct destination. Each role dashboard will provide a role-specific overview with metrics, inbox content, upcoming work, and quick actions. The app shell will expose role-aware navigation links and a consistent premium UI system.

### Commercial Workflows

The booking workflow will move through four connected surfaces: browse, offer creation, offer detail, and deal room. Promoters will discover talent or venues from browse pages, create structured offers through the wizard, manage sent and received offers through `/offers`, and move accepted work into `/deals/:id`. The deal room will become the canonical record for contract details, payment state, and conversation history.

## Data and Backend Architecture

| Domain | Core Responsibility |
| --- | --- |
| User roles | Persist the authenticated user role and onboarding state |
| Profiles | Store browseable listings for artists, venues, crews, and creatives |
| Offers | Store structured booking proposals, terms, status, and activity |
| Deals | Store accepted offer state, contract details, payment milestones, and messaging |
| Notifications | Store in-app notifications and email-trigger metadata |
| Reviews and metrics | Store review outcomes, response behavior, booking completion history, and BookScore snapshots |
| Scheduling | Run a server-side Heartbeat cron endpoint for BookScore recalculation |

## Scheduling Decision

BookScore updates are deterministic and should run as a server-side scheduled HTTP job, not an agent-driven workflow. The implementation will therefore use a project-level scheduled callback under `/api/scheduled/*`, with an idempotent handler that recalculates BookScore from booking history, response rate, and reviews, then writes the latest values to the database.

## Notification Strategy

For the specified triggers, the platform will create an in-app notification row and also dispatch an email notification event. The first release will cover two flows: notifying artists when they receive a new offer, and notifying promoters when an offer is accepted, countered, or declined.

## Design Principles

The interface should feel editorial, modern, and premium. The base experience will use a dark foundation, luminous accent colors by role, polished spacing, soft glass surfaces, restrained motion, and strong information hierarchy. Mobile behavior is a first-class requirement rather than a later adaptation.

## Delivery Order

| Stage | Focus |
| --- | --- |
| 1 | Schema, backend models, seed-style demo data structures, and routing shell |
| 2 | Landing page, auth entry points, and role onboarding |
| 3 | Role dashboards and app shell |
| 4 | Browse flows and live filters |
| 5 | Offers and deal room |
| 6 | Notifications, BookScore job, redirects, and testing |

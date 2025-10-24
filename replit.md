# Gerente de SaaS - SaaS Subscription Management Platform

## Overview
A comprehensive SaaS subscription management platform built with React, Express, and PostgreSQL. Helps small businesses and startups track all their software subscriptions, receive WhatsApp renewal alerts, visualize spending patterns, and manage team access.

## Product Details
- **Target Market**: Startups, agencies, and small businesses (5-50 people)
- **Pricing**: $19/month per team (14-day trial)
- **Primary Value**: Control SaaS spending, never miss a renewal, eliminate forgotten subscriptions

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query v5)
- **Charts**: Recharts
- **Design**: Notion/Linear inspired with electric blue (#217BEF) palette
- **Typography**: Inter (body), Poppins (headings), JetBrains Mono (numbers)
- **Features**: Dark/light mode, responsive design

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect) - supports email + Google OAuth
- **Session Management**: express-session with PostgreSQL store
- **Integrations**:
  - Twilio API for WhatsApp alerts
  - Stripe for subscription billing
- **Scheduling**: node-cron for renewal checks

## Project Structure

```
/client
  /src
    /components       # Reusable UI components
      app-sidebar.tsx
      ThemeToggle.tsx
      AddEditSubscriptionDialog.tsx
      /ui            # shadcn components
    /contexts        # React contexts
      ThemeProvider.tsx
    /hooks          # Custom hooks
      useAuth.ts
    /lib            # Utilities
      authUtils.ts
      queryClient.ts
    /pages          # Page components
      landing.tsx   # Marketing landing page
      dashboard.tsx # Main dashboard with cards & charts
      subscriptions.tsx
      alerts.tsx    # WhatsApp alerts log
      team.tsx      # Team management
    App.tsx         # Main app with routing
    index.css       # Global styles + design tokens

/server
  index.ts          # Express server entry
  routes.ts         # API route definitions
  storage.ts        # Data access layer (IStorage interface)
  db.ts            # Database connection (Drizzle)
  replitAuth.ts    # Replit Auth configuration
  twilio.ts        # Twilio WhatsApp integration

/shared
  schema.ts         # Drizzle schemas + Zod validators
                   # Shared types for frontend/backend

package.json
tsconfig.json
vite.config.ts
tailwind.config.ts
drizzle.config.ts
```

## Data Models

### Users
- Replit Auth integration (id, email, firstName, lastName, profileImageUrl)
- role: admin, finance, or user
- phoneNumber for WhatsApp alerts
- timestamps: createdAt, updatedAt

### Subscriptions
- appName, category (Comunicação, Produtividade, etc)
- monthlyCost / annualCost
- billingCycle: monthly or annual
- renewalDate
- paymentMethod: credit_card, debit_card, bank_transfer, paypal, other
- responsibleUserId (FK to users)
- status: active, trial, cancelled
- logoUrl, invoiceUrl (optional)
- notes (optional)

### WhatsApp Alerts
- subscriptionId (FK), userId (FK)
- phoneNumber, message
- status: pending, sent, delivered, read, failed
- twilioMessageSid
- sentAt, deliveredAt, readAt
- errorMessage (for failed alerts)

### Sessions
- Required for Replit Auth
- sid (PK), sess (jsonb), expire (timestamp)

## Key Features Implemented

### Task 1 - Schema & Frontend ✅
- Complete data models with Drizzle + Zod validation
- Design system with electric blue palette
- Landing page with hero, features, pricing sections
- Dashboard with:
  - 4 metric cards (total monthly, annual projection, active subs, expiring soon)
  - Alert banner for subscriptions expiring in 7 days
  - Pie chart showing spending by category
  - Bar chart showing monthly trends
  - Subscription cards grid with edit/delete actions
- Add/Edit subscription dialog with full form validation
- Sidebar navigation (Shadcn) with user profile
- WhatsApp alerts log page
- Team management page with role badges
- Theme toggle (dark/light mode)
- All components follow design_guidelines.md
- Comprehensive loading, empty, and error states

### Task 2 - Backend (Next)
- PostgreSQL database setup
- Replit Auth integration
- CRUD APIs for subscriptions
- Team member management
- WhatsApp alert sending via Twilio
- Cron job for 7-day renewal checks
- Role-based permissions middleware

### Task 3 - Integration (Next)
- Connect all frontend to backend APIs
- Error handling and loading states
- Testing with run_test
- Architect review
- Final polish

## User Roles & Permissions

- **Admin**: Full control - manage all subscriptions, team, settings, alerts
- **Finance**: View costs, financial reports, approve payments
- **User**: View and manage only their own subscriptions

## WhatsApp Alert Flow

1. Cron job runs daily checking for renewals 7+ days away
2. If subscription is 7 days from renewal:
   - Create WhatsApp alert record (status: pending)
   - Send via Twilio: "⚠️ Lembrete: sua assinatura do *[App]* vence em *[Data]*. Valor: *[Custo]*."
   - Update status based on Twilio response (sent → delivered → read)
3. User can view all alert logs in Alerts page

## Design Guidelines

Following design_guidelines.md:
- **Colors**: Electric blue primary (#217BEF), white/light gray backgrounds
- **Typography**: Inter for UI, Poppins for headings, JetBrains Mono for costs
- **Spacing**: Consistent 2/3/4/6/8/12/16 scale
- **Components**: Shadcn UI exclusively
- **Interactions**: hover-elevate and active-elevate-2 utilities
- **Cards**: Rounded corners, subtle shadows, hover states
- **Responsive**: Mobile-first, breakpoints at md/lg/xl
- **Accessibility**: WCAG 2.1 AA contrast, focus indicators, semantic HTML

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPLIT_DOMAINS` - Comma-separated domains for auth
- `REPL_ID` - Replit project ID

Twilio (already connected):
- Managed via Replit Connector

Stripe (for billing):
- `VITE_STRIPE_PUBLIC_KEY` - Publishable key (starts with pk_)
- `STRIPE_SECRET_KEY` - Secret key (starts with sk_)

## Development Commands

- `npm run dev` - Start dev server (frontend + backend)
- `npm run db:push` - Push schema changes to database
- `npm run db:push --force` - Force push (use for conflicts)

## Current Status

**Completed:**
- ✅ All data schemas defined
- ✅ Complete design system configured
- ✅ All frontend pages and components built
- ✅ Theme toggle and responsive design
- ✅ Beautiful loading/empty/error states

**In Progress:**
- 🔄 Backend API implementation (Task 2)

**Next:**
- ⏳ Database migration
- ⏳ Replit Auth setup
- ⏳ Twilio WhatsApp integration
- ⏳ Stripe billing
- ⏳ Frontend-backend integration
- ⏳ Testing and polish

## Recent Changes

### 2025-10-23
- Created complete schema with all tables (users, subscriptions, whatsapp_alerts, sessions)
- Built all frontend pages: Landing, Dashboard, Alerts, Team
- Implemented sidebar navigation following Shadcn patterns
- Created subscription management dialog with full form validation
- Added theme provider for dark/light mode
- Configured design system with electric blue palette and proper typography
- All components follow design guidelines with proper spacing, interactions, and accessibility

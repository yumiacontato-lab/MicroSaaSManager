# Design Guidelines: Gerente de SaaS (SaaS Manager)

## Design Approach

**Reference-Based Design** drawing from Notion's modularity, Linear's precision, and Apple Dashboard's data clarity. This platform requires professional polish with exceptional information hierarchy for data-dense subscription management.

## Core Design Principles

1. **Data Clarity First** - Information must be scannable at a glance
2. **Purposeful Density** - Pack value without clutter
3. **Precise Hierarchy** - Clear visual weight for critical data (costs, dates, alerts)
4. **Restrained Elegance** - Professional without being sterile

---

## Typography System

### Font Stack
- **Primary**: Inter (body, UI elements, data)
- **Accent**: Poppins (headings, CTAs)
- **Monospace**: JetBrains Mono (costs, numbers)

### Hierarchy
- **H1 (Page Headers)**: Poppins Semibold, text-4xl (36px)
- **H2 (Section Titles)**: Poppins Semibold, text-2xl (24px)
- **H3 (Card Headers)**: Inter Semibold, text-lg (18px)
- **Body Text**: Inter Regular, text-base (16px)
- **Small UI Text**: Inter Medium, text-sm (14px)
- **Micro Labels**: Inter Medium, text-xs (12px)
- **Cost Display**: JetBrains Mono Bold, text-xl to text-3xl
- **Status Tags**: Inter Semibold, text-xs uppercase tracking-wide

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16** for consistent rhythm
- **Micro spacing**: gap-2, p-3 (tight card internals)
- **Component spacing**: gap-4, p-4, p-6 (standard padding)
- **Section spacing**: gap-8, py-12, py-16 (visual breathing room)

### Grid Strategy
- **Dashboard Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- **Main Content Area**: max-w-7xl mx-auto px-4 md:px-6
- **Sidebar Width**: w-64 (fixed navigation)
- **Content Gap**: gap-6 for card grids, gap-4 for lists

---

## Component Library

### Navigation
**Sidebar Navigation** (Linear-inspired)
- Fixed left sidebar, full-height, minimal width
- Icon + label for main items (Dashboard, Subscriptions, Team, Alerts, Settings)
- Active state: subtle background fill + accent border-left (3px)
- Nested items with indent and reduced opacity
- Bottom-anchored user profile section with avatar + name + role

### Dashboard Cards (Subscription Display)
**Subscription Card Structure**:
- Rounded corners (rounded-lg)
- Subtle border + hover elevation (shadow-sm to shadow-md transition)
- Header: App logo (32x32) + Name (bold) + Status badge
- Body: Cost (large monospace) + "per month" label
- Metadata grid: Renewal date, Payment method, Owner (with avatar)
- Footer: Quick actions (Edit, Delete icons)
- Layout: p-6, flex-col with gap-4 internal spacing

**Status Badges**:
- Small rounded pills (rounded-full px-3 py-1)
- Active: subtle green background
- Cancelled: gray background with reduced opacity
- Trial: blue background
- Expiring Soon: amber/red background (animated pulse)

### Charts & Data Visualization
**Chart Containers**:
- White cards with rounded-lg, p-6
- Chart title (H3) with timeframe selector
- Legends below chart with color-coded dots
- Responsive: full-width mobile, grid layout desktop

**Visual Style**:
- Pie Chart: 6-8 segments max, soft pastels
- Bar Chart: rounded bar tops, consistent spacing
- Line Chart: smooth curves, subtle grid, data points on hover

### Alert System
**Renewal Alert Banner** (top of dashboard):
- Full-width with subtle red/amber background
- Icon + "X subscriptions renewing in 7 days" + View Details CTA
- Dismissible with close icon
- Sticky positioning on scroll

**WhatsApp Status Indicators**:
- Table with columns: Subscription, Recipient, Message, Status, Timestamp
- Status icons: Sent (single check), Delivered (double check), Read (blue checks)
- Compact row height with hover highlight

### Forms
**Subscription Add/Edit Form**:
- Two-column layout on desktop, single-column mobile
- Label above input (text-sm font-medium)
- Input fields: p-3, rounded-md, border with focus ring
- Upload area: dashed border, drag-and-drop zone with icon
- Category dropdown with icons for each category
- Cost input: monospace font with currency symbol
- Date picker: calendar overlay
- Action buttons: right-aligned, Primary + Secondary

### Tables
**Subscription List View**:
- Alternating row backgrounds (subtle gray on white)
- Sticky header row
- Sortable columns with arrow indicators
- Row hover: slight background change + action buttons reveal
- Columns: Logo/Name, Category, Cost, Renewal Date, Owner, Status, Actions
- Responsive: cards on mobile, full table on desktop

### Buttons
**Primary CTA**: 
- Poppins Medium, px-6 py-3, rounded-lg
- Solid background with hover darkening
- Shadow on hover

**Secondary**: 
- Border only, transparent background
- Same padding and rounding as primary

**Icon Buttons**: 
- Square (w-10 h-10), rounded-md
- Subtle background on hover

### Modals & Overlays
**Modal Structure**:
- Centered, max-w-2xl, rounded-xl
- Dark overlay (backdrop-blur-sm)
- Header with title + close icon
- Body with p-6
- Footer with actions right-aligned
- Smooth fade-in animation

---

## Page-Specific Layouts

### Dashboard (Main View)
**Structure**:
1. Top bar: Page title + filters + "Add Subscription" CTA
2. Stats bar: 4 metric cards in grid (Total Monthly, Annual Projection, Active Subs, Expiring Soon)
3. Alert banner (if applicable)
4. Charts section: 2-column grid (Spending by Category pie + Monthly Trends bar)
5. Subscription cards grid: responsive columns
6. Pagination at bottom

### Subscription Detail View
**Split Layout**:
- Left column (60%): Main subscription info, invoices list, usage notes
- Right column (40%): Quick stats, renewal timeline, related subscriptions
- Breadcrumb navigation at top

### Team Management
**Table-focused**:
- Search + filter bar
- Member table with avatar, name, email, role, subscriptions count, actions
- Invite button (top right)
- Role badges with permission preview tooltip

### Settings
**Tabbed Interface**:
- Left vertical tabs (Account, Billing, Notifications, Integrations, Team)
- Content area with form sections
- Each section clearly separated with headings

---

## Landing Page Design

### Hero Section (80vh)
**Layout**:
- Split screen: Left = headline + subheadline + CTAs, Right = dashboard screenshot/product preview
- Headline: Poppins Bold, text-5xl, max-w-2xl
- Subheadline: Inter Regular, text-xl, text-gray-600
- CTA row: Primary "Start Free Trial" + Secondary "See Demo"
- Trust indicator below CTAs: "No credit card required • 14-day trial"

**Image**: Modern dashboard screenshot showing subscription cards, charts, and WhatsApp alerts in action

### Features Section (py-20)
**6-column grid on desktop, 2 on tablet, 1 on mobile**:
- Feature card: Icon (top), Title (H3), Description (2-3 lines)
- Icons: WhatsApp, Chart, Bell, Users, Receipt, Lock
- Features: WhatsApp Alerts, Visual Analytics, Smart Reminders, Team Permissions, Invoice Management, Secure Billing

### Social Proof Section (py-16)
**Testimonial slider**:
- 3 cards visible on desktop
- Each card: Quote + Avatar + Name + Company + Role
- Subtle rotation animation on auto-advance

### Pricing Section (py-20)
**Two-column comparison**:
- Free Trial card (left) vs Pro Plan card (right)
- Feature checklist with checkmarks
- Highlighted "Most Popular" badge on Pro
- Large pricing display (monospace font)
- "Start Trial" CTAs

### Final CTA Section (py-24)
**Centered content**:
- Bold headline: "Ready to take control of your SaaS spending?"
- Supporting text with key benefit
- Large primary CTA
- Secondary link: "Schedule a demo"

---

## Images Strategy

**Hero Image**: Full-featured dashboard screenshot (1200x800px) showing:
- Multiple subscription cards with recognizable SaaS logos
- Active charts with real data
- WhatsApp notification panel visible
- Clean, professional mockup with subtle shadows

**Feature Section Icons**: Use Heroicons for consistency

**Testimonial Section**: Authentic user photos (headshots, professional style)

**Trust Badges**: Small logos of payment/security certifications at footer

---

## Animation Guidelines

**Minimal, purposeful only**:
- Card hover: subtle lift (translateY(-2px)) + shadow increase
- Alert pulse: gentle opacity animation on critical alerts
- Chart data: staggered fade-in on load
- Modal: fade-in overlay + scale-up content (0.95 to 1)
- No parallax, no continuous animations

---

## Accessibility Standards

- Minimum contrast ratio: 4.5:1 for text, 3:1 for UI components
- Focus indicators: 2px ring with offset on all interactive elements
- Semantic HTML with proper heading hierarchy
- ARIA labels for icon buttons and status indicators
- Keyboard navigation for all actions
- Screen reader announcements for dynamic alerts
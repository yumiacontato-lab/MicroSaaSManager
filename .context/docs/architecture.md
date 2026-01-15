---
status: unfilled
generated: 2026-01-15
---

# Architecture Notes

Describe how the system is assembled and why the current design exists.

## System Architecture Overview

Summarize the top-level topology (monolith, modular service, microservices) and deployment model. Highlight how requests traverse the system and where control pivots between layers.

## Architectural Layers
### Models
Data structures and domain objects
- **Directories**: `shared`
- **Symbols**: 6 total, 6 exported
- **Key exports**:
  - [`UpsertUser`](shared/schema.ts#L120) (type)
  - [`User`](shared/schema.ts#L121) (type)
  - [`InsertSubscription`](shared/schema.ts#L137) (type)
  - [`Subscription`](shared/schema.ts#L138) (type)
  - [`InsertWhatsappAlert`](shared/schema.ts#L151) (type)
  - [`WhatsappAlert`](shared/schema.ts#L152) (type)

### Controllers
Request handling and routing
- **Directories**: `server`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`registerRoutes`](server/routes.ts#L11) (function)

### Utils
Shared utilities and helpers
- **Directories**: `client/src/lib`
- **Symbols**: 5 total, 3 exported
- **Key exports**:
  - [`cn`](client/src/lib/utils.ts#L4) (function)
  - [`apiRequest`](client/src/lib/queryClient.ts#L10) (function)
  - [`isUnauthorizedError`](client/src/lib/authUtils.ts#L1) (function)

### Components
UI components and views
- **Directories**: `client/src/pages`, `client/src/components`, `client/src/components/ui`
- **Symbols**: 24 total, 7 exported
- **Key exports**:
  - [`Subscriptions`](client/src/pages/subscriptions.tsx#L5) (function)
  - [`NotFound`](client/src/pages/not-found.tsx#L4) (function)
  - [`ThemeToggle`](client/src/components/ThemeToggle.tsx#L5) (function)
  - [`ChartConfig`](client/src/components/ui/chart.tsx#L11) (type)
  - [`CalendarProps`](client/src/components/ui/calendar.tsx#L8) (type)
  - [`ButtonProps`](client/src/components/ui/button.tsx#L42) (interface)
  - [`BadgeProps`](client/src/components/ui/badge.tsx#L28) (interface)


## Detected Design Patterns
- *No design patterns detected yet.*

## Entry Points
- [`server/index.ts`](server/index.ts)
- [`client/src/main.tsx`](client/src/main.tsx)

## Public API
| Symbol | Type | Location |
| --- | --- | --- |
| [`apiRequest`](client/src/lib/queryClient.ts#L10) | function | client/src/lib/queryClient.ts:10 |
| [`BadgeProps`](client/src/components/ui/badge.tsx#L28) | interface | client/src/components/ui/badge.tsx:28 |
| [`ButtonProps`](client/src/components/ui/button.tsx#L42) | interface | client/src/components/ui/button.tsx:42 |
| [`CalendarProps`](client/src/components/ui/calendar.tsx#L8) | type | client/src/components/ui/calendar.tsx:8 |
| [`ChartConfig`](client/src/components/ui/chart.tsx#L11) | type | client/src/components/ui/chart.tsx:11 |
| [`cn`](client/src/lib/utils.ts#L4) | function | client/src/lib/utils.ts:4 |
| [`DatabaseStorage`](server/storage.ts#L35) | class | server/storage.ts:35 |
| [`getSession`](server/replitAuth.ts#L27) | function | server/replitAuth.ts:27 |
| [`getTwilioClient`](server/twilio.ts#L39) | function | server/twilio.ts:39 |
| [`getTwilioFromPhoneNumber`](server/twilio.ts#L46) | function | server/twilio.ts:46 |
| [`InsertSubscription`](shared/schema.ts#L137) | type | shared/schema.ts:137 |
| [`InsertWhatsappAlert`](shared/schema.ts#L151) | type | shared/schema.ts:151 |
| [`IStorage`](server/storage.ts#L17) | interface | server/storage.ts:17 |
| [`isUnauthorizedError`](client/src/lib/authUtils.ts#L1) | function | client/src/lib/authUtils.ts:1 |
| [`log`](server/vite.ts#L11) | function | server/vite.ts:11 |
| [`NotFound`](client/src/pages/not-found.tsx#L4) | function | client/src/pages/not-found.tsx:4 |
| [`registerRoutes`](server/routes.ts#L11) | function | server/routes.ts:11 |
| [`sendWhatsAppMessage`](server/twilio.ts#L52) | function | server/twilio.ts:52 |
| [`serveStatic`](server/vite.ts#L70) | function | server/vite.ts:70 |
| [`setupAuth`](server/replitAuth.ts#L72) | function | server/replitAuth.ts:72 |
| [`setupVite`](server/vite.ts#L22) | function | server/vite.ts:22 |
| [`Subscription`](shared/schema.ts#L138) | type | shared/schema.ts:138 |
| [`Subscriptions`](client/src/pages/subscriptions.tsx#L5) | function | client/src/pages/subscriptions.tsx:5 |
| [`ThemeProvider`](client/src/contexts/ThemeProvider.tsx#L20) | function | client/src/contexts/ThemeProvider.tsx:20 |
| [`ThemeToggle`](client/src/components/ThemeToggle.tsx#L5) | function | client/src/components/ThemeToggle.tsx:5 |
| [`UpsertUser`](shared/schema.ts#L120) | type | shared/schema.ts:120 |
| [`useAuth`](client/src/hooks/useAuth.ts#L5) | function | client/src/hooks/useAuth.ts:5 |
| [`useIsMobile`](client/src/hooks/use-mobile.tsx#L5) | function | client/src/hooks/use-mobile.tsx:5 |
| [`User`](shared/schema.ts#L121) | type | shared/schema.ts:121 |
| [`useTheme`](client/src/contexts/ThemeProvider.tsx#L46) | function | client/src/contexts/ThemeProvider.tsx:46 |
| [`WhatsappAlert`](shared/schema.ts#L152) | type | shared/schema.ts:152 |

## Internal System Boundaries

Document seams between domains, bounded contexts, or service ownership. Note data ownership, synchronization strategies, and shared contract enforcement.

## External Service Dependencies

List SaaS platforms, third-party APIs, or infrastructure services the system relies on. Describe authentication methods, rate limits, and failure considerations for each dependency.

## Key Decisions & Trade-offs

Summarize architectural decisions, experiments, or ADR outcomes that shape the current design. Reference supporting documents and explain why selected approaches won over alternatives.

## Diagrams

Link architectural diagrams or add mermaid definitions here.

## Risks & Constraints

Document performance constraints, scaling considerations, or external system assumptions.

## Top Directories Snapshot
- `attached_assets/` — approximately 6 files
- `client/` — approximately 68 files
- `components.json/` — approximately 1 files
- `design_guidelines.md/` — approximately 1 files
- `drizzle.config.ts/` — approximately 1 files
- `ecosystem.config.cjs/` — approximately 1 files
- `package-lock.json/` — approximately 1 files
- `package.json/` — approximately 1 files
- `postcss.config.js/` — approximately 1 files
- `replit.md/` — approximately 1 files
- `server/` — approximately 7 files
- `shared/` — approximately 1 files
- `tailwind.config.ts/` — approximately 1 files
- `tsconfig.json/` — approximately 1 files
- `vite.config.ts/` — approximately 1 files

## Related Resources

- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.

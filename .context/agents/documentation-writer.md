---
name: Documentation Writer
description: Create clear, comprehensive documentation
status: unfilled
generated: 2026-01-15
---

# Documentation Writer Agent Playbook

## Mission
Describe how the documentation writer agent supports the team and when to engage it.

## Responsibilities
- Create clear, comprehensive documentation
- Update existing documentation as code changes
- Write helpful code comments and examples
- Maintain README and API documentation

## Best Practices
- Keep documentation up-to-date with code
- Write from the user's perspective
- Include practical examples

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `attached_assets/` — TODO: Describe the purpose of this directory.
- `client/` — TODO: Describe the purpose of this directory.
- `server/` — TODO: Describe the purpose of this directory.
- `shared/` — TODO: Describe the purpose of this directory.

## Key Files
**Entry Points:**
- [`server/index.ts`](server/index.ts)
- [`client/src/main.tsx`](client/src/main.tsx)

## Architecture Context

### Models
Data structures and domain objects
- **Directories**: `shared`
- **Symbols**: 6 total
- **Key exports**: [`UpsertUser`](shared/schema.ts#L120), [`User`](shared/schema.ts#L121), [`InsertSubscription`](shared/schema.ts#L137), [`Subscription`](shared/schema.ts#L138), [`InsertWhatsappAlert`](shared/schema.ts#L151), [`WhatsappAlert`](shared/schema.ts#L152)

### Controllers
Request handling and routing
- **Directories**: `server`
- **Symbols**: 1 total
- **Key exports**: [`registerRoutes`](server/routes.ts#L11)

### Utils
Shared utilities and helpers
- **Directories**: `client/src/lib`
- **Symbols**: 5 total
- **Key exports**: [`cn`](client/src/lib/utils.ts#L4), [`apiRequest`](client/src/lib/queryClient.ts#L10), [`isUnauthorizedError`](client/src/lib/authUtils.ts#L1)

### Components
UI components and views
- **Directories**: `client/src/pages`, `client/src/components`, `client/src/components/ui`
- **Symbols**: 24 total
- **Key exports**: [`Subscriptions`](client/src/pages/subscriptions.tsx#L5), [`NotFound`](client/src/pages/not-found.tsx#L4), [`ThemeToggle`](client/src/components/ThemeToggle.tsx#L5), [`ChartConfig`](client/src/components/ui/chart.tsx#L11), [`CalendarProps`](client/src/components/ui/calendar.tsx#L8), [`ButtonProps`](client/src/components/ui/button.tsx#L42), [`BadgeProps`](client/src/components/ui/badge.tsx#L28)
## Key Symbols for This Agent
- [`DatabaseStorage`](server/storage.ts#L35) (class)
- [`IStorage`](server/storage.ts#L17) (interface)
- [`ButtonProps`](client/src/components/ui/button.tsx#L42) (interface)
- [`BadgeProps`](client/src/components/ui/badge.tsx#L28) (interface)
- [`log`](server/vite.ts#L11) (function)
- [`setupVite`](server/vite.ts#L22) (function)
- [`serveStatic`](server/vite.ts#L70) (function)
- [`getTwilioClient`](server/twilio.ts#L39) (function)
- [`getTwilioFromPhoneNumber`](server/twilio.ts#L46) (function)
- [`sendWhatsAppMessage`](server/twilio.ts#L52) (function)
- [`registerRoutes`](server/routes.ts#L11) (function)
- [`getSession`](server/replitAuth.ts#L27) (function)
- [`setupAuth`](server/replitAuth.ts#L72) (function)
- [`cn`](client/src/lib/utils.ts#L4) (function)
- [`apiRequest`](client/src/lib/queryClient.ts#L10) (function)

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes

Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.

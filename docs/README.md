# EventSponsorHub Documentation

This directory contains comprehensive documentation for the EventSponsorHub platform.

## Documentation Index

### 📚 [Database Schema](./DATABASE_SCHEMA.md)
Complete database schema documentation including:
- Entity relationship diagrams
- Table structures and relationships
- Database functions and triggers
- Row Level Security policies
- Common queries and patterns

**Read this first** to understand the data model.

### 🏗️ [System Architecture](./SYSTEM_ARCHITECTURE.md)
System architecture and design patterns including:
- Technology stack
- Authentication flow
- Data flow patterns
- Three-phase launch strategy
- Key workflows
- API patterns
- Security best practices

**Read this** to understand how the system works end-to-end.

### ⚡ [Quick Reference](./QUICK_REFERENCE.md)
Quick reference guide for coding agents and developers:
- Core concepts
- Common code patterns
- Key functions
- File locations
- Testing checklist

**Use this** as a cheat sheet when coding.

## Getting Started

1. **New to the project?** Start with [System Architecture](./SYSTEM_ARCHITECTURE.md)
2. **Working with the database?** Read [Database Schema](./DATABASE_SCHEMA.md)
3. **Need quick answers?** Check [Quick Reference](./QUICK_REFERENCE.md)

## Additional Resources

- **Supabase Setup**: See `supabase/README.md` for database setup instructions
- **Migration Files**: `supabase/migrations/001_initial_schema.sql`
- **TypeScript Types**: `lib/database/types.ts`

## For Coding Agents

When working on this codebase:

1. **Understand the context**: This is a B2B SaaS platform for event sponsorship reviews
2. **Follow the three-phase strategy**: Features should align with Phase 1, 2, or 3
3. **Respect RLS policies**: Never bypass Row Level Security
4. **Check subscriptions**: Always verify subscription tier for premium features
5. **Use TypeScript types**: Import types from `lib/database/types.ts`
6. **Follow patterns**: Use existing Supabase client patterns

## Questions?

Refer to the detailed documentation files above. Each document includes:
- Clear explanations
- Code examples
- Common patterns
- Best practices

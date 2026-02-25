/**
 * OLD STRUCTURE - Archive of Previous Documentation
 * 
 * Architecture before migration to Vercel-aligned structure.
 * These files are preserved for reference only.
 * 
 * To see the current structure, refer to:
 * - PROJECT_STRUCTURE.md
 * - VERCEL_STRUCTURE.md
 * - MIGRATION_GUIDE.md
 * 
 * The old structure was:
 * src/server/
 * ├── api/routes/
 * ├── controllers/
 * ├── services/
 * ├── repositories/
 * └── common/
 * 
 * The new Vercel-aligned structure is:
 * src/
 * ├── lib/                # Shared utilities
 * ├── _services/          # Private: Business logic
 * ├── _repositories/      # Private: Data access
 * └── app/api/(_api)/_lib/# API handlers
 * 
 * Current project context: CV extraction workflow documentation
 */

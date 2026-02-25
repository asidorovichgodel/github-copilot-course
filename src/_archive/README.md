/\*\*

- ARCHIVE - Old Server Structure Documentation
-
- This folder contains documentation and templates from the previous
- server-side architecture before migrating to the Vercel-aligned structure.
-
- These files are kept for reference but the code has been reorganized to:
- - Use src/lib/ for shared utilities (Vercel pattern)
- - Use src/\_services/ for business logic (private folder)
- - Use src/\_repositories/ for data access (private folder)
- - Use src/app/api/(\_api)/\_lib/ for API handlers (colocated)
- - Support the CV extraction project workflow in current docs
-
- For the current structure, see:
- - PROJECT_STRUCTURE.md (quick reference)
- - VERCEL_STRUCTURE.md (detailed guide)
- - MIGRATION_GUIDE.md (what changed)
    \*/

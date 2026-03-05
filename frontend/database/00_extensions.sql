-- ============================================================
-- 00_extensions.sql
-- PostgreSQL extensions required for the UAE ERP system
-- ============================================================

-- UUID generation (built-in gen_random_uuid() in pg13+, this is fallback)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cryptographic functions (for token hashing, password operations)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- B-tree GiST operator classes (for exclusion constraints, e.g. schedule overlaps)
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Trigram similarity for fuzzy text search (used by GIN indexes)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

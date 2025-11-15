# Database Migrations

This directory contains SQL migration files for Supabase database setup.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `001_initial_schema.sql`
4. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Using psql

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
\i migrations/001_initial_schema.sql
```

## Migration Files

### `001_initial_schema.sql`

Creates the core database schema:

- **users**: User profiles with gamification data
- **pins**: Hazard reports with location and verification stats
- **verifications**: User votes on pin validity
- **confirmations**: Official reports and confirmations

Includes:
- Primary keys and foreign key constraints
- Check constraints for data validation
- Indexes for query performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## Post-Migration Steps

After running the migration:

1. **Verify tables were created**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('users', 'pins', 'verifications', 'confirmations');
   ```

2. **Check indexes**:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename IN ('users', 'pins', 'verifications', 'confirmations');
   ```

3. **Verify RLS policies**:
   ```sql
   SELECT tablename, policyname FROM pg_policies 
   WHERE tablename IN ('users', 'pins', 'verifications', 'confirmations');
   ```

## Notes

- The migration uses UUIDs for all primary keys
- RLS policies allow public read access but require authentication for writes
- The `updated_at` timestamp is automatically maintained via triggers
- Foreign key constraints ensure referential integrity with CASCADE deletes

## Data Migration

If you need to migrate data from the in-memory store to Supabase:

1. Export data from the in-memory store (if needed)
2. Use Supabase's import tools or write a migration script
3. Ensure user IDs match between Supabase Auth and the users table


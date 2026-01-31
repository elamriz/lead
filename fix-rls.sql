-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';

-- Disable RLS temporarily for testing (you can re-enable later with proper policies)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled, add permissive policies:
-- DROP POLICY IF EXISTS "Enable read access for all users" ON products;
-- DROP POLICY IF EXISTS "Enable insert for all users" ON products;
-- DROP POLICY IF EXISTS "Enable update for all users" ON products;
-- DROP POLICY IF EXISTS "Enable delete for all users" ON products;

-- CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for all users" ON products FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update for all users" ON products FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete for all users" ON products FOR DELETE USING (true);

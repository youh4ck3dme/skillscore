-- Check all data in pricing_items table
SELECT 
  id,
  country,
  role,
  work_type,
  price_junior,
  price_standard,
  price_senior,
  source_url
FROM pricing_items
ORDER BY country, role, work_type;

-- Count total records
SELECT COUNT(*) as total_records FROM pricing_items;

-- Count by country
SELECT country, COUNT(*) as count 
FROM pricing_items 
GROUP BY country 
ORDER BY count DESC;

-- Count by role
SELECT role, COUNT(*) as count 
FROM pricing_items 
GROUP BY role 
ORDER BY count DESC;

-- Count by work_type
SELECT work_type, COUNT(*) as count 
FROM pricing_items 
GROUP BY work_type 
ORDER BY count DESC;

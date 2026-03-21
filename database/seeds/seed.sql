-- Seed data for Citylink MVP

-- 1. Admin Users
INSERT INTO admin_users (name, email, phone, password_hash, role)
VALUES ('System Admin', 'admin@citylink.com', '+1234567890', '$2b$10$xyz...', 'SUPER_ADMIN');

-- 2. Merchant Categories
INSERT INTO merchant_categories (name, sort_order)
VALUES 
  ('Thai Food', 1),
  ('Western', 2),
  ('Cafe & Bakery', 3);

-- 3. Merchants
INSERT INTO merchants (category_id, name, contact_name, contact_phone, address_line, city, township, service_mode)
SELECT 
  id, 
  'Spicy Thai Kitchen', 
  'Somchai', 
  '0987654321', 
  '123 Sukhumvit Rd', 
  'Bangkok', 
  'Watthana', 
  'DELIVERY'
FROM merchant_categories WHERE name = 'Thai Food';

-- 4. Product Categories
INSERT INTO product_categories (merchant_id, name, sort_order)
SELECT id, 'Signature Dishes', 1 FROM merchants WHERE name = 'Spicy Thai Kitchen';

-- 5. Products
INSERT INTO products (merchant_id, category_id, name, price, stock)
SELECT 
  m.id, 
  c.id, 
  'Tom Yum Goong', 
  150.00, 
  -1 
FROM merchants m 
JOIN product_categories c ON c.merchant_id = m.id
WHERE m.name = 'Spicy Thai Kitchen';

-- 6. Hotels
INSERT INTO hotels (name, star_rating, address_line, city, township, check_in_time, check_out_time, facilities)
VALUES (
  'Grand City Hotel', 
  5, 
  '456 Silom Rd', 
  'Bangkok', 
  'Bang Rak', 
  '14:00', 
  '12:00', 
  '["wifi", "pool", "gym", "spa"]'
);

-- 7. Room Types
INSERT INTO room_types (hotel_id, name, bed_type, room_size_sqm, max_occupancy, base_price, image_urls)
SELECT 
  id, 
  'Deluxe Double City View', 
  'King Bed', 
  45, 
  2, 
  3500.00, 
  '["https://example.com/room1.jpg", "https://example.com/room2.jpg"]'
FROM hotels WHERE name = 'Grand City Hotel';
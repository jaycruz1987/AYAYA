-- 开启 UUID 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 自动更新 updated_at 函数
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';

-- ==========================================
-- A. 用户与权限域
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    nickname VARCHAR(50),
    avatar_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER trigger_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trigger_admin_users_modtime BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    label VARCHAR(50),
    contact_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    township VARCHAR(100),
    landmark VARCHAR(255),
    building_name VARCHAR(255),
    floor VARCHAR(20),
    room_no VARCHAR(50),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uidx_user_addresses_default ON user_addresses(user_id) WHERE is_default = true AND deleted_at IS NULL;
CREATE TRIGGER trigger_user_addresses_modtime BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- B. 餐饮商家域 (Food)
-- ==========================================
CREATE TABLE merchant_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER trigger_merchant_categories_modtime BEFORE UPDATE ON merchant_categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES merchant_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    cover_image_url VARCHAR(255),
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    
    -- 彻底统一的地址模型
    address_line VARCHAR(255),
    city VARCHAR(100),
    township VARCHAR(100),
    landmark VARCHAR(255),
    building_name VARCHAR(255), 
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    
    service_mode VARCHAR(20) DEFAULT 'DELIVERY',
    minimum_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    delivery_radius_km NUMERIC(5, 2),
    operating_status VARCHAR(20) DEFAULT 'OPEN',
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER trigger_merchants_modtime BEFORE UPDATE ON merchants FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    name VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uidx_product_cat_name ON product_categories(merchant_id, name) WHERE deleted_at IS NULL;
CREATE TRIGGER trigger_product_categories_modtime BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    category_id UUID NOT NULL REFERENCES product_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT -1,
    status VARCHAR(20) DEFAULT 'ON_SHELF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON COLUMN products.stock IS 'Business Rule: -1 means unlimited stock';
COMMENT ON COLUMN products.price IS 'Currency: Single currency strategy applied platform-wide for MVP';
CREATE UNIQUE INDEX uidx_product_name ON products(merchant_id, name) WHERE deleted_at IS NULL;
CREATE TRIGGER trigger_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- C. 酒店域 (Stay)
-- ==========================================
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    star_rating INT CHECK (star_rating >= 1 AND star_rating <= 5),
    description TEXT,
    cover_image_url VARCHAR(255),
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    township VARCHAR(100),
    landmark VARCHAR(255),
    building_name VARCHAR(255),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    
    check_in_time VARCHAR(10),
    check_out_time VARCHAR(10),
    facilities JSONB,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON COLUMN hotels.facilities IS 'Format constraint: Simple string array like ["wifi", "pool"]';
CREATE TRIGGER trigger_hotels_modtime BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255), 
    image_urls JSONB, -- 格式约定: ["url1", "url2"] 纯字符串数组
    bed_type VARCHAR(50),
    room_size_sqm INT,
    max_occupancy INT DEFAULT 2,
    base_price NUMERIC(10, 2) NOT NULL,
    sort_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX uidx_room_type_name ON room_types(hotel_id, name) WHERE deleted_at IS NULL;
CREATE TRIGGER trigger_room_types_modtime BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- D. 交易域 (Orders)
-- ==========================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    
    order_type VARCHAR(20) NOT NULL DEFAULT 'DELIVERY',
    total_amount NUMERIC(10, 2) NOT NULL,
    
    order_status VARCHAR(20) DEFAULT 'PENDING',
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    fulfillment_status VARCHAR(20) DEFAULT 'PENDING',
    
    payment_method VARCHAR(50),
    delivery_address_snapshot JSONB,
    remarks TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON COLUMN orders.total_amount IS 'Currency: Single currency strategy applied platform-wide';
COMMENT ON COLUMN orders.delivery_address_snapshot IS 'Schema fixed at API layer: contact_name, phone, address_line, city, township, etc.';
CREATE TRIGGER trigger_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(100) NOT NULL, 
    unit_price NUMERIC(10, 2) NOT NULL, 
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- E. 服务与请求域 (CRM 闭环，无 deleted_at)
-- ==========================================
CREATE TABLE partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL,
    request_channel VARCHAR(50),
    submitted_by_type VARCHAR(20),
    city VARCHAR(100),
    company_name VARCHAR(100),
    contact_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    details JSONB,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PROCESSING, RESOLVED, CLOSED
    assigned_admin_user_id UUID REFERENCES admin_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    resolution_result TEXT, 
    admin_notes TEXT,       
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trigger_partner_applications_modtime BEFORE UPDATE ON partner_applications FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_no VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL,
    request_channel VARCHAR(50),
    submitted_by_type VARCHAR(20),
    user_id UUID REFERENCES users(id),
    city VARCHAR(100), 
    priority VARCHAR(20) DEFAULT 'NORMAL', 
    
    hotel_id UUID REFERENCES hotels(id),
    room_type_id UUID REFERENCES room_types(id),
    
    contact_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    request_data JSONB NOT NULL, 
    
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PROCESSING, RESOLVED, CLOSED
    assigned_admin_user_id UUID REFERENCES admin_users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trigger_service_requests_modtime BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- F. 内容域 (Content)
-- ==========================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100),
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    position VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER trigger_banners_modtime BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- 高频查询局部索引 (Partial Indexes)
-- ==========================================
CREATE INDEX idx_products_active ON products(merchant_id) WHERE deleted_at IS NULL AND status = 'ON_SHELF';
CREATE INDEX idx_merchants_active ON merchants(category_id) WHERE deleted_at IS NULL AND status = 'ACTIVE';
CREATE INDEX idx_hotels_active ON hotels(city) WHERE deleted_at IS NULL AND status = 'ACTIVE';
CREATE INDEX idx_orders_not_deleted ON orders(user_id) WHERE deleted_at IS NULL;
-- CRM 索引 (无 deleted_at)
CREATE INDEX idx_svc_req_status ON service_requests(status, city);

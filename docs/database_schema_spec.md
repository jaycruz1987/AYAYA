# Citylink Phase 1 - Database Schema Specification

## 1. Overview
This document outlines the database schema for Citylink Phase 1 (MVP). The system is built around a "Food + Stay" dual-core model, prioritizing a lightweight CRM loop, a unified geolocation model, and a single-currency strategy.

### Core Design Principles
- **Unified Geolocation Model**: `user_addresses`, `merchants`, and `hotels` share an identical address hierarchy (City -> Township -> Address Line -> Building -> Landmark).
- **No-Delete Policy for CRM**: `service_requests` and `partner_applications` do not use `deleted_at`. They are managed via `status`, `processed_at`, and `closed_at`.
- **Soft Delete for Business Entities**: Core entities (`users`, `merchants`, `products`, `orders`, `hotels`) use `deleted_at` to preserve history.
- **Single Currency Strategy**: All `NUMERIC(10,2)` fields imply a single, system-wide currency (e.g., THB).
- **Explicit Conventions**:
  - `stock = -1` means unlimited stock.
  - `hotels.facilities` uses a flat string array: `["wifi", "pool"]`.
  - `room_types.image_urls` uses a flat string array: `["url1", "url2"]`.

## 2. Core Entities

### A. Users & Permissions
- `users`: Standard B2C users (soft delete).
- `admin_users`: Internal admin accounts (no soft delete).
- `user_addresses`: User delivery/contact addresses (soft delete).

### B. Food Domain (Merchants)
- `merchant_categories`: Global categories (soft delete).
- `merchants`: Core merchant data (soft delete).
- `product_categories`: Merchant-specific categories (soft delete).
- `products`: Merchant items/dishes (soft delete).

### C. Stay Domain (Hotels)
- `hotels`: Core hotel data (soft delete).
- `room_types`: Hotel room offerings (soft delete).

### D. Orders Domain
- `orders`: Core transaction table with unified default states (soft delete).
- `order_items`: Snapshot of purchased items.

### E. CRM Domain (Requests & Applications)
- `partner_applications`: B2B onboarding requests (no soft delete).
- `service_requests`: B2C service requests (no soft delete).

### F. Content Domain
- `banners`: Homepage/Category banners (soft delete).

## 3. Key Data Contracts

### 3.1 Order Default States
When a new order is created, regardless of `order_type` (DELIVERY, PICKUP, DINE_IN) or payment method (Online, COD), the default state MUST be:
- `order_status = 'PENDING'`
- `payment_status = 'UNPAID'`
- `fulfillment_status = 'PENDING'`

### 3.2 CRM Status Enum
Both `service_requests` and `partner_applications` share this enum:
- `PENDING`
- `PROCESSING`
- `RESOLVED`
- `CLOSED`

### 3.3 Delivery Address Snapshot (API Schema)
The `orders.delivery_address_snapshot` JSONB field must adhere to this structure:
```json
{
  "contact_name": "string",
  "contact_phone": "string",
  "address_line": "string",
  "city": "string",
  "township": "string",
  "landmark": "string",
  "building_name": "string",
  "floor": "string",
  "room_no": "string",
  "latitude": "number",
  "longitude": "number"
}
```

### 3.4 Soft Delete vs. Visibility
- `deleted_at`: Used for data archival/deletion.
- `is_active` / `status = 'ACTIVE'`: Used to toggle frontend visibility without removing the data.

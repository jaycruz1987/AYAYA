# Citylink API Contract (Core Flows)

## 1. Orders API

### `POST /api/v1/orders`
Creates a new order.

**Request Body:**
```json
{
  "merchantId": "uuid",
  "orderType": "DELIVERY", // DELIVERY, PICKUP, DINE_IN
  "paymentMethod": "ONLINE",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "contactName": "John Doe",
    "contactPhone": "1234567890",
    "addressLine": "123 Main St",
    "city": "Bangkok",
    "township": "Watthana",
    "latitude": 13.7563,
    "longitude": 100.5018
  },
  "remarks": "No spicy please"
}
```

**Contract Rules:**
1. The backend MUST calculate `totalAmount` based on the database price of `productId`. Do not trust any total amount passed from the frontend.
2. If `orderType == 'DELIVERY'`, `deliveryAddress` is REQUIRED and must be validated against the schema.
3. The backend MUST set initial states explicitly:
   - `orderStatus = 'PENDING'`
   - `paymentStatus = 'UNPAID'`
   - `fulfillmentStatus = 'PENDING'`

---

## 2. CRM API (Service Requests)

### `POST /api/v1/service-requests`
Creates a new service request (e.g., Hotel Booking).

**Request Body:**
```json
{
  "type": "HOTEL_BOOKING",
  "hotelId": "uuid",
  "roomTypeId": "uuid",
  "contactName": "Alice Smith",
  "contactPhone": "+123456789",
  "city": "Bangkok",
  "requestData": {
    "checkInDate": "2024-12-01",
    "checkOutDate": "2024-12-05",
    "numberOfGuests": 2,
    "specialRequests": "High floor preferred"
  }
}
```

**Contract Rules:**
1. Initial `status` MUST be `PENDING`.
2. `requestData` MUST be stored as a JSONB object.
3. No `deletedAt` logic should be exposed for this endpoint.

---

## 3. Merchants API

### `GET /api/v1/merchants`
Fetches a list of active merchants.

**Query Parameters:**
- `categoryId` (optional)
- `city` (optional)
- `page` / `limit` (optional)

**Contract Rules:**
1. The API MUST apply a soft-delete filter automatically: `WHERE deleted_at IS NULL AND status = 'ACTIVE'`.
2. If `city` is provided, it must match the `city` field in the `merchants` table.
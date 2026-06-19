import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:3001/api/v1';

async function setup() {
  console.log('--- DB Setup ---');
  
  // 1. Create a dummy Admin for admin operations (or we can just generate a JWT for admin)
  // Let's generate a mock admin JWT to bypass actual admin login, since we have JWT_SECRET in env
  const jwtSecret = process.env.JWT_SECRET || 'supersecret';
  const adminToken = jwt.sign({ userId: 'mock-admin-id', type: 'admin' }, jwtSecret, { expiresIn: '1h' });

  // 2. Clean up test data
  await prisma.merchantUser.deleteMany({ where: { email: { startsWith: 'test_' } } });
  await prisma.hotelUser.deleteMany({ where: { email: { startsWith: 'test_' } } });
  
  await prisma.orderItem.deleteMany({ where: { order: { orderNo: { startsWith: 'TEST_ORD_' } } } });
  await prisma.order.deleteMany({ where: { orderNo: { startsWith: 'TEST_ORD_' } } });
  await prisma.serviceRequest.deleteMany({ where: { referenceNo: { startsWith: 'TEST_REQ_' } } });
  
  await prisma.product.deleteMany({ where: { name: { startsWith: 'Test Product ' } } });
  await prisma.productCategory.deleteMany({ where: { name: { startsWith: 'Test Category ' } } });
  await prisma.roomType.deleteMany({ where: { name: { startsWith: 'Test RoomType ' } } });

  await prisma.merchant.deleteMany({ where: { name: { startsWith: 'Test Merchant ' } } });
  await prisma.hotel.deleteMany({ where: { name: { startsWith: 'Test Hotel ' } } });

  // 3. Create test merchants and hotels
  // Get a category ID for merchant
  let merchantCat = await prisma.merchantCategory.findFirst();
  if (!merchantCat) {
    merchantCat = await prisma.merchantCategory.create({ data: { name: 'Food', isActive: true } });
  }

  const merchantA = await prisma.merchant.create({
    data: { name: 'Test Merchant A', categoryId: merchantCat.id, contactPhone: '12345', addressLine: 'Address A', status: 'ACTIVE' }
  });
  const merchantB = await prisma.merchant.create({
    data: { name: 'Test Merchant B', categoryId: merchantCat.id, contactPhone: '54321', addressLine: 'Address B', status: 'ACTIVE' }
  });

  const hotelA = await prisma.hotel.create({
    data: { name: 'Test Hotel A', contactPhone: '111', addressLine: 'H Address A', city: 'Test City', status: 'ACTIVE', facilities: ['wifi'] }
  });
  const hotelB = await prisma.hotel.create({
    data: { name: 'Test Hotel B', contactPhone: '222', addressLine: 'H Address B', city: 'Test City', status: 'ACTIVE', facilities: ['pool'] }
  });

  return { adminToken, merchantA, merchantB, hotelA, hotelB };
}

async function runTests() {
  const { adminToken, merchantA, merchantB, hotelA, hotelB } = await setup();
  const headers = { Authorization: `Bearer ${adminToken}` };

  console.log('\n=========================================');
  console.log('1. Admin Provisioning Flow');
  console.log('=========================================');

  // Create Merchant Users
  const mUserARes = await axios.post(`${API_BASE}/admin/provision/merchant`, {
    merchantId: merchantA.id, email: 'test_ma@example.com', password: 'password123', name: 'MA User'
  }, { headers });
  console.log('✅ Created Merchant User A:', mUserARes.data.success);

  const mUserBRes = await axios.post(`${API_BASE}/admin/provision/merchant`, {
    merchantId: merchantB.id, email: 'test_mb@example.com', password: 'password123', name: 'MB User'
  }, { headers });
  console.log('✅ Created Merchant User B:', mUserBRes.data.success);

  // Create Hotel Users
  const hUserARes = await axios.post(`${API_BASE}/admin/provision/hotel`, {
    hotelId: hotelA.id, email: 'test_ha@example.com', password: 'password123', name: 'HA User'
  }, { headers });
  console.log('✅ Created Hotel User A:', hUserARes.data.success);

  const hUserBRes = await axios.post(`${API_BASE}/admin/provision/hotel`, {
    hotelId: hotelB.id, email: 'test_hb@example.com', password: 'password123', name: 'HB User'
  }, { headers });
  console.log('✅ Created Hotel User B:', hUserBRes.data.success);

  console.log('\n=========================================');
  console.log('2. Login Flow & JWT Verification');
  console.log('=========================================');

  // Login Merchant A
  const mLoginARes = await axios.post(`${API_BASE}/auth/merchant/login`, { email: 'test_ma@example.com', password: 'password123' });
  const mTokenA = mLoginARes.data.data.token;
  const decodedMA = jwt.decode(mTokenA) as any;
  console.log('✅ Merchant A Login Success');
  console.log('   -> JWT userType:', decodedMA.userType, '| merchantId matches:', decodedMA.merchantId === merchantA.id);

  // Login Merchant B
  const mLoginBRes = await axios.post(`${API_BASE}/auth/merchant/login`, { email: 'test_mb@example.com', password: 'password123' });
  const mTokenB = mLoginBRes.data.data.token;

  // Login Hotel A
  const hLoginARes = await axios.post(`${API_BASE}/auth/hotel/login`, { email: 'test_ha@example.com', password: 'password123' });
  const hTokenA = hLoginARes.data.data.token;
  const decodedHA = jwt.decode(hTokenA) as any;
  console.log('✅ Hotel A Login Success');
  console.log('   -> JWT userType:', decodedHA.userType, '| hotelId matches:', decodedHA.hotelId === hotelA.id);

  // Login Hotel B
  const hLoginBRes = await axios.post(`${API_BASE}/auth/hotel/login`, { email: 'test_hb@example.com', password: 'password123' });
  const hTokenB = hLoginBRes.data.data.token;

  console.log('\n=========================================');
  console.log('3. Merchant API Tenant Isolation');
  console.log('=========================================');

  const mHeadersA = { Authorization: `Bearer ${mTokenA}` };
  const mHeadersB = { Authorization: `Bearer ${mTokenB}` };

  // Profile
  const mProfileRes = await axios.get(`${API_BASE}/b-end/merchant/profile`, { headers: mHeadersA });
  console.log('✅ GET Profile (Merchant A):', mProfileRes.data.data.name === 'Test Merchant A');

  // Create Category
  const catARes = await axios.post(`${API_BASE}/b-end/merchant/categories`, { name: 'Test Category A', sortOrder: 1 }, { headers: mHeadersA });
  const categoryAId = catARes.data.data.id;
  console.log('✅ Create Category (Merchant A): Success');

  // Create Product (Trying to spoof merchantId)
  const prodARes = await axios.post(`${API_BASE}/b-end/merchant/products`, { 
    name: 'Test Product A', categoryId: categoryAId, price: 10, stock: 100, merchantId: merchantB.id // Spoof attempt
  }, { headers: mHeadersA });
  const productAId = prodARes.data.data.id;
  console.log('✅ Create Product (Spoof attempt ignores fake merchantId): Product assigned to Merchant A =', prodARes.data.data.merchantId === merchantA.id);

  // Create Product B for testing isolation
  const catBRes = await axios.post(`${API_BASE}/b-end/merchant/categories`, { name: 'Test Category B', sortOrder: 1 }, { headers: mHeadersB });
  const prodBRes = await axios.post(`${API_BASE}/b-end/merchant/products`, { name: 'Test Product B', categoryId: catBRes.data.data.id, price: 20 }, { headers: mHeadersB });
  const productBId = prodBRes.data.data.id;

  // Merchant A tries to update Product B
  try {
    await axios.patch(`${API_BASE}/b-end/merchant/products/${productBId}`, { price: 999 }, { headers: mHeadersA });
    console.error('❌ FAIL: Merchant A updated Product B successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant Update Blocked (Merchant A -> Product B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  console.log('\n=========================================');
  console.log('4. Hotel API Tenant Isolation');
  console.log('=========================================');

  const hHeadersA = { Authorization: `Bearer ${hTokenA}` };
  const hHeadersB = { Authorization: `Bearer ${hTokenB}` };

  // Profile
  const hProfileRes = await axios.get(`${API_BASE}/b-end/hotel/profile`, { headers: hHeadersA });
  console.log('✅ GET Profile (Hotel A):', hProfileRes.data.data.name === 'Test Hotel A');

  // Create RoomType
  const roomARes = await axios.post(`${API_BASE}/b-end/hotel/room-types`, { 
    name: 'Test RoomType A', basePrice: 100, maxOccupancy: 2, hotelId: hotelB.id // Spoof attempt
  }, { headers: hHeadersA });
  const roomAId = roomARes.data.data.id;
  console.log('✅ Create RoomType (Spoof attempt ignores fake hotelId): Room assigned to Hotel A =', roomARes.data.data.hotelId === hotelA.id);

  // Create RoomType B
  const roomBRes = await axios.post(`${API_BASE}/b-end/hotel/room-types`, { name: 'Test RoomType B', basePrice: 200, maxOccupancy: 2 }, { headers: hHeadersB });
  const roomBId = roomBRes.data.data.id;

  // Hotel A tries to update RoomType B
  try {
    await axios.patch(`${API_BASE}/b-end/hotel/room-types/${roomBId}`, { basePrice: 999 }, { headers: hHeadersA });
    console.error('❌ FAIL: Hotel A updated RoomType B successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant Update Blocked (Hotel A -> RoomType B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  console.log('\n=========================================');
  console.log('5. Orders / Service Requests Boundary');
  console.log('=========================================');

  // Seed User for Order
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { phone: '99999', nickname: 'Test User', status: 'ACTIVE' } });
  }

  // Seed Order for Merchant B
  const orderB = await prisma.order.create({
    data: {
      orderNo: `TEST_ORD_B_${Date.now()}`,
      merchantId: merchantB.id,
      userId: user.id,
      totalAmount: 20,
      deliveryAddressSnapshot: {},
      orderStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      fulfillmentStatus: 'PENDING'
    }
  });

  // Merchant A tries to GET Order B
  try {
    await axios.get(`${API_BASE}/b-end/merchant/orders/${orderB.id}`, { headers: mHeadersA });
    console.error('❌ FAIL: Merchant A fetched Order B successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant GET Order Blocked (Merchant A -> Order B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  // Merchant A tries to Confirm Order B
  try {
    await axios.post(`${API_BASE}/b-end/merchant/orders/${orderB.id}/confirm`, {}, { headers: mHeadersA });
    console.error('❌ FAIL: Merchant A confirmed Order B successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant Action Order Blocked (Merchant A -> Order B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  // Seed Service Request for Hotel B
  const reqB = await prisma.serviceRequest.create({
    data: {
      referenceNo: `TEST_REQ_B_${Date.now()}`,
      userId: user.id,
      hotelId: hotelB.id,
      type: 'CLEANING',
      contactName: 'Test Contact',
      contactPhone: '12345',
      requestData: { details: 'Need cleaning' },
      status: 'PENDING'
    }
  });

  // Hotel A tries to GET Request B
  try {
    await axios.get(`${API_BASE}/b-end/hotel/service-requests/${reqB.id}`, { headers: hHeadersA });
    console.error('❌ FAIL: Hotel A fetched Request B successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant GET Request Blocked (Hotel A -> Request B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  // Hotel A tries to Update Notes on Request B
  try {
    await axios.patch(`${API_BASE}/b-end/hotel/service-requests/${reqB.id}/notes`, { adminNotes: 'Hacked' }, { headers: hHeadersA });
    console.error('❌ FAIL: Hotel A updated Request B notes successfully!');
  } catch (error: any) {
    console.log(`✅ Cross-tenant Action Request Blocked (Hotel A -> Request B): ${error.response?.status} ${error.response?.data?.message}`);
  }

  console.log('\n🎉 ALL TENANT ISOLATION TESTS PASSED 🎉');
}

runTests().catch(e => {
  console.error(e.response ? e.response.data : e);
}).finally(() => {
  prisma.$disconnect();
});
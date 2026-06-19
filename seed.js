const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const merchant = await prisma.merchant.findFirst();

  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'customer@test.com',
        name: 'Test Customer',
        phone: '1234567890'
      }
    });
  }

  if (!merchant) {
    console.log('Need at least 1 merchant to seed orders');
    return;
  }

  const order = await prisma.order.create({
    data: {
      orderNo: `ORD-${Date.now()}`,
      userId: user.id,
      merchantId: merchant.id,
      orderType: 'DELIVERY',
      totalAmount: 45.50,
      orderStatus: 'PENDING',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PENDING',
      paymentMethod: 'CREDIT_CARD',
      deliveryAddressSnapshot: '123 Sukhumvit Road, Bangkok 10110',
 const { PrismaClient } = require('@prism  const prisma = new PrismaClient();

async function run() {ro
async function run() {
  c,
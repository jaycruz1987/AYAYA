const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst();
  const merchant = await prisma.merchant.findFirst();

  if (!user || !merchant) {
    console.log('Need at least 1 user and 1 merchant to seed orders');
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
      items: {
        create: [
          {
            productId: 'dummy-prod-1',
            productName: 'Pad Thai',
            quantity: 2,
            unitPrice: 15.00,
            totalPrice: 30.00
          }
        ]
      }
    }
  });

  console.log('Created order:', order.orderNo);
}

run().catch(console.error).finally(() => prisma.$disconnect());


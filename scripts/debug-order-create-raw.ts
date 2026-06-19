import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const merchant = await prisma.merchant.findFirst();
  const product = await prisma.product.findFirst({ where: { merchantId: merchant?.id } });
  const user = await prisma.user.findFirst();

  if (!merchant || !product || !user) return;

  console.log(`Testing RAW order creation with Merchant: ${merchant.name}, Product: ${product.name}`);

  try {
    const newOrder = await prisma.order.create({
      data: {
        orderNo: `TEST-${Date.now()}`,
        userId: user.id,
        merchantId: merchant.id,
        orderStatus: 'PENDING',
        totalAmount: 10.00,
        deliveryAddressSnapshot: {
          contact_name: "test",
          contact_phone: "123",
          address_line: "test addr",
          city: "yangon",
          building_name: "test building",
          floor: "1",
          room_no: "101"
        },
        orderItems: {
          create: [{
            productId: product.id,
            quantity: 1,
            priceAtTime: 10.00
          }]
        }
      }
    });
    console.log('Order created successfully:', newOrder.id);
  } catch (e) {
    console.error('RAW Prisma Error:', e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
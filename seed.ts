import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  const merchant = await prisma.merchant.findFirst();
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: "customer@test.com", nickname: "Test Customer", phone: "1234567890" }
    });
  }

  if (!merchant) return;

  await prisma.order.create({
    data: {
      orderNo: `ORD-${Date.now()}`,
      userId: user.id,
      merchantId: merchant.id,
      orderType: "DELIVERY",
      totalAmount: 45.50,
      orderStatus: "PENDING",
      paymentStatus: "PAID",
      fulfillmentStatus: "PENDING",
      paymentMethod: "CREDIT_CARD",
      deliveryAddressSnapshot: "123 Sukhumvit Road, Bangkok 10110",
      orderItems: {
        create: [
          { productName: "Pad Thai", quantity: 2, unitPrice: 15.00, totalPrice: 30.00 }
        ]
      }
    }
  });
  console.log("Seeded order successfully");
}

run().catch(console.error).finally(() => prisma.$disconnect());

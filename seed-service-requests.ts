import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  const hotel = await prisma.hotel.findFirst();
  const roomType = await prisma.roomType.findFirst();
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: { email: "customer2@test.com", nickname: "Alice", phone: "0987654321" }
    });
  }

  await prisma.serviceRequest.create({
    data: {
      referenceNo: `REQ-${Date.now()}`,
      type: "HOTEL_BOOKING",
      userId: user.id,
      city: "Bangkok",
      priority: "HIGH",
      hotelId: hotel?.id || null,
      roomTypeId: roomType?.id || null,
      contactName: "Alice Wonderland",
      contactPhone: "0987654321",
      requestData: {
        checkInDate: "2024-12-24",
        checkOutDate: "2024-12-28",
        guests: 2,
        specialRequirements: "Needs a late check-in around 11 PM and an extra bed if possible."
      },
      status: "PENDING"
    }
  });

  await prisma.serviceRequest.create({
    data: {
      referenceNo: `REQ-${Date.now() + 1000}`,
      type: "CUSTOM_ITINERARY",
      userId: user.id,
      city: "Phuket",
      priority: "NORMAL",
      contactName: "Bob Builder",
      contactPhone: "1122334455",
      requestData: {
        travelDates: "2025-01-10 to 2025-01-15",
        budget: "2000 USD",
        preferences: "Beachfront, water sports, and local seafood."
      },
      status: "PENDING"
    }
  });

  console.log("Seeded service requests successfully");
}

run().catch(console.error).finally(() => prisma.$disconnect());
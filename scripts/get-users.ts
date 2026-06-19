import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, phone: true }
  });
  console.log('--- C-End Users ---');
  console.table(users);
  
  const merchants = await prisma.merchantUser.findMany({
    select: { id: true, email: true, merchant: { select: { name: true } } }
  });
  console.log('\n--- Merchant Users ---');
  console.table(merchants.map(m => ({ id: m.id, email: m.email, merchant: m.merchant.name })));
  
  const hotels = await prisma.hotelUser.findMany({
    select: { id: true, email: true, hotel: { select: { name: true } } }
  });
  console.log('\n--- Hotel Users ---');
  console.table(hotels.map(h => ({ id: h.id, email: h.email, hotel: h.hotel.name })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
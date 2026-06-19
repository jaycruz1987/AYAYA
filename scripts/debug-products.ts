import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      merchant: { select: { name: true } }
    }
  });
  
  console.log(`Found ${products.length} products total.`);
  for (const p of products) {
    console.log(`- ${p.name} (${p.merchant.name}) - Status: ${p.status}, Deleted: ${p.deletedAt}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

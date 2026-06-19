import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const merchantId = "1e8a9032-bd57-4ad3-85d7-23cd929f0146";
  
  const products = await prisma.product.findMany({
    where: {
      merchantId: merchantId
    }
  });

  console.log(`Found ${products.length} products for merchant ${merchantId}.`);
  for (const p of products) {
    console.log(`- ID: ${p.id}, Name: ${p.name}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

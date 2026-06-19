import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const merchantId = "1e8a9032-bd57-4ad3-85d7-23cd929f0146";
  const productIds = ["e05b9b7e-cd07-424a-9860-24707010f37b"];
  
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      merchantId: merchantId
    }
  });

  console.log(`Found ${products.length} products out of ${productIds.length} requested.`);
  
  const actualProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds }
    },
    include: {
      merchant: { select: { id: true, name: true } }
    }
  });
  
  console.log("Actual product details:", JSON.stringify(actualProducts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

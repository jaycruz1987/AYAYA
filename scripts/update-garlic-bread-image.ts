import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Garlic Bread image...');

  // Update specifically the Garlic Bread product
  const result = await prisma.product.updateMany({
    where: {
      name: 'Garlic Bread'
    },
    data: {
      // Use a proper garlic bread image from Unsplash
      imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80'
    }
  });

  console.log(`Updated ${result.count} Garlic Bread records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

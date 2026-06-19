import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating potentially mismatched images...');

  const updates = [
    // Real garlic bread image instead of the random person
    { name: 'Garlic Bread', url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80' },
    // Make sure BBQ Wings are wings
    { name: 'BBQ Chicken Wings (6pcs)', url: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80' },
    // Ensure pizzas look like pizzas
    { name: 'Hawaiian Pizza (Medium)', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
    { name: 'Pepperoni Pizza (Large)', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
    // Ensure soups and teas look correct
    { name: 'Miso Soup', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
    { name: 'Green Tea', url: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&q=80' },
    // Ensure Asian foods are correct
    { name: 'Shan Noodles', url: 'https://images.unsplash.com/photo-1552611052-3ba9d737a563?w=500&q=80' },
    { name: 'Pork Dumplings', url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&q=80' },
    { name: 'Shan Papaya Salad', url: 'https://images.unsplash.com/photo-1512621843614-b3e189922864?w=500&q=80' },
    { name: 'Tofu Nwe', url: 'https://images.unsplash.com/photo-1548943487-a2e4b43b485f?w=500&q=80' }
  ];

  for (const update of updates) {
    const result = await prisma.product.updateMany({
      where: { name: update.name },
      data: { imageUrl: update.url }
    });
    console.log(`Updated ${result.count} records for ${update.name}`);
  }

}

main().catch(console.error).finally(() => prisma.$disconnect());
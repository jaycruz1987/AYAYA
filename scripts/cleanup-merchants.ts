import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');

  // 1. First find all duplicate merchants by name and keep the latest one
  const allMerchants = await prisma.merchant.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const seenNames = new Set();
  let deletedCount = 0;

  for (const m of allMerchants) {
    // Condition to delete:
    // 1. It's a duplicate name (we already saw a newer one)
    // 2. OR it has no cover image
    // 3. OR it has 0 products
    if (seenNames.has(m.name) || !m.coverImageUrl || m._count.products === 0) {
      console.log(`Deleting ${m.name} (Duplicate: ${seenNames.has(m.name)}, No Image: ${!m.coverImageUrl}, Products: ${m._count.products})`);
      
      // Delete associated data first
      await prisma.product.deleteMany({ where: { merchantId: m.id } });
      await prisma.productCategory.deleteMany({ where: { merchantId: m.id } });
      
      // Check if it has orders before deleting user/merchant
      const orderCount = await prisma.order.count({ where: { merchantId: m.id } });
      if (orderCount === 0) {
        await prisma.merchantUser.deleteMany({ where: { merchantId: m.id } });
        await prisma.merchant.delete({ where: { id: m.id } });
        deletedCount++;
      } else {
        console.log(`  Skipping deletion of ${m.name} because it has existing orders.`);
      }
    } else {
      // Keep this one
      seenNames.add(m.name);
    }
  }
  
  console.log(`\nDeleted ${deletedCount} unwanted merchants.`);
  
  // Verify what's left
  const finalMerchants = await prisma.merchant.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
  
  console.log('\nFinal active merchants:');
  for (const m of finalMerchants) {
    console.log(`- ${m.name}: ${m._count.products} products`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
import { prisma } from '../config/database';

async function validateSeedData() {
  console.log('🔍 Validating seed data consistency...');
  try {
    // 1. Check Admin User
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0) {
      console.warn('⚠️ No Admin User found. CRM flows will not work properly.');
    } else {
      console.log(`✅ Admin Users found: ${adminCount}`);
    }

    // 2. Check Merchants
    const merchantCount = await prisma.merchant.count();
    if (merchantCount === 0) {
      console.warn('⚠️ No Merchants found. Order flows cannot be tested.');
    } else {
      console.log(`✅ Merchants found: ${merchantCount}`);
    }

    // 3. Check Hotels
    const hotelCount = await prisma.hotel.count();
    if (hotelCount === 0) {
      console.warn('⚠️ No Hotels found. Booking flows cannot be tested.');
    } else {
      console.log(`✅ Hotels found: ${hotelCount}`);
    }

    console.log('🎉 Seed data validation completed.');
  } catch (error) {
    console.error('❌ Error validating seed data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateSeedData();
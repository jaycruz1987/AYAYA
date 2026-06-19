import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create or update a C-End User
  const user = await prisma.user.upsert({
    where: { phone: '99999' },
    update: {
      password_hash: hashedPassword,
      nickname: 'Test Client',
      email: 'client@example.com',
      status: 'ACTIVE'
    },
    create: {
      phone: '99999',
      email: 'client@example.com',
      password_hash: hashedPassword,
      nickname: 'Test Client',
      status: 'ACTIVE'
    }
  });

  console.log('Updated C-End User:', user.phone, 'password123');

  // Let's also make sure Merchant and Hotel users have password123
  await prisma.merchantUser.updateMany({
    data: { passwordHash: hashedPassword }
  });
  console.log('Updated all Merchant Users to use password: password123');

  await prisma.hotelUser.updateMany({
    data: { passwordHash: hashedPassword }
  });
  console.log('Updated all Hotel Users to use password: password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
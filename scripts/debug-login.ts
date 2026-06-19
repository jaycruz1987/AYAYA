import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { phone: '99999' }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User found:', user.id, user.phone, user.email, user.status);
  
  const isMatch = await bcrypt.compare('password123', user.password_hash || '');
  console.log('Password match:', isMatch);
}

main().catch(console.error).finally(() => prisma.$disconnect());

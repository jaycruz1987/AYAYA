const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function run() {
  const email = 'super@citylink.com';
  const password = 'password123';
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password_hash: passwordHash, // use snake_case as required by Prisma error
      status: 'ACTIVE',
      role: 'SUPER_ADMIN'
    },
    create: {
      email,
      name: 'Ultimate Admin',
      password_hash: passwordHash, // use snake_case
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  });

  console.log(`Successfully created/updated admin: ${user.email}`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

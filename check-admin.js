const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.adminUser.findMany();
  console.log("Existing admin users:");
  console.log(users.map(u => ({ id: u.id, email: u.email, role: u.role, status: u.status })));
  
  if (users.length === 0) {
    console.log("No admins found! Creating a default one...");
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const newAdmin = await prisma.adminUser.create({
      data: {
        email: 'admin2@citylink.com',
        passwordHash: hashedPassword,
        name: 'Super Admin',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log("Created:", newAdmin.email);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());

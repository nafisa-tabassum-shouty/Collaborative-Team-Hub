const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  const users = await prisma.user.findMany({ take: 5 });
  console.log(users.map(u => u.email));
  process.exit(0);
}

listUsers();

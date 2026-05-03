const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { email: "anisahmed@gmail.com" },
        { name: "anisahmed" }
      ]
    }
  });
  console.log(JSON.stringify(user, null, 2));
  process.exit(0);
}

checkUser();

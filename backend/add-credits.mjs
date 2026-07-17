import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addCredits() {
  const result = await prisma.user.updateMany({
    data: {
      credits: 9999
    }
  });
  console.log(`Updated ${result.count} users to have 9999 credits.`);
  await prisma.$disconnect();
}

addCredits().catch(console.error);

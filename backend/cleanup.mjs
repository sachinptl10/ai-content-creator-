import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanOldEntries() {
  const deleted = await prisma.calendarEntry.deleteMany({
    where: { title: 'Mock Title' }
  });
  console.log(`Deleted ${deleted.count} old "Mock Title" entries`);
  
  const remaining = await prisma.calendarEntry.count();
  console.log(`Remaining calendar entries: ${remaining}`);
  
  await prisma.$disconnect();
}

cleanOldEntries().catch(console.error);

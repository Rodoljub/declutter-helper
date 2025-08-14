// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123', // temp password
    },
  });

  await prisma.item.createMany({
    data: [
      { name: 'Old Drill', category: 'Tool', userId: user.id },
      { name: 'Vintage Camera', category: 'Electronics', userId: user.id },
    ],
  });

  console.log('Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

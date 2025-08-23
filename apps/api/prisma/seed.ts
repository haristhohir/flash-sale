// import { prisma } from '../src/app/lib/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Seeding database...');
  await prisma.user.create({
    data: {
      name: 'Haris Thohir',
      email: 'haris@thohir.com',
      password: '$2a$12$rWEfXetcl12mSXWPPBgqdeCb60ABfYg.oyqzKy.RStIrqFuYhBP1O', // "secure"
    }
  });
  console.log('✅ Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

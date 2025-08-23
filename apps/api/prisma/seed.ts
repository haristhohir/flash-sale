import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('password', 12);
  await prisma.user.create({
    data: {
      name: 'Haris Thohir',
      email: 'haris@thohir.com',
      password: passwordHash,
    }
  });

  // create fake users
  const fakeUserToCreate = 10000;

  const users: any[] = [];
  for (let i = 0; i < fakeUserToCreate; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });


  const product = await prisma.product.create({
    data: {
      name: 'Darksaber',
      description: 'The Darksaber was an ancient black-bladed lightsaber. It had a unique blade that was shorter than that of most lightsabers, and shaped like a traditional sword.',
      image: 'https://static.wikia.nocookie.net/starwars/images/0/0a/Darksaber-SW100Objects.png',
      price: 10000,
    }
  });

  const now = new Date();
  const next10Minutes = new Date(now.getTime() + 10 * 60 * 1000);
  const next15Minutes = new Date(now.getTime() + 15 * 60 * 1000);


  await prisma.flashSale.create({
    data: {
      productId: product.id,
      discount: 9500,
      startAt: next10Minutes.toISOString(),
      endAt: next15Minutes.toISOString(),
      quota: 10,
    }
  });

  console.log('✅ Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

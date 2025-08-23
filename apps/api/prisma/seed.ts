import { prisma } from '../src/app/lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      name: "Anakin Skywalker"
    },
  });
  console.log('✅ Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

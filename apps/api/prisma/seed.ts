import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Seed Companies & Plants
  const company = await prisma.company.upsert({
    where: { id: '1000' },
    update: {},
    create: {
      id: '1000',
      name: 'Meridian Manufacturing - Maharashtra',
      country: 'IN',
      plants: {
        create: [
          { id: '1001', name: 'Pune HQ Plant', state: 'MH' },
          { id: '1002', name: 'Nashik Plant', state: 'MH' },
        ],
      },
    },
  });
  console.log(`✅ Upserted Company: ${company.name}`);

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('Meridian@2026', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@meridian.com' },
    update: {},
    create: {
      email: 'admin@meridian.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Upserted User: ${admin.email}`);

  const finance = await prisma.user.upsert({
    where: { email: 'finance@meridian.com' },
    update: {},
    create: {
      email: 'finance@meridian.com',
      passwordHash,
      firstName: 'Finance',
      lastName: 'Manager',
      role: Role.FINANCE_MANAGER,
    },
  });
  console.log(`✅ Upserted User: ${finance.email}`);

  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

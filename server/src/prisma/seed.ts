import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@autoparts.pro' },
    update: {},
    create: { email: 'admin@autoparts.pro', passwordHash: adminHash, name: 'Admin', role: 'ADMIN' },
  })

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'engine' }, update: {}, create: { name: 'Engine', slug: 'engine', icon: '🔧' } }),
    prisma.category.upsert({ where: { slug: 'brakes' }, update: {}, create: { name: 'Brakes', slug: 'brakes', icon: '🛞' } }),
    prisma.category.upsert({ where: { slug: 'suspension' }, update: {}, create: { name: 'Suspension', slug: 'suspension', icon: '⚙️' } }),
    prisma.category.upsert({ where: { slug: 'electrical' }, update: {}, create: { name: 'Electrical', slug: 'electrical', icon: '⚡' } }),
    prisma.category.upsert({ where: { slug: 'filters' }, update: {}, create: { name: 'Filters', slug: 'filters', icon: '🌀' } }),
  ])

  // Makes & models
  const toyota = await prisma.make.upsert({ where: { name: 'Toyota' }, update: {}, create: { name: 'Toyota' } })
  const bmw = await prisma.make.upsert({ where: { name: 'BMW' }, update: {}, create: { name: 'BMW' } })
  const ford = await prisma.make.upsert({ where: { name: 'Ford' }, update: {}, create: { name: 'Ford' } })

  const corolla = await prisma.model.upsert({ where: { name_makeId: { name: 'Corolla', makeId: toyota.id } }, update: {}, create: { name: 'Corolla', makeId: toyota.id, years: [2019, 2020, 2021, 2022, 2023, 2024] } })
  const camry = await prisma.model.upsert({ where: { name_makeId: { name: 'Camry', makeId: toyota.id } }, update: {}, create: { name: 'Camry', makeId: toyota.id, years: [2018, 2019, 2020, 2021, 2022, 2023] } })
  const bmw3 = await prisma.model.upsert({ where: { name_makeId: { name: '3 Series', makeId: bmw.id } }, update: {}, create: { name: '3 Series', makeId: bmw.id, years: [2019, 2020, 2021, 2022, 2023] } })
  const focus = await prisma.model.upsert({ where: { name_makeId: { name: 'Focus', makeId: ford.id } }, update: {}, create: { name: 'Focus', makeId: ford.id, years: [2018, 2019, 2020, 2021] } })

  const [engine, brakes, suspension, electrical, filters] = categories

  // Parts
  const parts = [
    { name: 'Bosch Front Brake Pad Set', slug: 'bosch-front-brake-pad-set', price: 44.99, comparePrice: 64.99, stock: 48, categoryId: brakes.id, oemNumber: '0986494163', description: 'Premium ceramic brake pads for quiet, dust-free braking performance.' },
    { name: 'Gates Timing Belt Kit', slug: 'gates-timing-belt-kit', price: 124.00, stock: 15, categoryId: engine.id, oemNumber: 'TCK328', description: 'Complete timing belt kit including belt, tensioner, and idler pulley.' },
    { name: 'NGK Iridium Spark Plug', slug: 'ngk-iridium-spark-plug', price: 18.99, stock: 120, categoryId: engine.id, oemNumber: 'ILZKAR7A11', description: 'Long-life iridium tip for maximum ignitability and fuel efficiency.' },
    { name: 'KYB Rear Shock Absorber', slug: 'kyb-rear-shock-absorber', price: 89.00, stock: 22, categoryId: suspension.id, oemNumber: 'KYB341264', description: 'OE replacement shock absorber for restored ride comfort and handling.' },
    { name: 'Philips H7 Headlight Bulb', slug: 'philips-h7-headlight', price: 22.00, stock: 80, categoryId: electrical.id, oemNumber: 'H7VPS', description: 'Up to 30% more light on the road vs standard halogen bulbs.' },
    { name: 'Mann Oil Filter', slug: 'mann-oil-filter', price: 12.50, stock: 200, categoryId: filters.id, oemNumber: 'W71180', description: 'High-quality oil filter for reliable engine protection.' },
    { name: 'ATE Brake Disc Pair', slug: 'ate-brake-disc-pair', price: 67.50, comparePrice: 79.00, stock: 30, categoryId: brakes.id, oemNumber: '24012501801', description: 'Vented front brake discs, sold in pairs.' },
    { name: 'Bosch Air Filter', slug: 'bosch-air-filter', price: 16.00, stock: 95, categoryId: filters.id, oemNumber: 'F026400006', description: 'High-filtration air filter to protect your engine from contaminants.' },
  ]

  for (const p of parts) {
    const part = await prisma.part.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, price: p.price, images: [] },
    })
    // Add compatibility
    await prisma.partCompatibility.upsert({
      where: { partId_modelId: { partId: part.id, modelId: corolla.id } },
      update: {},
      create: { partId: part.id, modelId: corolla.id, years: [2019, 2020, 2021, 2022, 2023] },
    })
  }

  // Promotion
  await prisma.promotion.upsert({
    where: { code: 'SUMMER30' },
    update: {},
    create: { code: 'SUMMER30', description: 'Summer sale — 30% off brakes', discount: 30, type: 'PERCENTAGE', isActive: true, expiresAt: new Date('2025-08-31') },
  })

  console.log('✅ Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())

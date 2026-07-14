import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding PriusParts.ge database...')

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@priusparts.ge' },
    update: {},
    create: { email: 'admin@priusparts.ge', passwordHash: adminHash, name: 'Admin', role: 'ADMIN' },
  })

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'engine' }, update: {}, create: { name: 'Engine', slug: 'engine', icon: '🔧' } }),
    prisma.category.upsert({ where: { slug: 'brakes' }, update: {}, create: { name: 'Brakes', slug: 'brakes', icon: '🛞' } }),
    prisma.category.upsert({ where: { slug: 'suspension' }, update: {}, create: { name: 'Suspension', slug: 'suspension', icon: '⚙️' } }),
    prisma.category.upsert({ where: { slug: 'electrical' }, update: {}, create: { name: 'Electrical', slug: 'electrical', icon: '⚡' } }),
    prisma.category.upsert({ where: { slug: 'filters' }, update: {}, create: { name: 'Filters', slug: 'filters', icon: '🌀' } }),
    prisma.category.upsert({ where: { slug: 'hybrid' }, update: {}, create: { name: 'Hybrid System', slug: 'hybrid', icon: '🔋' } }),
  ])

  // Toyota make
  const toyota = await prisma.make.upsert({ where: { name: 'Toyota' }, update: {}, create: { name: 'Toyota' } })

  // Prius generations
  const gen2 = await prisma.model.upsert({
    where: { name_makeId: { name: 'Prius Gen 2', makeId: toyota.id } }, update: {},
    create: { name: 'Prius Gen 2', makeId: toyota.id, years: [2008, 2009] }
  })
  const gen3 = await prisma.model.upsert({
    where: { name_makeId: { name: 'Prius Gen 3', makeId: toyota.id } }, update: {},
    create: { name: 'Prius Gen 3', makeId: toyota.id, years: [2010, 2011, 2012, 2013, 2014, 2015] }
  })
  const gen4 = await prisma.model.upsert({
    where: { name_makeId: { name: 'Prius Gen 4', makeId: toyota.id } }, update: {},
    create: { name: 'Prius Gen 4', makeId: toyota.id, years: [2016, 2017, 2018, 2019, 2020, 2021, 2022] }
  })
  const gen5 = await prisma.model.upsert({
    where: { name_makeId: { name: 'Prius Gen 5', makeId: toyota.id } }, update: {},
    create: { name: 'Prius Gen 5', makeId: toyota.id, years: [2023, 2024] }
  })

  const [engine, brakes, suspension, electrical, filters, hybrid] = categories

  // Parts
  const parts = [
    { name: 'Bosch Front Brake Pad Set — Prius Gen 3/4', slug: 'bosch-front-brake-pad-prius', price: 44.99, comparePrice: 64.99, stock: 48, categoryId: brakes.id, oemNumber: '04465-47080', description: 'OEM-spec ceramic brake pads for Toyota Prius Gen 3 and Gen 4.' },
    { name: 'Toyota Prius Engine Oil Filter', slug: 'toyota-prius-oil-filter', price: 12.50, stock: 120, categoryId: filters.id, oemNumber: '90915-YZZD2', description: 'Genuine Toyota oil filter for all Prius generations.' },
    { name: 'NGK Iridium Spark Plug Set (4pcs) — Prius', slug: 'ngk-iridium-spark-plug-prius', price: 52.00, stock: 60, categoryId: engine.id, oemNumber: 'ILZKR7B11', description: 'Long-life iridium spark plugs for Toyota Prius 1.8L engine.' },
    { name: 'KYB Rear Shock Absorber — Prius Gen 3', slug: 'kyb-rear-shock-prius-gen3', price: 89.00, stock: 22, categoryId: suspension.id, oemNumber: 'KYB349083', description: 'OE replacement rear shock absorber for Prius 2010–2015.' },
    { name: 'Prius Hybrid Battery Cooling Fan', slug: 'prius-hybrid-battery-fan', price: 78.00, stock: 15, categoryId: hybrid.id, oemNumber: '87103-47040', description: 'Hybrid battery cooling fan assembly for Prius Gen 2 and Gen 3.' },
    { name: 'ATE Front Brake Disc Pair — Prius', slug: 'ate-front-brake-disc-prius', price: 67.50, comparePrice: 89.00, stock: 30, categoryId: brakes.id, oemNumber: '43512-47030', description: 'Vented front brake discs for Toyota Prius, sold in pairs.' },
    { name: 'Prius Air Filter — All Generations', slug: 'prius-air-filter', price: 18.00, stock: 95, categoryId: filters.id, oemNumber: '17801-21050', description: 'High-filtration air filter compatible with all Prius generations 2008–2023.' },
    { name: 'Prius Inverter Coolant Pump', slug: 'prius-inverter-coolant-pump', price: 145.00, stock: 12, categoryId: hybrid.id, oemNumber: 'G9020-47031', description: 'Electric water pump for Prius hybrid inverter cooling system.' },
    { name: 'Toyota Prius Cabin Air Filter', slug: 'prius-cabin-air-filter', price: 14.50, stock: 80, categoryId: filters.id, oemNumber: '87139-YZZ20', description: 'Cabin air filter for fresh interior air. Fits Prius 2010–2022.' },
    { name: 'Prius Front Strut Assembly — Gen 4', slug: 'prius-front-strut-gen4', price: 124.00, stock: 8, categoryId: suspension.id, oemNumber: '48510-80517', description: 'Complete front strut assembly for Toyota Prius Gen 4 2016–2022.' },
  ]

  for (const p of parts) {
    const part = await prisma.part.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: [] },
    })
    // Add compatibility to all generations
    for (const model of [gen2, gen3, gen4, gen5]) {
      await prisma.partCompatibility.upsert({
        where: { partId_modelId: { partId: part.id, modelId: model.id } },
        update: {},
        create: { partId: part.id, modelId: model.id, years: model.years },
      })
    }
  }

  // Promotion
  await prisma.promotion.upsert({
    where: { code: 'SUMMER30' },
    update: {},
    create: { code: 'SUMMER30', description: 'Summer sale — 30% off brake parts', discount: 30, type: 'PERCENTAGE', isActive: true, expiresAt: new Date('2025-08-31') },
  })

  console.log('✅ PriusParts.ge seed complete!')
  console.log('👤 Admin: admin@priusparts.ge / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
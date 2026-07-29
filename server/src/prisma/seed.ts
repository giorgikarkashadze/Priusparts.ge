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
    prisma.category.upsert({ where: { slug: 'engine' }, update: {}, create:      { name: 'Engine',        nameKa: 'ძრავი',               slug: 'engine', icon: '🔧' } }),
    prisma.category.upsert({ where: { slug: 'brakes' }, update: {}, create:      { name: 'Brakes',        nameKa: 'სამუხრუჭე სისტემა',          slug: 'brakes', icon: '🛞' } }),
    prisma.category.upsert({ where: { slug: 'suspension' }, update: {}, create:  { name: 'Suspension',    nameKa: 'საშუალო სისტემა',    slug: 'suspension', icon: '⚙️' } }),
    prisma.category.upsert({ where: { slug: 'electrical' }, update: {}, create:  { name: 'Electrical',    nameKa: 'ელექტროობა',   slug: 'electrical', icon: '⚡' } }),
    prisma.category.upsert({ where: { slug: 'filters' }, update: {}, create:     { name: 'Filters',       nameKa: 'ფილტრები',          slug: 'filters', icon: '🌀' } }),
    prisma.category.upsert({ where: { slug: 'hybrid' }, update: {}, create:      { name: 'Hybrid System', nameKa: 'ჰიბრიდული სისტემა', slug: 'hybrid', icon: '🔋' } }),
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


  console.log('✅ PriusParts.ge seed complete!')
  console.log('👤 Admin: admin@priusparts.ge / admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import multer from 'multer'
import path from 'path'
import { requireAdmin } from '../../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
router.use(requireAdmin)

// Multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  cb(null, /image\/(jpeg|png|webp)/.test(file.mimetype))
}})

// Dashboard stats
router.get('/stats', async (_req, res) => {
  const [totalOrders, revenue, lowStock, totalParts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    prisma.part.count({ where: { stock: { lte: 10 }, isActive: true } }),
    prisma.part.count({ where: { isActive: true } }),
  ])
  res.json({ totalOrders, revenue: revenue._sum.total || 0, lowStock, totalParts })
})

// Parts CRUD
const partSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  oemNumber: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string(),
  slug: z.string().optional(),
})

router.get('/parts', async (_req, res) => {
  const parts = await prisma.part.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } })
  res.json(parts)
})

router.post('/parts', upload.array('images', 5), async (req, res) => {
  try {
    const data = partSchema.parse(req.body)
    const images = (req.files as Express.Multer.File[] | undefined)?.map(f => `/uploads/${f.filename}`) || []
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const part = await prisma.part.create({ data: { ...data, slug, images }, include: { category: true } })
    res.status(201).json(part)
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors })
    res.status(500).json({ error: 'Failed to create part' })
  }
})

router.put('/parts/:id', upload.array('images', 5), async (req, res) => {
  try {
    const data = partSchema.partial().parse(req.body)
    const newImages = (req.files as Express.Multer.File[] | undefined)?.map(f => `/uploads/${f.filename}`)
    const existing = await prisma.part.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Part not found' })
    const images = newImages?.length ? [...existing.images, ...newImages] : existing.images
    const part = await prisma.part.update({ where: { id: req.params.id }, data: { ...data, images }, include: { category: true } })
    res.json(part)
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors })
    res.status(500).json({ error: 'Failed to update part' })
  }
})

router.delete('/parts/:id', async (req, res) => {
  await prisma.part.update({ where: { id: req.params.id }, data: { isActive: false } })
  res.json({ success: true })
})

// Orders management
router.get('/orders', async (req, res) => {
  const { status, page = '1' } = req.query as Record<string, string>
  const where: any = status ? { status } : {}
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: { user: { select: { name: true, email: true } }, items: { include: { part: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' }, skip: (parseInt(page) - 1) * 20, take: 20 }),
    prisma.order.count({ where }),
  ])
  res.json({ data: orders, total })
})

router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } })
  res.json(order)
})

// Promotions
const promoSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  description: z.string().optional(),
  discount: z.coerce.number().positive(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  expiresAt: z.string().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
})

router.get('/promotions', async (_req, res) => {
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(promos)
})

router.post('/promotions', async (req, res) => {
  try {
    const data = promoSchema.parse(req.body)
    const promo = await prisma.promotion.create({ data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : null } })
    res.status(201).json(promo)
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors })
    res.status(500).json({ error: 'Failed to create promotion' })
  }
})

router.patch('/promotions/:id', async (req, res) => {
  const { isActive } = req.body
  const promo = await prisma.promotion.update({ where: { id: req.params.id }, data: { isActive } })
  res.json(promo)
})

export default router

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

// GET /api/products — list with filters
router.get('/', async (req, res) => {
  try {
    const { category, makeId, modelId, year, minPrice, maxPrice, search, page = '1', limit = '20', sort } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = { isActive: true }
    if (category) where.category = { slug: category }
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (minPrice || maxPrice) where.price = { gte: minPrice ? parseFloat(minPrice) : undefined, lte: maxPrice ? parseFloat(maxPrice) : undefined }
    if (modelId) where.compatibility = { some: { modelId } }

    const orderBy: any =
      sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { createdAt: 'desc' }

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: { category: true, compatibility: { include: { model: { include: { make: true } } } } },
      }),
      prisma.part.count({ where }),
    ])

    res.json({ data: parts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/categories
router.get('/categories', async (_req, res) => {
  const cats = await prisma.category.findMany({ include: { _count: { select: { parts: true } } } })
  res.json(cats)
})

// GET /api/products/makes
router.get('/makes', async (_req, res) => {
  const makes = await prisma.make.findMany({ include: { models: true } })
  res.json(makes)
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  const part = await prisma.part.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      compatibility: { include: { model: { include: { make: true } } } },
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!part) return res.status(404).json({ error: 'Part not found' })
  res.json(part)
})

// POST /api/products/:id/reviews
const reviewSchema = z.object({ rating: z.number().min(1).max(5), comment: z.string().optional() })

router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { rating, comment } = reviewSchema.parse(req.body)
    const review = await prisma.review.create({
      data: { partId: String(req.params.id), userId: req.user!.id, rating, comment },
      include: { user: { select: { name: true } } },
    })
    res.status(201).json(review)
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues })
    res.status(500).json({ error: 'Failed to create review' })
  }
})

export default router

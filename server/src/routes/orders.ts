import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import Stripe from 'stripe'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
})

const orderSchema = z.object({
  items: z.array(z.object({ partId: z.string(), quantity: z.number().min(1) })),
  promoCode: z.string().optional(),
  shippingAddress: z.object({
    name: z.string(), line1: z.string(), line2: z.string().optional(),
    city: z.string(), state: z.string(), zip: z.string(), country: z.string(),
  }),
})

// POST /api/orders — create order + Stripe payment intent
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { items, promoCode, shippingAddress } = orderSchema.parse(req.body)

    // Fetch parts & validate stock
    const parts = await Promise.all(items.map(async (item) => {
      const part = await prisma.part.findUnique({ where: { id: item.partId } })
      if (!part) throw new Error(`Part ${item.partId} not found`)
      if (part.stock < item.quantity) throw new Error(`Insufficient stock for ${part.name}`)
      return { ...part, quantity: item.quantity }
    }))

    let subtotal = parts.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0)
    let discount = 0
    let promotion = null

    // Apply promo code
    if (promoCode) {
      promotion = await prisma.promotion.findFirst({
        where: { code: promoCode, isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      })
      if (promotion) {
        discount = promotion.type === 'PERCENTAGE'
          ? subtotal * (Number(promotion.discount) / 100)
          : Math.min(Number(promotion.discount), subtotal)
      }
    }

    const shipping = 9.99
    const total = Math.max(0, subtotal - discount + shipping)

    // Stripe payment intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(total * 100),
    //   currency: 'usd',
    //   metadata: { userId: req.user!.id },
    // })
    const paymentIntent = { id: `mock_${Date.now()}`, client_secret: null }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        subtotal,
        shipping,
        discount,
        total,
        promotionId: promotion?.id,
        stripePaymentId: paymentIntent.id,
        shippingAddress,
        items: {
          create: parts.map(p => ({ partId: p.id, quantity: p.quantity, price: p.price })),
        },
      },
      include: { items: { include: { part: true } } },
    })

    // Decrement stock
    await Promise.all(parts.map(p => prisma.part.update({ where: { id: p.id }, data: { stock: { decrement: p.quantity } } })))

    res.status(201).json({ order, clientSecret: paymentIntent.client_secret })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors })
    if (e instanceof Error) return res.status(400).json({ error: e.message })
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders — my orders
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { items: { include: { part: { select: { name: true, images: true } } } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(orders)
})

// GET /api/orders/:id
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { items: { include: { part: true } } },
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

// POST /api/orders/validate-promo
router.post('/validate-promo', async (req, res) => {
  const { code } = req.body
  const promo = await prisma.promotion.findFirst({
    where: { code, isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
  })
  if (!promo) return res.status(404).json({ error: 'Invalid or expired promo code' })
  res.json({ discount: promo.discount, type: promo.type, description: promo.description })
})

export default router

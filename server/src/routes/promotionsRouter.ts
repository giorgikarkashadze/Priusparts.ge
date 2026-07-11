import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/promotions/active — public active promotions banner
router.get('/active', async (_req, res) => {
  const promos = await prisma.promotion.findMany({
    where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { code: true, description: true, discount: true, type: true, expiresAt: true },
  })
  res.json(promos)
})

export default router

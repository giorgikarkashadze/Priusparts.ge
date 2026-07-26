import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'

const router = Router()
const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

function signTokens(user: { id: string; role: string; email: string }) {
  const access = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  const refresh = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' })
  return { access, refresh }
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, passwordHash, name } })
    const tokens = signTokens(user)
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues })
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    const tokens = signTokens(user)
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.issues })
    res.status(500).json({ error: 'Login failed' })
  }
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' })
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }
    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user) return res.status(401).json({ error: 'User not found' })
    const tokens = signTokens(user)
    res.json(tokens)
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, email: true, name: true, role: true, createdAt: true } })
  res.json(user)
})

// Configure Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email from Google'))

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: profile.displayName || email.split('@')[0],
          passwordHash: '',  // no password for OAuth users
          role: 'CUSTOMER',
        }
      })
    }
    done(null, user)
  } catch (e) {
    done(e as Error)
  }
}))

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google` }),
  (req, res) => {
    const user = req.user as any
    const tokens = signTokens(user)
    // Redirect to frontend with tokens in URL params
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?access=${tokens.access}&refresh=${tokens.refresh}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user.id}`
    )
  }
)

export default router

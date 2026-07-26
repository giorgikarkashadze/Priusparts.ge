import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  role: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = (req as AuthRequest).headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser
    ;(req as AuthRequest).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const token = (req as AuthRequest).headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser
    if (payload.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' })
      return
    }
    ;(req as AuthRequest).user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
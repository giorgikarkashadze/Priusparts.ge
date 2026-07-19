import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'

import authRouter from './routes/auth'
import productsRouter from './routes/products'
import ordersRouter from './routes/orders'
import adminRouter from './routes/admin'
import promotionsRouter from './routes/promotionsRouter'

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
}, express.static(path.join(__dirname, '../uploads')))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use('/api/', limiter)

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/promotions', promotionsRouter)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(Number(PORT), '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`))

export default app
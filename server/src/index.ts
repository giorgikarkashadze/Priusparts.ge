import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import history from 'connect-history-api-fallback'

import authRouter from './routes/auth'
import productsRouter from './routes/products'
import ordersRouter from './routes/orders'
import adminRouter from './routes/admin'
import promotionsRouter from './routes/promotionsRouter'

const app = express()
const PORT = process.env.PORT || 4000

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use('/api/', limiter)

// API Routes — must be before history fallback
app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/promotions', promotionsRouter)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')))

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// React app — history fallback for client-side routing
app.use(history({
  rewrites: [
    {
      from: /^\/api\/.*$/,
      to: (context) => context.parsedUrl.pathname!
    }
  ]
}))

// Serve React build
const clientBuild = path.join(process.cwd(), '../client/dist')
app.use(express.static(clientBuild))
console.log('Looking for client build at:', clientBuild)
console.log('__dirname is:', __dirname)
console.log('process.cwd() is:', process.cwd())
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'))
})

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))

export default app
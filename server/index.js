import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import bodyParser from 'body-parser'

// Route imports
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/uploadRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'

dotenv.config()
const app = express()

connectDB()

// Stripe webhook must be mounted BEFORE express.json()
// Inject raw body parser for Stripe signature verification
app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }), webhookRoutes)

// Middleware
app.use(cors())
app.use(express.json())

// Static uploads
app.use('/api/upload', uploadRoutes)
app.use('/uploads', express.static('uploads'))

// Route mount
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

// Root route
app.get('/', (req, res) => {
  res.send('CyclePort backend is running')
})

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
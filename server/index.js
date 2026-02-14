import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import connectDB from './config/db.js'
import bodyParser from 'body-parser'
import path from 'path'

// Route imports
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/uploadRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'

// Middleware imports
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorMiddleware.js'

dotenv.config()
const app = express()

connectDB()

// Stripe webhook must be mounted BEFORE express.json()
// Inject raw body parser for Stripe signature verification
app.use('/api/webhook/', bodyParser.raw({ type: 'application/json' }), webhookRoutes)

// Security headers
app.use(helmet())

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


// Allowed origins (Netlify, Vercel, local dev)
const allowedOrigins = [
  "https://cycleport.netlify.app",
  "https://cycleport.vercel.app",
  "http://localhost:5173" // local dev
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

// Middleware
app.use(express.json())

// Static uploads with CORS enabled
app.use(
  '/uploads',
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
  express.static(path.join(process.cwd(), 'uploads'))
)

// Upload route
app.use('/api/upload', uploadRoutes)

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

// Not found middleware
app.use(notFound)

// Global error handler
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
import express from 'express'
import { stripeWebhook } from '../controllers/webhookController.js'

const router = express.Router()

// Stripe webhook endpoint (requires raw body parsing in index.js)
router.post('/stripe', stripeWebhook)

export default router
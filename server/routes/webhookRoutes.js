import express from 'express'
import { stripeWebhook } from '../controllers/webhookController.js'

const router = express.Router()

// Stripe webhook endpoint (requires raw body parsing in index.js)
router.post('/', stripeWebhook)

export default router
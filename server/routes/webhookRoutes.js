import express from 'express'
import { stripeWebhook } from '../controllers/webhookController.js'

const router = express.Router()

// Stripe requires raw body for signature verification
router.post('/', stripeWebhook)

export default router

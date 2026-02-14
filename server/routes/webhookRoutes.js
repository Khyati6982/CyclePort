import express from 'express'
import { stripeWebhook } from '../controllers/webhookController.js'

const router = express.Router()

// Stripe webhook endpoint (requires raw body parsing in index.js)
router.post('/stripe', stripeWebhook)

router.get('/test', (req, res) => {
  res.json({ message: 'Webhook route is alive' });
});


export default router
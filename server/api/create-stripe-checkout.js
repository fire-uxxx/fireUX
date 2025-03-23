import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import Stripe from 'stripe'
import admin from '../utils/firebase'
import { useRuntimeConfig } from '#imports' // Auto-imported in Nuxt 3

export default defineEventHandler(async event => {
  // Get runtime configuration
  const config = useRuntimeConfig()

  // Ensure Stripe Secret Key is available
  const stripeSecretKey = config.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    console.error('Stripe Secret Key is missing in runtimeConfig.')
    setResponseStatus(event, 500)
    return { error: 'Internal Server Error: Stripe Secret Key is missing.' }
  }

  // Define a constant currency
  const currency = 'usd'

  // Initialize Stripe
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia'
  })

  if (event.req.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody(event)
    const { userId, collection, product, amount } = body

    if (!userId || !collection || !product || !amount) {
      setResponseStatus(event, 400)
      return { error: 'Missing required parameters', received: body }
    }

    // Get the front-end URL from the public runtime config
    const frontendUrl = config.public.DOMAIN || 'https://fallback-url.com/'

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: product },
            unit_amount: amount // in cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/success`,
      cancel_url: `${frontendUrl}/cancel`
    })

    // Write a record to Firestore
    const db = admin.firestore()
    await db.collection(collection).add({
      userId,
      product,
      amount, // stored in cents
      sessionId: session.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      currency
    })

    // Return the session ID and URL for client redirection
    return {
      id: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('Stripe Checkout Error:', error)
    setResponseStatus(event, 500)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

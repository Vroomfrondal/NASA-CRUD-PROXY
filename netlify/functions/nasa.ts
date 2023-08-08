import express, { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import serverless from 'serverless-http'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import url from 'url'
import cors from 'cors'

require('dotenv').config()

// Init Server
const app = express()
const router = Router()
app.use(cors())

//! Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 24 * 3600000, // 4k limit per day per user
  max: 4000,
})
app.use(limiter)
app.set('Trust Proxy', 1)

// Routes
// baseUrl/nasa?start_date=2022-10-26&end_date=2022-11-9
router.get('/', async (req, res) => {
  const URL = process.env.NASA_BASE_URL!
  const KEY = process.env.NASA_API_KEY!

  try {
    const dynamicURLParams = url.parse(req.url, true).query
    console.log(dynamicURLParams)

    const CONFIG = {
      params: { api_key: KEY, start_date: dynamicURLParams.start_date, end_date: dynamicURLParams.end_date },
    }
    const request = await axios.get(URL, CONFIG)

    if (request.status === 200) {
      const response = await request.data.reverse() // reversing so today's image shows first

      res.status(200).json(response)
    } else {
      res.status(400).json({ err: `Failed with status code: ${request.status}, Text: ${request.statusText}` })
    }
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ err })
  }
})

// baseUrl/nasa/email
router.get('/email/:user_email', async (req, res) => {
  const URL = process.env.EMAIL_URL!
  const SENDER = process.env.SENDER!
  const KEY = process.env.EMAIL_API_KEY!
  const RECIEVER = req.params.user_email

  const CONFIG = {
    headers: { Authorization: KEY, 'Content-Type': 'application/json' },
    data: {
      from: { email: SENDER },
      subject: '60 Years of Nasa Spaceflight <PDF>',
      personalizations: [
        {
          to: [{ email: RECIEVER }],
          subject: 'Test',
        },
      ],
      attachments: [
        {
          content: '',
          filename: '60-Years-Nasa-Spaceflight.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
      content: [
        {
          type: 'text/html',
          value: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f1f1f1; padding: 40px 0;">
                <div style="background-color: #ffffff; padding: 40px 30px;">
                    <h1 style="font-family: Arial, sans-serif; font-size: 24px; color: #333333; margin: 0;">
                        <b>Thank You for Requesting NASA's PDF Pamphlet</b>
                    </h1>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333; margin-top: 20px;">
                        Dear ${RECIEVER},
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        We would like to express our gratitude for your interest in NASA's PDF pamphlet. We're excited to share this valuable resource with you.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        Your request was successful, and the PDF pamphlet is attached to this email. Please feel free to reach out if you have any questions or further inquiries using my email cjdeleon98@gmail.com.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        Thank you for your continued support and curiosity about space exploration!
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333; margin-top: 20px;">
                        Best regards,<br>
                        Christopher
                      </p>
                  </div>
              </div>
          </div>
            `,
        },
      ],
    },
  }

  // Retry support
  axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
  })

  // Email Request
  const request = await axios.post(URL, CONFIG.data, CONFIG)
  if (request.status === 202) res.status(200).json({ status: 200, message: 'Email sent' })
  else res.status(400).json({ status: 200, message: 'Email encountered an issue.' })
})

// Start Server
app.use('/nasa/', router)

export const handler = serverless(app)

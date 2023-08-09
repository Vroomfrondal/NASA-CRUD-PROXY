import { Router } from 'express'
import axios from 'axios'
import axiosRetry from 'axios-retry'
require('dotenv').config()

export const emailRoute = Router()

emailRoute.get('/email/:user_email', async (req, res) => {
  const URL = process.env.EMAIL_URL!
  const SENDER = process.env.SENDER!
  const RECIEVER = req.params.user_email
  const KEY = process.env.EMAIL_API_KEY!

  //   try {
  //     const PDF_URL = 'https://drive.google.com/file/d/1szO26knw8shxE1xWueHXWGdb4AUHU950/view?usp=sharing'
  //     const response = await axios.get(PDF_URL, { responseType: 'arraybuffer' })
  //     const base64String = Buffer.from(response.data, 'binary').toString('base64')
  //   } catch (error) {
  //     console.log(error)
  //   }

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
          filename: 'test.pdf',
          type: 'application/pdf', // 'text/plain' 'text/csv',
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
                          Thank you for your continued support and curiosity about space exploration! <b>Your email will not be saved or subscribed in anyway</b>.
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
  if (request.status === 202) res.status(200).json({ status: 200, message: `Email sent to ${SENDER}` })
  else res.status(400).json({ status: 400, message: 'Email encountered an issue.' })
})

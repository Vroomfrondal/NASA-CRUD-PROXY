import express, { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import serverless from 'serverless-http'
import axios from 'axios'
import url from 'url'
import cors from 'cors'

// Init Server
const app = express()
const imageRouter = Router()
app.use(cors())

//! Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 1 * 3600000, // 1 hour window for requests
  max: 200, // max requests
})
app.use(limiter)
app.set('Trust Proxy', 1)

// Routes
// For example use baseUrl/images?start_date=2022-10-26&end_date=2022-11-9
imageRouter.get('/', async (req, res) => {
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

// Start Server
app.use('/images/', imageRouter)

export const handler = serverless(app)

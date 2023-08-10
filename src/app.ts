import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { routes } from './routes'
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()

// Enable Cors
app.use(cors())

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window for requests
  max: 2, // max requests
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)
app.set('Trust Proxy', 1)

// Set Static Folder
app.use(express.static('public'))

// Import Routes
app.use('/', routes)

// Start Proxy
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

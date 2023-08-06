import express from 'express'
import cors from 'cors'
import { routes } from './routes'
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()

// Routes
app.use('/', routes)

// Enable Cors
app.use(cors())

// Start Proxy
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

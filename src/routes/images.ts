import { Router } from 'express'
import axios from 'axios'
require('dotenv').config()

export const imageRoute = Router()

imageRoute.get('/images', async (req, res) => {
  const URL = process.env.NASA_BASE_URL!
  const KEY = process.env.NASA_API_KEY!

  try {
    const CONFIG = {
      params: { api_key: KEY, start_date: '2022-10-26', end_date: '2022-11-2' },
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

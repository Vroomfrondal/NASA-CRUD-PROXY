// serverless function for fetching NASA images

import { Router } from 'express'
import axios from 'axios'
import url from 'url'
require('dotenv').config()

const imageRoute = Router()

imageRoute.get('/images', async (req, res) => {
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

// export default imageRoute
export const handler = imageRoute

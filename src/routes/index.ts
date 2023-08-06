import { Router } from 'express'
import { imageRoute } from './images'

export const routes = Router()

// Routes
routes.use(imageRoute)

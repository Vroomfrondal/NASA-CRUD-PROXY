import { Router } from 'express'
import { imageRoute } from './images'
import { emailRoute } from './email'

export const routes = Router()

// Routes
routes.use(imageRoute)
routes.use(emailRoute)

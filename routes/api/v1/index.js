import express from 'express'
import authRoute from './auth.js'
import postRoute from './post.js'
import labelRoute from './label.js'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/posts', postRoute)
router.use('/labels', labelRoute)

export default router

import express from 'express'
import passport from 'passport'
import '../../../config/passport-jwt-strategy.js'
import { createLabel, deleteLabel } from '../../../controllers/api/v1/label.js'

const router = express.Router()

/* /api/v1/labels/create */
router.post('/create', passport.authenticate('jwt', { session: false }), createLabel)
/* /api/v1/labels/delete/:labelId */
router.delete('/delete/:labelId', passport.authenticate('jwt', { session: false }), deleteLabel)

export default router

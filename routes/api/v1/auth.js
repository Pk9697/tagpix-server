import express from 'express'
import passport from 'passport'
import '../../../config/passport-jwt-strategy.js'
import { authenticateUser, login, register } from '../../../controllers/api/v1/auth.js'

const router = express.Router()

/* /api/v1/auth/register */
router.post('/register', register)
/* /api/v1/auth/login */
router.post('/login', login)
/* /api/v1/auth/authenticate-user */
router.get(
  '/authenticate-user',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  authenticateUser,
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    return res.status(422).json({
      success: false,
      message: 'User Authentication Failed! Logging Out',
    })
  }
)

export default router

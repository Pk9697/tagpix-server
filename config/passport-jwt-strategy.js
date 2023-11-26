/* eslint-disable no-underscore-dangle */
import passport from 'passport'
import passportJWT from 'passport-jwt'
import User from '../models/user.js'
import env from './environment.js'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: env.jwt_secret_key,
}

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    // here User. any methods does not support callback fxns anymore so use async await for that
    try {
      const user = await User.findOne({ _id: jwtPayload._id })
      if (user) {
        return done(null, user)
      }
    } catch (err) {
      if (err) {
        console.log('Error in finding user from JWT')
      }
    }
    return done(null, false)
  })
)

export default passport

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unsafe-optional-chaining */
import jwt from 'jsonwebtoken'
import User from '../../../models/user.js'
import env from '../../../config/environment.js'

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body
    if (password !== confirmPassword) {
      return res.status(422).json({
        success: false,
        message: 'Password and Confirm Password not same',
      })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(422).json({
        success: false,
        message: 'User Already Exists',
      })
    }

    const newUser = await User.create({
      email,
      password,
      name,
    })

    const { password: pass, ...newUserWithoutPass } = newUser?._doc
    // console.log({newUserWithoutPass})

    return res.status(201).json({
      success: true,
      message: 'Register successful here is your token keep it safe',
      data: {
        token: jwt.sign(newUserWithoutPass, env.jwt_secret_key, {
          expiresIn: '30d',
        }),
        user: newUserWithoutPass,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(422).json({
        success: false,
        message: "User Doesn't Exist",
      })
    }
    if (user.password !== password) {
      return res.status(422).json({
        success: false,
        message: 'Password wrong',
      })
    }

    const { password: pass, ...userWithoutPass } = user?._doc

    return res.status(200).json({
      success: true,
      message: 'Login successful here is your token keep it safe',
      data: {
        token: jwt.sign(userWithoutPass, env.jwt_secret_key, {
          expiresIn: '1d',
        }),
        user: userWithoutPass,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

export const authenticateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    return res.status(200).json({
      success: true,
      message: 'Authentication successful!',
      data: {
        user,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

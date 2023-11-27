/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import Label from '../../../models/label.js'

/* CREATE LABEL- requires admin authentication */
export const createLabel = async (req, res) => {
  try {
    const { name } = req.body
    const { user } = req

    if (!user.isAdmin) {
      return res.status(422).json({
        success: false,
        message: 'You are not an admin to create label',
      })
    }

    const existingLabel = await Label.findOne({ name })
    if (existingLabel) {
      return res.status(422).json({
        success: false,
        message: 'Label already exists!',
      })
    }

    const label = await Label.create({
      name,
      user: req.user._id,
    })

    return res.status(200).json({
      success: true,
      message: 'Label created successfully!',
      data: {
        label,
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

/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import Label from '../../../models/label.js'
import Post from '../../../models/post.js'

/* CREATE LABEL- requires admin authentication */
export const createLabel = async (req, res) => {
  try {
    const { name } = req.query
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

/* DELETE LABEL- requires admin authentication */

export const deleteLabel = async (req, res) => {
  try {
    const { labelId } = req.params
    const { user } = req
    if (!user.isAdmin) {
      return res.status(422).json({
        success: false,
        message: 'You are not an admin to delete label',
      })
    }

    const label = await Label.findById(labelId)
    if (!label) {
      return res.status(422).json({
        success: false,
        message: "Label doesn't exist",
      })
    }
    // Iterate on posts array and pull/remove labelid from that post
    label.posts.forEach(async (postId) => {
      await Post.findByIdAndUpdate(postId, {
        $pull: { labels: labelId },
      })
    })

    await Label.findByIdAndDelete(labelId)

    return res.status(200).json({
      success: true,
      message: 'Label deleted successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

/* GET ALL LABELS- requires authentication */
export const getAllLabels = async (req, res) => {
  try {
    const labels = await Label.find()
      .sort('-createdAt')
      .populate({ path: 'posts', populate: { path: 'labels' } })
    return res.status(200).json({
      success: true,
      message: 'Here are your labels',
      data: {
        labels,
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

/* GET ALL POSTS associated with a label- requires authentication */
export const filterPostsByLabel = async (req, res) => {
  try {
    const { labelId } = req.params
    const label = await Label.findById(labelId)
      .sort('-createdAt')
      .populate({ path: 'posts', populate: { path: 'labels' } })
    if (!label) {
      return res.status(422).json({
        success: false,
        message: "Label doesn't exist",
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Here are your posts filtered with this label',
      data: {
        posts: label.posts,
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

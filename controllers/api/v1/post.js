/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable no-underscore-dangle */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import Post from '../../../models/post.js'
import Label from '../../../models/label.js'

/* CREATE POST- requires admin authentication */
export const createPost = async (req, res) => {
  try {
    Post.uploadedPostImg(req, res, async (err) => {
      if (err) {
        console.error('********Multer error: ', err)
        return res.status(422).json({
          success: false,
          message: err.message,
        })
      }

      const { file, user } = req

      if (!user.isAdmin) {
        // deleting already uploaded image
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
        return res.status(422).json({
          success: false,
          message: 'You are not an admin to upload image',
        })
      }

      if (!file) {
        return res.status(422).json({
          success: false,
          message: 'No file provided!',
        })
      }

      const stats = fs.statSync(file.path)
      const fileSizeInBytes = stats.size
      // Convert the file size to megabytes
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024)
      let quality = 100

      if (fileSizeInMegabytes > 10) {
        quality = 10
      } else if (fileSizeInMegabytes > 5 && fileSizeInMegabytes <= 10) {
        quality = 20
      } else if (fileSizeInMegabytes > 1 && fileSizeInMegabytes <= 5) {
        quality = 30
      } else if (fileSizeInMegabytes > 0.5 && fileSizeInMegabytes <= 1) {
        quality = 50
      }

      const newFileName = file.fieldname + '-' + Date.now()
      const newFilePath = path.join(file.destination, newFileName)
      // console.log({ file, newFileName })

      await sharp(file.path)
        // .resize()
        .jpeg({ quality })
        // .toFormat('jpeg', { mozjpeg: true })
        .toFile(newFilePath)

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }

      const post = await Post.create({
        user: req.user._id,
        image: Post.postImgPath + '/' + newFileName,
      })

      if (post) {
        const userPopulatedPost = await post.populate('user')
        return res.status(200).json({
          success: true,
          message: 'Post created successfully!',
          data: {
            post: userPopulatedPost,
          },
        })
      }

      return res.status(422).json({
        success: false,
        message: 'Unable to create Post!',
      })
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

/* ASSIGN LABEL- requires authentication */

export const assignLabel = async (req, res) => {
  try {
    const { postId, labelId } = req.query
    const label = await Label.findById(labelId)
    if (!label) {
      return res.status(422).json({
        success: false,
        message: "Label doesn't exist",
      })
    }
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(422).json({
        success: false,
        message: "Post doesn't exist",
      })
    }

    // find if this label id already assigned to post
    const existingLabel = post.labels.includes(labelId)
    if (existingLabel) {
      return res.status(422).json({
        success: false,
        message: 'Label already assigned to this post',
      })
    }

    post.labels = [label._id, ...post.labels]
    post.save()
    // find if this label id already assigned to post
    const existingPost = label.posts.includes(postId)
    if (existingPost) {
      return res.status(422).json({
        success: false,
        message: 'Post already assigned to this label',
      })
    }

    label.posts = [post._id, ...label.posts]
    label.save()

    return res.status(200).json({
      success: true,
      message: 'Assigned Label successfully',
      data: {
        post,
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

export const removeLabel = async (req, res) => {
  try {
    const { postId, labelId } = req.query
    const label = await Label.findById(labelId)
    if (!label) {
      return res.status(422).json({
        success: false,
        message: "Label doesn't exist",
      })
    }
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(422).json({
        success: false,
        message: "Post doesn't exist",
      })
    }

    // find if this label id already assigned to post
    const existingLabel = post.labels.includes(labelId)
    if (!existingLabel) {
      return res.status(422).json({
        success: false,
        message: 'Label not assigned to this post',
      })
    }

    // find if this label id already assigned to post
    const existingPost = label.posts.includes(postId)
    if (!existingPost) {
      return res.status(422).json({
        success: false,
        message: 'Post not assigned to this label',
      })
    }
    // pull out from labels array which matches labelId
    await Post.findByIdAndUpdate(postId, {
      $pull: { labels: labelId },
    })
    // pull out from posts array which matches postId
    await Label.findByIdAndUpdate(labelId, {
      $pull: { posts: postId },
    })

    return res.status(200).json({
      success: true,
      message: 'Label removed successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

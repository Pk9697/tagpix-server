/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fileDirName from '../utils/file-dir-name.js'

const { __dirname } = fileDirName(import.meta)
const POST_IMG_PATH = path.join('/uploads/posts')

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: '',
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', POST_IMG_PATH))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  },
})

postSchema.statics.uploadedPostImg = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const uploadType = file.mimetype.split('/')[0]
    if (uploadType !== 'image') {
      return callback(new Error('Only images are allowed'))
    }
    return callback(null, true)
  },
}).single('image')

postSchema.statics.postImgPath = POST_IMG_PATH
// telling mongoose that this->'Post' is a model in the database
const Post = mongoose.model('Post', postSchema)
// now exporting this post schema
export default Post

import mongoose from 'mongoose'

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
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

// telling mongoose that this->'Label' is a model in the database
const Label = mongoose.model('Label', labelSchema)
// now exporting this Label schema
export default Label

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import router from './routes/index.js'
import './config/mongoose.js'

const port = process.env.TAGPIX_PORT || 4001
const app = express()

/* MIDDLEWARES */
app.use(cors())
app.use(express.json())
// use express router
app.use('/', router)

/* RUN SERVER */
app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running server : ${err}`)
  }

  console.log(`Server is running on port: ${port}`)
})

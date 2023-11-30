import express from 'express'
import passport from 'passport'
import '../../../config/passport-jwt-strategy.js'
import { createPost, assignLabel, removeLabel, deletePost, getAllPosts } from '../../../controllers/api/v1/post.js'

const router = express.Router()

/* /api/v1/posts/create */
router.post('/create', passport.authenticate('jwt', { session: false }), createPost)
router.post('/assignLabel', passport.authenticate('jwt', { session: false }), assignLabel)
router.post('/removeLabel', passport.authenticate('jwt', { session: false }), removeLabel)
router.delete('/delete/:postId', passport.authenticate('jwt', { session: false }), deletePost)
router.get('/', passport.authenticate('jwt', { session: false }), getAllPosts)

export default router

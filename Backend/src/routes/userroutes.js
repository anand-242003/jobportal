import express, { Router } from 'express'
import { updateUserProfile,getUserProfiledata } from '../controllers/userControllers.js'

import { authmiddleware} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/profile',authmiddleware,getUserProfiledata)
router.put('/profile',authmiddleware,updateUserProfile)


export default router
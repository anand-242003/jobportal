import express from 'express'
import { updateUserProfile, getUserProfiledata, uploadResume, uploadProfilePhoto } from '../controllers/userControllers.js'
import { authmiddleware } from '../middlewares/authMiddleware.js'
import { validateProfileUpdate } from '../middlewares/validation.js'
import upload from '../middlewares/upload.js'

const router = express.Router()

router.get('/profile', authmiddleware, getUserProfiledata)
router.put('/profile', authmiddleware, validateProfileUpdate, updateUserProfile)
router.post('/resume', authmiddleware, upload.single('file'), uploadResume)
router.post('/profile-photo', authmiddleware, upload.single('file'), uploadProfilePhoto)

export default router
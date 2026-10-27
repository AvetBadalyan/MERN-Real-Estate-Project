import express from 'express'
import {
	deleteUser,
	getUser,
	getUserListings,
	updateUser,
} from '../controllers/user-controller.js'
import { validateObjectId } from '../utils/validateObjectId.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/listings/:id', validateObjectId, verifyToken, getUserListings)
router.put('/:id', validateObjectId, verifyToken, updateUser)
router.delete('/:id', validateObjectId, verifyToken, deleteUser)
// Public — password is stripped in getUser, username/email needed by Contact component
router.get('/:id', validateObjectId, getUser)

export default router

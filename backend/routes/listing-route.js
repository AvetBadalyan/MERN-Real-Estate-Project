import express from 'express'
import {
	createListing,
	deleteListing,
	getListing,
	getListings,
	updateListing,
} from '../controllers/listing-controller.js'
import { validateObjectId } from '../utils/validateObjectId.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createListing)
router.get('/', getListings)
router.put('/:id', validateObjectId, verifyToken, updateListing)
router.delete('/:id', validateObjectId, verifyToken, deleteListing)
router.get('/:id', validateObjectId, getListing)

export default router

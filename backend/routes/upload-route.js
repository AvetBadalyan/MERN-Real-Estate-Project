import express from 'express'
import multer from 'multer'
import getCloudinary from '../config/cloudinary.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

// Use memory storage for serverless (no disk access)
const storage = multer.memoryStorage()

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image files are allowed'))
		}
		cb(null, true)
	},
})

router.post('/', verifyToken, (req, res) => {
	upload.single('image')(req, res, async err => {
		if (err) {
			const message =
				err.code === 'LIMIT_FILE_SIZE'
					? 'Image must be less than 5 MB'
					: err.message
			return res.status(400).json({ success: false, message })
		}

		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: 'No image uploaded' })
		}

		try {
			// Convert buffer to base64 data URI for Cloudinary upload
			const b64 = req.file.buffer.toString('base64')
			const dataURI = `data:${req.file.mimetype};base64,${b64}`

			const result = await getCloudinary().uploader.upload(dataURI, {
				folder: 'avets-estate',
				resource_type: 'image',
			})

			return res.status(201).json({ imageUrl: result.secure_url })
		} catch (error) {
			console.error('Cloudinary upload error:', error)
			return res
				.status(500)
				.json({ success: false, message: 'Image upload failed' })
		}
	})
})

export default router

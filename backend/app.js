import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRouter from './routes/auth-route.js'
import listingRouter from './routes/listing-route.js'
import uploadRouter from './routes/upload-route.js'
import userRouter from './routes/user-route.js'

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

// Connect to MongoDB (caches connection for serverless)
connectDB()

const app = express()

// Behind Vercel's proxy — needed for correct client IPs in rate limiting
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CORS - allow configured frontend origins with credentials.
// Fail closed in production: never reflect arbitrary origins when credentials
// are enabled. In development, allow all for convenience.
const allowedOrigins = process.env.CLIENT_URL?.split(',').map(o => o.trim())
app.use(
	cors({
		origin: allowedOrigins?.length ? allowedOrigins : !isProduction,
		credentials: true,
	})
)

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// Rate limiters: strict on auth (brute force) and uploads (abuse).
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { success: false, message: 'Too many attempts, please try again later.' },
})
const uploadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
	message: { success: false, message: 'Too many uploads, please try again later.' },
})

// Serve legacy images from /images folder (for existing listings)
// New uploads go to Cloudinary
app.use('/images', express.static(path.join(__dirname, '../images')))

// API routes
app.use('/api/upload', uploadLimiter, uploadRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authLimiter, authRouter)
app.use('/api/listing', listingRouter)

// Health check for monitoring
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// 404 for unknown API routes
app.use('/api', (_req, res) => {
	res.status(404).json({ success: false, message: 'API route not found' })
})

// Error handler
app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || 500
	// Don't leak internal error details for unexpected 500s in production.
	const message =
		isProduction && statusCode >= 500
			? 'Internal Server Error'
			: err.message || 'Internal Server Error'
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})

export default app

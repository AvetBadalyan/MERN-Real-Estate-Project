import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRouter from './routes/auth-route.js'
import listingRouter from './routes/listing-route.js'
import uploadRouter from './routes/upload-route.js'
import userRouter from './routes/user-route.js'

dotenv.config()

// Connect to MongoDB (caches connection for serverless)
connectDB()

const app = express()

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// CORS - allow frontend origin with credentials
const allowedOrigins = process.env.CLIENT_URL?.split(',').map(o => o.trim())
app.use(
	cors({
		origin: allowedOrigins?.length ? allowedOrigins : true,
		credentials: true,
	})
)

app.use(express.json())
app.use(cookieParser())

// Serve legacy images from /images folder (for existing listings)
// New uploads go to Cloudinary
app.use('/images', express.static(path.join(__dirname, '../images')))

// API routes
app.use('/api/upload', uploadRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
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
	const message = err.message || 'Internal Server Error'
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})

export default app

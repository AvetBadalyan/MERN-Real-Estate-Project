// Vercel serverless entry point
// Vercel auto-detects functions in the root /api directory.
// Express app works directly - Vercel invokes default export with (req, res)
import app from '../backend/app.js'

export default app

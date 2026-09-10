// Local development server - NOT used by Vercel
import app from './app.js'

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Server is running on port ${port}!`)
})

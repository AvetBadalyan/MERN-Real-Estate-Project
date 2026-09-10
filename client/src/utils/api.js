// Base URL for API calls - empty in dev (uses Vite proxy), full URL in production
const API_URL = import.meta.env.VITE_API_URL || ''

export const apiUrl = path => `${API_URL}${path}`

export default API_URL

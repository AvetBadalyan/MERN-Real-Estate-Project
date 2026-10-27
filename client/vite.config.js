import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// '.' = project root; avoids referencing Node's `process` global (browser-env lint)
	const env = loadEnv(mode, '.', '')
	// Backend port — defaults to 3000; override with VITE_API_PROXY_TARGET if
	// your backend runs elsewhere (e.g. port 3000 is taken by another app).
	const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:3000'

	return {
		server: {
			proxy: {
				'/api': { target: apiTarget, secure: false },
				'/images': { target: apiTarget, secure: false },
			},
		},
		build: {
			sourcemap: true,
			rollupOptions: {
				output: {
					// Vite 8 uses Rolldown, whose manualChunks only accepts the
					// function form. Each entry maps a vendor package to its own
					// chunk so they're cached independently of app code.
					// recharts is intentionally NOT split out — it's only imported
					// in Listing.jsx (lazy), so the bundler groups it there
					// automatically. Splitting it would force an eager modulepreload
					// on every page, loading ~100 KB on the home page before it's
					// ever needed.
					manualChunks(id) {
						if (!id.includes('node_modules')) return
						if (
							/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
								id
							)
						)
							return 'react-vendor'
						if (
							/[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|redux-persist|redux|immer|reselect)[\\/]/.test(
								id
							)
						)
							return 'redux'
						if (/[\\/]node_modules[\\/]swiper[\\/]/.test(id)) return 'swiper'
						if (/[\\/]node_modules[\\/]@?firebase[\\/]/.test(id))
							return 'firebase'
					},
				},
			},
		},
		plugins: [react()],
	}
})

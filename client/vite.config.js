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
					manualChunks: {
						'react-vendor': ['react', 'react-dom', 'react-router-dom'],
						redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
						// recharts is intentionally NOT listed here — it's only imported
						// in Listing.jsx (lazy), so Vite bundles it there automatically.
						// Listing manualChunks would cause an eager modulepreload on every
						// page, loading 100 KB on the home page before it's ever needed.
						swiper: ['swiper'],
						firebase: ['firebase/app', 'firebase/auth'],
					},
				},
			},
		},
		plugins: [react()],
	}
})

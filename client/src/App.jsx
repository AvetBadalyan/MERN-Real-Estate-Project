import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'

// Route-level code splitting: each page (and its heavy deps like recharts and
// swiper) loads on demand instead of inflating the initial bundle.
const Home = lazy(() => import('./pages/Home'))
const AuthForm = lazy(() => import('./pages/AuthForm'))
const Search = lazy(() => import('./pages/Search'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Compare = lazy(() => import('./pages/Compare'))
const Listing = lazy(() => import('./pages/Listing'))
const ListingForm = lazy(() => import('./pages/ListingForm'))
const Profile = lazy(() => import('./pages/Profile'))

function PageFallback() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-slate-300" />
			<span className="sr-only">Loading…</span>
		</div>
	)
}

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-slate-100 dark:bg-slate-900">
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
				>
					Skip to content
				</a>
				<Header />
				<main id="main-content">
					<Suspense fallback={<PageFallback />}>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/sign-in" element={<AuthForm isSignUp={false} />} />
							<Route path="/sign-up" element={<AuthForm isSignUp={true} />} />
							<Route path="/search" element={<Search />} />
							<Route path="/favorites" element={<Favorites />} />
							<Route path="/compare" element={<Compare />} />
							<Route path="/listing/:listingId" element={<Listing />} />

							<Route element={<PrivateRoute />}>
								<Route path="/profile" element={<Profile />} />
								<Route
									path="/create-listing"
									element={<ListingForm mode="create" />}
								/>
								<Route
									path="/update-listing/:listingId"
									element={<ListingForm mode="update" />}
								/>
							</Route>
						</Routes>
					</Suspense>
				</main>
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
				/>
			</div>
		</BrowserRouter>
	)
}

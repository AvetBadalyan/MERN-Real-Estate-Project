import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import AuthForm from './pages/AuthForm'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Listing from './pages/Listing'
import ListingForm from './pages/ListingForm'
import Profile from './pages/Profile'
import Search from './pages/Search'

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-slate-100 dark:bg-slate-900">
				<Header />
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

import { useEffect, useState } from 'react'
import { FaHeart, FaMoon, FaSearch, FaSun } from 'react-icons/fa'
import { MdCompareArrows } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useFavorites } from '../context/FavoritesContext'
import { useTheme } from '../context/ThemeContext'
import { getAvatarImageUrl, handleAvatarImageError } from '../utils/images'

export default function Header() {
	const { currentUser } = useSelector(state => state.user)
	const { favoritesCount } = useFavorites()
	const { compareCount } = useCompare()
	const { darkMode, toggleDarkMode } = useTheme()
	const location = useLocation()
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		const urlParams = new URLSearchParams(location.search)
		urlParams.set('searchTerm', searchTerm)
		navigate(`/search?${urlParams.toString()}`)
	}

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const searchTermFromUrl = urlParams.get('searchTerm')
		setSearchTerm(searchTermFromUrl || '')
	}, [location.search])

	return (
		<header className="sticky top-0 z-50 bg-slate-200 px-4 shadow-md dark:bg-slate-800 sm:px-6">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-2 py-3">
				<Link to="/" className="flex h-11 shrink-0 items-center">
					<span className="flex whitespace-nowrap text-sm font-bold sm:text-xl">
						<span className="text-slate-700 dark:text-slate-300">
							Avet&apos;s
						</span>
						<span className="text-slate-900 dark:text-white">Estate</span>
					</span>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="flex flex-1 max-w-xs items-center rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-700 sm:max-w-sm sm:p-3 md:max-w-md"
				>
					<label htmlFor="header-search" className="sr-only">
						Search listings
					</label>
					<input
						id="header-search"
						type="text"
						placeholder="Search..."
						className="min-w-0 w-full bg-transparent focus:outline-none dark:text-white dark:placeholder-slate-400"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
					<button
						type="submit"
						aria-label="Search listings"
						className="p-2 text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-500"
					>
						<FaSearch className="h-5 w-5" />
					</button>
				</form>
				<ul className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4">
					<li className="hidden text-slate-700 hover:underline dark:text-slate-300 sm:inline">
						<Link to="/">Home</Link>
					</li>
					<li>
						<button
							onClick={toggleDarkMode}
							className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-300 hover:text-amber-500 dark:text-slate-300 dark:hover:bg-slate-700 sm:h-11 sm:w-11"
							aria-label={
								darkMode ? 'Switch to light mode' : 'Switch to dark mode'
							}
						>
							{darkMode ? (
								<FaSun className="h-5 w-5" />
							) : (
								<FaMoon className="h-5 w-5" />
							)}
						</button>
					</li>
					<li>
						<Link
							to="/compare"
							className="relative flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-300 hover:text-blue-500 dark:text-slate-300 dark:hover:bg-slate-700 sm:h-11 sm:w-11"
							title="Compare properties"
							aria-label="Compare properties"
						>
							<MdCompareArrows className="h-6 w-6" />
							{compareCount > 0 && (
								<span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
									{compareCount}
								</span>
							)}
						</Link>
					</li>
					<li>
						<Link
							to="/favorites"
							className="relative flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-300 hover:text-red-500 dark:text-slate-300 dark:hover:bg-slate-700 sm:h-11 sm:w-11"
							title="Your favorites"
							aria-label="Your favorites"
						>
							<FaHeart className="h-5 w-5" />
							{favoritesCount > 0 && (
								<span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
									{favoritesCount > 9 ? '9+' : favoritesCount}
								</span>
							)}
						</Link>
					</li>
					<li className="text-slate-700 dark:text-slate-300">
						{currentUser ? (
							<Link
								to="/profile"
								className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11"
							>
								<img
									className="h-8 w-8 rounded-full object-cover"
									src={getAvatarImageUrl(currentUser.avatar)}
									alt="Your profile"
									onError={handleAvatarImageError}
								/>
							</Link>
						) : (
							<Link
								to="/sign-in"
								className="flex h-10 items-center justify-center whitespace-nowrap rounded-md px-2 text-sm hover:bg-slate-300 hover:underline dark:hover:bg-slate-700 sm:h-11 sm:px-3 sm:text-base"
							>
								Sign in
							</Link>
						)}
					</li>
				</ul>
			</div>
		</header>
	)
}

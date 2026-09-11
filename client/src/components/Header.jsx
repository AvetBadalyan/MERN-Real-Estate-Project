/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import { FaHeart, FaMoon, FaSearch, FaSun } from 'react-icons/fa'
import { MdCompareArrows } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useFavorites } from '../context/FavoritesContext'
import { useTheme } from '../context/ThemeContext'
import { FALLBACK_AVATAR_IMAGE, getAvatarImageUrl } from '../utils/images'

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
				<Link to="/" className="shrink-0">
					<h1 className="flex whitespace-nowrap text-sm font-bold sm:text-xl">
						<span className="text-slate-500 dark:text-slate-400">Avet's</span>
						<span className="text-slate-700 dark:text-white">Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="flex flex-1 max-w-xs items-center rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-700 sm:max-w-sm sm:p-3 md:max-w-md"
				>
					<input
						type="text"
						placeholder="Search..."
						className="min-w-0 w-full bg-transparent focus:outline-none dark:text-white dark:placeholder-slate-400"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
					<button
						type="submit"
						className="p-1 text-slate-600 hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-500"
					>
						<FaSearch />
					</button>
				</form>
				<ul className="flex shrink-0 items-center gap-3 sm:gap-4">
					<li className="hidden text-slate-700 hover:underline dark:text-slate-300 sm:inline">
						<Link to="/">Home</Link>
					</li>
					<li>
						<button
							onClick={toggleDarkMode}
							className="flex items-center justify-center text-slate-700 transition-colors hover:text-amber-500 dark:text-slate-300"
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
							className="relative flex items-center text-slate-700 transition-colors hover:text-blue-500 dark:text-slate-300"
						>
							<MdCompareArrows className="h-6 w-6" />
							{compareCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
									{compareCount}
								</span>
							)}
						</Link>
					</li>
					<li>
						<Link
							to="/favorites"
							className="relative flex items-center text-slate-700 transition-colors hover:text-red-500 dark:text-slate-300"
						>
							<FaHeart className="h-5 w-5" />
							{favoritesCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
									{favoritesCount > 9 ? '9+' : favoritesCount}
								</span>
							)}
						</Link>
					</li>
					<li className="text-slate-700 hover:underline dark:text-slate-300">
						<Link to="/profile">
							{currentUser ? (
								<img
									className="h-7 w-7 rounded-full object-cover"
									src={getAvatarImageUrl(currentUser.avatar)}
									alt="profile"
									onError={e => {
										e.currentTarget.src = FALLBACK_AVATAR_IMAGE
									}}
								/>
							) : (
								'Sign in'
							)}
						</Link>
					</li>
				</ul>
			</div>
		</header>
	)
}

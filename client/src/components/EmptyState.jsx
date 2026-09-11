import { FaHome, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function EmptyState({
	title = 'No listings found',
	message = 'Try adjusting your search filters or browse all properties.',
	icon: Icon = FaSearch,
	showBrowseButton = true,
}) {
	return (
		<div className="flex w-full flex-col items-center justify-center py-16 text-center">
			{/* Illustration */}
			<div className="relative mb-6">
				<div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
					<Icon className="h-16 w-16 text-slate-300 dark:text-slate-600" />
				</div>
				<div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
					<FaHome className="h-6 w-6 text-amber-500" />
				</div>
			</div>

			{/* Text */}
			<h3 className="mb-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
				{title}
			</h3>
			<p className="mb-6 max-w-md text-slate-500 dark:text-slate-400">
				{message}
			</p>

			{/* Action button */}
			{showBrowseButton && (
				<Link
					to="/search"
					className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
				>
					<FaSearch className="h-4 w-4" />
					Browse all listings
				</Link>
			)}
		</div>
	)
}

import { FaHeart } from 'react-icons/fa'
import EmptyState from '../components/EmptyState'
import ListingItem from '../components/ListingItem'
import { useFavorites } from '../context/FavoritesContext'

export default function Favorites() {
	const { favorites } = useFavorites()

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-800 dark:text-white">
					My Favorites
					{favorites.length > 0 && (
						<span className="ml-3 text-lg font-normal text-slate-500 dark:text-slate-400">
							({favorites.length}{' '}
							{favorites.length === 1 ? 'property' : 'properties'})
						</span>
					)}
				</h1>
				<p className="mt-2 text-slate-600 dark:text-slate-400">
					Properties you&apos;ve saved for later
				</p>
			</div>

			{favorites.length === 0 ? (
				<EmptyState
					icon={FaHeart}
					title="No favorites yet"
					message="Start browsing and click the heart icon on properties you like to save them here."
					showBrowseButton={true}
				/>
			) : (
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{favorites.map(listing => (
						<ListingItem
							key={listing._id}
							listing={listing}
							className="w-full"
						/>
					))}
				</div>
			)}
		</div>
	)
}

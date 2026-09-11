import { FaHeart, FaRegHeart, FaVideo } from 'react-icons/fa'
import { MdCompareArrows, MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCompare } from '../context/CompareContext'
import { useFavorites } from '../context/FavoritesContext'
import { getListingImageUrl } from '../utils/images'

export default function ListingItem({
	listing,
	className = 'w-full sm:w-[330px]',
}) {
	const { isFavorite, toggleFavorite } = useFavorites()
	const { isInCompare, toggleCompare } = useCompare()
	const {
		_id,
		imageUrls,
		name,
		address,
		description,
		offer,
		discountPrice,
		regularPrice,
		type,
		bedrooms,
		bathrooms,
		premium,
	} = listing

	const listingImage = getListingImageUrl(imageUrls[0])

	const price = offer ? discountPrice : regularPrice
	const formattedPrice = price.toLocaleString('en-US')
	const rentSuffix = type === 'rent' ? ' / month' : ''
	const liked = isFavorite(_id)
	const inCompare = isInCompare(_id)

	const handleFavoriteClick = e => {
		e.preventDefault()
		e.stopPropagation()
		const added = toggleFavorite(listing)
		toast.success(added ? 'Added to favorites!' : 'Removed from favorites')
	}

	const handleCompareClick = e => {
		e.preventDefault()
		e.stopPropagation()
		const added = toggleCompare(listing)
		if (added === true) {
			toast.success('Added to compare')
		} else if (added === false) {
			toast.info('Removed from compare')
		}
		// null means max reached — toast is handled inside CompareContext
	}

	return (
		<div
			className={`group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800 ${className}`}
		>
			<Link to={`/listing/${_id}`}>
				<div className="relative overflow-hidden">
					<img
						src={listingImage}
						alt="listing cover"
						className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-[220px]"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
					{/* Favorite button */}
					<button
						onClick={handleFavoriteClick}
						className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-110"
						aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
					>
						{liked ? (
							<FaHeart className="h-5 w-5 text-red-500" />
						) : (
							<FaRegHeart className="h-5 w-5 text-slate-600" />
						)}
					</button>
					{/* Compare button */}
					<button
						onClick={handleCompareClick}
						className={`absolute right-14 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 ${
							inCompare
								? 'bg-blue-500 text-white'
								: 'bg-white/90 text-slate-600'
						}`}
						aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
					>
						<MdCompareArrows className="h-5 w-5" />
					</button>
					{offer && (
						<span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
							Special Offer
						</span>
					)}
					{premium && (
						<span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
							<FaVideo className="h-3 w-3" />
							Virtual Tour
						</span>
					)}
				</div>
				<div className="flex w-full flex-col gap-2 p-4">
					<p className="truncate text-lg font-semibold text-slate-700 transition-colors group-hover:text-amber-600 dark:text-slate-200">
						{name}
					</p>
					<div className="flex items-center gap-1">
						<MdLocationOn className="h-4 w-4 text-amber-600" />
						<p className="w-full truncate text-sm text-gray-600 dark:text-slate-400">
							{address}
						</p>
					</div>
					<p className="line-clamp-2 text-sm text-gray-600 dark:text-slate-400">
						{description}
					</p>
					<p className="mt-2 font-semibold text-slate-500 dark:text-slate-300">
						${formattedPrice}
						{rentSuffix}
					</p>
					<div className="flex gap-4 text-slate-700 dark:text-slate-400">
						<div className="text-xs font-bold">
							{bedrooms} {bedrooms > 1 ? 'beds' : 'bed'}
						</div>
						<div className="text-xs font-bold">
							{bathrooms} {bathrooms > 1 ? 'baths' : 'bath'}
						</div>
					</div>
				</div>
			</Link>
		</div>
	)
}

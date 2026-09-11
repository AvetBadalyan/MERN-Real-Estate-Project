import { FaBath, FaBed, FaCouch, FaParking, FaTimes } from 'react-icons/fa'
import { MdCompareArrows, MdLocationOn } from 'react-icons/md'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { useCompare } from '../context/CompareContext'
import { getListingImageUrl } from '../utils/images'

export default function Compare() {
	const { compareList, removeFromCompare, clearCompare } = useCompare()

	if (compareList.length === 0) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
				<h1 className="mb-8 text-3xl font-bold text-slate-800 dark:text-white">
					Compare Properties
				</h1>
				<EmptyState
					icon={MdCompareArrows}
					title="No properties to compare"
					message="Add up to 3 properties to compare by clicking the compare icon on listing cards."
					showBrowseButton={true}
				/>
			</div>
		)
	}

	const features = [
		{
			key: 'price',
			label: 'Price',
			format: l => {
				const price = l.offer ? l.discountPrice : l.regularPrice
				return `$${price.toLocaleString()}${l.type === 'rent' ? '/mo' : ''}`
			},
		},
		{
			key: 'type',
			label: 'Type',
			format: l => (l.type === 'rent' ? 'For Rent' : 'For Sale'),
		},
		{ key: 'bedrooms', label: 'Bedrooms', icon: FaBed },
		{ key: 'bathrooms', label: 'Bathrooms', icon: FaBath },
		{
			key: 'parking',
			label: 'Parking',
			icon: FaParking,
			format: l => (l.parking ? 'Yes' : 'No'),
		},
		{
			key: 'furnished',
			label: 'Furnished',
			icon: FaCouch,
			format: l => (l.furnished ? 'Yes' : 'No'),
		},
		{ key: 'address', label: 'Location', icon: MdLocationOn },
	]

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-800 dark:text-white">
						Compare Properties
					</h1>
					<p className="mt-2 text-slate-600 dark:text-slate-400">
						{compareList.length} of 3 properties selected
					</p>
				</div>
				<button
					onClick={clearCompare}
					className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
				>
					Clear All
				</button>
			</div>

			{/* Property Cards Row */}
			<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{compareList.map(listing => (
					<div
						key={listing._id}
						className="relative overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800"
					>
						<button
							onClick={() => removeFromCompare(listing._id)}
							className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
							aria-label="Remove from compare"
						>
							<FaTimes className="h-4 w-4" />
						</button>
						<Link to={`/listing/${listing._id}`}>
							<img
								src={getListingImageUrl(listing.imageUrls[0])}
								alt={listing.name}
								className="h-48 w-full object-cover"
							/>
							<div className="p-4">
								<h3 className="truncate text-lg font-semibold text-slate-800 dark:text-white">
									{listing.name}
								</h3>
								{listing.offer && (
									<span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
										Special Offer
									</span>
								)}
							</div>
						</Link>
					</div>
				))}
			</div>

			{/* Comparison Table */}
			<div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
								<th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
									Feature
								</th>
								{compareList.map(listing => (
									<th
										key={listing._id}
										className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
									>
										{listing.name.length > 20
											? listing.name.slice(0, 20) + '...'
											: listing.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{features.map((feature, idx) => (
								<tr
									key={feature.key}
									className={
										idx % 2 === 0
											? 'bg-white dark:bg-slate-800'
											: 'bg-slate-50 dark:bg-slate-700/50'
									}
								>
									<td className="px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">
										<div className="flex items-center gap-2">
											{feature.icon && <feature.icon className="h-4 w-4" />}
											{feature.label}
										</div>
									</td>
									{compareList.map(listing => (
										<td
											key={listing._id}
											className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200"
										>
											{feature.format
												? feature.format(listing)
												: listing[feature.key]}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{compareList.length < 3 && (
				<p className="mt-6 text-center text-slate-500 dark:text-slate-400">
					Add more properties from the{' '}
					<Link to="/search" className="text-blue-600 hover:underline">
						search page
					</Link>{' '}
					to compare.
				</p>
			)}
		</div>
	)
}

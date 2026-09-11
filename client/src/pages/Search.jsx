import { useCallback, useEffect, useState } from 'react'
import { FaMap, FaThLarge } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'
import ListingItem from '../components/ListingItem'
import ListingMap from '../components/ListingMap'
import SkeletonCard from '../components/SkeletonCard'

export default function Search() {
	const navigate = useNavigate()
	const location = useLocation()
	const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'
	const [sidebardata, setSidebardata] = useState({
		searchTerm: '',
		type: 'all',
		parking: false,
		furnished: false,
		offer: false,
		sort: 'createdAt',
		order: 'desc',
	})

	const [loading, setLoading] = useState(false)
	const [listings, setListings] = useState([])
	const [showMore, setShowMore] = useState(false)

	const getParams = useCallback(
		params => {
			const urlParams = new URLSearchParams(location.search)
			const result = {}
			params.forEach(param => {
				const value = urlParams.get(param)
				if (value !== null) result[param] = value
			})
			return result
		},
		[location.search]
	)

	useEffect(() => {
		const params = getParams([
			'searchTerm',
			'type',
			'parking',
			'furnished',
			'offer',
			'sort',
			'order',
		])

		setSidebardata({
			searchTerm: params.searchTerm || '',
			type: params.type || 'all',
			parking: params.parking === 'true',
			furnished: params.furnished === 'true',
			offer: params.offer === 'true',
			sort: params.sort || 'createdAt',
			order: params.order || 'desc',
		})

		const fetchListings = async () => {
			setLoading(true)
			setShowMore(false)
			try {
				const searchQuery = new URLSearchParams(params).toString()
				const res = await fetch(`/api/listing?${searchQuery}`)
				const data = await res.json()
				if (data.length === 0 && Object.keys(params).length > 0) {
					toast.info('No listings match your filters.')
				}
				setShowMore(data.length > 8)
				setListings(data)
			} catch (error) {
				toast.error('Failed to fetch listings.')
				console.error('Failed to fetch listings:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchListings()
	}, [location.search, getParams])

	const handleChange = useCallback(e => {
		const { id, value, checked, type, name } = e.target

		setSidebardata(prevData => {
			if (type === 'radio') {
				return { ...prevData, [name]: id }
			}
			if (type === 'checkbox') {
				return { ...prevData, [id]: checked }
			}
			if (id === 'sort_order') {
				const [sort, order] = value.split('_')
				return {
					...prevData,
					sort: sort || 'createdAt',
					order: order || 'desc',
				}
			}
			return { ...prevData, [id]: value }
		})
	}, [])

	const handleSubmit = e => {
		e.preventDefault()
		const urlParams = new URLSearchParams()
		Object.keys(sidebardata).forEach(key => {
			urlParams.set(key, sidebardata[key])
		})
		navigate(`/search?${urlParams.toString()}`)
	}

	const onShowMoreClick = async () => {
		const numberOfListings = listings.length
		const startIndex = numberOfListings
		const urlParams = new URLSearchParams(location.search)
		urlParams.set('startIndex', startIndex)

		try {
			const res = await fetch(`/api/listing?${urlParams.toString()}`)
			const data = await res.json()
			setShowMore(data.length >= 9)
			setListings(prevListings => [...prevListings, ...data])
		} catch (error) {
			toast.error('Failed to fetch more listings.')
			console.error('Failed to fetch more listings:', error)
		}
	}

	return (
		<div className="flex flex-col md:flex-row">
			<div className="border-b-2 bg-white px-4 py-6 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:px-6 md:min-h-screen md:w-80 md:border-b-0 md:border-r-2 lg:w-96">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<label className="font-semibold text-slate-800 dark:text-slate-200 sm:whitespace-nowrap">
							Search Term:
						</label>
						<input
							type="text"
							id="searchTerm"
							placeholder="Search..."
							className="w-full rounded-lg border border-slate-300 p-3 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
							value={sidebardata.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col gap-3">
						<label className="font-semibold text-slate-800 dark:text-slate-200">
							Type:
						</label>
						<div className="flex flex-wrap gap-3 text-slate-700 dark:text-slate-300">
							<div className="flex gap-2">
								<input
									type="radio"
									name="type"
									id="all"
									className="w-5"
									onChange={handleChange}
									checked={sidebardata.type === 'all'}
								/>
								<span>Rent & Sale</span>
							</div>
							<div className="flex gap-2">
								<input
									type="radio"
									name="type"
									id="rent"
									className="w-5"
									onChange={handleChange}
									checked={sidebardata.type === 'rent'}
								/>
								<span>Rent</span>
							</div>
							<div className="flex gap-2">
								<input
									type="radio"
									name="type"
									id="sale"
									className="w-5"
									onChange={handleChange}
									checked={sidebardata.type === 'sale'}
								/>
								<span>Sale</span>
							</div>
							<div className="flex gap-2">
								<input
									type="checkbox"
									id="offer"
									className="w-5"
									onChange={handleChange}
									checked={sidebardata.offer}
								/>
								<span>Offer</span>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
						<label className="font-semibold text-slate-800 dark:text-slate-200">
							Amenities:
						</label>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.parking}
							/>
							<span>Parking</span>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.furnished}
							/>
							<span>Furnished</span>
						</div>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<label className="font-semibold text-slate-800 dark:text-slate-200">
							Sort:
						</label>
						<select
							onChange={handleChange}
							value={`${sidebardata.sort}_${sidebardata.order}`}
							id="sort_order"
							className="w-full rounded-lg border border-slate-300 p-3 text-slate-800 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-auto"
						>
							<option value="regularPrice_desc">Price high to low</option>
							<option value="regularPrice_asc">Price low to high</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500">
						Search
					</button>
				</form>
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-between border-b px-4 py-4 dark:border-slate-700 sm:px-6">
					<h1 className="text-2xl font-semibold text-slate-700 dark:text-white sm:text-3xl">
						Listing results
						{listings.length > 0 && (
							<span className="ml-2 text-base font-normal text-slate-500 dark:text-slate-400">
								({listings.length})
							</span>
						)}
					</h1>
					{/* View Mode Toggle */}
					<div className="flex gap-1 rounded-lg bg-slate-200 p-1 dark:bg-slate-700">
						<button
							onClick={() => setViewMode('grid')}
							className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
								viewMode === 'grid'
									? 'bg-white text-slate-800 shadow dark:bg-slate-600 dark:text-white'
									: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
							}`}
						>
							<FaThLarge className="h-4 w-4" />
							<span className="hidden sm:inline">Grid</span>
						</button>
						<button
							onClick={() => setViewMode('map')}
							className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
								viewMode === 'map'
									? 'bg-white text-slate-800 shadow dark:bg-slate-600 dark:text-white'
									: 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
							}`}
						>
							<FaMap className="h-4 w-4" />
							<span className="hidden sm:inline">Map</span>
						</button>
					</div>
				</div>

				{viewMode === 'map' ? (
					<div className="p-4 sm:p-6">
						<ListingMap listings={listings} height="calc(100vh - 200px)" />
					</div>
				) : (
					<>
						<div className="flex flex-wrap gap-4 px-4 py-6 sm:px-6">
							{!loading && listings.length === 0 && (
								<EmptyState
									title="No listings found"
									message="We couldn't find any properties matching your criteria. Try adjusting your filters or search term."
									showBrowseButton={false}
								/>
							)}
							{loading && (
								<>
									{[...Array(8)].map((_, i) => (
										<SkeletonCard key={i} />
									))}
								</>
							)}
							{!loading &&
								listings &&
								listings.map(listing => (
									<ListingItem key={listing._id} listing={listing} />
								))}
						</div>
						{showMore && (
							<div className="flex justify-center py-8">
								<button
									onClick={onShowMoreClick}
									className="rounded-lg bg-slate-700 px-6 py-2 text-white transition hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
								>
									Show more
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

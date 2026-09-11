import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import EmptyState from '../components/EmptyState'
import ListingItem from '../components/ListingItem'
import SkeletonCard from '../components/SkeletonCard'
import { countries, getCitiesForCountry } from '../utils/countries'

export default function Search() {
	const navigate = useNavigate()
	const location = useLocation()
	const [availableCities, setAvailableCities] = useState([])
	const [sidebardata, setSidebardata] = useState({
		searchTerm: '',
		type: 'all',
		country: '',
		city: '',
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
			'country',
			'city',
			'parking',
			'furnished',
			'offer',
			'sort',
			'order',
		])

		const country = params.country || ''
		const city = params.city || ''

		// Update available cities if country is set
		if (country) {
			setAvailableCities(getCitiesForCountry(country))
		} else {
			setAvailableCities([])
		}

		setSidebardata({
			searchTerm: params.searchTerm || '',
			type: params.type || 'all',
			country,
			city,
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
			if (id === 'country') {
				// When country changes, reset city and update available cities
				setAvailableCities(value ? getCitiesForCountry(value) : [])
				return { ...prevData, country: value, city: '' }
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
						<label className="form-label sm:whitespace-nowrap">
							Search Term:
						</label>
						<input
							type="text"
							id="searchTerm"
							placeholder="Search..."
							className="form-input-inset w-full"
							value={sidebardata.searchTerm}
							onChange={handleChange}
						/>
					</div>

					{/* Country Filter */}
					<div className="flex flex-col gap-2">
						<label className="form-label">Country:</label>
						<select
							id="country"
							value={sidebardata.country}
							onChange={handleChange}
							className="form-input-inset w-full"
						>
							<option value="">All Countries</option>
							{countries.map(c => (
								<option key={c.code} value={c.name}>
									{c.flag} {c.name}
								</option>
							))}
						</select>
					</div>

					{/* City Filter */}
					{availableCities.length > 0 && (
						<div className="flex flex-col gap-2">
							<label className="form-label">City:</label>
							<select
								id="city"
								value={sidebardata.city}
								onChange={handleChange}
								className="form-input-inset w-full"
							>
								<option value="">All Cities</option>
								{availableCities.map(city => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>
					)}
					<div className="flex flex-col gap-3">
						<label className="form-label">Type:</label>
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
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
						<label className="form-label w-full">Amenities:</label>
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
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.offer}
							/>
							<span>Has Offer</span>
						</div>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<label className="form-label">Sort:</label>
						<select
							onChange={handleChange}
							value={`${sidebardata.sort}_${sidebardata.order}`}
							id="sort_order"
							className="form-input-inset w-full sm:w-auto"
						>
							<option value="regularPrice_desc">Price high to low</option>
							<option value="regularPrice_asc">Price low to high</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button
						type="submit"
						className="rounded-lg bg-slate-700 p-3 font-semibold uppercase text-white transition hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
					>
						Search
					</button>
				</form>
			</div>
			<div className="flex-1">
				<div className="border-b px-4 py-4 dark:border-slate-700 sm:px-6">
					<h1 className="text-2xl font-semibold text-slate-700 dark:text-white sm:text-3xl">
						Listing results
						{listings.length > 0 && (
							<span className="ml-2 text-base font-normal text-slate-500 dark:text-slate-400">
								({listings.length})
							</span>
						)}
					</h1>
				</div>

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
			</div>
		</div>
	)
}

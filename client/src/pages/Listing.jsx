import { useEffect, useState } from 'react'
import {
	FaArrowLeft,
	FaBath,
	FaBed,
	FaChair,
	FaMapMarkerAlt,
	FaParking,
	FaPlay,
	FaVideo,
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Contact from '../components/Contact'
import ImageGallery from '../components/ImageGallery'
import MortgageCalculator from '../components/MortgageCalculator'
import PriceHistoryChart from '../components/PriceHistoryChart'
import ShareButton from '../components/ShareButton'
import { getFlagForCountry } from '../utils/countries'

export default function Listing() {
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [contact, setContact] = useState(false)
	const params = useParams()
	const navigate = useNavigate()
	const { currentUser } = useSelector(state => state.user)

	useEffect(() => {
		const fetchListing = async () => {
			try {
				const res = await fetch(`/api/listing/${params.listingId}`)
				if (!res.ok) {
					throw new Error('Network response was not ok.')
				}
				const data = await res.json()
				if (data.success === false) {
					setError(true)
					setLoading(false)
					return
				}
				setListing(data)
				setLoading(false)
				setError(false)
			} catch (error) {
				console.error('Fetch error:', error)
				toast.error('Failed to fetch listing.')
				setError(true)
				setLoading(false)
			}
		}

		fetchListing()
	}, [params.listingId])

	if (loading) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
				<div className="animate-pulse space-y-4">
					<div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-700 sm:h-96" />
					<div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
					<div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
					<div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
					<div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center px-4">
				<p className="text-center text-2xl text-slate-600 dark:text-slate-400">
					Something went wrong!
				</p>
			</div>
		)
	}

	return (
		<main>
			{listing && (
				<div>
					<ImageGallery images={listing.imageUrls} />
					<div className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-4 sm:px-6">
						<button
							onClick={() => navigate(-1)}
							className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
							aria-label="Go back"
						>
							<FaArrowLeft className="h-4 w-4" />
							Back
						</button>
						<ShareButton title={listing.name} />
					</div>
					<div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6">
						<h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
							{listing.name}
						</h1>
						<p className="text-xl font-bold text-amber-700 dark:text-amber-400">
							$
							{listing.offer
								? listing.discountPrice.toLocaleString('en-US')
								: listing.regularPrice.toLocaleString('en-US')}
							{listing.type === 'rent' && (
								<span className="text-base font-medium text-slate-600 dark:text-slate-400">
									{' '}
									/ month
								</span>
							)}
						</p>
						<p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
							<FaMapMarkerAlt className="shrink-0 text-amber-600" />
							{listing.city && listing.country ? (
								<span>
									{listing.address}, {listing.city},{' '}
									{getFlagForCountry(listing.country)} {listing.country}
								</span>
							) : (
								listing.address
							)}
						</p>
						<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
							<p className="w-full max-w-[200px] rounded-md bg-slate-800 p-1 text-center text-white">
								{listing.type === 'rent' ? 'For Rent' : 'For Sale'}
							</p>
							{listing.offer && (
								<p className="w-full max-w-[200px] rounded-md bg-amber-600 p-1 text-center text-white">
									${+listing.regularPrice - +listing.discountPrice} OFF
								</p>
							)}
						</div>

						{/* Virtual Tour Banner for Premium Listings */}
						{listing.premium && (
							<div className="overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
											<FaVideo className="h-6 w-6 text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-white">
												Virtual Tour Available
											</h3>
											<p className="text-sm text-purple-200">
												Experience this property from anywhere
											</p>
										</div>
									</div>
									<button
										onClick={() =>
											toast.info(
												'Virtual tour feature coming soon! This is a demo.'
											)
										}
										className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-purple-600 transition hover:bg-purple-100"
									>
										<FaPlay className="h-3 w-3" />
										Start Tour
									</button>
								</div>
							</div>
						)}
						<p className="text-slate-800 dark:text-slate-300">
							<span className="font-semibold text-black dark:text-white">
								Description -{' '}
							</span>
							{listing.description}
						</p>
						<ul className="flex flex-wrap items-center gap-4 text-sm font-semibold text-amber-700 dark:text-amber-400">
							<li className="flex items-center gap-1 whitespace-nowrap">
								<FaBed className="text-lg" />
								{listing.bedrooms > 1
									? `${listing.bedrooms} beds`
									: `${listing.bedrooms} bed`}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap">
								<FaBath className="text-lg" />
								{listing.bathrooms > 1
									? `${listing.bathrooms} baths`
									: `${listing.bathrooms} bath`}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap">
								<FaParking className="text-lg" />
								{listing.parking ? 'Parking spot' : 'No Parking'}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap">
								<FaChair className="text-lg" />
								{listing.furnished ? 'Furnished' : 'Unfurnished'}
							</li>
						</ul>

						{/* Price History Chart */}
						<PriceHistoryChart
							currentPrice={
								listing.offer ? listing.discountPrice : listing.regularPrice
							}
							type={listing.type}
						/>

						{/* Mortgage Calculator */}
						<MortgageCalculator
							price={
								listing.offer ? listing.discountPrice : listing.regularPrice
							}
							type={listing.type}
						/>

						{!contact && (
							<button
								onClick={() => {
									if (!currentUser) {
										toast.info('Please sign in to contact the seller')
										return
									}
									if (listing.userRef === currentUser._id) {
										toast.info("You can't contact yourself!")
										return
									}
									setContact(true)
								}}
								className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
							>
								Contact seller
							</button>
						)}
						{contact && <Contact listing={listing} />}
					</div>
				</div>
			)}
		</main>
	)
}

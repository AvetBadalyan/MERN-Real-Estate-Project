import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { countries, getCitiesForCountry } from '../utils/countries'
import { getListingImageUrl } from '../utils/images'
import { uploadImage } from '../utils/uploadImage'

export default function ListingForm({ mode }) {
	const { currentUser } = useSelector(state => state.user)
	const navigate = useNavigate()
	const params = useParams()
	const [files, setFiles] = useState([])
	const [availableCities, setAvailableCities] = useState([])
	const [formData, setFormData] = useState({
		imageUrls: [],
		name: '',
		description: '',
		address: '',
		country: '',
		city: '',
		type: 'rent',
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountPrice: 0,
		offer: false,
		parking: false,
		furnished: false,
	})
	const [imageUploadError, setImageUploadError] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (mode === 'update') {
			const fetchListing = async () => {
				try {
					const res = await fetch(`/api/listing/${params.listingId}`)
					const data = await res.json()
					if (data.success === false) {
						console.error(data.message)
						return
					}
					setFormData(data)
					if (data.country) {
						setAvailableCities(getCitiesForCountry(data.country))
					}
				} catch (err) {
					toast.error('An error occurred while fetching the listing data')
					console.error(err)
				}
			}
			fetchListing()
		}
	}, [mode, params.listingId])

	const handleImageSubmit = () => {
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true)
			setImageUploadError(false)
			const promises = Array.from(files).map(file => uploadImage(file))
			Promise.all(promises)
				.then(urls => {
					setFormData(prev => ({
						...prev,
						imageUrls: prev.imageUrls.concat(urls),
					}))
					setUploading(false)
				})
				.catch(err => {
					console.error(err)
					const message = err.message || 'Image upload failed'
					setImageUploadError(message)
					toast.error(message)
					setUploading(false)
				})
		} else {
			setImageUploadError('You can only upload 6 images per listing')
			toast.error('You can only upload up to 6 images per listing')
			setUploading(false)
		}
	}

	const handleRemoveImage = index => {
		setFormData(prev => ({
			...prev,
			imageUrls: prev.imageUrls.filter((_, i) => i !== index),
		}))
	}

	const handleChange = e => {
		const { id, type, value, checked } = e.target
		if (type === 'radio' && checked) {
			setFormData(prev => ({ ...prev, type: value }))
		} else if (id === 'country') {
			setAvailableCities(value ? getCitiesForCountry(value) : [])
			setFormData(prev => ({ ...prev, country: value, city: '' }))
		} else {
			setFormData(prev => ({
				...prev,
				[id]: type === 'checkbox' ? checked : value,
			}))
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (formData.imageUrls.length < 1) {
			toast.error('You must upload at least one image')
			return setError('You must upload at least one image')
		}
		if (+formData.regularPrice < +formData.discountPrice) {
			toast.error('Discount price must be lower than regular price')
			return setError('Discount price must be lower than regular price')
		}
		setLoading(true)
		setError(false)
		try {
			const endpoint =
				mode === 'create' ? '/api/listing' : `/api/listing/${params.listingId}`
			const res = await fetch(endpoint, {
				method: mode === 'create' ? 'POST' : 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, userRef: currentUser._id }),
			})
			const data = await res.json()
			setLoading(false)
			if (data.success === false) {
				console.error(data.message)
				setError(data.message)
				return
			}
			toast.success('Listing successfully submitted!')
			navigate(`/listing/${data._id}`)
		} catch (err) {
			toast.error(err.message)
			setError(err.message)
			setLoading(false)
		}
	}

	return (
		<main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
			<h1 className="mb-6 text-center text-3xl font-semibold text-slate-900 dark:text-white">
				{mode === 'create' ? 'Create' : 'Update'} a Listing
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
				{/* ── Left column ── */}
				<div className="flex flex-1 flex-col gap-4">
					<input
						type="text"
						placeholder="Name"
						className="form-input"
						id="name"
						maxLength="62"
						minLength="10"
						required
						onChange={handleChange}
						value={formData.name}
					/>
					<textarea
						placeholder="Description"
						className="form-input"
						id="description"
						rows="4"
						required
						onChange={handleChange}
						value={formData.description}
					/>
					<input
						type="text"
						placeholder="Address"
						className="form-input"
						id="address"
						required
						onChange={handleChange}
						value={formData.address}
					/>

					{/* Country & City */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<div className="flex flex-1 flex-col gap-1">
							<label htmlFor="country" className="form-label">
								Country *
							</label>
							<select
								id="country"
								value={formData.country}
								onChange={handleChange}
								required
								className="form-input"
							>
								<option value="">Select Country</option>
								{countries.map(c => (
									<option key={c.code} value={c.name}>
										{c.flag} {c.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-1 flex-col gap-1">
							<label htmlFor="city" className="form-label">
								City *
							</label>
							<select
								id="city"
								value={formData.city}
								onChange={handleChange}
								required
								disabled={!formData.country}
								className="form-input disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="">
									{formData.country ? 'Select City' : 'Select country first'}
								</option>
								{availableCities.map(city => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Type & Amenities */}
					<div className="flex flex-wrap gap-3">
						<div className="flex items-center gap-2">
							<input
								type="radio"
								id="rent"
								name="listingType"
								className="h-4 w-4 accent-amber-600"
								value="rent"
								onChange={handleChange}
								checked={formData.type === 'rent'}
							/>
							<label htmlFor="rent" className="form-label">
								Rent
							</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								id="sale"
								name="listingType"
								className="h-4 w-4 accent-amber-600"
								value="sale"
								onChange={handleChange}
								checked={formData.type === 'sale'}
							/>
							<label htmlFor="sale" className="form-label">
								Sale
							</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="parking"
								className="h-4 w-4 accent-amber-600"
								onChange={handleChange}
								checked={formData.parking}
							/>
							<label htmlFor="parking" className="form-label">
								Parking spot
							</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="h-4 w-4 accent-amber-600"
								onChange={handleChange}
								checked={formData.furnished}
							/>
							<label htmlFor="furnished" className="form-label">
								Furnished
							</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="offer"
								className="h-4 w-4 accent-amber-600"
								onChange={handleChange}
								checked={formData.offer}
							/>
							<label htmlFor="offer" className="form-label">
								Special Offer
							</label>
						</div>
					</div>

					{/* Beds & Baths */}
					<div className="flex flex-wrap gap-4">
						<div className="flex flex-col gap-1">
							<label htmlFor="bedrooms" className="form-label">
								Bedrooms
							</label>
							<input
								type="number"
								className="form-input w-24"
								id="bedrooms"
								onChange={handleChange}
								value={formData.bedrooms}
								min="1"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="bathrooms" className="form-label">
								Bathrooms
							</label>
							<input
								type="number"
								className="form-input w-24"
								id="bathrooms"
								onChange={handleChange}
								value={formData.bathrooms}
								min="1"
								required
							/>
						</div>
					</div>

					{/* Prices */}
					<div className="flex flex-wrap gap-4">
						<div className="flex flex-col gap-1">
							<label htmlFor="regularPrice" className="form-label">
								Regular price
							</label>
							<div className="flex items-center gap-2">
								<input
									type="number"
									className="form-input w-36"
									id="regularPrice"
									onChange={handleChange}
									value={formData.regularPrice}
									min="50"
									required
								/>
								<span className="text-sm text-slate-500 dark:text-slate-400">
									{formData.type === 'rent' ? '$ / mo' : '$'}
								</span>
							</div>
						</div>
						{formData.offer && (
							<div className="flex flex-col gap-1">
								<label htmlFor="discountPrice" className="form-label">
									Discount price
								</label>
								<div className="flex items-center gap-2">
									<input
										type="number"
										className="form-input w-36"
										id="discountPrice"
										onChange={handleChange}
										value={formData.discountPrice}
										min="0"
										required={formData.offer}
									/>
									<span className="text-sm text-slate-500 dark:text-slate-400">
										{formData.type === 'rent' ? '$ / mo' : '$'}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* ── Right column: images ── */}
				<div className="flex flex-1 flex-col gap-4">
					<div className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-800">
						<p className="form-label mb-3">
							Photos{' '}
							<span className="font-normal text-slate-500 dark:text-slate-400">
								(up to 6)
							</span>
						</p>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{formData.imageUrls.map((url, i) => (
								<div
									key={i}
									className="group relative aspect-square overflow-hidden rounded-lg"
								>
									<img
										src={getListingImageUrl(url)}
										alt="Uploaded"
										className="h-full w-full object-cover"
									/>
									<button
										type="button"
										className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition group-hover:opacity-100"
										onClick={() => handleRemoveImage(i)}
										aria-label="Remove image"
									>
										✕
									</button>
								</div>
							))}
							{formData.imageUrls.length < 6 && (
								<div className="flex flex-col gap-2">
									<input
										type="file"
										className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-700 file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-sm file:text-slate-700 dark:border-slate-600 dark:text-slate-300 dark:file:bg-slate-700 dark:file:text-slate-300"
										multiple
										accept="image/*"
										onChange={e => setFiles(e.target.files)}
									/>
									<button
										type="button"
										className="w-full rounded-lg bg-amber-600 p-2 text-sm font-semibold uppercase text-white transition hover:bg-amber-700"
										onClick={handleImageSubmit}
									>
										{uploading ? 'Uploading\u2026' : 'Upload Images'}
									</button>
								</div>
							)}
						</div>
						{imageUploadError && (
							<p className="mt-3 text-sm text-red-600 dark:text-red-400">
								{imageUploadError}
							</p>
						)}
					</div>

					{error && (
						<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
					)}

					<button
						type="submit"
						className="rounded-lg bg-slate-700 p-3 font-semibold uppercase text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-600 dark:hover:bg-slate-500"
						disabled={loading}
					>
						{loading
							? 'Submitting\u2026'
							: mode === 'create'
								? 'Create Listing'
								: 'Update Listing'}
					</button>
				</div>
			</form>
		</main>
	)
}

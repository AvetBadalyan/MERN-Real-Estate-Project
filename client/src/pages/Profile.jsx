import { useEffect, useRef, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConfirmationModal from '../components/ConfirmationModal'
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from '../redux/user/userSlice'
import {
	FALLBACK_AVATAR_IMAGE,
	getAvatarImageUrl,
	getListingImageUrl,
} from '../utils/images'
import { uploadImage } from '../utils/uploadImage'

export default function Profile() {
	const fileRef = useRef(null)
	const { currentUser, loading } = useSelector(state => state.user)
	const [file, setFile] = useState(null)
	const [filePercentage, setFilePercentage] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [formData, setFormData] = useState({})
	const [showPassword, setShowPassword] = useState(false)
	const [showListingsError, setShowListingsError] = useState(false)
	const [userListings, setUserListings] = useState([])
	const [modalOpen, setModalOpen] = useState(false)
	const [confirmationAction, setConfirmationAction] = useState(() => () => {})
	const dispatch = useDispatch()

	useEffect(() => {
		if (file) {
			handleFileUpload(file)
		}
	}, [file])

	const handleFileUpload = async file => {
		try {
			setFileUploadError(false)
			setFilePercentage(10)
			const imageUrl = await uploadImage(file)
			setFormData(prev => ({ ...prev, avatar: imageUrl }))
			setFilePercentage(100)
			toast.success('Image successfully uploaded!')
		} catch (error) {
			setFileUploadError(error.message || 'Error uploading image')
			setFilePercentage(0)
			toast.error(error.message || 'Error uploading image')
			console.error(error)
		}
	}

	const handleChange = e => {
		const { id, value } = e.target
		setFormData(prev => ({ ...prev, [id]: value }))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		dispatch(updateUserStart())
		try {
			const res = await fetch(`/api/user/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(updateUserFailure(data.message))
				toast.error(data.message)
				return
			}
			dispatch(updateUserSuccess(data))
			toast.success('Profile updated successfully!')
		} catch (error) {
			dispatch(updateUserFailure(error.message))
			toast.error(error.message)
		}
	}

	const confirmAndExecute = action => {
		setConfirmationAction(() => action)
		setModalOpen(true)
	}

	const handleDeleteUser = async () => {
		confirmAndExecute(async () => {
			dispatch(deleteUserStart())
			try {
				const res = await fetch(`/api/user/${currentUser._id}`, {
					method: 'DELETE',
				})
				const data = await res.json()
				if (data.success === false) {
					dispatch(deleteUserFailure(data.message))
					toast.error(data.message)
					return
				}
				dispatch(deleteUserSuccess(data))
				toast.success('Account deleted successfully!')
			} catch (error) {
				dispatch(deleteUserFailure(error.message))
				toast.error(error.message)
			}
		})
	}

	const handleSignOut = async () => {
		dispatch(signOutUserStart())
		try {
			const res = await fetch('/api/auth/signout')
			const data = await res.json()
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message))
				console.error(data.message)
				return
			}
			dispatch(signOutUserSuccess())
			toast.success('Signed out successfully!')
		} catch (error) {
			dispatch(signOutUserFailure(error.message))
			toast.error(error.message)
		}
	}

	const handleShowListings = async () => {
		try {
			setShowListingsError(false)
			const res = await fetch(`/api/user/listings/${currentUser._id}`)
			const data = await res.json()
			if (data.success === false) {
				setShowListingsError(true)
				return
			}
			setUserListings(data)
		} catch (error) {
			setShowListingsError(true)
			toast.error('Error loading listings')
		}
	}

	const handleListingDelete = async listingId => {
		confirmAndExecute(async () => {
			try {
				const res = await fetch(`/api/listing/${listingId}`, {
					method: 'DELETE',
				})
				const data = await res.json()
				if (data.success === false) {
					console.error(data.message)
					return
				}
				setUserListings(prev =>
					prev.filter(listing => listing._id !== listingId)
				)
				toast.success('Listing deleted successfully!')
			} catch (error) {
				toast.error(error.message)
				console.error(error.message)
			}
		})
	}

	return (
		<div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
			<h1 className="mb-6 text-center text-3xl font-semibold dark:text-white">
				Profile
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={e => setFile(e.target.files[0])}
				/>
				<div className="group relative mt-2 h-24 w-24 cursor-pointer self-center">
					<img
						src={getAvatarImageUrl(formData.avatar || currentUser.avatar)}
						alt="profile"
						className="h-24 w-24 rounded-full object-cover transition-opacity group-hover:opacity-75"
						onClick={() => fileRef.current.click()}
						onError={e => {
							e.currentTarget.src = FALLBACK_AVATAR_IMAGE
						}}
					/>
					<div
						className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={() => fileRef.current.click()}
					>
						<span className="text-xs font-medium text-white">Change photo</span>
					</div>
				</div>
				<p className="self-center text-sm">
					{fileUploadError ? (
						<span className="text-red-600 dark:text-red-400">
							{fileUploadError}
						</span>
					) : filePercentage > 0 && filePercentage < 100 ? (
						<span className="text-slate-600 dark:text-slate-300">
							Uploading {filePercentage}%
						</span>
					) : filePercentage === 100 ? (
						<span className="text-green-700 dark:text-green-400">
							Image successfully uploaded!
						</span>
					) : null}
				</p>
				<input
					type="text"
					placeholder="Username"
					id="username"
					defaultValue={currentUser.username}
					className="rounded-lg border border-slate-300 p-3 text-slate-800 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="Email"
					id="email"
					defaultValue={currentUser.email}
					className="rounded-lg border border-slate-300 p-3 text-slate-800 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
					onChange={handleChange}
				/>
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="New password (leave blank to keep current)"
						id="password"
						className="w-full rounded-lg border border-slate-300 p-3 pr-10 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
						onChange={handleChange}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400"
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:bg-slate-800 disabled:opacity-80 dark:bg-slate-600 dark:hover:bg-slate-500"
				>
					{loading ? 'Loading...' : 'Update'}
				</button>
				<Link
					to="/create-listing"
					className="rounded-lg bg-amber-600 p-3 text-center uppercase text-white hover:bg-amber-700"
				>
					Create Listing
				</Link>
			</form>
			<div className="mt-4 flex justify-between">
				<span
					onClick={handleDeleteUser}
					className="cursor-pointer text-red-700 hover:underline dark:text-red-500"
				>
					Delete account
				</span>
				<span
					onClick={handleSignOut}
					className="cursor-pointer text-red-700 hover:underline dark:text-red-500"
				>
					Sign out
				</span>
			</div>

			<button
				className="mt-4 w-full rounded-lg bg-amber-600 p-3 text-center uppercase text-white hover:bg-amber-700"
				onClick={handleShowListings}
			>
				Show My Listings
			</button>
			{showListingsError && (
				<p className="mt-4 text-red-600 dark:text-red-400">
					Error loading listings. Please try again.
				</p>
			)}

			{userListings && userListings.length > 0 && (
				<div className="flex flex-col gap-4">
					<h1 className="mt-6 text-center text-2xl font-semibold dark:text-white">
						Your Listings
					</h1>
					{userListings.map(listing => (
						<div
							key={listing._id}
							className="flex flex-col gap-3 rounded-lg border p-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
						>
							<Link to={`/listing/${listing._id}`} className="w-full sm:w-auto">
								<img
									src={getListingImageUrl(listing.imageUrls[0])}
									alt="listing cover"
									className="h-28 w-full rounded-md object-cover sm:h-16 sm:w-16 sm:object-contain"
								/>
							</Link>
							<Link
								className="flex-1 truncate font-semibold text-slate-700 hover:underline dark:text-slate-200"
								to={`/listing/${listing._id}`}
							>
								<p>{listing.name}</p>
							</Link>

							<div className="flex w-full justify-between sm:w-auto sm:flex-col sm:items-center">
								<button
									onClick={() => handleListingDelete(listing._id)}
									className="uppercase text-red-700 hover:underline dark:text-red-500"
								>
									Delete
								</button>
								<Link to={`/update-listing/${listing._id}`}>
									<button className="uppercase text-amber-700 hover:underline dark:text-amber-500">
										Edit
									</button>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}

			<ConfirmationModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onConfirm={confirmationAction}
				message="Are you sure you want to proceed?"
			/>
		</div>
	)
}

import { useCallback, useEffect, useRef, useState } from 'react'
import {
	FaChevronLeft,
	FaChevronRight,
	FaExpand,
	FaTimes,
} from 'react-icons/fa'
import {
	FALLBACK_LISTING_IMAGE,
	getListingImageUrl,
	handleListingImageError,
} from '../utils/images'

export default function ImageGallery({ images }) {
	const safeImages = Array.isArray(images) && images.length > 0 ? images : null
	const [activeIndex, setActiveIndex] = useState(0)
	const [isFullscreen, setIsFullscreen] = useState(false)
	const closeButtonRef = useRef(null)
	// Remember what was focused before opening fullscreen, to restore on close.
	const triggerRef = useRef(null)

	const count = safeImages ? safeImages.length : 0

	const goToPrevious = useCallback(() => {
		setActiveIndex(prev => (prev === 0 ? count - 1 : prev - 1))
	}, [count])

	const goToNext = useCallback(() => {
		setActiveIndex(prev => (prev === count - 1 ? 0 : prev + 1))
	}, [count])

	// Keyboard navigation + scroll lock + focus management while fullscreen.
	useEffect(() => {
		if (!isFullscreen) return

		const handleKeyDown = e => {
			if (e.key === 'ArrowLeft') goToPrevious()
			if (e.key === 'ArrowRight') goToNext()
			if (e.key === 'Escape') setIsFullscreen(false)
		}

		document.addEventListener('keydown', handleKeyDown)
		document.body.style.overflow = 'hidden'
		closeButtonRef.current?.focus()

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
			// Restore focus to the element that opened the dialog.
			triggerRef.current?.focus()
		}
	}, [isFullscreen, goToPrevious, goToNext])

	if (!safeImages) {
		return (
			<div className="relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[500px]">
				<img
					src={FALLBACK_LISTING_IMAGE}
					alt="No images available"
					className="h-full w-full object-cover"
				/>
			</div>
		)
	}

	return (
		<>
			{/* Main Gallery */}
			<div className="relative">
				{/* Main Image */}
				<div className="relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[500px]">
					<img
						src={getListingImageUrl(safeImages[activeIndex])}
						alt={`Property image ${activeIndex + 1}`}
						onError={handleListingImageError}
						className="h-full w-full object-cover"
					/>

					{/* Navigation Arrows */}
					{count > 1 && (
						<>
							<button
								onClick={goToPrevious}
								className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
								aria-label="Previous image"
							>
								<FaChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={goToNext}
								className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
								aria-label="Next image"
							>
								<FaChevronRight className="h-5 w-5" />
							</button>
						</>
					)}

					{/* Fullscreen Button */}
					<button
						onClick={e => {
							triggerRef.current = e.currentTarget
							setIsFullscreen(true)
						}}
						className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
						aria-label="View fullscreen"
					>
						<FaExpand className="h-4 w-4" />
					</button>

					{/* Image Counter */}
					<div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
						{activeIndex + 1} / {count}
					</div>
				</div>

				{/* Thumbnails */}
				{count > 1 && (
					<div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-2 sm:px-0">
						{safeImages.map((img, idx) => (
							<button
								key={`${img}-${idx}`}
								onClick={() => setActiveIndex(idx)}
								aria-label={`View image ${idx + 1}`}
								aria-current={idx === activeIndex || undefined}
								className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg transition sm:h-20 sm:w-28 ${
									idx === activeIndex
										? 'ring-2 ring-amber-500 ring-offset-2'
										: 'opacity-70 hover:opacity-100'
								}`}
							>
								<img
									src={getListingImageUrl(img)}
									alt={`Thumbnail ${idx + 1}`}
									onError={handleListingImageError}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Fullscreen Modal */}
			{isFullscreen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black"
					role="dialog"
					aria-modal="true"
					aria-label="Image gallery fullscreen view"
				>
					{/* Close Button */}
					<button
						ref={closeButtonRef}
						onClick={() => setIsFullscreen(false)}
						className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
						aria-label="Close fullscreen"
					>
						<FaTimes className="h-6 w-6" />
					</button>

					{/* Main Image */}
					<img
						src={getListingImageUrl(safeImages[activeIndex])}
						alt={`Property image ${activeIndex + 1}`}
						onError={handleListingImageError}
						className="max-h-[90vh] max-w-[90vw] object-contain"
					/>

					{/* Navigation Arrows */}
					{count > 1 && (
						<>
							<button
								onClick={goToPrevious}
								className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
								aria-label="Previous image"
							>
								<FaChevronLeft className="h-6 w-6" />
							</button>
							<button
								onClick={goToNext}
								className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
								aria-label="Next image"
							>
								<FaChevronRight className="h-6 w-6" />
							</button>
						</>
					)}

					{/* Thumbnails */}
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2">
						{safeImages.map((img, idx) => (
							<button
								key={`${img}-${idx}`}
								onClick={() => setActiveIndex(idx)}
								aria-label={`View image ${idx + 1}`}
								aria-current={idx === activeIndex || undefined}
								className={`h-12 w-16 overflow-hidden rounded transition ${
									idx === activeIndex
										? 'ring-2 ring-amber-500'
										: 'opacity-50 hover:opacity-100'
								}`}
							>
								<img
									src={getListingImageUrl(img)}
									alt={`Thumbnail ${idx + 1}`}
									onError={handleListingImageError}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>

					{/* Image Counter */}
					<div className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-2 text-white">
						{activeIndex + 1} / {count}
					</div>
				</div>
			)}
		</>
	)
}

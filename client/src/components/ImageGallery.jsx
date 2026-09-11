import { useCallback, useEffect, useState } from 'react'
import {
	FaChevronLeft,
	FaChevronRight,
	FaExpand,
	FaTimes,
} from 'react-icons/fa'
import { getListingImageUrl } from '../utils/images'

export default function ImageGallery({ images }) {
	const [activeIndex, setActiveIndex] = useState(0)
	const [isFullscreen, setIsFullscreen] = useState(false)

	const goToPrevious = useCallback(() => {
		setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
	}, [images.length])

	const goToNext = useCallback(() => {
		setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
	}, [images.length])

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'ArrowLeft') goToPrevious()
			if (e.key === 'ArrowRight') goToNext()
			if (e.key === 'Escape') setIsFullscreen(false)
		}

		if (isFullscreen) {
			document.addEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isFullscreen, goToPrevious, goToNext])

	return (
		<>
			{/* Main Gallery */}
			<div className="relative">
				{/* Main Image */}
				<div className="relative h-[280px] overflow-hidden sm:h-[420px] lg:h-[500px]">
					<img
						src={getListingImageUrl(images[activeIndex])}
						alt={`Property image ${activeIndex + 1}`}
						className="h-full w-full object-cover"
					/>

					{/* Navigation Arrows */}
					{images.length > 1 && (
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
						onClick={() => setIsFullscreen(true)}
						className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
						aria-label="View fullscreen"
					>
						<FaExpand className="h-4 w-4" />
					</button>

					{/* Image Counter */}
					<div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
						{activeIndex + 1} / {images.length}
					</div>
				</div>

				{/* Thumbnails */}
				{images.length > 1 && (
					<div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-2 sm:px-0">
						{images.map((img, idx) => (
							<button
								key={img}
								onClick={() => setActiveIndex(idx)}
								className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg transition sm:h-20 sm:w-28 ${
									idx === activeIndex
										? 'ring-2 ring-amber-500 ring-offset-2'
										: 'opacity-70 hover:opacity-100'
								}`}
							>
								<img
									src={getListingImageUrl(img)}
									alt={`Thumbnail ${idx + 1}`}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Fullscreen Modal */}
			{isFullscreen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
					{/* Close Button */}
					<button
						onClick={() => setIsFullscreen(false)}
						className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
						aria-label="Close fullscreen"
					>
						<FaTimes className="h-6 w-6" />
					</button>

					{/* Main Image */}
					<img
						src={getListingImageUrl(images[activeIndex])}
						alt={`Property image ${activeIndex + 1}`}
						className="max-h-[90vh] max-w-[90vw] object-contain"
					/>

					{/* Navigation Arrows */}
					{images.length > 1 && (
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
						{images.map((img, idx) => (
							<button
								key={img}
								onClick={() => setActiveIndex(idx)}
								className={`h-12 w-16 overflow-hidden rounded transition ${
									idx === activeIndex
										? 'ring-2 ring-amber-500'
										: 'opacity-50 hover:opacity-100'
								}`}
							>
								<img
									src={getListingImageUrl(img)}
									alt={`Thumbnail ${idx + 1}`}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>

					{/* Image Counter */}
					<div className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-2 text-white">
						{activeIndex + 1} / {images.length}
					</div>
				</div>
			)}
		</>
	)
}

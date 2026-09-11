import { useState } from 'react'
import {
	FaCheck,
	FaEnvelope,
	FaFacebook,
	FaLink,
	FaShare,
	FaTimes,
	FaTwitter,
	FaWhatsapp,
} from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function ShareButton({ title, url }) {
	const [isOpen, setIsOpen] = useState(false)
	const [copied, setCopied] = useState(false)

	const shareUrl = url || window.location.href
	const shareTitle = title || 'Check out this property!'

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl)
			setCopied(true)
			toast.success('Link copied to clipboard!')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Failed to copy link')
		}
	}

	const shareOptions = [
		{
			name: 'Copy Link',
			icon: copied ? FaCheck : FaLink,
			onClick: handleCopyLink,
			color: copied ? 'text-green-500' : 'text-slate-600 dark:text-slate-300',
		},
		{
			name: 'Facebook',
			icon: FaFacebook,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
			color: 'text-blue-600',
		},
		{
			name: 'Twitter',
			icon: FaTwitter,
			href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
			color: 'text-sky-500',
		},
		{
			name: 'WhatsApp',
			icon: FaWhatsapp,
			href: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
			color: 'text-green-500',
		},
		{
			name: 'Email',
			icon: FaEnvelope,
			href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent('Check out this property: ' + shareUrl)}`,
			color: 'text-amber-600',
		},
	]

	// Use native share if available
	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: shareTitle,
					url: shareUrl,
				})
			} catch (err) {
				// User cancelled or error
				if (err.name !== 'AbortError') {
					setIsOpen(true)
				}
			}
		} else {
			setIsOpen(true)
		}
	}

	return (
		<div className="relative">
			{/* Main Share Button */}
			<button
				onClick={handleNativeShare}
				className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-100 transition hover:bg-amber-100 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-amber-900/50 sm:h-12 sm:w-12"
				aria-label="Share this listing"
			>
				<FaShare className="h-4 w-4 text-slate-500 dark:text-slate-300" />
			</button>

			{/* Share Modal */}
			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-40 bg-black/20"
						onClick={() => setIsOpen(false)}
					/>

					{/* Modal */}
					<div className="absolute right-0 top-14 z-50 w-64 rounded-xl bg-white p-4 shadow-xl dark:bg-slate-800">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="font-semibold text-slate-800 dark:text-white">
								Share Property
							</h3>
							<button
								onClick={() => setIsOpen(false)}
								className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
							>
								<FaTimes />
							</button>
						</div>

						<div className="space-y-1">
							{shareOptions.map(option => {
								const Icon = option.icon
								if (option.href) {
									return (
										<a
											key={option.name}
											href={option.href}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
										>
											<Icon className={`h-5 w-5 ${option.color}`} />
											<span className="text-sm text-slate-700 dark:text-slate-200">
												{option.name}
											</span>
										</a>
									)
								}
								return (
									<button
										key={option.name}
										onClick={option.onClick}
										className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-700"
									>
										<Icon className={`h-5 w-5 ${option.color}`} />
										<span className="text-sm text-slate-700 dark:text-slate-200">
											{option.name}
										</span>
									</button>
								)
							})}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

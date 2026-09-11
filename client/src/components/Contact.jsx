import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Contact({ listing }) {
	const [seller, setSeller] = useState(null)
	const [message, setMessage] = useState('')

	const onChange = e => {
		setMessage(e.target.value)
	}

	useEffect(() => {
		const fetchSeller = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`)
				const data = await res.json()
				if (!res.ok || data.success === false) {
					throw new Error(data.message || 'Error fetching seller information')
				}
				setSeller(data)
			} catch (error) {
				console.error('Error fetching seller:', error)
				toast.error(
					'Error fetching seller information. Please try again later.'
				)
			}
		}

		fetchSeller()
	}, [listing.userRef])

	if (!seller) {
		return (
			<div className="flex items-center gap-2 py-3 text-sm text-slate-500 dark:text-slate-400">
				<div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300" />
				Loading seller info...
			</div>
		)
	}

	const subject = encodeURIComponent(`Regarding ${listing.name}`)
	const body = encodeURIComponent(message)

	return (
		<div className="flex flex-col gap-3">
			<p className="text-sm text-slate-700 dark:text-slate-300">
				Contact{' '}
				<span className="font-semibold text-slate-900 dark:text-white">
					{seller.username}
				</span>{' '}
				about{' '}
				<span className="font-semibold text-slate-900 dark:text-white">
					{listing.name}
				</span>
			</p>
			<textarea
				name="message"
				id="message"
				rows="3"
				value={message}
				onChange={onChange}
				placeholder="Enter your message here..."
				className="form-input w-full"
			/>
			<Link
				to={`mailto:${seller.email}?subject=${subject}&body=${body}`}
				className="rounded-lg bg-slate-700 p-3 text-center font-semibold uppercase text-white transition hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
			>
				Send Message
			</Link>
		</div>
	)
}

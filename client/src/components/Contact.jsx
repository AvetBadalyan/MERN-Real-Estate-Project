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
		return null
	}

	const subject = encodeURIComponent(`Regarding ${listing.name}`)
	const body = encodeURIComponent(message)

	return (
		<div className="flex flex-col gap-2">
			<p>
				Contact <span className="font-semibold">{seller.username}</span> for{' '}
				<span className="font-semibold">{listing.name.toLowerCase()}</span>
			</p>
			<textarea
				name="message"
				id="message"
				rows="2"
				value={message}
				onChange={onChange}
				placeholder="Enter your message here..."
				className="w-full rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
			></textarea>
			<Link
				to={`mailto:${seller.email}?subject=${subject}&body=${body}`}
				className="rounded-lg bg-slate-700 p-3 text-center uppercase text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
			>
				Send Message
			</Link>
		</div>
	)
}

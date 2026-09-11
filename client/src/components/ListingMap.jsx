import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { getListingImageUrl } from '../utils/images'

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
	shadowUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icon
const customIcon = new L.Icon({
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
	iconRetinaUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
	shadowUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
})

// Mock coordinates for demo - in production you'd geocode addresses
function getMockCoordinates(listing) {
	// Generate consistent coordinates based on listing ID
	const hash = listing._id
		.split('')
		.reduce((acc, char) => acc + char.charCodeAt(0), 0)

	// Center around Yerevan, Armenia with variation
	const baseLat = 40.1792
	const baseLng = 44.4991
	const latOffset = ((hash % 100) - 50) * 0.01
	const lngOffset = (((hash * 7) % 100) - 50) * 0.01

	return {
		lat: baseLat + latOffset,
		lng: baseLng + lngOffset,
	}
}

export default function ListingMap({ listings, height = '400px' }) {
	const [mapReady, setMapReady] = useState(false)

	useEffect(() => {
		setMapReady(true)
	}, [])

	if (!listings || listings.length === 0) {
		return (
			<div
				className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"
				style={{ height }}
			>
				<div className="text-center">
					<FaMapMarkerAlt className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
					<p className="mt-2 text-slate-500 dark:text-slate-400">
						No listings to display on map
					</p>
				</div>
			</div>
		)
	}

	// Get center of all listings
	const coordinates = listings.map(l => getMockCoordinates(l))
	const centerLat =
		coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length
	const centerLng =
		coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length

	if (!mapReady) {
		return (
			<div
				className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"
				style={{ height }}
			>
				<p className="text-slate-500 dark:text-slate-400">Loading map...</p>
			</div>
		)
	}

	return (
		<div className="overflow-hidden rounded-xl shadow-lg" style={{ height }}>
			<MapContainer
				center={[centerLat, centerLng]}
				zoom={12}
				style={{ height: '100%', width: '100%' }}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{listings.map(listing => {
					const coords = getMockCoordinates(listing)
					const price = listing.offer
						? listing.discountPrice
						: listing.regularPrice
					return (
						<Marker
							key={listing._id}
							position={[coords.lat, coords.lng]}
							icon={customIcon}
						>
							<Popup>
								<div className="w-48">
									<Link to={`/listing/${listing._id}`}>
										<img
											src={getListingImageUrl(listing.imageUrls[0])}
											alt={listing.name}
											className="mb-2 h-24 w-full rounded object-cover"
										/>
										<h3 className="truncate font-semibold text-slate-800">
											{listing.name}
										</h3>
										<p className="text-sm font-bold text-amber-600">
											${price.toLocaleString()}
											{listing.type === 'rent' ? '/mo' : ''}
										</p>
										<p className="text-xs text-slate-500">
											{listing.bedrooms} bed · {listing.bathrooms} bath
										</p>
									</Link>
								</div>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
		</div>
	)
}

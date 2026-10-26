import placeholderAvatar from '../assets/placeholder-avatar.svg'
import placeholderListing from '../assets/placeholder-listing.svg'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkaknfwcl'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

export const FALLBACK_LISTING_IMAGE = placeholderListing
export const FALLBACK_AVATAR_IMAGE = placeholderAvatar

// Cloudinary lets you add transform parameters right inside the URL path.
// Inserting f_auto,q_auto:eco,w_X after /upload/ tells Cloudinary to:
//   f_auto      → serve WebP or AVIF instead of JPEG/PNG (smaller, same look)
//   q_auto:eco  → pick quality automatically, favouring smaller files
//   w_X         → resize to the width we actually display, so we don't
//                 download a huge image for a small card
function withTransforms(url, width = 800) {
	if (!url || typeof url !== 'string') return url
	if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
	if (url.includes('f_auto')) return url // transforms already added, skip
	return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width}/`)
}

// The hero image on the home page — wide because it fills the screen.
export const HERO_IMAGE = withTransforms(
	`${BASE_URL}/avets-estate/ixodcblawsxjfc2c0vmj.png`,
	1400
)

// Listing cards display at roughly 300–400px wide, so 450 covers retina too.
export function getListingImageUrl(url, fallback = FALLBACK_LISTING_IMAGE, width = 450) {
	if (!url) return fallback
	return withTransforms(url, width)
}

export function getAvatarImageUrl(url) {
	if (!url) return FALLBACK_AVATAR_IMAGE
	return withTransforms(url, 160)
}

// onError handler for <img> elements.
// If the image fails to load, swap in the local SVG fallback.
// The src check prevents an infinite loop if the fallback itself ever fails.
export function handleListingImageError(e) {
	if (e.currentTarget.src !== FALLBACK_LISTING_IMAGE) {
		e.currentTarget.src = FALLBACK_LISTING_IMAGE
	}
}

export function handleAvatarImageError(e) {
	if (e.currentTarget.src !== FALLBACK_AVATAR_IMAGE) {
		e.currentTarget.src = FALLBACK_AVATAR_IMAGE
	}
}

import placeholderAvatar from '../assets/placeholder-avatar.svg'
import placeholderListing from '../assets/placeholder-listing.svg'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkaknfwcl'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

export const FALLBACK_LISTING_IMAGE = placeholderListing
export const FALLBACK_AVATAR_IMAGE = placeholderAvatar

// Cloudinary lets you add transform parameters right inside the URL path.
// Inserting f_auto,q_auto,w_X after /upload/ tells Cloudinary to:
//   f_auto → serve WebP or AVIF instead of JPEG/PNG (smaller file, same quality)
//   q_auto → let Cloudinary pick the best quality level automatically
//   w_X    → resize to the given width so we don't download a 4K image for a card
function withTransforms(url, width = 800) {
	if (!url || typeof url !== 'string') return url
	if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
	if (url.includes('f_auto')) return url // transforms already added, skip
	return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}

// The hero image on the home page — extra wide because it fills the screen.
export const HERO_IMAGE = withTransforms(
	`${BASE_URL}/avets-estate/ixodcblawsxjfc2c0vmj.png`,
	1600
)

export function getListingImageUrl(url, fallback = FALLBACK_LISTING_IMAGE, width = 800) {
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

import placeholderAvatar from '../assets/placeholder-avatar.svg'
import placeholderListing from '../assets/placeholder-listing.svg'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkaknfwcl'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

export const FALLBACK_LISTING_IMAGE = placeholderListing
export const FALLBACK_AVATAR_IMAGE = placeholderAvatar

// Adds Cloudinary delivery transforms to a URL so the browser gets a modern
// format (WebP/AVIF) at the right size instead of a full-resolution JPEG.
//   f_auto     → best format the browser supports (WebP, AVIF)
//   q_auto:eco → Cloudinary picks quality, leaning toward smaller file size
//   w_X        → resize to the requested width
function withTransforms(url, width = 800) {
	if (!url || typeof url !== 'string') return url
	if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
	if (url.includes('f_auto')) return url // transforms already present, skip
	return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width}/`)
}

// ─── Hero image ───────────────────────────────────────────────────────────────
const HERO_ID = `${BASE_URL}/avets-estate/ixodcblawsxjfc2c0vmj.png`

// Default src for browsers that don't support srcset (all modern ones do).
export const HERO_IMAGE = withTransforms(HERO_ID, 1600)

// Responsive sizes: mobile gets 800 w (saves ~50 KB on slow 4G),
// tablets get 1200 w, desktops get 1600 w.
// The widths here MUST match the imagesrcset in the <link rel="preload">
// in index.html so the browser reuses the preloaded resource.
export const HERO_SRCSET = [
	`${withTransforms(HERO_ID, 800)} 800w`,
	`${withTransforms(HERO_ID, 1200)} 1200w`,
	`${withTransforms(HERO_ID, 1600)} 1600w`,
].join(', ')

// ─── Listing & avatar helpers ─────────────────────────────────────────────────

// Listing cards show at ~300–400 px wide; 450 px covers 2× retina without waste.
export function getListingImageUrl(url, fallback = FALLBACK_LISTING_IMAGE, width = 450) {
	if (!url) return fallback
	return withTransforms(url, width)
}

export function getAvatarImageUrl(url) {
	if (!url) return FALLBACK_AVATAR_IMAGE
	return withTransforms(url, 160)
}

// onError handler for <img> elements — swaps in a local SVG fallback once.
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

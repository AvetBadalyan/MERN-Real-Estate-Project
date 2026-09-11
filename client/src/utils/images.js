// Cloudinary account used for the app's static/fallback assets.
// Falls back to the project's cloud name so builds work without the env var set.
const CLOUDINARY_CLOUD_NAME =
	import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkaknfwcl'

const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`

export const HERO_IMAGE = `${CLOUDINARY_BASE}/v1789063531/avets-estate/ixodcblawsxjfc2c0vmj.png`

const FALLBACK_LISTING_IMAGE = `${CLOUDINARY_BASE}/v1789063532/avets-estate/fnxl0vhkyq6zv5cm09sg.jpg`

export const FALLBACK_AVATAR_IMAGE = `${CLOUDINARY_BASE}/v1789063533/avets-estate/jmk8vydzrnzx7uvfbqr9.svg`

export const getListingImageUrl = (
	imageUrl,
	fallback = FALLBACK_LISTING_IMAGE
) => {
	if (!imageUrl) return fallback
	return imageUrl
}

export const getAvatarImageUrl = imageUrl => {
	if (!imageUrl) return FALLBACK_AVATAR_IMAGE
	return imageUrl
}

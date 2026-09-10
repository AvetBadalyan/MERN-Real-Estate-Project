const FALLBACK_LISTING_IMAGE =
	'/images/1718130801032_hero-real-estate-facts-trends.jpeg'
export const FALLBACK_AVATAR_IMAGE = '/images/default-avatar.svg'

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

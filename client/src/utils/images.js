const FALLBACK_LISTING_IMAGE =
	'https://res.cloudinary.com/dkaknfwcl/image/upload/v1789063532/avets-estate/fnxl0vhkyq6zv5cm09sg.jpg'
export const FALLBACK_AVATAR_IMAGE =
	'https://res.cloudinary.com/dkaknfwcl/image/upload/v1789063533/avets-estate/jmk8vydzrnzx7uvfbqr9.svg'

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

// Shared input-sanitizing helpers used by controllers.

// Fields a client is allowed to set on a listing. Anything else in req.body
// (e.g. userRef, _id, createdAt, __v) is ignored to prevent mass assignment.
const ALLOWED_LISTING_FIELDS = [
	'name',
	'description',
	'address',
	'country',
	'city',
	'regularPrice',
	'discountPrice',
	'bathrooms',
	'bedrooms',
	'furnished',
	'parking',
	'type',
	'offer',
	'premium',
	'imageUrls',
]

// Pick only the whitelisted listing fields from an arbitrary object.
export const pickListingFields = body => {
	const result = {}
	for (const key of ALLOWED_LISTING_FIELDS) {
		if (body[key] !== undefined) result[key] = body[key]
	}
	return result
}

// Escape regex metacharacters so a user's search term can't inject a pattern
// (prevents ReDoS and unexpected matches).
export const escapeRegex = (str = '') =>
	String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Only these fields may be sorted on, and order is constrained to asc/desc.
const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'regularPrice'])

export const sanitizeSort = (sort, order) => {
	const safeSort = ALLOWED_SORT_FIELDS.has(sort) ? sort : 'createdAt'
	const safeOrder = order === 'asc' ? 'asc' : 'desc'
	return { sort: safeSort, order: safeOrder }
}

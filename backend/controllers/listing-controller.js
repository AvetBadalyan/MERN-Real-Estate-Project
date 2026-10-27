import Listing from '../models/listing-model.js'
import { errorHandler } from '../utils/error.js'
import {
	escapeRegex,
	pickListingFields,
	sanitizeSort,
} from '../utils/sanitize.js'

export const createListing = async (req, res, next) => {
	try {
		const listing = await Listing.create({
			...pickListingFields(req.body),
			userRef: req.user.id,
		})
		return res.status(201).json(listing)
	} catch (error) {
		next(error)
	}
}

export const deleteListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id)

		if (!listing) {
			return next(errorHandler(404, 'Listing not found!'))
		}

		if (req.user.id !== listing.userRef) {
			return next(errorHandler(401, 'You can only delete your own listings!'))
		}

		await Listing.findByIdAndDelete(req.params.id)
		res.status(200).json('Listing has been deleted!')
	} catch (error) {
		next(error)
	}
}

export const updateListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id)
		if (!listing) {
			return next(errorHandler(404, 'Listing not found!'))
		}
		if (req.user.id !== listing.userRef) {
			return next(errorHandler(401, 'You can only update your own listings!'))
		}

		const updatedListing = await Listing.findByIdAndUpdate(
			req.params.id,
			// Whitelist fields and re-pin ownership so the body can't overwrite userRef.
			{ ...pickListingFields(req.body), userRef: listing.userRef },
			{ new: true, runValidators: true }
		)
		res.status(200).json(updatedListing)
	} catch (error) {
		next(error)
	}
}

// Cache public, read-only listing responses at Vercel's edge. s-maxage serves
// repeat requests from the CDN (skipping the serverless cold start + DB query),
// and stale-while-revalidate serves slightly stale data instantly while the
// cache refreshes in the background. Listings change rarely, so 60s is safe.
const LISTING_CACHE_CONTROL =
	'public, s-maxage=60, stale-while-revalidate=300'

export const getListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id)
		if (!listing) {
			return next(errorHandler(404, 'Listing not found!'))
		}
		res.set('Cache-Control', LISTING_CACHE_CONTROL)
		res.status(200).json(listing)
	} catch (error) {
		next(error)
	}
}

export const getListings = async (req, res, next) => {
	try {
		const limit = parseInt(req.query.limit) || 9
		const startIndex = parseInt(req.query.startIndex) || 0
		let offer = req.query.offer

		if (offer === 'true') {
			offer = true
		} else if (offer === undefined || offer === 'false') {
			offer = { $in: [false, true] }
		}

		let furnished = req.query.furnished

		if (furnished === undefined || furnished === 'false') {
			furnished = { $in: [false, true] }
		}

		let parking = req.query.parking

		if (parking === undefined || parking === 'false') {
			parking = { $in: [false, true] }
		}

		let premium = req.query.premium

		if (premium === 'true') {
			premium = true
		} else if (premium === undefined || premium === 'false') {
			premium = { $in: [false, true] }
		}

		let type = req.query.type

		if (type === undefined || type === 'all') {
			type = { $in: ['sale', 'rent'] }
		}

		const searchTerm = req.query.searchTerm || ''

		// Constrain sort/order to a known-safe set.
		const { sort, order } = sanitizeSort(req.query.sort, req.query.order)

		// Build query object (escape the search term so it can't inject a regex)
		const query = {
			name: { $regex: escapeRegex(searchTerm), $options: 'i' },
			offer,
			furnished,
			parking,
			premium,
			type,
		}

		// Add country filter if provided
		if (req.query.country && req.query.country !== '') {
			query.country = req.query.country
		}

		// Add city filter if provided
		if (req.query.city && req.query.city !== '') {
			query.city = req.query.city
		}

		const listings = await Listing.find(query)
			.sort({ [sort]: order })
			.limit(limit)
			.skip(startIndex)

		res.set('Cache-Control', LISTING_CACHE_CONTROL)
		return res.status(200).json(listings)
	} catch (error) {
		next(error)
	}
}

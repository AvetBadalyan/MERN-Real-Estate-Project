import { errorHandler } from './error.js'

// Matches a 24-character hex string — the shape of a MongoDB ObjectId.
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/

// Route middleware that rejects a request whose :id param isn't a valid
// ObjectId. This preserves the behavior of the old Express 4 inline-regex
// routes (`/:id([0-9a-fA-F]{24})`): a malformed id never reaches the
// controller and is answered with a 404, instead of hitting the database
// and surfacing a Mongoose CastError. Express 5 (path-to-regexp v8) no
// longer supports inline regex in route paths, so the check lives here.
export const validateObjectId = (req, _res, next) => {
	if (!OBJECT_ID_REGEX.test(req.params.id)) {
		return next(errorHandler(404, 'Not found'))
	}
	next()
}

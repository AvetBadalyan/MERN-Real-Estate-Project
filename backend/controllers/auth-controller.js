import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'
import { errorHandler } from './../utils/error.js'

const TOKEN_EXPIRY = '7d'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

const getCookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'strict',
	maxAge: COOKIE_MAX_AGE,
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const signup = async (req, res, next) => {
	const { username, email, password } = req.body

	if (!username || !email || !password) {
		return next(errorHandler(400, 'All fields are required'))
	}
	if (typeof username !== 'string' || username.trim().length < 3) {
		return next(errorHandler(400, 'Username must be at least 3 characters'))
	}
	if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
		return next(errorHandler(400, 'Please provide a valid email address'))
	}
	if (typeof password !== 'string' || password.length < 6) {
		return next(errorHandler(400, 'Password must be at least 6 characters'))
	}

	const hashedPassword = bcryptjs.hashSync(password, 10)
	const newUser = new User({ username, email, password: hashedPassword })
	try {
		await newUser.save()
		res.status(201).json('User created successfully')
	} catch (error) {
		next(error)
	}
}

export const signin = async (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) {
		return next(errorHandler(400, 'Email and password are required'))
	}
	try {
		// Coerce to string so an object (e.g. { $gt: '' }) can't be used as a query operator.
		const validUser = await User.findOne({ email: String(email) })
		if (!validUser) {
			return next(errorHandler(404, 'user not found!'))
		}
		const validPassword = bcryptjs.compareSync(password, validUser.password)
		if (!validPassword) {
			return next(errorHandler(401, 'Wrong credentials!'))
		}
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
			expiresIn: TOKEN_EXPIRY,
		})
		const { password: _pass, ...rest } = validUser._doc
		res.cookie('access_token', token, getCookieOptions()).status(200).json(rest)
	} catch (error) {
		next(error)
	}
}

export const google = async (req, res, next) => {
	const { email, name, photo } = req.body
	if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
		return next(errorHandler(400, 'A valid email is required'))
	}
	try {
		const user = await User.findOne({ email })
		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: TOKEN_EXPIRY,
			})
			const { password: _pass, ...rest } = user._doc
			res
				.cookie('access_token', token, getCookieOptions())
				.status(200)
				.json(rest)
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8)
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
			const baseName = (name || email.split('@')[0])
				.split(' ')
				.join('')
				.toLowerCase()
			const newUser = new User({
				username: baseName + Math.random().toString(36).slice(-4),
				email,
				password: hashedPassword,
				avatar: photo,
			})
			await newUser.save()
			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
				expiresIn: TOKEN_EXPIRY,
			})
			const { password: _pass, ...rest } = newUser._doc
			res
				.cookie('access_token', token, getCookieOptions())
				.status(200)
				.json(rest)
		}
	} catch (error) {
		next(error)
	}
}

export const signOut = async (req, res, next) => {
	try {
		res.clearCookie('access_token')
		res.status(200).json('User has been logged out!')
	} catch (error) {
		next(error)
	}
}

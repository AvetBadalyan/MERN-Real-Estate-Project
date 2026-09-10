import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'
import {
	signInFailure,
	signInStart,
	signInSuccess,
	signUpFailure,
	signUpStart,
	signUpSuccess,
} from '../redux/user/userSlice'

const initialFormData = {
	username: '',
	email: '',
	password: '',
}

const AuthForm = ({ isSignUp }) => {
	const [formData, setFormData] = useState(initialFormData)
	const [showPassword, setShowPassword] = useState(false)
	const { error, loading } = useSelector(state => state.user)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		if (error) {
			toast.error(error)
		}
	}, [error])

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		})
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin'
		dispatch(isSignUp ? signUpStart() : signInStart())

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
			const data = await res.json()

			if (data.success === false) {
				dispatch(
					isSignUp ? signUpFailure(data.message) : signInFailure(data.message)
				)
				return
			}

			dispatch(isSignUp ? signUpSuccess(data) : signInSuccess(data))
			setFormData(initialFormData)
			navigate('/')

			toast.success(
				`Successfully ${isSignUp ? 'signed up' : 'signed in'}! Welcome ${
					data.username || data.email
				}`
			)
		} catch (error) {
			dispatch(
				isSignUp ? signUpFailure(error.message) : signInFailure(error.message)
			)
		}
	}

	return (
		<div className="px-4 py-6 sm:px-6 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold mb-6">
				{isSignUp ? 'Sign Up' : 'Sign In'}
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				{isSignUp && (
					<input
						type="text"
						placeholder="Username"
						className="border p-3 rounded-lg"
						id="username"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				)}
				<input
					type="email"
					placeholder="Email"
					className="border p-3 rounded-lg"
					id="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						className="border p-3 rounded-lg w-full pr-10"
						id="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>

				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800 disabled:opacity-80"
				>
					{loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
				</button>
				<OAuth />
			</form>
			<div className="flex flex-wrap gap-2 mt-4">
				<p>
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}
				</p>
				<Link
					to={isSignUp ? '/sign-in' : '/sign-up'}
					className="text-amber-700"
				>
					{isSignUp ? 'Sign in' : 'Sign up'}
				</Link>
			</div>
		</div>
	)
}

export default AuthForm

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { app } from '../firebase'
import { signInSuccess } from '../redux/user/userSlice'

export default function OAuth() {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleGoogleClick = async () => {
		try {
			const provider = new GoogleAuthProvider()
			const auth = getAuth(app)
			const result = await signInWithPopup(auth, provider)
			const { displayName, email, photoURL } = result.user

			const res = await fetch('/api/auth/google', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: displayName, email, photo: photoURL }),
			})

			const data = await res.json()
			dispatch(signInSuccess(data))
			toast.success('Successfully signed in with Google!')
			navigate('/')
		} catch (error) {
			console.error('Could not sign in with Google', error)
			toast.error('Could not sign in with Google. Please try again later.')
		}
	}

	return (
		<button
			onClick={handleGoogleClick}
			type="button"
			className="rounded-lg border border-slate-300 bg-white p-3 uppercase text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
		>
			Continue with Google
		</button>
	)
}

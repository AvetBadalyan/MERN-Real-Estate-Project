import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PrivateRoute() {
	const { currentUser, loading, error } = useSelector(state => state.user)

	useEffect(() => {
		if (error) {
			toast.error(`Error: ${error}`)
		}
	}, [error])

	if (loading) {
		return <div>Loading...</div>
	}

	return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
}

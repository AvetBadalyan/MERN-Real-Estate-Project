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
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-slate-300" />
			</div>
		)
	}

	return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
}

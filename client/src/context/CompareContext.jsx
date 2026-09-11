/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CompareContext = createContext()

const MAX_COMPARE = 3
const STORAGE_KEY = 'avets-estate-compare'

export function CompareProvider({ children }) {
	const [compareList, setCompareList] = useState(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : []
	})

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList))
	}, [compareList])

	const addToCompare = listing => {
		if (compareList.length >= MAX_COMPARE) {
			toast.warning(`You can compare up to ${MAX_COMPARE} properties at a time`)
			return null
		}
		if (compareList.some(l => l._id === listing._id)) {
			return null
		}
		setCompareList(prev => [...prev, listing])
		return true
	}

	const removeFromCompare = listingId => {
		setCompareList(prev => prev.filter(l => l._id !== listingId))
	}

	const isInCompare = listingId => {
		return compareList.some(l => l._id === listingId)
	}

	const toggleCompare = listing => {
		if (isInCompare(listing._id)) {
			removeFromCompare(listing._id)
			return false
		} else {
			return addToCompare(listing)
		}
	}

	const clearCompare = () => {
		setCompareList([])
	}

	return (
		<CompareContext.Provider
			value={{
				compareList,
				addToCompare,
				removeFromCompare,
				isInCompare,
				toggleCompare,
				clearCompare,
				compareCount: compareList.length,
				canAddMore: compareList.length < MAX_COMPARE,
			}}
		>
			{children}
		</CompareContext.Provider>
	)
}

export function useCompare() {
	const context = useContext(CompareContext)
	if (!context) {
		throw new Error('useCompare must be used within a CompareProvider')
	}
	return context
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const FavoritesContext = createContext()

const STORAGE_KEY = 'avets-estate-favorites'

export function FavoritesProvider({ children }) {
	const [favorites, setFavorites] = useState(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : []
	})

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
	}, [favorites])

	const addFavorite = listing => {
		setFavorites(prev => {
			if (prev.some(f => f._id === listing._id)) return prev
			return [...prev, listing]
		})
	}

	const removeFavorite = listingId => {
		setFavorites(prev => prev.filter(f => f._id !== listingId))
	}

	const isFavorite = listingId => {
		return favorites.some(f => f._id === listingId)
	}

	const toggleFavorite = listing => {
		if (isFavorite(listing._id)) {
			removeFavorite(listing._id)
			return false
		} else {
			addFavorite(listing)
			return true
		}
	}

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				addFavorite,
				removeFavorite,
				isFavorite,
				toggleFavorite,
				favoritesCount: favorites.length,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	)
}

export function useFavorites() {
	const context = useContext(FavoritesContext)
	if (!context) {
		throw new Error('useFavorites must be used within a FavoritesProvider')
	}
	return context
}

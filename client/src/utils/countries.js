// Country data with cities for the real estate app
export const countries = [
	{
		code: 'AM',
		name: 'Armenia',
		flag: '🇦🇲',
		cities: ['Yerevan', 'Gyumri', 'Vanadzor'],
	},
	{
		code: 'FR',
		name: 'France',
		flag: '🇫🇷',
		cities: ['Paris', 'Lyon', 'Marseille'],
	},
	{
		code: 'RU',
		name: 'Russia',
		flag: '🇷🇺',
		cities: ['Moscow', 'Saint Petersburg', 'Sochi'],
	},
	{
		code: 'US',
		name: 'United States',
		flag: '🇺🇸',
		cities: ['New York', 'Los Angeles', 'Miami'],
	},
	{
		code: 'DE',
		name: 'Germany',
		flag: '🇩🇪',
		cities: ['Berlin', 'Munich', 'Hamburg'],
	},
	{
		code: 'ES',
		name: 'Spain',
		flag: '🇪🇸',
		cities: ['Barcelona', 'Madrid', 'Valencia'],
	},
	{
		code: 'IT',
		name: 'Italy',
		flag: '🇮🇹',
		cities: ['Rome', 'Milan', 'Florence'],
	},
	{
		code: 'GB',
		name: 'United Kingdom',
		flag: '🇬🇧',
		cities: ['London', 'Manchester', 'Edinburgh'],
	},
	{
		code: 'AE',
		name: 'UAE',
		flag: '🇦🇪',
		cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
	},
	{
		code: 'GE',
		name: 'Georgia',
		flag: '🇬🇪',
		cities: ['Tbilisi', 'Batumi', 'Kutaisi'],
	},
]

// Get country by name
export const getCountryByName = name => countries.find(c => c.name === name)

// Get cities for a country
export const getCitiesForCountry = countryName => {
	const country = getCountryByName(countryName)
	return country ? country.cities : []
}

// Get flag for country — returns empty string if country not found
// (old listings without country data fall back to address string in the UI)
export const getFlagForCountry = countryName => {
	const country = getCountryByName(countryName)
	return country ? country.flag : ''
}

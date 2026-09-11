import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Listing from './models/listing-model.js'
import User from './models/user-model.js'

dotenv.config()

// Country data with cities and realistic property info
const countries = [
	{
		country: 'Armenia',
		flag: '🇦🇲',
		cities: ['Yerevan', 'Gyumri', 'Vanadzor'],
		currency: 'AMD',
		priceMultiplier: 1,
		addresses: [
			'Northern Avenue',
			'Mashtots Avenue',
			'Abovyan Street',
			'Tumanyan Street',
			'Sayat-Nova Avenue',
		],
	},
	{
		country: 'France',
		flag: '🇫🇷',
		cities: ['Paris', 'Lyon', 'Marseille'],
		currency: 'EUR',
		priceMultiplier: 3.5,
		addresses: [
			'Champs-Élysées',
			'Rue de Rivoli',
			'Boulevard Saint-Germain',
			'Avenue Montaigne',
			'Rue du Faubourg',
		],
	},
	{
		country: 'Russia',
		flag: '🇷🇺',
		cities: ['Moscow', 'Saint Petersburg', 'Sochi'],
		currency: 'RUB',
		priceMultiplier: 1.8,
		addresses: [
			'Tverskaya Street',
			'Arbat Street',
			'Nevsky Prospect',
			'Rublyovka',
			'Kutuzovsky Avenue',
		],
	},
	{
		country: 'United States',
		flag: '🇺🇸',
		cities: ['New York', 'Los Angeles', 'Miami'],
		currency: 'USD',
		priceMultiplier: 4,
		addresses: [
			'Fifth Avenue',
			'Sunset Boulevard',
			'Ocean Drive',
			'Park Avenue',
			'Rodeo Drive',
		],
	},
	{
		country: 'Germany',
		flag: '🇩🇪',
		cities: ['Berlin', 'Munich', 'Hamburg'],
		currency: 'EUR',
		priceMultiplier: 3,
		addresses: [
			'Unter den Linden',
			'Kurfürstendamm',
			'Maximilianstraße',
			'Königsallee',
			'Jungfernstieg',
		],
	},
	{
		country: 'Spain',
		flag: '🇪🇸',
		cities: ['Barcelona', 'Madrid', 'Valencia'],
		currency: 'EUR',
		priceMultiplier: 2.5,
		addresses: [
			'La Rambla',
			'Gran Vía',
			'Paseo de Gracia',
			'Calle Serrano',
			'Diagonal Avenue',
		],
	},
	{
		country: 'Italy',
		flag: '🇮🇹',
		cities: ['Rome', 'Milan', 'Florence'],
		currency: 'EUR',
		priceMultiplier: 2.8,
		addresses: [
			'Via del Corso',
			'Via Montenapoleone',
			'Via Tornabuoni',
			'Piazza Navona',
			'Via Condotti',
		],
	},
	{
		country: 'United Kingdom',
		flag: '🇬🇧',
		cities: ['London', 'Manchester', 'Edinburgh'],
		currency: 'GBP',
		priceMultiplier: 4.5,
		addresses: [
			'Oxford Street',
			"King's Road",
			'Mayfair',
			'Kensington High Street',
			'Princes Street',
		],
	},
	{
		country: 'UAE',
		flag: '🇦🇪',
		cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
		currency: 'AED',
		priceMultiplier: 5,
		addresses: [
			'Sheikh Zayed Road',
			'Palm Jumeirah',
			'Downtown Boulevard',
			'Marina Walk',
			'Corniche Road',
		],
	},
	{
		country: 'Georgia',
		flag: '🇬🇪',
		cities: ['Tbilisi', 'Batumi', 'Kutaisi'],
		currency: 'GEL',
		priceMultiplier: 0.8,
		addresses: [
			'Rustaveli Avenue',
			'Aghmashenebeli Avenue',
			'Chavchavadze Avenue',
			'Batumi Boulevard',
			'Freedom Square',
		],
	},
]

// Property name templates
const propertyTypes = [
	'Modern Apartment',
	'Luxury Penthouse',
	'Cozy Studio',
	'Family House',
	'Elegant Villa',
	'City Loft',
	'Garden Residence',
	'Executive Suite',
	'Charming Flat',
	'Premium Condo',
]

// Description templates
const descriptions = [
	'Beautiful property featuring modern amenities and stunning views. Recently renovated with high-quality finishes throughout. Perfect for those seeking comfort and style.',
	'Spacious living area with natural light flooding through large windows. Contemporary design meets classic elegance in this exceptional home.',
	'Prime location in the heart of the city. Walking distance to shops, restaurants, and public transport. Ideal for professionals.',
	'Quiet neighborhood perfect for families. Features include a modern kitchen, hardwood floors, and ample storage space.',
	'Luxurious finishes throughout including marble countertops, designer fixtures, and smart home technology. A truly premium residence.',
	'Charming property with character and modern conveniences. Features original architectural details combined with contemporary updates.',
	'Open floor plan perfect for entertaining. High ceilings, gourmet kitchen, and private outdoor space make this home special.',
	'Turnkey property ready for immediate occupancy. All furniture and appliances included. Move in and start living.',
	'Investment opportunity in rapidly developing area. Strong rental potential with excellent projected returns.',
	'Eco-friendly home with energy-efficient systems. Solar panels, smart thermostat, and sustainable materials throughout.',
]

// Real estate images from Unsplash (free to use)
const imageCollections = [
	[
		'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
		'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
		'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
	],
	[
		'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
		'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
		'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
	],
	[
		'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
		'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
		'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
	],
	[
		'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
		'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
		'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
	],
	[
		'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
		'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
		'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
	],
	[
		'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
		'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
		'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
	],
	[
		'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
		'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
		'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
	],
	[
		'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
		'https://images.unsplash.com/photo-1600566752734-2a0cd66c42b3?w=800',
		'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
	],
	[
		'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
		'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
		'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
	],
	[
		'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
		'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
		'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
	],
]

// Helper function to get random element from array
const getRandom = arr => arr[Math.floor(Math.random() * arr.length)]

// Helper function to get random number in range
const getRandomInRange = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min

// Generate a single listing
const generateListing = (countryData, index, demoUserId) => {
	const city = getRandom(countryData.cities)
	const propertyType = propertyTypes[index % propertyTypes.length]
	const address = `${getRandomInRange(1, 200)} ${getRandom(countryData.addresses)}`

	const isRent = Math.random() > 0.6
	const basePrice = isRent
		? getRandomInRange(800, 5000)
		: getRandomInRange(150000, 800000)
	const price = Math.round(basePrice * countryData.priceMultiplier)

	const hasOffer = Math.random() > 0.7
	const discountPercent = hasOffer ? getRandomInRange(5, 20) : 0
	const discountPrice = hasOffer
		? Math.round(price * (1 - discountPercent / 100))
		: 0

	const isPremium = Math.random() > 0.75

	return {
		name: `${propertyType} in ${city}`,
		description: descriptions[index % descriptions.length],
		address,
		country: countryData.country,
		city,
		regularPrice: price,
		discountPrice,
		bathrooms: getRandomInRange(1, 4),
		bedrooms: getRandomInRange(1, 5),
		furnished: Math.random() > 0.4,
		parking: Math.random() > 0.3,
		type: isRent ? 'rent' : 'sale',
		offer: hasOffer,
		premium: isPremium,
		imageUrls: imageCollections[index % imageCollections.length],
		userRef: demoUserId,
	}
}

// Main seed function
const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO)
		console.log('Connected to MongoDB')

		// Use the first real user in the DB (same pattern as seed-listings.js)
		const user = await User.findOne({})
		if (!user) {
			console.error('No user found. Please sign up first.')
			process.exit(1)
		}
		const demoUserId = user._id.toString()
		console.log(`Using user: ${user.username} (${demoUserId})`)

		// Delete existing seeded listings for this user (optional - be careful!)
		const deleteResult = await Listing.deleteMany({ userRef: demoUserId })
		console.log(
			`Deleted ${deleteResult.deletedCount} existing listings for this user`
		)

		// Generate listings
		const listings = []
		let listingIndex = 0

		for (const countryData of countries) {
			console.log(`Generating listings for ${countryData.country}...`)
			for (let i = 0; i < 10; i++) {
				listings.push(generateListing(countryData, listingIndex, demoUserId))
				listingIndex++
			}
		}

		// Insert all listings
		const result = await Listing.insertMany(listings)
		console.log(`\nSuccessfully seeded ${result.length} listings!`)

		// Summary
		console.log('\nSummary by country:')
		for (const countryData of countries) {
			const count = listings.filter(
				l => l.country === countryData.country
			).length
			console.log(
				`  ${countryData.flag} ${countryData.country}: ${count} listings`
			)
		}

		console.log('\nSeed completed successfully!')
		process.exit(0)
	} catch (error) {
		console.error('Error seeding database:', error)
		process.exit(1)
	}
}

seedDatabase()

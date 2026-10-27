import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Listing from './models/listing-model.js'
import User from './models/user-model.js'

dotenv.config({ quiet: true })

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

// Real estate images hosted on the project's own Cloudinary account.
// Served from the app's own cloud so they don't depend on (and can't be blocked
// as) a third-party image host like Unsplash. Version segments are omitted so
// Cloudinary always serves the current version of each public_id.
const CDN = 'https://res.cloudinary.com/dkaknfwcl/image/upload/avets-estate'

// Pool of real property photos (excludes the hero .png, avatar .svg and the
// generic fallback .jpg).
const propertyImages = [
	`${CDN}/cbtv207hgfpmegk775ap.jpg`,
	`${CDN}/cjonvvtgt1mdw38lgikj.jpg`,
	`${CDN}/dfmfmfdaos8vfm8g3y2x.jpg`,
	`${CDN}/dhk1gbcrh3a80wlod2m1.jpg`,
	`${CDN}/dpchshpp5xwkvwqsi7qs.jpg`,
	`${CDN}/em1gckk7bhw0qfv1mb1a.jpg`,
	`${CDN}/fmwpu7tocjact7ihdjig.jpg`,
	`${CDN}/foqpfmjoqewhelyvra3a.jpg`,
	`${CDN}/fpeoapwa5rbqqdn5yuqd.jpg`,
	`${CDN}/gfiyynzhocdi7mm709re.jpg`,
	`${CDN}/hyjf8kpvrxsfrqutv6w2.jpg`,
	`${CDN}/iqxdk6upzkf2bdyphdoq.jpg`,
	`${CDN}/k3p70sd1mdu2eljpzvms.jpg`,
	`${CDN}/l8i3onggvu0g76omnx4q.png`,
	`${CDN}/l9ytghbxn33kyzbj88df.jpg`,
	`${CDN}/lamdanso0aja0goebm89.jpg`,
	`${CDN}/okydekojrrpxh98pojdd.jpg`,
	`${CDN}/ry8xuleoyz28pwrjf6yx.jpg`,
	`${CDN}/skyg6q8zs2igrihbb5tz.webp`,
	`${CDN}/ufq9d7eqpnrme3zfmrou.webp`,
	`${CDN}/vvgil7vd9tdpthvk5b21.jpg`,
	`${CDN}/wkwczcxksao0hxdljhqw.jpg`,
	`${CDN}/zs03dihrxgn6nq4gfq7b.webp`,
]

// Build 10 collections of 3 images each, cycling through the pool.
const imageCollections = Array.from({ length: 10 }, (_, group) => [
	propertyImages[(group * 3) % propertyImages.length],
	propertyImages[(group * 3 + 1) % propertyImages.length],
	propertyImages[(group * 3 + 2) % propertyImages.length],
])

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

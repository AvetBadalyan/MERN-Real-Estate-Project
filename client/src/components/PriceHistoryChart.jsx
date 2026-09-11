import { useMemo } from 'react'
import { FaChartLine } from 'react-icons/fa'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

// Generate mock price history based on current price
function generatePriceHistory(currentPrice, months = 12) {
	const data = []
	const now = new Date()
	const volatility = 0.03 // 3% max monthly change

	let price = currentPrice * (1 - Math.random() * 0.15) // Start 0-15% lower

	for (let i = months - 1; i >= 0; i--) {
		const date = new Date(now)
		date.setMonth(date.getMonth() - i)

		// Random price movement toward current price
		const targetDiff = currentPrice - price
		const movement =
			targetDiff * 0.1 + (Math.random() - 0.3) * price * volatility
		price = Math.max(price + movement, currentPrice * 0.7)

		// Last month should be close to current price
		if (i === 0) {
			price = currentPrice
		}

		data.push({
			month: date.toLocaleDateString('en-US', {
				month: 'short',
				year: '2-digit',
			}),
			price: Math.round(price),
		})
	}

	return data
}

export default function PriceHistoryChart({ currentPrice, type }) {
	const data = useMemo(() => generatePriceHistory(currentPrice), [currentPrice])

	const formatPrice = value => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(1)}M`
		}
		if (value >= 1000) {
			return `$${(value / 1000).toFixed(0)}K`
		}
		return `$${value}`
	}

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg bg-white p-3 shadow-lg dark:bg-slate-800">
					<p className="text-sm font-medium text-slate-600 dark:text-slate-300">
						{label}
					</p>
					<p className="text-lg font-bold text-slate-800 dark:text-white">
						${payload[0].value.toLocaleString()}
						{type === 'rent' ? '/mo' : ''}
					</p>
				</div>
			)
		}
		return null
	}

	// Calculate price change
	const firstPrice = data[0]?.price || currentPrice
	const priceChange = currentPrice - firstPrice
	const percentChange = ((priceChange / firstPrice) * 100).toFixed(1)
	const isPositive = priceChange >= 0

	return (
		<div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<FaChartLine className="h-5 w-5 text-amber-500" />
					<h3 className="text-lg font-semibold text-slate-800 dark:text-white">
						Price History
					</h3>
				</div>
				<div className="text-right">
					<span
						className={`text-sm font-medium ${
							isPositive ? 'text-green-500' : 'text-red-500'
						}`}
					>
						{isPositive ? '+' : ''}
						{percentChange}%
					</span>
					<p className="text-xs text-slate-500 dark:text-slate-400">
						Last 12 months
					</p>
				</div>
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#e2e8f0"
							vertical={false}
						/>
						<XAxis
							dataKey="month"
							tick={{ fontSize: 12, fill: '#94a3b8' }}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							tickFormatter={formatPrice}
							tick={{ fontSize: 12, fill: '#94a3b8' }}
							tickLine={false}
							axisLine={false}
							width={60}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type="monotone"
							dataKey="price"
							stroke="#f59e0b"
							strokeWidth={2}
							fill="url(#priceGradient)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
				* Historical price data is simulated for demonstration
			</p>
		</div>
	)
}

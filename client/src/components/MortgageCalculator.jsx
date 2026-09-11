import { useMemo, useState } from 'react'
import { FaCalculator, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function MortgageCalculator({ price, type }) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [downPaymentPercent, setDownPaymentPercent] = useState(20)
	const [interestRate, setInterestRate] = useState(6.5)
	const [loanTerm, setLoanTerm] = useState(30)

	const calculations = useMemo(() => {
		const downPayment = (price * downPaymentPercent) / 100
		const loanAmount = price - downPayment
		const monthlyRate = interestRate / 100 / 12
		const numberOfPayments = loanTerm * 12

		// Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
		let monthlyPayment = 0
		if (monthlyRate > 0) {
			monthlyPayment =
				(loanAmount *
					(monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
				(Math.pow(1 + monthlyRate, numberOfPayments) - 1)
		} else {
			monthlyPayment = loanAmount / numberOfPayments
		}

		const totalPayment = monthlyPayment * numberOfPayments
		const totalInterest = totalPayment - loanAmount

		return {
			downPayment,
			loanAmount,
			monthlyPayment,
			totalPayment,
			totalInterest,
		}
	}, [price, downPaymentPercent, interestRate, loanTerm])

	// Don't show for rentals
	if (type === 'rent') {
		return null
	}

	return (
		<div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
			{/* Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between"
			>
				<div className="flex items-center gap-2">
					<FaCalculator className="h-5 w-5 text-amber-500" />
					<h3 className="text-lg font-semibold text-slate-800 dark:text-white">
						Mortgage Calculator
					</h3>
				</div>
				<div className="flex items-center gap-3">
					<div className="text-right">
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Est. Monthly
						</p>
						<p className="text-xl font-bold text-amber-600">
							${Math.round(calculations.monthlyPayment).toLocaleString()}
						</p>
					</div>
					{isExpanded ? (
						<FaChevronUp className="h-4 w-4 text-slate-400" />
					) : (
						<FaChevronDown className="h-4 w-4 text-slate-400" />
					)}
				</div>
			</button>

			{/* Expandable Content */}
			{isExpanded && (
				<div className="mt-6 space-y-6">
					{/* Sliders */}
					<div className="space-y-4">
						{/* Down Payment */}
						<div>
							<div className="mb-2 flex justify-between">
								<label
									htmlFor="downPayment"
									className="text-sm font-medium text-slate-600 dark:text-slate-300"
								>
									Down Payment
								</label>
								<span className="text-sm font-semibold text-slate-800 dark:text-white">
									{downPaymentPercent}% ($
									{calculations.downPayment.toLocaleString()})
								</span>
							</div>
							<input
								id="downPayment"
								type="range"
								min="0"
								max="50"
								step="5"
								value={downPaymentPercent}
								onChange={e => setDownPaymentPercent(Number(e.target.value))}
								className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500 dark:bg-slate-700"
							/>
							<div className="mt-1 flex justify-between text-xs text-slate-400">
								<span>0%</span>
								<span>50%</span>
							</div>
						</div>

						{/* Interest Rate */}
						<div>
							<div className="mb-2 flex justify-between">
								<label
									htmlFor="interestRate"
									className="text-sm font-medium text-slate-600 dark:text-slate-300"
								>
									Interest Rate
								</label>
								<span className="text-sm font-semibold text-slate-800 dark:text-white">
									{interestRate}%
								</span>
							</div>
							<input
								id="interestRate"
								type="range"
								min="1"
								max="15"
								step="0.25"
								value={interestRate}
								onChange={e => setInterestRate(Number(e.target.value))}
								className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500 dark:bg-slate-700"
							/>
							<div className="mt-1 flex justify-between text-xs text-slate-400">
								<span>1%</span>
								<span>15%</span>
							</div>
						</div>

						{/* Loan Term */}
						<div>
							<div className="mb-2 flex justify-between">
								<label className="text-sm font-medium text-slate-600 dark:text-slate-300">
									Loan Term
								</label>
								<span className="text-sm font-semibold text-slate-800 dark:text-white">
									{loanTerm} years
								</span>
							</div>
							<div className="flex gap-2">
								{[15, 20, 30].map(term => (
									<button
										key={term}
										onClick={() => setLoanTerm(term)}
										className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
											loanTerm === term
												? 'bg-amber-500 text-white'
												: 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
										}`}
									>
										{term} yr
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Summary */}
					<div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Loan Amount
								</p>
								<p className="font-semibold text-slate-800 dark:text-white">
									${calculations.loanAmount.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Monthly Payment
								</p>
								<p className="font-semibold text-amber-600">
									${Math.round(calculations.monthlyPayment).toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Total Interest
								</p>
								<p className="font-semibold text-slate-800 dark:text-white">
									${Math.round(calculations.totalInterest).toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Total Payment
								</p>
								<p className="font-semibold text-slate-800 dark:text-white">
									${Math.round(calculations.totalPayment).toLocaleString()}
								</p>
							</div>
						</div>
					</div>

					<p className="text-center text-xs text-slate-400 dark:text-slate-500">
						* Estimate only. Does not include taxes, insurance, or PMI.
					</p>
				</div>
			)}
		</div>
	)
}

export default function SkeletonCard() {
	return (
		<div className="w-full animate-pulse sm:w-[330px]">
			<div className="h-[220px] rounded-t-lg bg-slate-200 dark:bg-slate-700" />
			<div className="flex flex-col gap-2 rounded-b-lg bg-white p-3 shadow-md dark:bg-slate-800">
				<div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
				<div className="flex items-center gap-1">
					<div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700" />
					<div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
				</div>
				<div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
				<div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
				<div className="mt-2 h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
				<div className="mt-2 flex gap-4">
					<div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
					<div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
				</div>
			</div>
		</div>
	)
}

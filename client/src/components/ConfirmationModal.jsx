import Modal from 'react-modal'

Modal.setAppElement('#root')

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel="Confirmation Modal"
			className="mx-auto my-24 w-[calc(100%-2rem)] max-w-sm rounded-lg bg-white p-5 shadow-lg outline-none dark:bg-slate-800 sm:p-6"
			overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
		>
			<div onClick={e => e.stopPropagation()}>
				<p className="mb-4 text-center text-slate-800 dark:text-white">
					{message}
				</p>
				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
					<button
						onClick={onClose}
						className="rounded border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm()
							onClose()
						}}
						className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
					>
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmationModal

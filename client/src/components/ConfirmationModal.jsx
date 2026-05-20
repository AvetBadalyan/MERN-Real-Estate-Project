/* eslint-disable react/prop-types */
import Modal from "react-modal";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-[calc(100%-2rem)] max-w-sm mx-auto my-24 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <p className="text-center mb-4">{message}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

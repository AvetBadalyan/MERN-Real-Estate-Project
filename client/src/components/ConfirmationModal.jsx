/* eslint-disable react/prop-types */
import Modal from "react-modal";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto my-24 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <p className="text-center mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded mr-4 hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

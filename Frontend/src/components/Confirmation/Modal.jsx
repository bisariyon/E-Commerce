import React from "react";

const Modal = ({ showModal, handleClose, handleConfirm, message }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-500 p-5 rounded-md shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-2">Confirm Action</h2>
        <p className="mb-2">{message}</p>
        <div className="flex justify-center ">
          <button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            Confirm
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md active:bg-gray-500 active:scale-90 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

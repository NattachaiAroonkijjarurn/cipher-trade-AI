import React from 'react';
// import '../CSS/successModal.css'; // Import your styles

const SuccessPhoneModal = ({ onClose }) => {
  return (
    <div className="success-modal px-20 py-10">
      <div className="modal-content flex flex-col justify-center">
        <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Success!</h2>
        <p className="pb-5">Phone Number changed successfully.</p>
        <button onClick={onClose} className="blue-button mt-7 m-auto bg-blue-700 py-2 w-6/12">
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPhoneModal;

// Modal.js
import React, { useState } from 'react';
import './Modal.css';

// Sub Modal
import EmailModal from "./subModal/JS/emailModal"
import PhoneModal from "./subModal/JS/phoneModal"
import PasswordModal from "./subModal/JS/passwordModal"
import AuthenModal from "./subModal/JS/authenModal"
import DlAccModal from './subModal/JS/dlAccModal';

const Modal = ({ showModal, onClose, modalType }) => {
  let modalContent;
  const [changeSuccess, setIsChangeSuccess] = useState(false)

  const handleChangeSuccess = () => {
    setIsChangeSuccess(true);
  };

  const handleRefreshPage = () => {
    window.location.reload(true)
  }

  switch (modalType) {
    case 'email':
      modalContent = <EmailModal onClose={onClose} onSubmit={handleChangeSuccess} />;
      break;
    case 'phoneNumber':
      modalContent = <PhoneModal/>;
      break;
    case 'password':
      modalContent = <PasswordModal/>;
      break;
    case 'authen':
      modalContent = <AuthenModal/>;
      break;
    case 'dlAcc':
      modalContent = <DlAccModal/>;
      break;
    default:
      modalContent = <p className='text-[#FFFFFF]'>Don't Have Modal.</p>;
  }

  return (
    <>
      <div className={`modal-overlay ${showModal ? "" : "hide hidden"}`}>
        <div className={`modal ${showModal ? "" : "hide hidden"}`}>
          <button className={modalType == "dlAcc" ? "delClose-button" : "close-button"} onClick={changeSuccess ? handleRefreshPage : onClose}>
            X
          </button>
          {modalContent}
        </div>
      </div>
    </>
  );
};

export default Modal;

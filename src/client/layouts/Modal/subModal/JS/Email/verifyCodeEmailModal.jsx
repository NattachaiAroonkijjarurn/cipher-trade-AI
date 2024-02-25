// VerifyCodeModal.js
import React, { useState } from 'react';
import axios from 'axios';

const VerifyCodeEmailModal = ({ onClose, onSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const handleChangeVerificationCode = (e) => {
    setVerificationCode(e.target.value);
    setVerificationError('');
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-cce",
        {
          code: verificationCode,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      // Check response and handle success/failure accordingly
      if (response.data.success) {
        onSuccess();
      } else {
        setVerificationError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setVerificationError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="verify-code-modal px-20 py-10">
      <div className="modal-content">
        <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Verify Email Address</h2>
        <p className='pb-5'>Please check your email for the verification code.</p>
        <form className='gap-3'>
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            required
            className='text-[#000000] py-2 px-5'
            onChange={handleChangeVerificationCode}
          />
          {verificationError && <p className="text-red-500">{verificationError}</p>}
          <button
            type="button"
            onClick={handleVerifyCode}
            className='blue-button mt-7 m-auto bg-blue-700 py-2 w-6/12'
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodeEmailModal;
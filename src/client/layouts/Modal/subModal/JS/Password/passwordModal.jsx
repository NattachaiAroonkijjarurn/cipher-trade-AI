import React, { useState } from 'react';
import axios from 'axios';
import SuccessPassModal from './successPassModal';
import VerifyCodePassModal from './verifyCodePassModal';

const PasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [presentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleSuccessModalClose = () => {
    setShowVerifyCodeModal(false);
    setShowSuccessModal(false);
    onClose()
    window.location.reload(true);
  };

  const handleVerifyCodeModalClose = () => {
    setShowVerifyCodeModal(false);
    setShowSuccessModal(true);
  };

  const handleVerifyCodeSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const newPassword = password;
      const currentPassword = presentPassword;

      const result = await axios.post(
        "http://localhost:5000/api/change-pass",
        {
          newPassword,
          currentPassword
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(result);

      if (result.data.success) {
        onClose()
        setShowVerifyCodeModal(true);
      }

    } catch (err) {
      console.error(err);
    } 
  };

  return (
    <div>
      {showSuccessModal ? (
        <SuccessPassModal onClose={handleSuccessModalClose} />
      ) : showVerifyCodeModal ? (
        <VerifyCodePassModal onClose={handleVerifyCodeModalClose} onSuccess={handleVerifyCodeSuccess} />
      ) : (
        <div className="email-modal px-20 py-10">
          <div className="modal-content text-center">
            <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Password</h2>
            <p className='pb-5'>Use this form to change your password</p>
            <form onSubmit={handleSubmit} className='gap-3 text-start'>
              <label htmlFor="password1">New Password :</label>
              <input type="password" id="password1" name="password" required className='text-[#000000] py-2 px-5' onChange={handleChangePassword} />
              <label htmlFor="password2">Current Password :</label>
              <input type="password" id="password2" name="password" required className='text-[#000000] py-2 px-5' onChange={handleChangeCurrentPassword} />
              <p className='text-sm text-slate-400'>For confirm changing</p>
              <button type="submit" className={`blue-button mt-7 m-auto bg-blue-700 py-3 w-6/12 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordModal;

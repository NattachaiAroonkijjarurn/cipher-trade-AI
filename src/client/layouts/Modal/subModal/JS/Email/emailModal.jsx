import React, { useState } from 'react';
import axios from 'axios';
import SuccessEmailModal from './successEmailModal';
import VerifyCodeEmailModal from './verifyCodeEmailModal';  // Import the VerifyCodeModal

const EmailModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSuccessModalClose = () => {
    setShowVerifyCodeModal(false)
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

      const newMail = await axios.post(
        "http://localhost:5000/api/change-email",
        {
          newEmail: email
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(newMail);

      if (newMail.data.success) {
        setShowVerifyCodeModal(true);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {showSuccessModal ? (
        <SuccessEmailModal onClose={handleSuccessModalClose} />
      ) : showVerifyCodeModal ? (
        <VerifyCodeEmailModal onClose={handleVerifyCodeModalClose} onSuccess={handleVerifyCodeSuccess} />
      ) : (
        <div className="email-modal px-20 py-10">
          <div className="modal-content">
            <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Email Address</h2>
            <p className='pb-5'>Use this form to change your email</p>
            <form onSubmit={handleSubmit} className='gap-3'>
              <label htmlFor="email">New Email :</label>
              <input type="email" id="email" name="email" 
                required 
                className={`text-[#000000] py-2 px-5 ${loading ? 'cursor-not-allowed' : ''}`}
                readOnly={loading}  // Set read-only attribute when loading is true
                value={email} 
                onChange={handleChangeEmail} />
              <button type="submit" className={`blue-button mt-7 m-auto bg-blue-700 py-2 w-6/12 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailModal;

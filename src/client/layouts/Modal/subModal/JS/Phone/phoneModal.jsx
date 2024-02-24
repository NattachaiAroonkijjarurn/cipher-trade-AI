import React, { useState } from 'react';
import axios from 'axios';
import SuccessPhoneModal from './successPhoneModal';
import VerifyCodePhoneModal from './verifyCodePhoneModal';
import '../../CSS/phoneModal.css'; // Import your styles

const PhoneModal = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerifyCodeModal, setShowVerifyCodeModal] = useState(false);

  const handleChangePhone = (e) => {
    setPhone(e.target.value);
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

      const newPhoneNumber = await axios.post(
        "http://localhost:5000/api/change-phone",
        {
          newPhoneNumber: phone
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(newPhoneNumber);

      if (newPhoneNumber.data.success) {
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
        <SuccessPhoneModal onClose={handleSuccessModalClose} />
      ) : showVerifyCodeModal ? (
        <VerifyCodePhoneModal onClose={handleVerifyCodeModalClose} onSuccess={handleVerifyCodeSuccess} />
      ) : (
        <div className="phone-modal px-20 py-10">
          <div className="modal-content">
            <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Phone Number</h2>
            <p className='pb-5'>Use this form to change your phone number</p>
            <form onSubmit={handleSubmit} className='gap-3'>
              <label htmlFor="tel">New Phone Number :</label>
              <input
                type="tel"
                id="tel"
                name="tel"
                required
                className={`text-[#000000] py-2 px-5 ${loading ? 'cursor-not-allowed' : ''}`}
                readOnly={loading}
                value={phone}
                onChange={handleChangePhone}
              />
              <button
                type="submit"
                className={`blue-button mt-7 m-auto bg-blue-700 py-3 w-6/12 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneModal;

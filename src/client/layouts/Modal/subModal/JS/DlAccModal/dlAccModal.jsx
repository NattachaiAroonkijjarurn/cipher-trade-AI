import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import SuccessDlAccModal from './successDlAccModal';

const DlAccModal = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errMes, setErrMes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    onClose()
    window.location.reload(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmPassword = e.target[0].value;

    try {
      const dlAccRes = await axios.post(
        'http://localhost:5000/api/delete-acc',
        {
          confirmPass: confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (dlAccRes.data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      setErrMes(err.response.data.message);
      console.log(err);
    }
  };

  const icon = showPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />;

  return (
    <div>
      {showSuccessModal ? (
        <SuccessDlAccModal onClose={handleCloseSuccessModal} />
      ) : (
        <div className="email-modal px-20 py-10">
          <div className="modal-content">
            <h2 className="modal-title text-[#ff4d4d]/80 font-bold text-xl text-center pt-5">Confirm Delete Account</h2>
            <p className="pb-5 text-center">Your Account Will Disappear Forever</p>
            <form onSubmit={handleSubmit} className="gap-3 flex justify-center">
              <label htmlFor="password" className="relative flex flex-col">
                Enter Your Password to Confirm Deletion:
                <div className="flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    className="text-[#000000] py-2 px-5 w-full pr-10 mt-2"
                  />
                  <span
                    className="absolute right-3 bottom-2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {icon}
                  </span>
                </div>
              </label>
              <p className="text-center text-red-500">{errMes}</p>
              <button
                type="submit"
                className="submit-modal mt-5 m-auto bg-[#ff4d4d]/80 py-2 w-6/12 hover:bg-red-500 transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DlAccModal;

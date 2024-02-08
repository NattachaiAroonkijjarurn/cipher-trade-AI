// React
import React from 'react';
import { useState } from 'react';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

// Normal CSS
import "../CSS/dlAccModal.css"

const DlAccModal = ({ onClose, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
    // Access the input value using e.target.email.value
    // Example: onSubmit(e.target.email.value);
  };

  const icon = showPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />;

  return (
    <div className="email-modal px-20 py-10 max-w-screen-sm mx-auto">
      <div className="modal-content">
        <h2 className="modal-title text-[#ff4d4d]/80 font-bold text-xl text-center pt-5">Confirm Delete Account</h2>
        <p className='pb-5 text-center'>Your Account Will Disappear Forever</p>
        <form onSubmit={handleSubmit} className='gap-3'>
          <label htmlFor="password" className="relative flex flex-col">
            Enter Your Password to Confirm Deletion:
            <div className='flex items-center'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    className='text-[#000000] py-2 px-5 w-full pr-10 mt-2'
                />
                <span
                    className="absolute right-3 bottom-2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                >
                    {icon}
                </span>
            </div>
          </label>
          <button type="submit" className='submit-modal mt-5 m-auto bg-[#ff4d4d]/80 py-2 w-6/12 hover:bg-red-500 transition-colors duration-300'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DlAccModal;

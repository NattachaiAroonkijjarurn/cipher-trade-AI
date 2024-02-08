// EmailModal.js
import React from 'react';
import '../CSS/authenModal.css'; // Import your styles

const AuthenModal = ({ onClose, onSubmit }) => {
  const handleInputChange = (e, nextInputId) => {
    const maxLength = parseInt(e.target.maxLength, 10);
    const currentInputId = e.target.id;

    if (e.target.value.length === maxLength) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, prevInputId) => {
    if (e.keyCode === 8 && e.target.value.length === 0) {
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
  };

  return (
    <div className="email-modal px-20 py-10 max-w-screen-sm mx-auto">
      <div className="modal-content">
        <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">2-Factor Authentication</h2>
        <p className='pb-5 text-center'>The code for verification will be sent to your email</p>
        <form onSubmit={handleSubmit} className='gap-3'>
          <label htmlFor="otp">Enter Code :</label>
          <div id="otp-input-container" className='grid grid-cols-6 gap-3'>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <input
                className='auten-input'
                key={index}
                type="text"
                id={`otp${index}`}
                name={`otp${index}`}
                maxLength="1"
                onChange={(e) => handleInputChange(e, `otp${index + 1}`)}
                onKeyDown={(e) => handleKeyDown(e, `otp${index - 1}`)}
              />
            ))}
          </div>
          <button type="submit" className='blue-button mt-7 m-auto bg-blue-700 py-3 w-6/12'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AuthenModal;

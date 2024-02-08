// EmailModal.js
import React from 'react';
import '../CSS/passwordModal.css'; // Import your styles

const PasswordModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
    // Access the input value using e.target.email.value
    // Example: onSubmit(e.target.email.value);
  };

  return (
    <div className="email-modal px-20 py-10">
      <div className="modal-content text-center">
        <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Password</h2>
        <p className='pb-5'>Use this form to change your password</p>
        <form onSubmit={handleSubmit} className='gap-3 text-start'>
          <label htmlFor="password">New Password :</label>
          <input type="password" id="password1" name="password" required className='text-[#000000] py-2 px-5'/>
          <label htmlFor="password">Current Password :</label>
          <input type="password" id="password2" name="password" required className='text-[#000000] py-2 px-5'/>
          <p className='text-sm text-slate-400'>For confirm changing</p>
          <button type="submit" className='blue-button mt-7 m-auto bg-blue-700 py-3 w-6/12'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;

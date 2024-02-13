// EmailModal.js
import React from 'react';
import { useState } from 'react';
import '../CSS/emailModal.css'; // Import your styles
import axios from 'axios';
import SuccessModal from '../JS/successModal';

const EmailModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    window.location.reload(true); // Reload the page
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    const sendNewEmail = async() => {
      try {
        const newMail = await axios.post("http://localhost:5000/api/change-email", 
        {
          newEmail : email
        }, 
        {
          withCredentials: true,
          headers: {
              'Access-Control-Allow-Origin': '*', 
              'Content-Type': 'application/json'
          }
        });
        console.log(newMail)
        setShowSuccessModal(true);
        onSubmit();
      } catch(err) {
        console.log(err)
      }
    }

    sendNewEmail();
  };

  return (
    showSuccessModal
    ? <SuccessModal onClose={handleSuccessModalClose} />
    : <div className="email-modal px-20 py-10">
        <div className="modal-content ">
          <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Email Address</h2>
          <p className='pb-5'>Use this form to change your email</p>
          <form onSubmit={handleSubmit} className='gap-3'>
            <label htmlFor="email">New Email :</label>
            <input type="email" id="email" name="email" required className='text-[#000000] py-2 px-5' onChange={handleChangeEmail}/>
            <button type="submit" className='blue-button mt-7 m-auto bg-blue-700 py-2 w-6/12'>Submit</button>
          </form>
        </div>
      </div>
  );
};

export default EmailModal;

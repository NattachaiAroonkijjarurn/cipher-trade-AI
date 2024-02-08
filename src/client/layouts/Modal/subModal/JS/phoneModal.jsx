// EmailModal.js
import React from 'react';
import '../CSS/phoneModal.css'; // Import your styles

const PhoneModal = ({ onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission logic here
    // Access the input value using e.target.email.value
    // Example: onSubmit(e.target.email.value);
  };

  return (
    <div className="email-modal px-20 py-10">
      <div className="modal-content ">
        <h2 className="modal-title text-blue-500 font-bold text-xl text-center pt-5">Change Phone Number</h2>
        <p className='pb-5'>Use this form to change your phone number</p>
        <form onSubmit={handleSubmit} className='gap-3'>
          <label htmlFor="tel">New Phone Number :</label>
          <input type="tel" id="tel" name="tel" required className='text-[#000000] py-2 px-5'/>
          <button type="submit" className='blue-button mt-7 m-auto bg-blue-700 py-3 w-6/12'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PhoneModal;

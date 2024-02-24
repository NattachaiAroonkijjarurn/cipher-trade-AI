import React from 'react';
import './LogoutModal.css'; // Import the new CSS file for styling

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <div className={`modal-logout ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-logout-overlay" onClick={onClose}></div>
      <div className="modal-logout-content">
        <p>Are you sure you want to logout?</p>
        <div className="modal-logout-buttons">
          <button className='bg-red-500 p-2 rounded' onClick={onLogout}>Logout</button>
          <button className='bg-gray-500 p-2 rounded' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

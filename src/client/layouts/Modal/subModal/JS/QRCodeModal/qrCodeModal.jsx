import React, { useState } from 'react';

const QRCodeModal = ({ onClose }) => {

  return (
    <div>
        <div className="qr-modal px-20 py-5">
            <div className="modal-content">
            <h2 className="modal-title text-blue-500 font-bold text-xl text-center">QR Code for Payment</h2>
            <form className='gap-2'>
                <p className='text-center'>Your commission that need to pay</p>
                <span className='text-blue-500 text-center font-bold'>฿2</span>
                <img
                src="http://localhost:3000/img/QRforPayment.jpg"
                className='max-h-[60vh]'
                />
                <p className='text-center font-bold pt-3'>Thank You, Hope You Rich</p>
            </form>
            </div>
        </div>
    </div>
  );
};

export default QRCodeModal;

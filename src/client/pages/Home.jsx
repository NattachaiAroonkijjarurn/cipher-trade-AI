import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../img/home.png';

const Home = () => {
  let navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signup');
  };

  return (
    <div 
      className="h-screen w-full bg-cover flex relative" // Added 'relative' here
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded focus:outline-none focus:shadow-outline absolute top-5 right-5" // Adjusted positioning classes
        onClick={handleSignInClick}
      >
        Sign Up
      </button>
    </div>
  );
};

export default Home;
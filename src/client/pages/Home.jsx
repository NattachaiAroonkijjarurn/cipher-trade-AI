// React
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Axios
import axios from 'axios';

// Image
import backgroundImage from '../img/home.png';

const Home = () => {
  let navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth-user', {
          withCredentials: true,
        });
        // Assuming the backend sends a response with a status of 200 if the user is logged in
        if (response.data.authorized == true) {
          navigate('/aiTradingBot')
        }
      } catch (error) {
      }
    };

    checkLoginStatus();
  }, []);

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div 
      className="h-screen w-full bg-cover flex relative" // Added 'relative' here
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className='flex-1 justify-between text-right mt-2 mr-3'>
        <button
          className='bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline mr-3'
          onClick={handleLogin}
        >
          Login
        </button>
        <button 
          className="bg-white hover:bg-zinc-300 active:bg-zinc-400 text-black text-sm font-medium py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline" // Adjusted positioning classes
          onClick={handleSignUpClick}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
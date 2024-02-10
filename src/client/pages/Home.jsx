// React
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Axios
import axios from 'axios';

// Image
import backgroundImage from '../img/home.png';

const Home = () => {
  let navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signup');
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/api/auth-user');
        // Assuming the backend sends a response with a status of 200 if the user is logged in
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        // If there is an error or the status is not 200, the user is not logged in
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Redirect to another page if logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/aiTradingBot');
    }
  }, [isLoggedIn, navigate]);

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
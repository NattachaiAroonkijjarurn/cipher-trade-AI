import { Route, Routes, useLocation } from "react-router-dom";
import RootLayout from "./client/layouts/RootLayout";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


// Pages
import Home from "./client/pages/Home"
import AITradingBot from "./client/pages/AITradingBot";
import Wallets from "./client/pages/Wallets";
import Statements from "./client/pages/Statements";
import Overall from "./client/pages/Overall";
import Support from "./client/pages/Support";
import Profile from "./client/pages/Profile/Profile";
import SignUp from "./client/pages/SignUp";
import Authentication from "./client/pages/Authentication";
import Login from "./client/pages/Login";

// Axios
import axios from 'axios';

const App = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth-user', {
          withCredentials: true,
        });
        console.log(response)
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
  }, [location]);

  // Redirect to another page if logged in
  useEffect(() => {
    console.log("Login: "+isLoggedIn)
    const checkEmailVerification = async () => {
      try {
        const emailVerified = await axios.get('http://localhost:5000/api/email-verify', {
          withCredentials: true,
        })
        console.log("Email: "+emailVerified.data.emailVerify)
        if(emailVerified.data.emailVerify == false) {
          navigate('/authentication')
        }
        else {
          setIsEmailVerified(true)
          navigate(location)
        }
      } catch(err) {
          console.log(err)
      }
    }

    if (isLoggedIn && !isEmailVerified) {
      checkEmailVerification();
    }

  }, [isLoggedIn, location]);

  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Home />}/> 
        <Route path="/signup" element ={<SignUp />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/authentication" element = {<Authentication />} />
        <Route path="/aiTradingBot" element={<AITradingBot />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/overall" element={<Overall />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </RootLayout>
  );
};

export default App;

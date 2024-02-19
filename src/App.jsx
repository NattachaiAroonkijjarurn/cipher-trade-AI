import { Route, Routes, useLocation } from "react-router-dom";
import RootLayout from "./client/layouts/RootLayout";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


// Pages
import Home from "./client/pages/Home"
import AITradingBot from "./client/pages/AITradingBot";
import Accounts from "./client/pages/Accounts";
import Statements from "./client/pages/Statements";
import Overall from "./client/pages/Overall";
import Support from "./client/pages/Support";
import Profile from "./client/pages/Profile/Profile";
import SignUp from "./client/pages/SignUp/SignUp";
import VerifySignUp from "./client/pages/SignUp/VerifySignUp"
import Authentication from "./client/pages/Authentication";
import Login from "./client/pages/Login";

// Axios
import axios from 'axios';

const App = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth-user', {
          withCredentials: true,
        });
        if (response.data.authorized == true) {
          setIsLoggedIn(true);
          setIsInitialCheckDone(true);
        }
        else {
          const isHomePage = location.pathname == "/" ? true : false
          const isSignUpPage = location.pathname == "/signup" ? true : false
          const isVerifySignUpPage = location.pathname == "/verify-signup" ? true : false

          if(!isHomePage && !isSignUpPage && !isVerifySignUpPage) {
            navigate('/login')
          }
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    if(!isInitialCheckDone){
      checkLoginStatus();
    }
      
  }, [navigate]);

  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Home />}/> 
        <Route path="/signup" element ={<SignUp />} />
        <Route path="/verify-signup" element ={<VerifySignUp />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/authentication" element = {<Authentication />} />
        <Route path="/aiTradingBot" element={<AITradingBot />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/overall" element={<Overall />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </RootLayout>
  );
};

export default App;

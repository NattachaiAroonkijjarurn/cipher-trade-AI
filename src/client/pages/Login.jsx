import React, { useState, useEffect } from "react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Connect to Backend with Axios
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();

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

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    const handleSignIn = async (e) => {
      e.preventDefault();

      if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }

      try {
        // Send login data to the backend
        const response = await axios.post("http://localhost:5000/api/login", {
          username: username,
          password: password,
        }, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json'
            }
        });

        // Assuming the backend sends a response with a status of 200 for successful login
        if (response.status === 200) {
          // Redirect to another page upon successful login
          navigate("/");
        } else {
          // Handle other response statuses or show an error message
          setError("Invalid username or password");
        }
    } catch (error) {
        // Handle axios error or show a generic error message
        console.log(error)
        setError("An error occurred during login");
    }
  };
  const icon = showPassword ? <FaEyeSlash style={{ color: 'black' }} /> : <FaEye style={{ color: 'black' }} />;

  return (
    <div className="flex justify-center items-center mt-8">
      <div
        className="max-w-sm w-full rounded-lg border border-gray-800 shadow-md"
        style={{ backgroundColor: "#1E2226" }}
      >
        <div className="flex justify-center mt-4">
          <img src={logo} width={45} alt="CipherTradeAI" />
          <h1 className="mt-2.5 ml-2 font-bold text-white">CipherTrade AI</h1>
        </div>
        <h1
          className="text-lg font-bold text-center p-1 mb-0 text-white"
          style={{ color: "#2C7AFE" }}
        >
          Login
        </h1>
        <form
          className="px-8 pt-4 pb-5 mb-2 bg-white rounded-lg"
          style={{ backgroundColor: "#1E2226" }}
          onSubmit={handleSignIn}
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
                className="absolute right-3 bottom-2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {icon}
            </span>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 mt-5 block w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

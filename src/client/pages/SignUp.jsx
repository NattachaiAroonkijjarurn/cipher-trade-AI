import React, { useState } from "react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

// Axios
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Regular expression for username (6-16 characters, English letters and numbers only)
    const usernameRegex = /^[A-Za-z0-9]{6,16}$/;
    // Regular expression for password (8-24 characters, at least one lowercase, one uppercase, and one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,24}$/;
    // Regular expression for email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!usernameRegex.test(username)) {
      setError("Username must be 6-16 characters and A-Z, a-z, 0-9");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Password must be 8-24 characters, include at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    try {
        // Send login data to the backend
        const response = await axios.post("http://localhost:5000/api/register", {
          username: username,
          email: email,
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
          navigate("/authentication");
        } else {
          // Handle other response statuses or show an error message
          setError(response);
        }
    } catch (error) {
        // Handle axios error or show a generic error message
        console.log(error)
        setError("An error occurred during sign up");
    }

    setError("");
  };

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
          Sign Up
        </h1>
        <form
          className="px-8 pt-4 pb-5 mb-2 bg-white rounded-lg"
          style={{ backgroundColor: "#1E2226" }}
          onSubmit={handleSignUp}
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
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
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
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="confirm password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-xs text-blue-600 hover:text-blue-800"
            style={{ display: 'block', marginTop: '10px' }}
          >
            {showPassword ? "🚫 Hide" : "👁 Show"}
          </button>
          {error && (
            <p className="text-red-500 text-xs italic mt-4">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 mt-5 block w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
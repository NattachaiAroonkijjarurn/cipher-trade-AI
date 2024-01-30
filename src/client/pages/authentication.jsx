import React, { useState } from "react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

const authentication = () => {
  const navigate = useNavigate();

  const [digitCode, setDigitCode] = useState("");
  const [error, setError] = useState("");


  const handleVerify = (e) => {
    e.preventDefault(); // Prevents the default form submit action

    // Check if any field is empty
    if (!digitCode) {
      setError("Please fill in all fields");
      return;
    }

    if (digitCode.length !== 6) {
      setError("Please enter correctly");
      return;
    }

    // Clear error and proceed with sign-up logic
    setError("");

    // Navigate to authentication page
    navigate("/authentication");
  };

  const handleSendCode = () => {
    console.log("sending")
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <div
        className="max-w-sm w-full rounded-lg border border-gray-800 shadow-md"
        style={{ backgroundColor: "#1E2226" }}
      >
        {/* Centering the logo */}
        <div className="flex justify-center mt-4">
          <img src={logo} width={45} alt="CipherTradeAI" />
          <h1 className="mt-2.5 ml-2 font-bold text-white">CipherTrade AI</h1>
        </div>
        <h1
          className="text-lg font-bold text-center p-1 mb-0 mtext-white mt-2"
          style={{ color: "#2C7AFE" }}
        >
          2-factor authentication
        </h1>
        <form
          className="px-8 pt-4 pb-5 mb-2 bg-white rounded-lg"
          style={{ backgroundColor: "#1E2226" }}
          onSubmit={handleVerify}
        >
          <div className="mb-4">
            <label
              htmlFor="Enter"
              className="block mb-2 text-sm font-medium text-white"
            >
              Verify Code 6 digit
            </label>
            <input
              type="text"
              id="Enter 6 digit code"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter 6 digit code"
              required
              value={digitCode}
              onChange={(e) => setDigitCode(e.target.value)} // Add this line
            />
            {error && (
              <p className="text-red-500 text-xs italic mt-4">{error}</p>
            )}
          </div>
          <button
            type="button" // Change type to 'button' to prevent form submission
            className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
            onClick={handleSendCode}
          >
            Send Code
          </button>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 mt-8 h-12 block w-full" // Adjust width here
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default authentication;

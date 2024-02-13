import React, { useState, useEffect } from "react";
import logo from "../../img/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Authentication = () => {
  const navigate = useNavigate();

  const [digitCode, setDigitCode] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30); // Initial countdown value
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleVerify = (e) => {

    const checkVerifyCode = async() => {
      try {
        const response = await axios.post('http://localhost:5000/api/verify-suc', 
        {
          verifyCode: digitCode
        },
        {
          withCredentials: true,
        })
        if (response.data.success == true) {
          console.log("Verification Success")
          // Navigate to authentication page
          navigate("/login");
        }
        else {
          setError("Code dosen't match")
          console.log(response)
        }
      } catch(err) {
          console.log(err)
      }
    }

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

    // Clear error
    setError("");

    checkVerifyCode()
  };

  const handleSendCode = () => {
    const sendCode = async () => {
      try {
        // Disable the button and reset the countdown
        setIsButtonDisabled(true);
        setCountdown(30);

        // Your axios request to resend the verification code
        const response = await axios.get("http://localhost:5000/api/send-suc", {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });

        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    sendCode();
  };

  useEffect(() => {
    let timer;

    // Update the countdown every second
    if (countdown > 0 && isButtonDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isButtonDisabled) {
      // Enable the button when the countdown reaches zero
      setIsButtonDisabled(false);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [countdown, isButtonDisabled]);

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
          Email Verification for Sign Up
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
              Verify Code 6 digits
            </label>
            <input
              type="text"
              id="Enter 6 digit code"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter 6 digit code"
              required
              value={digitCode}
              onChange={(e) => setDigitCode(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-xs italic mt-4">{error}</p>
            )}
          </div>
          <button
            type="button"
            className={`text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2 ${
              isButtonDisabled ? "cursor-not-allowed" : ""
            }`}
            onClick={handleSendCode}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled
              ? `Resend Code (${countdown}s)`
              : "Send Code"}
          </button>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 mt-8 h-12 block w-full"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
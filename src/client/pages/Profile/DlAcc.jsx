// React
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

// Modal
import Modal from "../../layouts/Modal/Modal"

export default function DlAcc() {

    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 1200px)" });

    // useState for Checking Modal is Open or Close
    const [isDlAccModalOpen, setIsDlAccModalOpen] = useState(false)

    return (
        <div className={isTabletMid ? "profile-content w-full flex flex-col px-5 items-center" : "profile-content w-full flex flex-col my-10 ml-10 mr-5 items-center"}>
            <h1 className="text-[#ff4d4d]/80 font-bold self-start">Delete Account</h1>
            <img
                src="http://localhost:3000/img/fail-robot.png"
                className="mt-5 w-7/12"
                alt="FailRobot"
            />
            <h2 className="mt-10">Are You Sure to Delete Your Account?</h2>
            <button className="bg-[#ff4d4d]/80 mt-5 py-3 px-5 hover:bg-red-500 transition-colors duration-300 rounded-md" onClick={() => setIsDlAccModalOpen(!isDlAccModalOpen)}>Delete Account</button>
            <Modal 
                showModal={isDlAccModalOpen} 
                onClose={() => setIsDlAccModalOpen(!isDlAccModalOpen)} 
                modalType={"dlAcc"}
            />
        </div>
    );
    
}
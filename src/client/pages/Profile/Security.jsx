// React
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip';

// Icon
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";

// Layout
import Modal from "../../layouts/Modal/Modal"

export default function Security({data}) {

    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 1200px)" });

    // Fetch user data
    const [userData, setUserData] = useState({});

    useEffect(() => {
        
        setUserData(data);

    }, [data]);

// ======================================================= Modal =======================================================
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [isPWModalOpen, setIsPWModalOpen] = useState(false);
    const [isAuthenModalOpen, setIsAuthenModalOpen] = useState(false);

    return (
        <div className={isTabletMid ? "security-content w-full flex flex-col px-5" : "profile-content w-full flex flex-col my-10 ml-10 mr-5"}>
            <h1>Security</h1>
            <div className="personal-board w-full h-full border-[2px] py-10 px-10 mt-8 border-slate-500 rounded-2xl">
                <div className="title-edit grid grid-cols-1 justify-start items-center">
                    <h2 className="text-xl text-[#2C7AFE] font-bold">Private Information</h2>
                </div>
                <div className="private-info grid grid-rows-4 gap-5 mt-10">
                    <div className="email flex flex-col gap-2">
                        <h3 className="text-slate-500">Email :</h3>
                        <div className="user-email-edit grid grid-cols-2 items-center">
                            <h3 className="user-email w-10/12 overflow-hidden text-ellipsis">{userData.email}</h3>
                            <Tooltip
                                id="email-tooltip" 
                                anchorSelect=".user-email" 
                                place="top"
                                variant="info" 
                                content="nattachai.aroonkij@gmail.com"
                            />
                            <button className="change-button em" onClick={() => setIsEmailModalOpen(!isEmailModalOpen)}>Change Email</button>
                            <Modal 
                                showModal={isEmailModalOpen} 
                                onClose={() => setIsEmailModalOpen(!isEmailModalOpen)} 
                                modalType={"email"}
                            />
                            <Tooltip
                                id="CEM-tooltip" 
                                anchorSelect=".change-button.em" 
                                place="top"
                                variant="info" 
                                content="Change Email"
                                className={`${isTabletMid ? "" : "hidden"}`}
                            />
                        </div>  
                    </div>
                    <div className="phone flex flex-col gap-2">
                        <h3 className="text-slate-500">Phone Number :</h3>
                        <div className="user-phone-edit grid grid-cols-2 items-center">
                            <h3 className="user-phone overflow-hidden text-ellipsis whitespace-nowrap">{userData.phone}</h3>
                            <Tooltip
                                id="phone-tooltip" 
                                anchorSelect=".user-phone" 
                                place="top"
                                variant="info" 
                                content="095-XXX-XXXX"
                                className={`${isTabletMid ? "" : "hidden"}`}
                            />
                            <button className="change-button pn" onClick={() => setIsPhoneModalOpen(!isPhoneModalOpen)}>Change Phone Number</button>
                            <Modal 
                                showModal={isPhoneModalOpen} 
                                onClose={() => setIsPhoneModalOpen(!isPhoneModalOpen)} 
                                modalType={"phoneNumber"}
                            />
                            <Tooltip
                                id="CPN-tooltip" 
                                anchorSelect=".change-button.pn" 
                                place="top"
                                variant="info" 
                                content="Change Phone Number"
                                className={`${isTabletMid ? "" : "hidden"}`}
                            />     
                        </div>
                    </div>
                    <div className="password grid grid-cols-2 items-center">
                        <h3 className="text-slate-500">Password :</h3>
                        <button className="change-button pw" onClick={() => setIsPWModalOpen(!isPWModalOpen)}>Change Password</button>
                        <Modal 
                                showModal={isPWModalOpen} 
                                onClose={() => setIsPWModalOpen(!isPWModalOpen)} 
                                modalType={"password"}
                            />
                        <Tooltip
                                id="CPW-tooltip" 
                                anchorSelect=".change-button.pw" 
                                place="top"
                                variant="info" 
                                content="Change Password"
                                className={`${isTabletMid ? "" : "hidden"}`}
                        />
                    </div>
                    <div className="phone-sec grid grid-cols-2 items-center">
                        <h3 className="two-authen text-slate-500 w-10/12 overflow-hidden text-ellipsis whitespace-nowrap">2-Factor Authentication :</h3>
                        <Tooltip
                                id="2Authen-tooltip" 
                                anchorSelect=".two-authen" 
                                place="top"
                                variant="info" 
                                content="2-Factor Authentication"
                                className={`${isTabletMid ? "" : "hidden"}`}
                        />
                        <button 
                            className={userData.authen 
                                ? "verify-button flex items-center gap-2 bg-[#07A66C]" : "verify-button flex items-center gap-2 bg-red-500/80"}
                            onClick={() => setIsAuthenModalOpen(!isAuthenModalOpen)}
                        >
                            <span>{userData.authen ? "Verified" : "Not Verified"}</span>
                            {userData.authen
                                ? <IoIosCheckmarkCircle />
                                : <IoIosCloseCircle />
                            }
                        </button>
                        <Modal 
                            showModal={isAuthenModalOpen} 
                            onClose={() => setIsAuthenModalOpen(!isAuthenModalOpen)} 
                            modalType={"authen"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    
}
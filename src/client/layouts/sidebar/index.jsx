// React
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { NavLink, useLocation } from "react-router-dom";

// Axios
import axios from "axios";

// Framer
import { motion } from "framer-motion";

// Modal
import LogoutModal from "../Modal/LogoutModal";

// React Icons
import { MdHeadphones, MdAnalytics, MdAccountBox, MdExitToApp } from "react-icons/md";
import { RiRobot2Fill, RiFileList3Fill } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";

// Logo Image
import logo from "../../img/logo.png";

const Sidebar = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  let isTabletHight = useMediaQuery({ query: "(max-height: 540px)" });

  const isLoginPage = useLocation().pathname == "/login" ? true : false

  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  let { pathname } = useLocation();

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid, pathname]);

  const handleMouseEnter = () => {
    if (!isTabletMid) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTabletMid) {
      setOpen(false);
    }
  };

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: 0,
          width: "4rem",
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  const subMenusList = [
    {
      name: "Profile",
      icon: BsPersonCircle,
      menus: [
        { name: "My Profile", to: "/profile/#my-profile" },
        { name: "Logout", to: "/logout" },
      ],
    },
  ];

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {

    const redirectPage = async() => {
      window.location.href = "/login";
    }

    const signoutSubmit = async() => {
      try {
        const logoutRes = await axios.get(`http://localhost:5000/api/logout`, {
          withCredentials: true,
        })

        console.log(logoutRes.data)
        await redirectPage()
        
      } catch(err) {
        console.log(err)
      }
    }

    signoutSubmit();

  };

  return (
    <div className="bg-[#1E2226]">
      <motion.div
        onClick={() => setOpen(!open)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-[#1E2226] text-gray shadow-xl z-[999] max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen"
      >
        <div>
          <NavLink to="/" className="flex items-center gap-2.5 font-medium border-b py-3 border-gray-500  mx-3">
            <img src={logo} width={45} alt="" />
            <span className="text-xl text-[#2C7AFE] whitespace-pre"> CipherTrade AI</span>
          </NavLink>
        </div>

        <div className="flex flex-col  h-full relative ">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-3 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100   md:h-[68%] h-[70%] text-[#2C7AFE]">
            <li>
              <NavLink to={"/aiTradingBot"} className="link hover:bg-blue-700 hover:text-white rounded">
                <RiRobot2Fill size={23} className="min-w-max group-hover:scale-110" />
                Al Trading Bot
              </NavLink>
            </li>
            <li>
              <NavLink to={"/accounts"} className="link hover:bg-blue-700 hover:text-white rounded">
                <MdAccountBox size={23} className="min-w-max" />
                Accounts
              </NavLink>
            </li>
            <li>
              <NavLink to={"/statements"} className="link hover:bg-blue-700 hover:text-white rounded">
                <RiFileList3Fill size={23} className="min-w-max" />
                Statements
              </NavLink>
            </li>
            <li>
              <NavLink to={"/overall"} className="link hover:bg-blue-700 hover:text-white rounded">
                <MdAnalytics size={23} className="min-w-max" />
                Overall
              </NavLink>
            </li>
            <div className="border-t py-3 border-gray-500 ">
              <li>
                <NavLink to={"/support"} className="link hover:bg-blue-700 hover:text-white rounded">
                  <MdHeadphones size={23} className="min-w-max" />
                  Support
                </NavLink>
              </li>
            </div>
          </ul>

          <div className="flex-1 text-sm z-50  max-h-60 mt-auto  whitespace-pre   w-full  font-medium  text-[#FFFFFF] absolute bottom-20">
            {open && (
              <div className={isTabletHight ? "hidden" : "flex border-y border-slate-300 p-4 items-center justify-between"}>
                <div>
                  <p>Commission</p>
                  <small>Total : 5000</small>
                </div>
                <p className="text-[#2C7AFE] py-1.5 px-3 text-xs bg-teal-50 rounded-xl">Pay</p>
              </div>
            )}
            <div>
              <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100  text-[#2C7AFE]">
                <li>
                  <NavLink to={"/profile/#my-profile"} className="link hover:bg-blue-700 hover:text-white rounded">
                    <BsPersonCircle size={23} className="min-w-max" />
                    Profile
                  </NavLink>
                </li>
                {isLoginPage
                  ? <></>
                  : <li onClick={openLogoutModal}>
                      <div className={"link hover:bg-blue-700 hover:text-white rounded"}>
                        <MdExitToApp size={23} className="min-w-max" />
                        Logout
                      </div>
                    </li>
                }
                
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="m-3 md:hidden whitespace-pre flex flex-col mr-7">
        <BsPersonCircle size={25} color={"#2C7AFE"} />
      </div>
      <LogoutModal isOpen={showLogoutModal} onClose={closeLogoutModal} onLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;

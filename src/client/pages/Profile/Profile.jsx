// React
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip';
import { HashLink } from "react-router-hash-link";

// Framer
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'

// Normal image and css
const default_profile = "/img/default-profile.jpg"
import "../css/Profile.css"

// Sub Page
import MyProfile from "./MyProfile"
import Security from "./Security"
import DlAcc from "./DlAcc"
import Commission from "./Commission"

const Profile = () => {
  // Check Window Size for Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 880px)" });
  let sideToNav = useMediaQuery({ query: "(max-width: 1200px)" });

  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Fetch data when the component mounts
    // Replace this with your actual data fetching logic
    const fetchData = async () => {
        try {
            // Simulate a delay for loading animation (adjust the timeout duration as needed)
            setTimeout(async () => {
              const response = await fetch("http://localhost:3000/Data/data.json");
              const data = await response.json();

              // Set the fetched data to the state
              setUserData(data[0]);  // Assuming the data is an array, so access the first element
              setIsLoading(false);
            }, 500); // 1500 milliseconds (1.5 seconds) timeout
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false)
        }
    };

    fetchData();
  }, []);

  // Set Sidebar Menu
  const [sbMenu, setSBMenu] = useState(0)
  const [subPage, setSubPage] = useState(<MyProfile/>);

  // All tabs
  const usingMenu = [
  {
    link_profile: "My Profile",
    color: "#FFFFFF",
    id: "my-profile",
    path: "/profile/#my-profile",
  },
  {
    link_profile: "Security",
    color: "#FFFFFF",
    id: "security",
    path: "/profile/#security",
  },
  {
    link_profile: "Commission",
    color: "#FFFFFF",
    id: "commission",
    path: "/profile/#commission",
  },
  {
    link_profile: "Delete Account",
    color: "#FFFFFF",
    id: "deAcc",
    path: "/profile/#delete-account",
  },
];

  useEffect(() => {
    switch (sbMenu) {
      case 0:
        setSubPage(<MyProfile data={userData}/>);
        break;
      case 1:
        setSubPage(<Security data={userData}/>);
        break;
      case 2:
        setSubPage(<Commission />);
        break;
      case 3:
        setSubPage(<DlAcc />);
        break;
      default:
        setSubPage(null);
        break;
    }
  }, [sbMenu, userData]);

  return (
    isLoading
      ? <div className="loading-container">
          <div className="loading"></div>
        </div>
      : <div className="page-container flex flex-col mt-7 ml-auto">
          <h1 className="title text-2xl">Profile</h1>
          <div className={`profile-container flex flex-col rounded-t-2xl w-11/12 mt-10 ${isTabletMid ? "" : "gap-20" }`}>

            {/* Top Profile */}
            <div className={isTabletMid ? "top-profile py-5 px-10 flex justify-center rounded-t-2xl" : "top-profile py-10 px-10 flex justify-start rounded-t-2xl"}>
              {/* Blur Dark BG */}
              <div className="top-profile-overlay rounded-t-2xl px-10"></div>
              {isTabletMid 
                ? <div className="img-name z-10 flex flex-col items-center">
                    <img 
                      src={userData.profileImage ? userData.profileImage : default_profile } 
                      alt="Profile" 
                      className="w-12/12 h-[30vh] object-cover rounded-full z-10 border-white border-2"
                      onError={(e) => e.target.src = default_profile}
                    />
                    <h1 className="username text-[150%] z-10 mt-4 leading-normal overflow-hidden text-ellipsis whitespace-nowrap font-bold">{userData.username}</h1>
                  </div>
                : <div className="img-name z-10 flex items-center">
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-12/12 h-[50vh] object-cover rounded-full self-start z-10 border-white border-2"
                      onError={(e) => e.target.src = default_profile}
                    />
                    <h1 className="username text-[200%] z-10 mt-12 ml-10 leading-normal font-bold">{userData.username}</h1>
                  </div>
              }   
            </div>
            
            <div className={sideToNav ? "bottom-profile flex flex-col bg-[#1E2226]" : "bottom-profile flex bg-[#1E2226] mb-10"}>
              <LayoutGroup transition={{ duration: 0.5 }}>
                  <ul className={sideToNav 
                    ? "sidebar flex grid grid-cols-4 my-6 px-10 gap-6 border-b-2 border-slate-500 w-full justify-center text-center text-[30%]"
                    : "sidebar flex flex-col my-10 px-10 gap-6 border-r-2 border-slate-500 w-3/12"}>
                    {usingMenu.map(({ link_profile, id, path }, i) => (
                      <HashLink smooth to={path} key={i}>
                        <motion.li
                          key={i}
                          className={`title profile ${id} ${i === sbMenu && "selected"} ${sideToNav ? "rounded-t-lg": "rounded"}`}
                          onClick={() => setSBMenu(i)}
                          animate
                        > 
                            {i === sbMenu && (
                              <motion.div
                                className="underline box"
                                layoutId="underline"
                                style={{
                                  backgroundColor: link_profile === "Delete Account" ? "rgba(255, 77, 77, 0.8)" : "#2C7AFE",
                                }}
                              />
                            )}
                          <span className="px-5">{link_profile}</span>
                        </motion.li>
                      </HashLink>
                    ))}
                    {usingMenu.map(({ link_profile, id }, i) => (
                      <Tooltip
                        key={`tooltip-${i}`}
                        id="bar-tooltip" 
                        anchorSelect={".title.profile." + id} 
                        place="top"
                        variant="info" 
                        content={link_profile}
                        style={{zIndex:9999, fontSize:"16px"}}
                        className={sideToNav ? "" : "hidden"}
                      />
                    ))}
                  </ul>
              </LayoutGroup>

              <AnimatePresence mode="wait">
                <motion.div
                  className={sideToNav ? "motion-profile w-full mb-10" : "motion-profile w-8/12 mb-10"}
                  key={sbMenu}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {subPage}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
  );
};

export default Profile;

// React
import React from 'react';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// DropDown
import "../layouts/DropDown/DropDown.css"

// DatePicker
import { DateRangePicker } from 'react-date-range';
import { startOfYear, set, addYears } from 'date-fns';
import moment from 'moment'; // for change the format of date
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2DateFill } from "react-icons/bs"; // calender icon

// Tabs
import { motion, LayoutGroup } from "framer-motion";
import '../layouts/layoutsCss/Tabs.css'

// Normal CSS
import "../pages/css/Statements.css"

// Axios
import axios from 'axios';

// Fetch Data
import { fetchUserId } from './fetch/fetchData';

const Statements = () => {

    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });
    // Loading Page
    const [isLoading, setIsLoading] = useState(true)

// =========================================================== Tabs ===========================================================
    // useState to set which tab is selected
    const [selectedTab, setSelectedTab] = useState(0);

    // All tabs
    const usingTabs = [
      {
        title: "Order History",
        color: "#FFFFFF"
      },
      {
        title: "Position",
        color: "#FFFFFF"
      }
    ]

// =========================================================== Bot Filter + DropDown ===========================================================

    // useState to set state of DropDown and Bot Choosed
    const [dropped, setDropped] = useState(false)

    const [userId, setUserId] = useState('')
    const [accountPick, setAccountPick] = useState("All")
    const [accounts, setAccounts] = useState([{}])

    const [isAccountFetched, setIsAccountFetched] = useState(false)

    useEffect(() => {
      // Fetch User MT Account
      const fetchUser_mtAccount = async() => {
        const fetchedUserId = await fetchUserId();
        setUserId(fetchedUserId);
        if (!fetchedUserId) return; 
        try {
          const response = await axios.get(`http://localhost:5000/api/account-mt`, {
            params: { user_id: fetchedUserId },
            withCredentials: true
          });

          setIsAccountFetched(true)
          setAccounts(response.data)

        } catch(err) {
          console.log(err)
        }
      }

      fetchUser_mtAccount()

    },[])

    // Control DropDown in and out
    useEffect(() => {
        const dropdownBtn = document.querySelector(".dropdown-btn");
        const dropdownCaret = document.querySelector(".arrow");
        const dropdownContent = document.querySelector(".dropdown-content");

        // add rotate to caret element
        dropdownCaret.classList.toggle("arrow-rotate");
        // add open styles to menu element
        dropdownContent.classList.toggle("menu-open");
        dropdownBtn.setAttribute(
            "aria-expanded",
            dropdownBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
        );
    },[dropped])

// =========================================================== Date Filter ===========================================================
    // useState to set Start and End Date
    const [dateRange, setDateRange] = useState([
      {
        startDate: set(startOfYear(new Date()), { hours: 0, minutes: 0, seconds: 0 }),
        endDate: addYears(new Date(), 2),
        key: 'selection'
      }
    ]);

    // State to manage calendar visibility
    const [isCalendarVisible, setCalendarVisible] = useState(false);

    // Variable to show Start Date and End Date in the  button
    const formattedStartDate = moment(dateRange[0].startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(dateRange[0].endDate).format("DD-MM-YYYY");

// ===========================================================  Table ===========================================================
// =========================================================== Order Table ===========================================================
    // useState for keeping Order Data
    const [tableOrderData, setTableOrderData] = useState([]);
    const [orders, setOrders] = useState([{}])
    const [isOrderFetched, setIsOrderFetched] = useState(false)

    // Fetch Order Data
    useEffect(() => {
      // Fetch Order
      const fetchOrder = async() => {
        try {
          let orderResponse = await axios.get("http://localhost:5000/api/fetch-order", {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          });

          setOrders(orderResponse.data.orders)
          setIsOrderFetched(true)

        } catch(err) {
          console.log(err)
        }
      }

      fetchOrder()

    }, [])

    // Update the Table when the date or bot filter change
    useEffect(() => {
      // Update the Table when the date or bot filter changes
      if (isOrderFetched) {
        if (accountPick === "All") {
          let fetchData = orders.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          fetchData = fetchData.map(data => ({ ...data, entrytime: new Date(data.entrytime) }));
          setTableOrderData(fetchData);
        } else {
          // Handle filtering for specific bot (demoOrderData is not used here, use orders instead)
          let mt5Username
          accounts.forEach((account) => {
            if(accountPick == account.name_account) {
              mt5Username = account.username_mt5
            }
          })

          let fetchBotData = orders.filter(data => data.username_mt5 === mt5Username);
          let fetchData = fetchBotData.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          setTableOrderData(fetchData);
        }
      }
    }, [isOrderFetched, accountPick, dateRange, orders]);    

// =========================================================== Position Table ===========================================================
    // useState for keeping Order Data
    const [tablePosData, setTablePosData] = useState([]);
    const [positions, setPositions] = useState([{}])
    const [isPositionFetched, setIsPositionFetched] = useState(false)

    // Fetch Order Data
    useEffect(() => {
      // Fetch Order
      const fetchPosition = async() => {
        try {
          let positionResponse = await axios.get("http://localhost:5000/api/fetch-position", {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          });

          setPositions(positionResponse.data.positions)
          setIsPositionFetched(true)

        } catch(err) {
          console.log(err)
        }
      }

      fetchPosition()

    }, [])

    // Update the Table when the date or bot filter change
    useEffect(() => {
      // Update the Table when the date or bot filter changes
      if (isPositionFetched) {
        if (accountPick === "All") {
          let fetchData = positions.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          fetchData = fetchData.map(data => ({ ...data, entrytime: new Date(data.entrytime) }));
          setTablePosData(fetchData);
        } else {
          // Handle filtering for specific bot (demoOrderData is not used here, use orders instead)
          let mt5Username
          accounts.forEach((account) => {
            if(accountPick == account.name_account) {
              mt5Username = account.username_mt5
            }
          })

          let fetchBotData = positions.filter(data => data.username_mt5 === mt5Username);
          let fetchData = fetchBotData.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          setTablePosData(fetchData);
        }
      }
    }, [isPositionFetched, accountPick, dateRange, positions]); 


// ===========================================================  Loading Animation ===========================================================

    useEffect(() => {
      if(isAccountFetched && isOrderFetched && isPositionFetched) {
        setIsLoading(false)
      }
    }, [isAccountFetched, isOrderFetched, isPositionFetched])

// ===================================================================================================================================

    return (
      <div className="page-container flex flex-col mt-7 ml-auto">
        <h1 className="title text-2xl">Orders</h1>

        {/* Type of Statements */}
        <LayoutGroup transition={{ duration: 0.5 }}>
          <ol className='mt-6 mb-2 border-b-2 border-slate-500 w-full gap-10'>
            {usingTabs.map(({ title, color }, i) => (
              <motion.li
                key={i}
                className={`title ${i === selectedTab && "selected"}`}
                style={{ color: i === selectedTab ? color : "#64748b" }}
                onClick={() => setSelectedTab(i)}
                animate
              >
                {i === selectedTab && (
                  <motion.div
                    className="underline"
                    layoutId="underline"
                    style={{ backgroundColor: "#2C7AFE" }}
                  />
                )}
                <span className='px-5'>{title}</span>
              </motion.li>
            ))}
          </ol>
        </LayoutGroup>

        {/* Filter */}
        <div className="filter flex flex-auto flex-wrap mt-3 mr-auto gap-5 items-center">

          {/* Date Filter */}
          <div className="date-filter">
            <button className="butttonShowCalender flex items-center gap-5 bg-[#2a2c2d] p-3 rounded-lg" onClick={() => {setCalendarVisible(!isCalendarVisible)}}>
              <span>{formattedStartDate} - {formattedEndDate}</span>
              <BsCalendar2DateFill/>
            </button>
            <ul className="ulShowDate absolute z-50">
              {isCalendarVisible 
              ? <li className="liCalender block">
                  <DateRangePicker
                    className="text-[#2C7AFE]"
                    onChange={item => setDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={dateRange}
                    direction="horizontal"
                  />
                </li> 
              : <li className="liCalender hidden w-11/12">
                  <DateRangePicker
                    className="text-[#2C7AFE]"
                    onChange={item => setDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={dateRange}
                    direction="horizontal"
                  />
                </li>
              }
            </ul>
          </div>

          {/* Bot Filter */}
          <div className="bot-filter whitespace-pre flex flex-auto items-center w-[16em] z-60">
            <p className="mr-2">Bot :</p>
            <div className="dropdown">
              <button className="dropdown-btn" aria-label="menu button" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-menu" onClick={() => {setDropped(!dropped)}}>
                  <span>{accountPick}</span>
                  <span className="arrow"></span>
              </button>
              <ul className="dropdown-content" role="menu" id="dropdown-menu">
                  {accounts.map((account) => (
                    <li key={account.username_mt5} onClick={() => setAccountPick(account.name_account)}>
                      <p>{account.name_account}</p>
                    </li>
                  ))}
              </ul>
          </div>
          </div>
          <div className="resetButton bg-[#3a3c3d] rounded-lg flex-shrink-0">
            <button className="py-3 px-5" onClick={() => {setAccountPick("All")}}>Reset</button>
          </div>
        </div>

        {/* Table */}
        {isLoading 
          ?
          <div className="loading-container h-[50vh] w-11/12">
            <div className="loading"></div>
          </div>
          :
            <div className="mt-3"> 
              {selectedTab == 0 
                ? 
                  <table className="text-center w-full" border="1">
                    <thead className="text-slate-500">
                      {isTabletMid
                        ? <tr className="border-y-2 border-slate-500">
                            <th className="py-2">ID</th>
                            <th>Account</th>
                            <th>Symbol</th>
                            <th>Side</th>
                            <th>Profit</th>
                          </tr>
                        : <tr className="border-y-2 border-slate-500 text-sm">
                            <th className="py-2">ID</th>
                            <th>Account</th>
                            <th>Symbol</th>
                            <th>Entry Time</th>
                            <th>Exit Time</th>
                            <th>Take Profit</th>
                            <th>Stop Loss</th>
                            <th>Side</th>
                            <th>Price</th>
                            <th>Lot</th>
                            <th>Profit</th>
                          </tr>
                      }
                    </thead>
                    <tbody>
                      {isTabletMid
                        ? tableOrderData.map((row) => (
                          <motion.tr
                            key={row.order_id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-600"
                          >
                              <td className="pt-2">{row.order_id}</td>
                              <td>
                                {(() => {
                                  let mtAccount = ""; // Initialize an empty string to store the matching name_account
                                  accounts.forEach((element) => {
                                    if (element.username_mt5 === row.username_mt5) {
                                      mtAccount = element.name_account; // Set mtAccount if there is a match
                                    }
                                  });
                                  return mtAccount; // Return the matched value for rendering
                                })()}
                              </td>
                              <td>{row.symbol}</td>
                              <td className={row.side === 'Buy' ? 'text-[#07A66C]' : 'text-red-500'}>{row.side}</td>
                              <td>{(row.profit).toFixed(2)}</td>
                            </motion.tr>
                          ))
                        : tableOrderData.map((row) => (
                          <motion.tr
                            key={row.order_id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-600"
                          >
                              <td className="pt-2">{row.order_id}</td>
                              <td>
                                {(() => {
                                  let mtAccount = ""; // Initialize an empty string to store the matching name_account
                                  accounts.forEach((element) => {
                                    if (element.username_mt5 === row.username_mt5) {
                                      mtAccount = element.name_account; // Set mtAccount if there is a match
                                    }
                                  });
                                  return mtAccount; // Return the matched value for rendering
                                })()}
                              </td>
                              <td>{row.symbol}</td>
                              <td>{moment(row.entrytime).format('DD-MM-YYYY h:mm')}</td>
                              <td>{moment(row.exittime).format('DD-MM-YYYY h:mm')}</td>
                              <td>{(row.tp).toFixed(5)}</td>
                              <td>{(row.sl).toFixed(5)}</td>
                              <td className={row.side === 'buy' ? 'text-[#07A66C]' : 'text-red-500'}>{row.side}</td>
                              <td>{(row.entryprice).toFixed(5)}</td>
                              <td>{row.lotsize}</td>
                              <td>{(row.profit).toFixed(2)}</td>
                            </motion.tr>
                          ))}
                    </tbody>
                  </table>
              :
                  <table className="text-center w-full" border="1">
                    <thead className="text-slate-500">
                      {isTabletMid
                        ? <tr className="border-y-2 border-slate-500">
                        <th className="py-2">ID</th>
                        <th>Account</th>
                        <th>Symbol</th>
                        <th>Entry Time</th>
                        <th>Side</th>
                      </tr>
                        : <tr className="border-y-2 border-slate-500">
                        <th className="py-2">ID</th>
                        <th>Account</th>
                        <th>Symbol</th>
                        <th>Entry Time</th>
                        <th>Side</th>
                        <th>Price</th>
                        <th>Lot</th>
                      </tr>
                      }
                    </thead>
                    <tbody>
                      {isTabletMid
                        ? tablePosData.map((row) => (
                          <motion.tr
                            key={row.order_id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-600"
                          >
                              <td className="pt-2">{row.order_id}</td>
                              <td>
                                {(() => {
                                  let mtAccount = ""; // Initialize an empty string to store the matching name_account
                                  accounts.forEach((element) => {
                                    if (element.username_mt5 === row.username_mt5) {
                                      mtAccount = element.name_account; // Set mtAccount if there is a match
                                    }
                                  });
                                  return mtAccount; // Return the matched value for rendering
                                })()}
                              </td>
                              <td>{row.symbol}</td>
                              <td>{moment(row.entrytime).format('DD-MM-YYYY h:mm')}</td>
                              <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                            </motion.tr>
                          ))
                        : tablePosData.map((row) => (
                          <motion.tr
                            key={row.order_id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-slate-600"
                          >
                              <td className="pt-2">{row.order_id}</td>
                              <td>
                                {(() => {
                                  let mtAccount = ""; // Initialize an empty string to store the matching name_account
                                  accounts.forEach((element) => {
                                    if (element.username_mt5 === row.username_mt5) {
                                      mtAccount = element.name_account; // Set mtAccount if there is a match
                                    }
                                  });
                                  return mtAccount; // Return the matched value for rendering
                                })()}
                              </td>
                              <td>{row.symbol}</td>
                              <td>{moment(row.entrytime).format('DD-MM-YYYY h:mm')}</td>
                              <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                              <td>{row.entryprice}</td>
                              <td>{row.lotsize}</td>
                            </motion.tr>
                          ))}
                    </tbody>
                  </table>    
              }
             </div>
          } 
      </div>
    )
  };
  
  export default Statements;
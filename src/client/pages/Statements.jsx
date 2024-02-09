// React
import React from 'react';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// DropDown
import "../layouts/layoutsCss/DropDown.css"

// DatePicker
import { DateRangePicker } from 'react-date-range';
import { subDays, set } from 'date-fns';
import moment from 'moment'; // for change the format of date
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2DateFill } from "react-icons/bs"; // calender icon

// Tabs
import { motion, LayoutGroup } from "framer-motion";
import '../layouts/layoutsCss/Tabs.css'

// Normal CSS
import "../pages/css/Statements.css"

const Statements = () => {

    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

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
    const [botPick, setBotPick] = useState("All")

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
        startDate: set(subDays(new Date(), 7), { hours: 0, minutes: 0, seconds: 0 }),
        endDate: new Date(),
        key: 'selection'
      }
    ])

    // State to manage calendar visibility
    const [isCalendarVisible, setCalendarVisible] = useState(false);

    // Variable to show Start Date and End Date in the  button
    const formattedStartDate = moment(dateRange[0].startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(dateRange[0].endDate).format("DD-MM-YYYY");

// ===========================================================  Table ===========================================================
// =========================================================== Order Table ===========================================================
    // Sample Order Data
    const demoOrderData = [
      { id: 20000, currencyPair: "EURUSD", entryTime: 1706603347000, exitTime: "24-12-2023", bot: "Bot4", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20001, currencyPair: "EURUSD", entryTime: 1706603347000, exitTime: "24-12-2023", bot: "Bot1", side: "Sell", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20002, currencyPair: "EURUSD", entryTime: 1706803347000, exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20003, currencyPair: "EURUSD", entryTime: 1706803347000, exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20004, currencyPair: "EURUSD", entryTime: 1706903347000, exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20005, currencyPair: "EURUSD", entryTime: 1707003347000, exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20006, currencyPair: "EURUSD", entryTime: 1707003347000, exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
    ];

    // useState for keeping Order Data
    const [tableOrderData, setTableOrderData] = useState([]);

    // Update the Table when the date or bot filter change
    useEffect(() => {
      if(botPick === "All") {
        let fetchData = demoOrderData.filter(data => data.entryTime >= dateRange[0].startDate.getTime() && data.entryTime <= dateRange[0].endDate.getTime());
        fetchData = fetchData.map(data => ({ ...data, entryTime: new Date(data.entryTime) }));
        setTableOrderData(fetchData);
      }
      else {
        let fetchBotData = demoOrderData.filter(data => data.bot === botPick)
        let fetchData = fetchBotData.filter(data => data.entryTime >= dateRange[0].startDate.getTime() && data.entryTime <= dateRange[0].endDate.getTime());
        setTableOrderData(fetchData);
      }
    }, [botPick, dateRange]);

// =========================================================== Position Table ===========================================================
        // Sample Order Data
        const demoPosData = [
          { id: 30000, currencyPair: "EURUSD", entryTime: 1707180920000, exitTime: "24-12-2023", bot: "Bot4", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
          { id: 30001, currencyPair: "EURUSD", entryTime: 1707180920000, exitTime: "24-12-2023", bot: "Bot1", side: "Sell", price: 1.0982, lot: 0.01, profit: 5.25 },
          { id: 30002, currencyPair: "EURUSD", entryTime: 1707180920000, exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
          { id: 30003, currencyPair: "EURUSD", entryTime: 1707180920000, exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
          { id: 30004, currencyPair: "EURUSD", entryTime: 1707180920000, exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
        ];

        // useState for keeping Order Data
        const [tablePosData, setTablePosData] = useState([]);

        // Update the Table when the date or bot filter change
        useEffect(() => {
          if(botPick === "All") {
            let fetchData = demoPosData.filter(data => data.entryTime >= dateRange[0].startDate.getTime() && data.entryTime <= dateRange[0].endDate.getTime());
            fetchData = fetchData.map(data => ({ ...data, entryTime: new Date(data.entryTime) }));
            setTablePosData(fetchData);
          }
          else {
            let fetchBotData = demoPosData.filter(data => data.bot === botPick)
            let fetchData = fetchBotData.filter(data => data.entryTime >= dateRange[0].startDate.getTime() && data.entryTime <= dateRange[0].endDate.getTime());
            setTablePosData(fetchData);
          }
        }, [botPick, dateRange]);

// ===================================================================================================================================

    return (
      <div className="page-container flex flex-col mt-7 ml-auto">
        <h1 className="title text-2xl">Orders</h1>

        {/* Type of Statements */}
        <LayoutGroup transition={{ duration: 0.5 }}>
          <ol className='mt-6 mb-2 border-b-2 border-slate-500 w-11/12 gap-10'>
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
                  <span>{botPick}</span>
                  <span className="arrow"></span>
              </button>
              <ul className="dropdown-content" role="menu" id="dropdown-menu">
                  <li onClick={() => {setBotPick("Bot1")}}><p>Bot1</p></li>
                  <li onClick={() => {setBotPick("Bot2")}}><p>Bot2</p></li>
                  <li onClick={() => {setBotPick("Bot3")}}><p>Bot3</p></li>
                  <li onClick={() => {setBotPick("Bot4")}}><p>Bot4</p></li>
              </ul>
          </div>
          </div>
          <div className="resetButton bg-[#3a3c3d] rounded-lg flex-shrink-0">
            <button className="py-3 px-5" onClick={() => {setBotPick("All")}}>Reset</button>
          </div>
        </div>

        {/* Table */}
        {selectedTab == 0 
          ? <div className="mt-3">
              <table className="text-center w-11/12" border="1">
                <thead className="text-slate-500">
                  {isTabletMid
                    ? <tr className="border-y-2 border-slate-500">
                        <th className="py-2">ID</th>
                        <th>Currency Pair</th>
                        <th>Bot</th>
                        <th>Side</th>
                        <th>Profit</th>
                      </tr>
                    : <tr className="border-y-2 border-slate-500">
                        <th className="py-2">ID</th>
                        <th>Currency Pair</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Bot</th>
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
                        <tr key={row.id}>
                          <td className="pt-2">{row.id}</td>
                          <td>{row.currencyPair}</td>
                          <td>{row.bot}</td>
                          <td className={row.side === 'Buy' ? 'text-[#07A66C]' : 'text-red-500'}>{row.side}</td>
                          <td>{row.profit}</td>
                        </tr>
                      ))
                    : tableOrderData.map((row) => (
                        <tr key={row.id}>
                          <td className="pt-2">{row.id}</td>
                          <td>{row.currencyPair}</td>
                          <td>{moment(row.entryTime).format('DD-MM-YYYY h:mm')}</td>
                          <td>{row.exitTime}</td>
                          <td>{row.bot}</td>
                          <td className={row.side === 'Buy' ? 'text-[#07A66C]' : 'text-red-500'}>{row.side}</td>
                          <td>{row.price}</td>
                          <td>{row.lot}</td>
                          <td>{row.profit}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          : <div className="mt-3">
              <table className="text-center w-11/12" border="1">
                <thead className="text-slate-500">
                  {isTabletMid
                    ? <tr className="border-y-2 border-slate-500">
                    <th className="py-2">ID</th>
                    <th>Currency Pair</th>
                    <th>Bot</th>
                    <th>Entry Time</th>
                    <th>Side</th>
                  </tr>
                    : <tr className="border-y-2 border-slate-500">
                    <th className="py-2">ID</th>
                    <th>Currency Pair</th>
                    <th>Entry Time</th>
                    <th>Bot</th>
                    <th>Side</th>
                    <th>Price</th>
                    <th>Lot</th>
                  </tr>
                  }
                </thead>
                <tbody>
                  {isTabletMid
                    ? tablePosrData.map((row) => (
                        <tr key={row.id}>
                          <td className="pt-2">{row.id}</td>
                          <td>{row.currencyPair}</td>
                          <td>{row.bot}</td>
                          <td>{moment(row.entryTime).format('DD-MM-YYYY h:mm')}</td>
                          <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                        </tr>
                      ))
                    : tablePosData.map((row) => (
                        <tr key={row.id}>
                          <td className="pt-2">{row.id}</td>
                          <td>{row.currencyPair}</td>
                          <td>{moment(row.entryTime).format('DD-MM-YYYY h:mm')}</td>
                          <td>{row.bot}</td>
                          <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                          <td>{row.price}</td>
                          <td>{row.lot}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
        }
      </div>
    )
  };
  
  export default Statements;
  
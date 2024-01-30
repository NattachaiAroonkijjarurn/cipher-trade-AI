// React
import React from 'react';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// Layout
import "../layouts/layoutsCss/DropDown.css"

// DatePicker
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';


// Normal CSS
import "../pages/css/Statements.css"

const Statements = () => {

    // Check Window Size
    let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

    // Sample data
    const demoData = [
      { id: 20000, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot4", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20001, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot1", side: "Sell", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20002, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20003, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot2", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20004, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20005, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
      { id: 20006, currencyPair: "EURUSD", entryTime: "23-12-2023", exitTime: "24-12-2023", bot: "Bot3", side: "Buy", price: 1.0982, lot: 0.01, profit: 5.25 },
    ];

    const [tableData, setTableData] = useState([]);

    // Drop Down Pick Bot
    const [dropped, setDropped] = useState(false)
    const [botPick, setBotPick] = useState("All")

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

    // Update the Table
    useEffect(() => {
      if(botPick === "All") {
        setTableData(demoData);
      }
      else {
        let fetchData = demoData.filter(data => data.bot === botPick) 
        setTableData(fetchData);
      }
    }, [botPick]);

    // Date Range Picker
    const [datePick, setDatePick] = useState()

    return (
      <div className="page-container flex flex-col mt-7 ml-auto">
        <h1 className="titlle text-2xl">Orders</h1>

        {/* Type of Statements */}
        <div className="tabs border-b-2 border-slate-500 w-11/12 mt-6 flex pb-2">
          <div className="order ml-5">
              Order History
          </div>
          <div className="position ml-10">
              Position
          </div>
        </div>

        {/* Filter */}
        <div className="filter flex flex-auto flex-wrap mt-3 mr-auto gap-5 items-center">
          <div className="date-filter">

          < RangePicker
            onChange={(values) => {
              
              
              setDatePick(values.map(item=>{
                console.log(moment(item).format('DD-MM-YYYY'))
              }))
            }}
          />
            {console.log(datePick)}
          </div>
          <div className="bot-filter whitespace-pre flex flex-auto items-center w-[16em]">
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
        <div className="mt-3">
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
                ? tableData.map((row) => (
                    <tr key={row.id}>
                      <td className="pt-2">{row.id}</td>
                      <td>{row.currencyPair}</td>
                      <td>{row.bot}</td>
                      <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                      <td>{row.profit}</td>
                    </tr>
                  ))
                : tableData.map((row) => (
                    <tr key={row.id}>
                      <td className="pt-2">{row.id}</td>
                      <td>{row.currencyPair}</td>
                      <td>{row.entryTime}</td>
                      <td>{row.exitTime}</td>
                      <td>{row.bot}</td>
                      <td className={row.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{row.side}</td>
                      <td>{row.price}</td>
                      <td>{row.lot}</td>
                      <td>{row.profit}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  };
  
  export default Statements;
  
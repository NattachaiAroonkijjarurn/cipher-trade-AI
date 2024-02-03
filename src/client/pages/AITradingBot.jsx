import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

//layout
import "../layouts/layoutsCss/DropDown.css"

// //DataPicker
// import { DatePicker } from 'antd';
// const { RangePicker } = DatePicker;
// import moment from 'moment';


const AITradingBot = () => {

  // Check Window Size for Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

// =========================================================== Tabs ===========================================================
    // useState to set which tab is selected
    const [selectedTab, setSelectedTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  const demoData = [
    {
      id: 'bot1',
      currency_pair: 'EURUSD',
      timeframe: '15m',
      profit_gained: 31.20,
      winrate: 70,
      working_time: '17h 45m',
      status: 'Active',
      total_balance: 87.562,
      numberofTrades: 10,
      isActive: true,
    },
    {
      id: 'bot2',
      currency_pair: 'EURUSD',
      timeframe: '15m',
      profit_gained: 31.20,
      winrate: 70,
      working_time: '17h 45m',
      status: 'Active',
      total_balance: 87.562,
      numberofTrades: 10,
      isActive: true,
    },
  ]
  const [bots, setTableData] = useState([]);
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


  // Update the Table
  useEffect(() => {
    if(botPick === "All") {
      setTableData(demoData);
    }
    else {
      let fetchData = demoData.filter(data => data.currency_pair === botPick) 
      setTableData(fetchData);
    }
  }, [botPick]);

  const toggleBotStatus = (id) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === id) {
        return { ...bot, isActive: !bot.isActive };
      }
      return bot;
    });
    setTableData(updatedBots);
  };

  const resetBotData = (id) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === id) {
        return {
          ...bot,
          working_time: '0h 0m',
          winrate: 0,
          profit_gained: 0,
          numberofTrades: 0,
        };
      }
      return bot;
    });
    setTableData(updatedBots);
  };

  return (
    <div className="page-container flex flex-col mt-7 ml-auto">
      <h1 className="title text-2xl text-white ml-5">Bot Trading Strategies</h1>
      <div className="flex justify-between mx-5">
        <div></div>
        <div></div>
        <div className="flex">
          <div className="dropdown">
            <button className="dropdown-btn text-sm mr-10" aria-label="menu button" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-menu" onClick={() => setDropped(!dropped)}>
              <span>{botPick}</span>
              <span className="arrow"></span>
            </button>
              <ul className="dropdown-content text-sm" role="menu" id="dropdown-menu">
                <li onClick={() => {setBotPick("All")}}><p>All</p></li>
                <li onClick={() => {setBotPick("EURUSD")}}><p>EURUSD</p></li>
                <li onClick={() => {setBotPick("USDJPY")}}><p>USDJPY</p></li>
                <li onClick={() => {setBotPick("GBPUSD")}}><p>GBPUSD</p></li>
                <li onClick={() => {setBotPick("USDCHF")}}><p>USDCHF</p></li>
                <li onClick={() => {setBotPick("USDCAD")}}><p>USDCAD</p></li>
                <li onClick={() => {setBotPick("AUDUSD")}}><p>AUDUSD</p></li>
              </ul>
          </div>
          <button onClick={toggleModal} className="rounded-lg bg-blue-800 text-white whitespace-nowrap ml-3 px-2 ">
            + add strategy
          </button>
          <BotSettingModal isOpen={isModalOpen} onClose={toggleModal} />
        </div>
      </div>
      {bots.map((bot) => (
        <div key={bot.id} className="bot-info bg-[#1E2226] text-white p-4 my-4 rounded-lg flex justify-between mx-5">
          <div>
            <h2 className="text-lg">{bot.id}</h2>
            {/* Placeholder for Currency Pair which you might want to add in your dataBot array */}
          </div>
          <div className="flex">
            <div className="mr-40 mb-4 ml-80"> {/* Increased margin-right here */}
              <p>Profit</p>
              <div>{bot.profit_gained}</div>
              <p className="mt-6">Winrate</p>
              <div>{bot.winrate}%</div>
            </div>
            <div className="mr-40 mb-4 ml-20"> {/* Increased margin-right here */}
              <p>Working Time</p>
              <div>{bot.working_time}</div>
              <p className="mt-6">Status</p>
              <div className={bot.isActive ? 'text-green-500' : 'text-red-500'}>{bot.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div className="mb-4 ml-20"> {/* Optionally, adjust margin here as well */}
              <p>Total Balance</p>
              <div>${bot.total_balance}</div>
              <p className="mt-6">Trades</p>
              <div>{bot.numberofTrades}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <button
              className={`mb-4 px-2 py-1 rounded-full ${bot.isActive ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => toggleBotStatus(bot.id)}
            >
              {bot.isActive ? 'ON' : 'OFF'}
            </button>
            <button
              className="px-5 py-1 border border-neutral-500 rounded-lg mt-14"
              onClick={() => resetBotData(bot.id)}
            >
              Reset
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const BotSettingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-[#1E2226] p-10 rounded-lg shadow-lg space-y-3 w-3/4 max-w-4xl">
        <h2 className="text-xl font-bold text-white">Add Bot Strategy</h2>
        <div className="flex text-white flex-col">
          <form 
            className="px-8 pt-4 pb-5 mb-2 rounded-lg"
          >
            <div className="mb-4">
              <label 
                htmlFor="botname"
                className="block mb-2 text-sm font-medium text-white">Bot name
                </label>
                <input 
                  type="text"
                  id="botname"
                  className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-30 p-2.5" 
                  placeholder="bot name"
                  required
                  />
            </div>
            <div className="mt-20">
              <button 
                type="sumbit"
                className="bg-blue-800 rounded-lg px-8 py-2">
                  save
              </button>
              
            </div>
          </form>
        </div>
          <div className="text-right">
            <button onClick={onClose} className="bg-red-500 text-white rounded px-4 py-2">
              Close
            </button>
          </div>
      </div>
    </div>
  );
};
export default AITradingBot;

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

//layout
import "../layouts/DropDown/DropDown.css"
import "../layouts/layoutsCss/PopUp.css"

// //DataPicker
// import { DatePicker } from 'antd';
// const { RangePicker } = DatePicker;
// import moment from 'moment';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAnimation("modal-enter");
      setTimeout(() => {
        setAnimation("modal-enter-active");
      }, 7); // start the enter animation shortly after the component is rendered
    } else {
      setAnimation("modal-exit");
      setTimeout(() => {
        setAnimation("modal-exit-active");
      }, 7); // start the exit animation
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 text-white w-2/4 xl:w-1/4 ${animation}`}>
        <p>{message}</p>
        <div className="flex justify-between flex-col md:flex-row gap-2">
          <button onClick={() => {onClose(); setAnimation("");}} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 active:bg-gray-800">Cancel</button>
          <button onClick={() => {onConfirm(); setAnimation("");}} className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-400 active:bg-red-600">OK</button>
        </div>
      </div>
    </div>
  );
};


const AITradingBot = () => {

  // Check Window Size for Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

// =========================================================== Tabs ===========================================================
    // useState to set which tab is selected
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [selectedBotId, setSelectedBotId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bots, setTableData] = useState([]);
  const [dropped, setDropped] = useState(false)
  const [botPick, setBotPick] = useState("All")

  const [animation, setAnimation] = useState('slid-up')
  const [animationVisible, setAnimationVisible] = useState(true);

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

  useEffect (() => {
    setAnimation('slid-up')
    setTimeout(()=> {
      setAnimation('slid-up-active')
    }, 10)
    setTimeout(() => {
      setAnimationVisible(false)
    }, 800)
  } ,[]);

  const handleResetClick = (id) => {
    setShowConfirmation(true);
    setCurrentAction('reset');
    setSelectedBotId(id);
  };

  const handleDeleteClick = (id) => {
    setShowConfirmation(true);
    setCurrentAction('delete');
    setSelectedBotId(id);
  };

  const handleConfirmAction = () => {
    if (currentAction === 'reset') {
      resetBotData(selectedBotId);
    } else if (currentAction === 'delete') {
      const updatedBots = bots.filter(bot => bot.id !== selectedBotId);
      setTableData(updatedBots);
    }
    setShowConfirmation(false);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
      currency_pair: 'USDJPY',
      timeframe: '30m',
      profit_gained: 31.20,
      winrate: 70,
      working_time: '17h 45m',
      status: 'Active',
      total_balance: 87.562,
      numberofTrades: 10,
      isActive: true,
    },
  ]
  

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
      <div className={`flex justify-between mx-5`}>
        <div className="flex justify-end flex-1">
          <div className="dropdown w-24">
            <button className="dropdown-btn text-sm" aria-label="menu button" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-menu" onClick={() => setDropped(!dropped)}>
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
          <button onClick={toggleModal} className="rounded-lg bg-blue-600 text-white whitespace-nowrap ml-3 px-2 hover:bg-blue-500 active:bg-blue-700">
            + add strategy
          </button>
          <BotSettingModal isOpen={isModalOpen} onClose={toggleModal} setTableData={setTableData} />
        </div>
      </div>
      {bots.map((bot) => (
        <div key={bot.id} className={`bot-info bg-[#1E2226] text-white p-4 my-4 rounded-lg flex flex-col md:flex-row justify-between mx-5 text-sm ${animationVisible ? animation : ''}`}>
          <div className="md-4 xl:mb-0 xl:mr-80 mr-5">
            <h2 className="text-lg font-bold">{bot.id}</h2>
            <h2 className="text-base whitespace-nowrap">{bot.currency_pair} {bot.timeframe}</h2>
            {/* Placeholder for Currency Pair which you might want to add in your dataBot array */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 flex-1 xl:ml-32">
            <div className="flex flex-col">
              <div>
                <p>Profit</p>
                <div className={bot.profit_gained >= 0 ?"text-[#04A66D] " : "text-red-500"}>{bot.profit_gained}</div>
              </div>
              <div>
                <p className="mt-3">Winrate</p>
                <div className="text-zinc-400">{bot.winrate}%</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Working Time</p>
                <div className="text-zinc-400">{bot.working_time}</div>
              </div>
              <div>
                <p className="mt-3">Status</p>
                <div className={bot.isActive ? 'text-[#04A66D]' : 'text-red-500'}>{bot.isActive ? 'Active' : 'Inactive'}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Total Balance</p>
                <div className="text-zinc-400">${bot.total_balance}</div>
              </div>
              <div>
                <p className="mt-3">Trades</p>
                <div className="text-zinc-400">{bot.numberofTrades}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end mt-4 md:mt-0">
            <button className={`mb-4 px-2 py-1 rounded-full ${bot.isActive ? 'bg-[#04A66D] hover:bg-emerald-500 active:bg-emerald-600' : 'bg-red-500 hover:bg-red-400 active:bg-red-600'}`} onClick={() => toggleBotStatus(bot.id)}>
              {bot.isActive ? 'ON' : 'OFF'}
            </button>
            <button className="px-6 py-1 border border-neutral-500 rounded-lg ml-5 hover:bg-zinc-800 active:bg-zinc-900" onClick={() => handleResetClick(bot.id)}>
              reset
            </button>
            <button className="bg-red-500 text-white rounded-lg px-5 py-1 mt-2 ml-5 hover:bg-red-400 active:bg-red-600" onClick={() => handleDeleteClick(bot.id)}>
              delete
            </button>
          </div>
        </div>
      ))}
      <ConfirmationModal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
        onConfirm={handleConfirmAction} 
        message={`Are you sure you want to ${currentAction} this bot?`}
      />
    </div>
  );
};


const BotSettingModal = ({ isOpen, onClose, setTableData}) => {
  const [bot_name, setBotName] = useState('');
  const [currency, setCurrency] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [tpSlValues, setTpSlValues] = useState({tp:'', sl:''})

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBot = {
      id: bot_name,
      currency_pair: currency,
      timeframe: timeframe,
      profit_gained: 0,
      winrate: 0,
      working_time: '0h 0m',
      status: 'Active',
      total_balance: 0,
      numberofTrades: 0,
      isActive: true,
    };
    
    // Update the bots state with the new bot
    setTableData((prevBots) => [...prevBots, newBot]);
    
    // Reset form fields and close modal
    setBotName('');
    setCurrency('');
    setTimeframe('');
    onClose();
  };

  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAnimation("modal-enter");
      setTimeout(() => {
        setAnimation("modal-enter-active");
      }, 10); // start the enter animation shortly after the component is rendered
    } else {
      setAnimation("modal-exit");
      setTimeout(() => {
        setAnimation("modal-exit-active");
      }, 10); // start the exit animation
    }
  }, [isOpen]);

  useEffect(() => {
    switch (timeframe) {
      case '5m':
        setTpSlValues({ tp: '0.00100', sl: '0.00050' });
        break;
      case '15m':
        setTpSlValues({ tp: '0.00200', sl: '0.00100' });
        break;
      case '30m':
        setTpSlValues({ tp: '0.00500', sl: '0.00250' });
        break;
      case '1h':
        setTpSlValues({ tp: '0.00800', sl: '0.00400' });
        break;
      case '2h':
        setTpSlValues({ tp: '0.01000', sl: '0.00500' });
        break;
      case '4h':
        setTpSlValues({ tp: '0.01200', sl: '0.00600' });
        break;
      default:
        setTpSlValues({ tp: '', sl: '' });
    }
  }, [timeframe]);
  if (!isOpen) return null;
  return (
    <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/4 xl:w-2/6 max-w-4xl ${animation}`}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
        <h2 className="text-xl font-bold text-white">Add Bot Strategy</h2>
        <div className="flex text-white flex-col">
          <form 
            className="px-5 pt-4 pb-2 rounded-lg"
            onSubmit={handleSubmit}
          >
            <div>
              <h1 className="text-lg">General setting</h1>
            </div>
            <div className="mb-4 mt-2">
              <label 
                htmlFor="botname"
                className="block mb-2 text-sm font-medium text-zinc-400">Bot name
              </label>
              <input 
                type="text"
                id="botname"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5" 
                placeholder="bot name"
                required
                value={bot_name}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
            {/* Timeframe Select Dropdown */}
            <div className="mb-4">
              <label 
                htmlFor="Currencypair"
                className="block mb-2 text-sm font-medium text-zinc-400">Currency Pair
                </label>
                <select 
                  id="Currencypair"
                  className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                  required
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="" className="text-blue-200" disabled selected>Select currency pair</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="USDJPY">USDJPY</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="USDCHF">USDCHF</option>
                  <option value="USDCAD">USDCAD</option>
                  <option value="AUDUSD">AUDUSD</option>
                </select>
            </div>
            {/* Timeframe Select Dropdown */}
            <div className="mb-4">
              <label 
                htmlFor="timeframe"
                className="block mb-2 text-sm font-medium text-zinc-400">Timeframe
                </label>
                <select 
                  id="timeframe"
                  className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                  required
                  value={timeframe}
                  onChange ={(e) => setTimeframe(e.target.value)}
                > 
                  <option value="" className="text-blue-200" disabled selected>Select timeframe</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="30m">30m</option>
                  <option value="1h">1h</option>
                  <option value="2h">2h</option>
                  <option value="4h">4h</option>
                </select>
            </div>
            <div>
              <h1 className="text-lg">Strategy setting</h1>
            </div>
            <div className="flex justify-between items-end space-x-4 mt-2">
              <div className="flex-1">
                <label 
                  htmlFor="lot size"
                  className="block mb-2 text-sm font-medium text-zinc-400">Lot size
                  </label>
                  <input 
                    type="text"
                    id="lot size"
                    className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5" 
                    placeholder="lot size"
                    required
                    />
              </div>
              {/* TP and SL Display */}
              <div className="flex-1">
                <label htmlFor="tp" className="block mb-2 text-sm font-medium text-zinc-400">Take Profit (TP)</label>
                <input
                  type="text"
                  id="tp"
                  placeholder="0.00000"
                  className="bg-[#1E2226] border border-gray-600 text-zinc-400 text-sm rounded-lg w-full p-2.5 focus:outline-none"
                  value={tpSlValues.tp}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <label htmlFor="sl" className="block mb-2 text-sm font-medium text-zinc-400">Stop Loss (SL)</label>
                <input
                  type="text"
                  id="sl"
                  placeholder="0.00000"
                  className="bg-[#1E2226] border border-gray-600 text-zinc-400 text-sm rounded-lg w-full p-2.5 focus:outline-none"
                  value={tpSlValues.sl}
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-between mt-10 flex-col md:flex-row gap-2">
              <button onClick={()=>{onClose();setAnimation("")}} className="bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-lg p-2 px-5">
                Close
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg p-2 px-5 text-white">
                  Add strategy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default AITradingBot;
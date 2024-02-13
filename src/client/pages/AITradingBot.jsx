import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

//layout
import "../layouts/DropDown/DropDown.css"
import "../layouts/layoutsCss/PopUp.css"


import axios from 'axios'

function formatTimestamp(timestamp) {
  // Create a Date object from the timestamp
  let date = new Date(timestamp*1000);

  // Extract date components
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are 0-indexed
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format hours and minutes
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert hour '0' to '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Construct the formatted string
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm} (GMT+7)`;
}

const AITradingBot = () => {
  // Check Window Size for Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

// =========================================================== Tabs ===========================================================
  const [bots, setTableData] = useState([]);
  const [Defaultbots, setDefaultbot] = useState([])
  const [dropped, setDropped] = useState(false)
  const [botPick, setBotPick] = useState("All")
  const [tradeType, setTradeType] = useState("Buy");

  const [animation, setAnimation] = useState('slid-up')
  const [animationVisible, setAnimationVisible] = useState(true);

  
    // useEffect for fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/model');
        setTableData(response.data); 
        setDefaultbot(response.data);
      } catch (error) {
        console.error("Failed to fetch bots:", error);
      }
    };

    fetchData();
  }, []);


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

  useEffect(() => {
    if(botPick === "All") {
      setTableData(Defaultbots);
    }
    else {
      let fetchData = Defaultbots.filter(data => data.symbol === botPick) 
      setTableData(fetchData);
    }
  }, [botPick]);

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
        </div>
      </div>
      {bots.map((bot) => (
        <div key={bot.model_name} className={`bot-info bg-[#1E2226] text-white p-4 my-2 rounded-lg flex flex-col md:flex-row justify-between mx-5 text-xs ${animationVisible ? animation : ''}`}>
          <div className="mr-2">
            <h2 className={`text-sm font-bold ${bot.side === 'buy'? 'text-[#11C47E]' : 'text-[#F6465D]'}`}>{bot.model_name}</h2>
            <h2 className="text-sm text-base whitespace-nowrap">{bot.symbol} {bot.timeframe}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 lg:gap-12 text-zinc-400">
            <div className="flex flex-col">
              <div>
                <p>Version</p>
                <div className="text-white">{bot.version}</div>
              </div>
              <div>
                <p className="mt-3">Last update</p>
                <div className="text-white">{formatTimestamp(bot.timestamp)}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>AUC score test</p>
                <div className="text-white">{bot.auc_score_test}</div>
              </div>
              <div>
                <p className="mt-3">AUC score train</p>
                <div className="text-white">{bot.auc_score_train}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>F1 score test</p>
                <div className="text-white">{bot.f1_score_test}</div>
              </div>
              <div>
                <p className="mt-3">F1 score train</p>
                <div className="text-white">{bot.f1_score_train}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Accuracy test</p>
                <div className="text-white">{bot.f1_score_test}</div>
              </div>
              <div>
                <p className="mt-3">Accuracy train</p>
                <div className="text-white">{bot.f1_score_train}</div>
              </div>
            </div>
            <div className="flex flex-col mr-2">
              <div>
                <p>Precision test</p>
                <div className="text-white">{bot.precision_test}</div>
              </div>
              <div>
                <p className="mt-3">Precision train</p>
                <div className="text-white">{bot.precision_train}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AITradingBot;
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { fetchUsername } from "./fetch/fetchData";
import { url_serverJs } from "../../config";
import { Chart, registerables } from "chart.js/auto";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { differenceInDays } from "date-fns";

// Import Highcharts modules
import HC_exporting from "highcharts/modules/exporting";
import HC_exportData from "highcharts/modules/export-data";

// Initialize Highcharts modules
HC_exporting(Highcharts);
HC_exportData(Highcharts);

//layout
import "../layouts/DropDown/DropDown.css";
import "../layouts/layoutsCss/PopUp.css";

import "../pages/css/Profile.css";

import axios from "axios";

// Outside the component
function calculatePNL(backtestData) {
  const firstTimestamp = backtestData[0].time; // Get the timestamp of the first data point
  const lastTimestamp = backtestData[backtestData.length - 1].time; // Get the timestamp of the last data point
  const durationInDays = differenceInDays(
    new Date(lastTimestamp * 1000), // Convert seconds to milliseconds
    new Date(firstTimestamp * 1000) // Convert seconds to milliseconds
  ); // Calculate the difference in days
  return `${durationInDays}D`; // Format and return the duration
}

function formatTimestamp(timestamp) {
  // Create a Date object from the timestamp
  let date = new Date(timestamp * 1000);

  // Extract date components
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are 0-indexed
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format hours and minutes
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert hour '0' to '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the formatted string
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm} (GMT+7)`;
}

const AITradingBot = () => {
  // Check Window Size for Responsive
  let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });

  // =========================================================== Tabs ===========================================================
  const [bots, setTableData] = useState([]);
  const [Defaultbots, setDefaultbot] = useState([]);
  const [dropped, setDropped] = useState(false);
  const [botPick, setBotPick] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [animation, setAnimation] = useState("slid-up");
  const [animationVisible, setAnimationVisible] = useState(true);

  const [username, setUsername] = useState("");

  const [isDataFetched, setIsDataFetched] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // useEffect for fetching data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url_serverJs + "/api/model");
        setTableData(response.data);
        setDefaultbot(response.data);
        setUsername(await fetchUsername()); // Ensure fetchUsername is async or handled correctly
        setIsDataFetched(true); // Indicate that data fetching is complete
      } catch (error) {
        setLoading(false);
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
  }, [dropped]);

  useEffect(() => {
    if (isDataFetched) {
      setLoading(false);
      setAnimation("slid-up");
      setTimeout(() => {
        setAnimation("slid-up-active");
      }, 10);
      setTimeout(() => {
        setAnimationVisible(false);
      }, 800);
    }
  }, [isDataFetched, bots]);

  useEffect(() => {
    const filterBots = () => {
      let filteredBots = [...Defaultbots];

      if (botPick !== "All") {
        filteredBots = filteredBots.filter((bot) => bot.symbol === botPick);
      }

      if (searchTerm) {
        filteredBots = filteredBots.filter((bot) =>
          bot.model_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTableData(filteredBots);
    };

    filterBots();
  }, [botPick, searchTerm, Defaultbots]);

  return isLoading ? (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  ) : (
    <div className="page-container flex flex-col mt-7 ml-auto">
      <h1 className="title text-2xl text-white ml-5">
        Bot Trading Strategies {username}
      </h1>
      <div className={`flex justify-between mx-5`}>
        <div className="flex justify-end flex-1">
          <div className="dropdown w-24">
            <button
              className="dropdown-btn text-sm"
              aria-label="menu button"
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{botPick}</span>
              <span
                className={`arrow ${isDropdownOpen ? "arrow-rotate" : ""}`}
              ></span>
            </button>
            <ul
              className={`dropdown-content text-sm ${
                isDropdownOpen ? "menu-open" : ""
              }`}
              role="menu"
            >
              <li
                onClick={() => {
                  setBotPick("All");
                }}
              >
                <p>All</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("EURUSD");
                }}
              >
                <p>EURUSD</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("USDJPY");
                }}
              >
                <p>USDJPY</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("GBPUSD");
                }}
              >
                <p>GBPUSD</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("USDCHF");
                }}
              >
                <p>USDCHF</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("USDCAD");
                }}
              >
                <p>USDCAD</p>
              </li>
              <li
                onClick={() => {
                  setBotPick("AUDUSD");
                }}
              >
                <p>AUDUSD</p>
              </li>
            </ul>
          </div>
          <div className="flex justify-between ml-2">
            {/* Search input */}
            <div className="search-box rounded-lg">
              <input
                type="text"
                placeholder="Search bots by name..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input text-white text-sm w-full pl-3 pr-4 py-2 rounded-lg border border-[#2a2c2d] bg-[#2a2c2d]"
              />
            </div>
          </div>
        </div>
      </div>
      {bots.map((bot) => (
        <div
          key={bot.model_name}
          className={`bot-info bg-[#1E2226] text-white p-4 my-2 rounded-lg flex flex-col xl:flex-row justify-between mx-5 text-sm ${
            animationVisible ? animation : ""
          }`}
        >
          <div className="mr-2">
            <h2 className={`text-sm font-bold text-blue-500`}>
              {bot.model_name}
            </h2>
            <h2 className="text-sm text-base whitespace-nowrap">
              {bot.symbol} {bot.timeframe}
            </h2>
          </div>
          <div className="mx-2 flex flex-col text-zinc-400 text-sm items-center">
            <div className="">{calculatePNL(bot.backtest)} PNL</div>
            <div
              className={`text-2xl font-semibold ${
                bot.backtest[bot.backtest.length - 1].balance -
                  bot.backtest[0].balance >
                0
                  ? "text-[#0ECB81]"
                  : "text-[#F6465D]"
              }`}
            >
              {bot.backtest[bot.backtest.length - 1].balance -
                bot.backtest[0].balance >=
              0
                ? "+"
                : ""}
              {(
                bot.backtest[bot.backtest.length - 1].balance -
                bot.backtest[0].balance
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="mt-2 whitespace-nowrap">
              ROI{" "}
              <span
                className={`${
                  bot.backtest[bot.backtest.length - 1].balance -
                    bot.backtest[0].balance >
                  0
                    ? "text-[#0ECB81]"
                    : "text-[#F6465D]"
                }`}
              >
                {bot.backtest[bot.backtest.length - 1].balance -
                  bot.backtest[0].balance >=
                0
                  ? "+"
                  : ""}
                {(
                  ((bot.backtest[bot.backtest.length - 1].balance -
                    bot.backtest[0].balance) /
                    bot.backtest[0].balance) *
                  100
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                %
              </span>
            </div>
            <div className="mt-2">
              Lot <span className="text-white">0.1</span>
            </div>
          </div>
          <div className="flex justify-center chart-containe mx-3">
            {/* HighchartsReact component for rendering Highcharts */}
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: "spline", // Change the chart type as needed
                  backgroundColor: "transparent", // Set chart background color
                },
                title: {
                  text: "",
                },
                credits: {
                  enabled: false, // Hide the Highcharts watermark
                },
                exporting: {
                  enabled: false, // Disable exporting module
                },
                legend: {
                  enabled: false, // Hide the legend button
                },
                xAxis: {
                  categories: bot.backtest.map((entry) => entry.time),
                  title: {
                    text: "",
                  },
                  labels: {
                    enabled: false,
                  },
                  gridLineWidth: 0,
                  minorGridLineWidth: 0,
                  tickColor: "transparent",
                  minorTickLength: 0,
                  lineColor: "transparent",
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  labels: {
                    style: {
                      color: "#848E9C",
                    },
                    enabled: false,
                  },
                  gridLineWidth: 0,
                  minorGridLineWidth: 0,
                  tickColor: "transparent",
                  minorTickLength: 0,
                  lineColor: "transparent",
                },
                plotOptions: {
                  series: {
                    fillOpacity: 0.1, // Adjust the fill opacity as needed
                  },
                  spline: {
                    zones: [
                      {
                        value: bot.backtest[0].balance,
                        color: "rgba(246, 70, 93, 0.6)", // Red color for down
                      },
                      {
                        color: "rgba(14, 203, 129, 0.6)", // Green color for up
                      },
                    ],
                  },
                  area: {
                    fillOpacity: 0, // Set fillOpacity to 0 for the "Starting Balance" series
                  },
                },
                series: [
                  {
                    name: "Balance",
                    data: bot.backtest.map((entry) => entry.balance),
                    color: "rgba(14, 203, 129, 0.6)", // Default color
                    marker: {
                      enabled: false, // Hide the point circles
                    },
                    zIndex: 2, // Ensure this series is above the "Starting Balance" series
                  },
                  {
                    name: "Starting Balance",
                    type: "line",
                    data: Array(bot.backtest.length).fill(
                      bot.backtest[0].balance
                    ),
                    color: "#848E9C", // Color for the starting balance line
                    fillOpacity: 0.6, // Adjust fill opacity as needed
                    lineWidth: 2, // Adjust line width as needed
                    marker: {
                      enabled: false, // Hide the point circles
                    },
                    zIndex: 1, // Ensure this series is below the "Balance" series
                    dashStyle: "dot", // Set dashStyle to 'dot' for a dotted line
                  },
                ],
                responsive: {
                  rules: [
                    {
                      condition: {
                        maxWidth: 600,
                      },
                      chartOptions: {
                        chart: {
                          height: 150,
                          width: 300,
                        },
                      },
                    },
                    {
                      condition: {
                        minWidth: 601,
                        maxWidth: 1999,
                      },
                      chartOptions: {
                        chart: {
                          height: 150,
                          width: 450,
                        },
                      },
                    },
                  ],
                },
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 lg:gap-12 text-zinc-400">
            <div className="flex flex-col">
              <div>
                <p>Version</p>
                <div className="text-white">{bot.version}</div>
              </div>
              <div>
                <p className="mt-3">Last update</p>
                <div className="text-white">
                  {formatTimestamp(bot.timestamp)}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Win Rate</p>
                <div className="text-white">{bot.metric.winrate}%</div>
              </div>
              <div>
                <p className="mt-3">Risk and Reword Ratio</p>
                <div className="text-white">{bot.metric.rrr}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Win Positions</p>
                <div className="text-white">{bot.metric.win}</div>
              </div>
              <div>
                <p className="mt-3">Maximum DrawDown</p>
                <div className="text-white">{bot.metric.max_drawdown}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p>Loss Positions</p>
                <div className="text-white">{bot.metric.loss}</div>
              </div>
              <div>
                <p className="mt-3">Maximum DrawDown per</p>
                <div className="text-white">{bot.metric.max_drawdown_per}%</div>
              </div>
            </div>
            <div className="flex flex-col mr-2">
              <div>
                <p>Total Positions</p>
                <div className="text-white">
                  {bot.metric.win + bot.metric.loss}
                </div>
              </div>
              <div>
                <p className="mt-3">Precision test</p>
                <div className="text-white">{bot.precision_test}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AITradingBot;

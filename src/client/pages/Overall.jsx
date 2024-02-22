// React
import React from 'react';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// DropDown
import DropDown from '../layouts/DropDown/DropDown';

// DatePicker
import { DateRangePicker } from 'react-date-range';
import { startOfYear, set } from 'date-fns';
import moment from 'moment'; // for change the format of date
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2DateFill } from "react-icons/bs"; // calender icon

// Chart
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';

// Normal CSS
import './css/Overall.css'

// Axios
import axios from 'axios';

// Fetch Data
import { fetchUserId } from './fetch/fetchData';

const Overall = () => {
  
    // Check Window Size for Responsive
    let isTabletMid = useMediaQuery({ query: "(max-width: 960px)" });
    let isTabletMidChart  = useMediaQuery({ query: "(max-width: 1280px)" });
    let isTabletMidWR = useMediaQuery({ query: "(max-width: 1160px)" });

// =========================================================== Account Filter + DropDown ===========================================================
    // useState to set state of DropDown and Account Choosed
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

    const handleAccountSelection = (selectedAccount) => {
      setAccountPick(selectedAccount);
    };

// =========================================================== Date Filter ===========================================================
    // useState to set Start and End Date
    const [dateRange, setDateRange] = useState([
      {
        startDate: set(startOfYear(new Date()), { hours: 0, minutes: 0, seconds: 0 }),
        endDate: new Date(),
        key: 'selection'
      }
    ]);

    // State to manage calendar visibility
    const [isCalendarVisible, setCalendarVisible] = useState(false);

    // Variable to show Start Date and End Date in the  button
    const formattedStartDate = moment(dateRange[0].startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(dateRange[0].endDate).format("DD-MM-YYYY");

// ===================================================================================================================================

    // useState for keeping Order Data
    const [chartData, setChartData] = useState([]);
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

    // Update the Table when the date or account filter change
    useEffect(() => {
      // Update the Table when the date or account filter changes
      if (isOrderFetched) {
        if (accountPick === "All") {
          let fetchData = orders.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          fetchData = fetchData.map(data => ({ ...data, entrytime: new Date(data.entrytime) }));
          setChartData(fetchData);
        } else {
          // Handle filtering for specific account (demoOrderData is not used here, use orders instead)
          let mt5Username
          accounts.forEach((account) => {
            if(accountPick == account.name_account) {
              mt5Username = account.username_mt5
            }
          })

          let fetchAccountData = orders.filter(data => data.username_mt5 === mt5Username);
          let fetchData = fetchAccountData.filter(data => data.entrytime >= dateRange[0].startDate.getTime() && data.entrytime <= dateRange[0].endDate.getTime());
          setChartData(fetchData);
        }
      }
    }, [isOrderFetched, accountPick, dateRange, orders]);

//  ========================================================== Doughnut Chart ==========================================================
    // Create a reusable function to create doughnut charts
    const createDoughnutChart = (canvasId, data, title) => {
      const labels = data.map(item => item.label);
      const counts = data.map(item => item.count);

      // Define the colors for the charts
      const sideColors = ["#2C7AFE", "#5a5c5d"];  // Blue and Grey
      const buyColors = ["#07A66C", "#5a5c5d"];    // Green and Grey
      const sellColors = ["rgba(255, 77, 77, 0.8)", "#5a5c5d"];   // Red and Grey

      // Choose the colors based on the canvasId
      let backgroundColors;
      switch (canvasId) {
        case 'b/s':
          backgroundColors = sideColors;
          break;
        case 'buy':
          backgroundColors = buyColors;
          break;
        case 'sell':
          backgroundColors = sellColors;
          break;
        default:
          backgroundColors = ["#000000"];  // Default color (black)
      }

      const innerLabel = {
        id: 'innerLabel',
        afterDatasetDraw(chart, args, pluginOptions) {
          const { ctx } = chart;
          const meta = args.meta;
          const xCoor = meta.data[0].x;
          const yCoor = meta.data[0].y;
          const perc = chart.data.datasets[0].data[0] / meta.total * 100;
          const label = chart.data.labels[0];
          
          let lines
          // Splitting label and percentage into separate lines
          if (isNaN(perc)) {
            lines = ["No Data"];
          }
          else {
            lines = [label, perc.toFixed(2) + '%'];
          }

          // Calculate total height of lines
          const totalHeight = lines.length * 12;

          // Adjust starting Y position to center the text vertically
          let startY = yCoor - totalHeight / 2;

          // Draw each line
          lines.forEach(line => {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '80% sans-serif';
            ctx.fillText(line, xCoor, startY);
            ctx.restore();

            // Move Y position to the next line
            startY += 20; // You can adjust the line height as needed
          });
        },
      };

      return new Chart(
        document.getElementById(canvasId).getContext('2d'),
        {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: counts,
              backgroundColor: backgroundColors,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
              },
              title: {
                display: true,
                position: 'bottom',
                text: title,
                color: () => {
                  if(canvasId == 'b/s') {
                    return "#2C7AFE"
                  }
                  else if(canvasId == 'buy') {
                    return "#4CAF50"
                  }
                  else {
                    return "rgba(255, 77, 77, 0.8)"
                  }
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = labels[context.dataIndex];
                    const value = context.formattedValue;
                    const percentage = ((counts[context.dataIndex] / counts.reduce((a, b) => a + b, 0)) * 100).toFixed(2) + '%';
                    return `${label}: ${value} (${percentage})`;
                  },
                },
              },
            },
            elements: {
              arc: {
                borderWidth: 0,
              }
            }
          },
          // Center text configuration
          plugins: [innerLabel],
        }
      );
    };

// ==================================================== Overall Doughnut Chart ====================================================
    // useState for keep labels and number of buy and sell for making doughnut chart
    const [overallData, setOverallData] = useState([
      { label: "Buy", count: 0},
      { label: "Sell", count: 0}
    ])

    // to count number of buy and sell and update ot "overallData" when the chartData change
    useEffect(() => {
      let buyCount = 0
      let sellCount = 0

      chartData.forEach(entry => {
        if (entry.side === "buy") {
          buyCount += 1;
        } else if (entry.side === "sell") {
          sellCount += 1;
        }
      })

      setOverallData([
        { label: "Buy", count: buyCount },
        { label: "Sell", count: sellCount }
      ])
    },[chartData])

    // Use the createDoughnutChart function in useEffect hooks
    useEffect(() => {
      const overallDoughnutChart = createDoughnutChart('b/s', overallData, 'Side');
      return () => overallDoughnutChart.destroy();
    }, [overallData]);

// ==================================================== Buy Doughnut Chart ====================================================
    // useState for keep labels and number of win and loss of buy side for making doughnut chart

    const [buyData, setBuyData] = useState([
      { label: "Win", count: 0 },
      { label: "Loss", count: 0 }
    ])

    // to count number of win and loss of buy side and update ot "buyData" when the chartData change
    useEffect(() => {
      let buyWinCount = 0
      let buyLossCount = 0

      chartData.forEach(entry => {
        if (entry.profit >= 0 && entry.side === "buy") {
          buyWinCount += 1;
        } else if (entry.profit < 0 && entry.side === "buy") {
          buyLossCount += 1;
        }
      })

      setBuyData([
        { label: "Win", count: buyWinCount },
        { label: "Loss", count: buyLossCount }
      ])
    },[chartData])

    // Use the createDoughnutChart function in useEffect hooks
    useEffect(() => {
      const buyDoughnutChart = createDoughnutChart('buy', buyData, 'Buy');
      return () => buyDoughnutChart.destroy();
    }, [buyData]);

// ==================================================== Sell Doughnut Chart ====================================================
    // useState for keep labels and number of win and loss of sell side for making doughnut chart
    const [sellData, setSellData] = useState([
      { label: "Win", count: 0 },
      { label: "Loss", count: 0 }
    ])

    // to count number of win and loss of sell side and update ot "sellData" when the chartData change
    useEffect(() => {
      let sellWinCount = 0
      let sellLossCount = 0

      chartData.forEach(entry => {
        if (entry.profit >= 0 && entry.side === "sell") {
          sellWinCount += 1;
        } else if (entry.profit < 0 && entry.side === "sell") {
          sellLossCount += 1;
        }
      })

      setSellData([
        { label: "Win", count: sellWinCount },
        { label: "Loss", count: sellLossCount }
      ])
    },[chartData])

    // Use the createDoughnutChart function in useEffect hooks
    useEffect(() => {
      const sellDoughnutChart = createDoughnutChart('sell', sellData, 'Sell');
      return () => sellDoughnutChart.destroy();
    }, [sellData]);

//  ========================================================== Line Chart (Profit Growth) ==========================================================
    // useState to keep Profit Growth Data
    const [profitGrowthData, setProfitGrowthData] = useState([])

    // Update the Line Chart data when the date or account filter change
    useEffect(() => {
      // Example calculation, replace this with your actual logic
      const calculateLineChartData = () => {
        const dailyProfits = {};
    
        chartData.forEach(entry => {
          const dateKey = moment(entry.entryTime).format("YYYY-MM-DD");
    
          if (dailyProfits[dateKey] === undefined) {
            dailyProfits[dateKey] = entry.profit;
          } else {
            dailyProfits[dateKey] += entry.profit;
          }
        });
    
        const pgData = Object.keys(dailyProfits).map(date => ({
          x: date,
          y: dailyProfits[date],
        }));
    
        console.log
        return pgData;
      }

      setProfitGrowthData(calculateLineChartData());
    }, [chartData]);

    // Create a reusable function to create doughnut charts
    const createLineChart = (canvasId, data, title) => {

      let profit = profitGrowthData.map(yData => yData.y)
      let date = [];
  
      // Generate dates from startDate to endDate
      const currentDate = moment(dateRange[0].startDate);
      const endDate = moment(dateRange[0].endDate);

      while (currentDate <= endDate) {
        date.push(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, 'days');
      }
    
      return new Chart(
        document.getElementById(canvasId).getContext('2d'),
        {
          type: 'line',
          data: {
            labels: date,
            datasets: [{
              label: 'Profit Growth',
              data: profit,
              borderColor: '#2C7AFE', // Line color
              backgroundColor: '#2C7AFE', // Fill color
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                position: 'bottom',
                labels: {
                  color: 'white', // Set legend text color to white
                },
              },
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'DD-MM'
                  }
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: 'white', // Set x-axis title color to white
                },
                grid: {
                  display: false,
                  color: 'white', // Set x-axis grid lines color to white
                },
                ticks: {
                  color: 'white', // Set x-axis tick color to white
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Profit',
                  color: 'white', // Set y-axis title color to white
                },
                grid: {
                  color: '#5a5c5d', // Set y-axis grid lines color to white
                },
                ticks: {
                  color: 'white', // Set y-axis tick color to white
                },
              }
            }
          }
        }
      );
    };

    // Use the createLineChart function in useEffect hooks
    useEffect(() => {
      const PGLineChart = createLineChart('pg', profitGrowthData, 'Profit Growth');
      return () => PGLineChart.destroy();
    }, [profitGrowthData]);

//  ========================================================== Bar Chart (PNL) ==========================================================
    // Create a reusable function to create pnl bar chart
    const createPNLChart = (canvasId, data, title) => {

      let date = [];
  
      // Generate dates from startDate to endDate
      const currentDate = moment(dateRange[0].startDate);
      const endDate = moment(dateRange[0].endDate);

      while (currentDate <= endDate) {
        date.push(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, 'days');
      }

      // Calculate daily sum of profit
      const dailySumProfit = date.map(currentDate => {
        const entriesOnDate = data.filter(entry => moment(entry.entryTime).format("YYYY-MM-DD") === currentDate);
        const sumProfit = entriesOnDate.reduce((sum, entry) => sum + entry.profit, 0);
        return sumProfit;
      });

      // Determine background color based on dailySumProfit value
      const backgroundColors = dailySumProfit.map(profit => (profit < 0 ? 'rgba(255, 77, 77, 0.8)' : '#07A66C'));

      return new Chart(
        document.getElementById(canvasId).getContext('2d'),
        {
          type: 'bar', // Change the chart type to 'bar'
          data: {
            labels: date,
            datasets: [{
              label: 'PNL',
              data: dailySumProfit,
              backgroundColor: backgroundColors, // Bar color (you can choose a different color)
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'DD-MM'
                  }
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: 'white',
                },
                grid: {
                  display: false,
                  color: 'white',
                },
                ticks: {
                  color: 'white',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'PNL',
                  color: 'white',
                },
                grid: {
                  color: '#5a5c5d',
                },
                ticks: {
                  color: 'white',
                },
              }
            }
          }
        }
      );
    };

    // Use the createPNLChart function in useEffect hooks
    useEffect(() => {
      const pnlChart = createPNLChart('pnl', chartData, 'PNL');
      return () => pnlChart.destroy();
    }, [chartData]);

// =============================================================================================================================

  return (
    <div className="page-container flex flex-col mt-7 w-11/12">
      <h1 className="titlle text-2xl border-b-2 border-slate-500 w-full">Overall</h1>

      {/* Filter */}
      <div className="filter flex flex-auto flex-wrap mt-3 mr-auto gap-5 items-center justify-start">

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

        {/* Account Filter */}
        <div className="account-filter whitespace-pre flex flex-auto items-center w-[16em] z-60 relative">
          <p className="mr-2">Account :</p>
          <DropDown
            accountPick = {accountPick}
            onAccountSelect={handleAccountSelection}
          />
        </div>
        {/* Reset Button */}
        <div className="resetButton bg-[#3a3c3d] rounded-lg flex-shrink-0">
          <button className="py-3 px-5" onClick={() => {setAccountPick("All")}}>Reset</button>
        </div>
      </div>

      {/* Static Contanier */}
      <div className='statitic-container flex flex-col my-5 gap-5 w-full justify-end'>
        {/* W/L and Profit Growth */}
        <div className={isTabletMidChart ? 'winrate-pg flex flex-col items-center gap-5 w-full justify-end' : 'winrate-pg flex items-center gap-5 w-full'}>
          {/* W/L */}
          <div className={isTabletMidChart ? 'winrate-container flex flex-col bg-[#1E2226] w-full rounded-lg' : 'winrate-container flex flex-col bg-[#1E2226] w-6/12 rounded-lg'}>
            <span className={isTabletMidChart ? 'pl-10 pt-5 pb-5 text-2xl font-bold' : 'pl-10 pt-5 pb-2 text-2xl font-bold'}>Winrate</span>
            <div className={isTabletMidWR ? 'overall-container flex flex-col gap-10 px-10 pb-5 w-full justify-center' : 'overall-container flex gap-20 px-10 pb-5 w-full justify-center'}>
                <div className={isTabletMidChart ? isTabletMidWR ? 'b/s-container w-full h-[50vh]' : 'b/s-container w-4/12 h-[37vh]' : 'b/s-container w-3/12 h-[37vh]'}>
                  {/* Side Doughnut Chart */}
                  <canvas id='b/s' className='z-99'></canvas> 
                </div>
                <div className={isTabletMidChart ? isTabletMidWR ? 'buy-container w-full h-[50vh]' : 'buy-container w-4/12 h-[37vh]' : 'buy-container w-3/12 h-[37vh]'}>
                  {/* Buy Doughnut Chart */}
                  <canvas id='buy' className='z-99'></canvas> 
                </div>
                <div className={isTabletMidChart ? isTabletMidWR ? 'sell-container w-full h-[50vh]' : 'sell-container w-4/12 h-[37vh]' : 'sell-container w-3/12 h-[37vh]'}>
                  {/* Sell Doughnut Chart */}
                  <canvas id='sell' className='z-99'></canvas> 
                </div>
            </div>
          </div>

          {/* Profit Growth */}
          <div className={`pg-container bg-[#1E2226] p-6 ${isTabletMidChart ? 'w-full' : 'w-6/12'} rounded-lg`}>
            <span className='pl-5 text-2xl font-bold w-full'>Profit Growth</span>
            <div className='px-5 pt-5 w-full h-[37vh]'>
              <canvas id='pg'></canvas> 
            </div>
          </div>
        </div>
        
        {/* PNL */}
        <div className='pnl-container px-10 flex flex-col w-full bg-[#1E2226] rounded-lg'>
          <span className='pt-7 text-2xl font-bold w-full'>PNL</span>
          <div className='pnl-chart px-5 pt-5 w-full h-[50vh]'>
            <canvas id='pnl'></canvas>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Overall;

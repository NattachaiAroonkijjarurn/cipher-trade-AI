import React, {useState, useEffect, useRef} from 'react';
import "./css/Support.css";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

import atomate from '../img/atomate.png';
import speed from '../img/speed.jpg';
import speed2 from '../img/speed2.jpg';

import emotion from '../img/emotion.jpg';
import backtesting from '../img/backtesting.png';
import data_analysis from '../img/data-analysis.jpg'

import logo from '../img/logo.png'


function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}


const Support = () => {
  let navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [animate2, setAnimate2] = useState('slid-up');

  useEffect(() => {
    // Trigger the animation shortly after the component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClickModel = () => {
    navigate('/aiTradingBot')
  }

  const handleClickAccount = () => {
    navigate('/accounts')
  }

  const handleClickStatement = () => {
    navigate('/statements')
  }

  const handleClickOverall = () => {
    navigate('/overall')
  }

  const handleClickProfile = () => {
    navigate('/profile/#my-profile')
  }

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const isVisible1 = useOnScreen(ref1);
  const isVisible2 = useOnScreen(ref2);
  const isVisible3 = useOnScreen(ref3);
  const isVisible4 = useOnScreen(ref4);
  return (
    <div className={`page-container w-full ${animate ? 'slide-up-animation' : animate2}`}>
      <div className="flex flex-col gap-5">
        <div ref={ref1} className={`flex flex-col xl:flex-row justify-between gap-20 ${isVisible1 ? 'slide-up-animation' : ''}`}>
          <img className="h-screen w-6/12 object-cover" src={atomate} alt="" />
          <div className='flex w-full h-screen'>
            <div className="text-container text-blue-200 mx-10 my-10 py-5 flex flex-col justify-center">
              <div className='flex items-center text-[60px] font-semibold'>Automation</div>
              <div className='flex items-center font-medium text-xl items-end mt-20'> Explain how AI trading bots can automate trading strategies, allowing traders to execute trades 24/7 without manual intervention.</div>
            </div>
          </div>
        </div>
        <div ref={ref2} className={`flex flex-col xl:flex-row justify-between gap-20 ${isVisible2 ? 'slide-up-animation' : ''}`}>
          <div className='flex w-full h-screen'>
            <div className="text-container max-w-[500px] text-white mx-32 my-10 py-5 flex flex-col justify-center">
              <div className='flex items-center text-[60px] font-semibold'>Speed</div>
              <div className='flex items-center font-medium text-xl mt-10'> Explain how AI trading bots can automate trading strategies, allowing traders to execute trades 24/7 without manual intervention.</div>
            </div>
          </div>
          <div className="flex items-center">
            <img className="object-cover h-[300px] w-[500px] xl:h-[500px] xl:w-[800px]" src={speed} alt="" />
          </div>
          <div className="flex items-center">
            <img className="object-cover h-[300px] w-[500px] xl:h-[300px] xl:w-[800px]" src={speed2} alt="" />
          </div>
        </div>
        <div ref={ref3} className={`flex xl:h-screen xl:justify-center xl:items-center text-white text-medium ${isVisible3 ? 'slide-up-animation' : ''}`}>
          <div className="grid grid-rows gap-10 mx-20 xl:grid-cols-3">
            <div className="border border-1 border-zinc-800 rounded-lg p-10 flex flex-col items-center bg-blue-950 text-white">
              <div className="font-semibold text-center text-[30px] ">Data Analysis</div>
              <img src={emotion} alt="Data Analysis" className="h-72 w-full object-cover mt-8"/> {/* Increased margin-top here */}
              <p className="text-center mt-20 font-medium mb-5">Discuss how AI bots can analyze vast amounts of market data to identify trading opportunities based on historical trends and patterns.</p>
            </div>
            <div className="border border-1 border-zinc-800 rounded-lg p-10 flex flex-col items-center bg-sky-950 text-white">
              <div className="font-semibold text-center text-[30px]">Emotionless Trading</div>
              <img src={backtesting} alt="Emotionless Trading" className="h-72 w-full object-cover mt-8"/> {/* Increased margin-top here */}
              <p className="text-center mt-20 font-medium mb-5">Point out that bots operate based on algorithms and data, eliminating emotional biases that often lead to poor trading decisions.</p>
            </div>
            <div className="border border-1 border-zinc-800 rounded-lg p-10 flex flex-col items-center bg-cyan-950 text-white">
              <div className="font-semibold text-center text-[30px]">Backtesting</div>
              <img src={data_analysis} alt="Backtesting" className="h-72 w-full object-cover mt-8"/> {/* Increased margin-top here */}
              <p className="text-center mt-20 font-medium mb-5">Mention the capability of AI bots to backtest trading strategies using historical data, helping to refine and improve their effectiveness.</p>
            </div>
          </div>
        </div>
        <div ref={ref4} className={`grid bg-[#1E2226] h-full text-white text-medium ${isVisible4 ? 'slide-up-animation' : ''}`}>
          <div className='divide-y mx-32 divide-zinc-500'>
            <div className='flex flex-col xl:flex-row justify-between my-10'>
              <div className='flex flex-row items-center mb-3 justify-center'>
                <img className = "h-16 w-16"src={logo} alt="" />
                <div className='text-blue-500 font-semibold ml-5'>CipherTrade</div>
              </div>
              <div className='flex-1 grid grid-cols-2 xl:grid-cols-3 place-content-around'>
                <div className='flex justify-center'>
                  <div className='flex flex-col gap-2 items-start mb-2 xl:mb-0'>
                    <div className='mb-3'>PAGE</div>
                    <button className='hover:text-blue-500 text-zinc-400' onClick={handleClickModel}>Model</button>
                    <button className='hover:text-blue-500 text-zinc-400' onClick={handleClickAccount}>Account</button>
                    <button className='hover:text-blue-500 text-zinc-400' onClick={handleClickStatement}>Statement</button>
                    <button className='hover:text-blue-500 text-zinc-400' onClick={handleClickOverall}>Overall</button>
                    <button className='hover:text-blue-500 text-zinc-400' onClick={handleClickProfile}>Profile</button>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <div className='flex flex-col gap-2 item-start mb-2 xl:mb-0'>
                    <div className='mb-3'>SYMBOL</div>
                    <div className='text-zinc-400'>EURUSD</div>
                    <div className='text-zinc-400'>GBPUSD</div>
                    <div className='text-zinc-400'>AUDUSD</div>
                    <div className='text-zinc-400'>USDCHF</div>
                    <div className='text-zinc-400'>USDCAD</div>
                  </div>
                </div>
                <div className='flex justify-center ml-24 xl:ml-0'>
                  <div className='flex flex-col gap-2 items-start '>
                    <div className='mb-3'>CONTACT</div>
                    <div className='text-zinc-400 line-clamp-1'>s6404062630589@kmutnb.ac.th</div>
                    <div className='text-zinc-400 line-clamp-1'>s6404062610073@kmutnb.ac.th</div>
                    <div className='text-zinc-400 line-clamp-1'>cipher_trade@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
            <div >
              <div className='mt-2 text-sm font-medium text-blue-200 mb-2'>CipherTrade@2023-2024</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Support;

import React ,{ useState, useEffect} from "react";
import { FaCoins } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import "../layouts/layoutsCss/PopUp.css"

const Wallets = () => {
  const [wallets, setWallet] = useState([
    {
      id: 'Account 1',
      usernameMT5: '15965485',
      passwordMT5: '9876541236',
      server: 'FX-server-demo',
      leverage: 500,
      company: 'FXPRO Financial Services Ltd',
      balance: 52,
    },
  ]);
  // const [showConfirmation, setShowConfirmation] = useState(false)


  const [isModalOpen, setIsModalOpen] = useState(false)

  const [animation, setAnimation] = useState('slid-up')

  const [showEdit, setShowEdit] = useState(false);
  const [countWallet, setcountWallet] = useState([])

  useEffect(() => {
    setAnimation('slid-up');
    setTimeout(() => {
      setAnimation('slid-up-active')
    }, 10);
  }, []);


  const handleEditClick = (id) => {
    setShowEdit(true)
    const filteredWallet = wallets.filter(wallet => wallet.id === id);
    setcountWallet(filteredWallet[0])
  }


  const toggleModal = () => setIsModalOpen(!isModalOpen)

  return (
    <div className="page-container flex flex-col mt-7 ml-auto">
      <h1 className="title text-2xl text-white ml-5">
        Accounts
      </h1>
      <div className="flex justify-between mx-5">
        <div className="flex justify-end flex-1">
          <button 
            className="rounded-lg bg-blue-600 text-white whitespace-nowrap py-1 px-2 hover:bg-blue-500 active:bg-blue-700"
            onClick = {toggleModal}>
            + add wallet
          </button>
          <AddWalletModal isOpen={isModalOpen} onClose={toggleModal} setWallet={setWallet}
          />
        </div>
      </div>
      {wallets.map((wallet) => (
        <div key={wallet.id} className={`wallet-info bg-[#1E2226] text-white p-4 my-4 rounded-lg flex flex-col md:flex-row justify-between mx-5 text-sm ${animation}`}>
          <div className="md-4 xl:mb-0 xl:mr-80 mr-5">
            <h2 className="text-lg font-bold">{wallet.id}</h2>
            <h3 className="text-sm ml-5">Estiamted Balance</h3>
            <div className="flex items-center text-[#04A66D] ml-4">
              <h1 className="flex text-2xl ml-2"><FaCoins/></h1>
              <h1 className="flex text-2xl ml-2">{wallet.balance}</h1>
              <h1 className="flex text-2xl ml-2">USD</h1>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 xl:ml-32">
            <div className="flex flex-col">
              <div>
                <p className="text-zinc-400">MetaTrade Username</p>
                <div>{wallet.usernameMT5}</div>
              </div>
              <div className="mt-2">
                <p className="text-zinc-400">MetaTrade Server</p>
                <div>{wallet.server}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div>
                <p className="text-zinc-400">Leverage</p>
                <div>{wallet.leverage}</div>
              </div>
              <div className="mt-2">
                <p className="text-zinc-400">Company</p>
                <div>{wallet.company}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2">
              <button className="text-white border border-gray-500 rounded-lg px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900">
                refresh
              </button>
              <button 
                className="text-white border border-gray-500 rounded-lg px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900"
                onClick={() => handleEditClick(wallet.id)}
                >
                <FaEdit/>
              </button>
            </div>
          </div>
        </div>
      ))}
      <EditWallet 
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        wallet={countWallet}
        walletmain={wallets}
        setWallet={setWallet}
      />
    </div>
  );
};

const AddWalletModal  = ({isOpen, onClose, setWallet}) => {
  const [walletName, setWalletName] = useState('')
  const [usernameMT, setUsernameMT] = useState('')
  const [passwordMT, setPasswordMT] = useState('')
  const [serverMT, setserverMT] = useState('')
  const [company, setCompany] = useState('not know')
  const [leverage, setLeverage] = useState(500)
  const [ballance, setBalance] = useState('0')

  const [animation, setAnimation] = useState('')

  const handleSubmit = (e) =>{
    e.preventDefault();
    const newWallet = {
      id : walletName,
      usernameMT5 : usernameMT,
      passwordMT5 : passwordMT,
      server : serverMT,
      leverage : leverage,
      company : company,
      balance : ballance,
    }
    setWallet((prevBots) => [...prevBots, newWallet]);

    setWalletName('')
    setUsernameMT('')
    setPasswordMT('')
    setserverMT('')
    setCompany('not know')
    setLeverage(500)
    setBalance('0')
    onClose()
  }

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

  if (!isOpen) return null
  return (
    <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/6 xl:w-1/4 max-w-4xl ${animation}`} 
        style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 className="text-xl font-bold text-white">Add Wallet</h2>
        <div className="flex text-white flex-col">
          <form
            className="px-5 pt-4 pb-2 rounded-lg flex-1"
            onSubmit={handleSubmit}
          >
            <div className="font-medium text-zinc-400 text-sm">
              <label 
                htmlFor="walletname"
                className="block mb-2 "
                >
                Wallet name
              </label>
              <input 
                type="text" 
                id="walletname"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="wallet name"
                required
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
              <label 
                htmlFor="usernameMT"
                className="block mb-2 mt-2">
                  Username MT5
              </label>
              <input 
                type="text" 
                id="usernameMT"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="username mt5"
                required
                value={usernameMT}
                onChange={(e) => setUsernameMT(e.target.value)}
              />
              <label 
                htmlFor="PasswordMT"
                className="block mb-2 mt-2">
                  Password MT5
              </label>
              <input 
                type="password" 
                id="PasswordMT"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="password mt5"
                required
                value={passwordMT}
                onChange={(e) => setPasswordMT(e.target.value)}
              />
              <label 
                htmlFor="server"
                className="block mb-2 mt-2">
                  Server MT5
              </label>
              <input 
                type="text" 
                id="server"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="server mt5"
                required
                value={serverMT}
                onChange={(e) => setserverMT(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-10 flex-col md:flex-row gap-2">
              <button 
                className="bg-red-500 rounded-lg p-2 px-5 text-white hover:bg-red-400 active:bg-red-600" 
                onClick={onClose}>
                  Close
              </button>
              <button 
                type = "submit" 
                className="bg-blue-600 rounded-lg p-2 px-5 text-white hover:bg-blue-500 active:bg-blue-700" >
                  Done
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const EditWallet = ({isOpen, onClose, wallet, walletmain, setWallet}) => {
  const [animation, setAnimation] = useState('');

  const [walletName, setWalletName] = useState('')
  const [usernameMT, setUsernameMT] = useState('')
  const [passwordMT, setPasswordMT] = useState('')
  const [serverMT, setserverMT] = useState('')
  const [company, setCompany] = useState('not know')
  const [leverage, setLeverage] = useState('500')
  const [ballance, setBalance] = useState('0')

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedWallet = {
      id: walletName ? walletName : wallet.id,
      usernameMT5: usernameMT? usernameMT : wallet.usernameMT5,
      passwordMT5: passwordMT? passwordMT : wallet.passwordMT5,
      server: serverMT? serverMT : wallet.server,
      leverage: leverage, // Note: You might have mixed up company and leverage fields
      company: company, // Same here
      balance: ballance,
    };


    // Update the wallet list with the edited wallet
    const updatedWallets = walletmain.map(w => w.id === wallet.id ? updatedWallet : w);
    setWallet(updatedWallets); // Assuming setWallet is meant to update the wallets state in the parent component

    setUsernameMT('')
    setWalletName('')
    setPasswordMT('')
    setserverMT('')
    onClose(); // Close the modal after submission
  };

  const handleDelete = () => {
    const updatedBots = walletmain.filter(wa => wa.id !== wallet.id);
    setWallet(updatedBots);
  }

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



  if (!isOpen) return null

  return (
    <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/4 xl:w-1/4 text-white ${animation}`}
      style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h1>Edit wallet {wallet.id}</h1>
        <form 
          className="px-5 pt-4 pb-2 rounded-lg text-sm text-zinc-400"
          onSubmit={handleSubmit}
        >
          <div className="font-medium text-zinc-400 text-sm">
              <label 
                htmlFor="walletname"
                className="block mb-2 "
                >
                Wallet name
              </label>
              <input 
                type="text" 
                id="walletname"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder={wallet.id}
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
              />
              <label 
                htmlFor="usernameMT"
                className="block mb-2 mt-2">
                  Username MT5
              </label>
              <input 
                type="text" 
                id="usernameMT"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder={wallet.usernameMT5}
                value={usernameMT}
                onChange={(e) => setUsernameMT(e.target.value)}
              />
              <label 
                htmlFor="PasswordMT"
                className="block mb-2 mt-2">
                  Password MT5
              </label>
              <input 
                type="password" 
                id="PasswordMT"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder=". . . . . ."
                value={passwordMT}
                onChange={(e) => setPasswordMT(e.target.value)}
              />
              <label 
                htmlFor="server"
                className="block mb-2 mt-2">
                  Server MT5
              </label>
              <input 
                type="text" 
                id="server"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder={wallet.server}
                value={serverMT}
                onChange={(e) => setserverMT(e.target.value)}
              />
            </div>
            <div className="flex-col md:flex-row gap-2">
              <button onClick={handleDelete} className="bg-red-500 w-full text-white rounded-lg mt-5 py-2 hover:bg-red-400 active:bg-red-600">delete</button>
            </div>
            <div className="flex justify-between mt-2 flex-col xl:flex-row gap-2">
              <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 active:bg-gray-800">Cancel</button>
              <button type="submit" className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-400 active:bg-red-600">OK</button>
            </div>
        </form>
        
      </div>
    </div>
  );
};

export default Wallets;
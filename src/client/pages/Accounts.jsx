import React ,{ useState, useEffect} from "react";
import { FaCoins } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import "../pages/css/switch.css"

import { fetchUserId, checkAccountMT } from "./fetch/fetchData";
import axios from "axios";

function ToggleSwitch({ isOn, onToggle }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={onToggle}
      />
      <span className="switch" />
    </label>
  );
}

const Wallets = () => {
  const [wallets, setWallet] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [animation, setAnimation] = useState('slid-up')

  const [showEdit, setShowEdit] = useState(false);
  const [countWallet, setcountWallet] = useState([])

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [userId, setUserId] = useState('')

  const [isLoading , setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserId = await fetchUserId();
      setUserId(fetchedUserId);
      if (!fetchedUserId) return; 
      try {
        const response = await axios.get(`http://localhost:5000/api/account-mt`, {
          params: { user_id: fetchedUserId },
          withCredentials: true
        });

        const accounts = response.data
        const updateAccounts = []

        for (const account of accounts) {
          const accountDetails = await axios.post('http://localhost:8000/checkaccountmt', {
            username: account.username_mt5,
            password: account.password_mt5,
            server: account.server,
          });
          if (accountDetails.data.success) {
            updateAccounts.push({
              ...account,
              leverage: accountDetails.data.account_info.leverage,
              company: accountDetails.data.account_info.company,
              balance: accountDetails.data.account_info.balance,
            })
          } else {
            updateAccounts.push({
              ...account,
              leverage: '',
              company: '',
              balance: '',
            })
            console.log("Account check failed for account :", account.username_mt5);
          }
        }
        setIsDataFetched(true);
        setWallet(updateAccounts);
      } catch (error) {
        console.error("Failed to fetch account MT:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isDataFetched) {
      setIsLoading(false);
      setAnimation('slid-up');
      setTimeout(() => {
        setAnimation('slid-up-active')
      }, 10);
    }
  }, [isDataFetched]);

  const handleEditClick = (username_mt5) => {
    const selectedWallet = wallets.find(wallet => wallet.username_mt5 === username_mt5);
    setShowEdit(true);
    setcountWallet(selectedWallet);
  };

  const handleToggleBotStatus = async (user_id, usernameMt5, modelName, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const updatedWallets = wallets.map(wallet => {
      if (wallet.username_mt5 === usernameMt5) {
        const updatedWallet = { ...wallet };
        updatedWallet.bots = wallet.bots.map(bot => {
          if (bot.model_name === modelName) {
            return { ...bot, status: newStatus };
          }
          return bot;
        });
        return updatedWallet;
      }
      return wallet;
    });
    setWallet(updatedWallets);
    
    try {
      const temp = await axios.post('http://localhost:5000/api/change-status-bot', {
        user_id: user_id,
        username_mt5: usernameMt5,
        model_name: modelName,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to change bot status:", error);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  return (
    isLoading
      ? <div className="loading-container">
            <div className="loading"></div>
          </div>
      :
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
            <AddWalletModal isOpen={isModalOpen} onClose={toggleModal} setWallet={setWallet} user_id={userId}
            />
          </div>
        </div>
        {wallets.map((wallet, index) => (
          <div key={wallet.username_mt5 || index}>
            <div className={`wallet-info bg-[#1E2226] text-white p-4 my-4 rounded-lg flex flex-col md:flex-row justify-between mx-5 text-sm ${animation}`}>
              <div className="md-4 xl:mb-0 xl:mr-80 mr-5">
                <h2 className="text-lg font-bold">{wallet.name_account}</h2>
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
                    <div>{wallet.username_mt5}</div>
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
                    onClick={() => handleEditClick(wallet.username_mt5)}
                    >
                    <FaEdit/>
                  </button>
                </div>
              </div>
            </div>
            {wallet.bots.map((bot, botindex) => (
              <div key={bot.model_name || botindex} className={`bot-info bg-[#1E2228] text-white p-4 my-2 rounded-lg flex flex-col md:flex-row justify-between mx-5 text-sm ${animation}`}>
                <div className="md-4 mr-5">
                  <h2 className="text-sm font-bold text-blue-500">{bot.model_name}</h2>
                </div>
                <div className="flex flex-col">
                  <div>
                    <p className="text-zinc-400">Timeframe</p>
                    <div>{bot.timeframe}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>
                    <p className="text-zinc-400">Lot size</p>
                    <div>{bot.lotsize}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>
                    <p className="text-zinc-400">Status</p>
                    <div className={bot.status === 'active' ? 'text-green-500' : 'text-red-500'}>{bot.status}</div>
                  </div>
                </div>
                <ToggleSwitch
                  isOn={bot.status === 'active'}
                  onToggle={() => handleToggleBotStatus(wallet.user_id, wallet.username_mt5, bot.model_name, bot.status)}
                />
              </div>
            ))}
          </div>
        ))}
        {showEdit && 
          <EditWallet
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            wallet={countWallet}
            setWallet={setWallet}
            user_id={userId}
            wallets={wallets}
          />
        }
      </div>
  );
};

const AddWalletModal  = ({isOpen, onClose, setWallet, user_id}) => {
  const [walletName, setWalletName] = useState('')
  const [usernameMT, setUsernameMT] = useState('')
  const [passwordMT, setPasswordMT] = useState('')
  const [serverMT, setserverMT] = useState('')

  const [animation, setAnimation] = useState('')

  const handleSubmit = async (e) =>{
    e.preventDefault();

    const Account = await checkAccountMT(usernameMT, passwordMT, serverMT);
    if (Account) {
      const newWallet = {
        id : walletName,
        username_mt5 : usernameMT,
        password_mt5 : passwordMT,
        server : serverMT,
        leverage : Account.account_info.leverage,
        company : Account.account_info.company,
        balance : Account.account_info.balance,
      }

      const response = await axios.post(`http://localhost:5000/api/send-account-mt`, {
        name_account: walletName,
        username_mt5: usernameMT,
        password_mt5: passwordMT,
        server: serverMT,
        user_id: user_id,
        bots: []
      });

      setWallet((prevBots) => [...prevBots, newWallet]);
  
      setWalletName('')
      setUsernameMT('')
      setPasswordMT('')
      setserverMT('')
      onClose()
    } else {
      console.log("can't add your account mt");
    }
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

const EditWallet = ({ isOpen, onClose, wallet, user_id, setWallet, wallets}) => {
  const [name_account, setNameAccount] = useState(wallet.name_account)
  const [usernameMT, setUsernameMT] = useState(wallet.username_mt5);
  const [passwordMT, setPasswordMT] = useState('');
  const [serverMT, setServerMT] = useState(wallet.server);

  const [animation, setAnimation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (wallet) {
      setUsernameMT(wallet.username_mt5);
      setServerMT(wallet.server);
    }
  }, [wallet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("") ;
    setLoading(true);

    const updatedAccount = {
      user_id : user_id,
      name_account: name_account || wallet.name_account,
      old_username_mt5: wallet.username_mt5,
      username_mt5: usernameMT || wallet.username_mt5,
      password_mt5: passwordMT || wallet.password_mt5,
      server: serverMT || wallet.server,
    };

    try {
      const accountDetails = await axios.post('http://localhost:8000/checkaccountmt', {
        username: updatedAccount.username_mt5,
        password: updatedAccount.password_mt5,
        server: updatedAccount.server,
      });
      console.log("HI")
      if (accountDetails.data.success) {
        const updatedWallets = wallets.map(wallet => {
          if (wallet.username_mt5 === updatedAccount.username_mt5) {
            return { ...wallet, ...updatedAccount };
          }
          return wallet;
        });
        setWallet(updatedWallets);
    
        try {
          const response = await axios.post('http://localhost:5000/api/edit-account-mt', updatedAccount);
          console.log('Edit successful:', response.data);
          setLoading(false);
          onClose();
        } catch (error) {
          console.error("Failed to edit account:", error);
        }
      } else {
        setLoading(false);
        setErrorMessage("Failed to verify account. Please check the details and try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error checking account details:", error);
      setErrorMessage("An error occurred while verifying the account. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/delete-account-mt', {
        username_mt5: wallet.username_mt5,
        user_id : user_id
      });
      console.log('Delete successful:', response.data);

      // Remove the deleted account from the parent component's state
      const updatedWallets = wallets.filter(w => w.username_mt5 !== wallet.username_mt5);
      setWallet(updatedWallets);
      setLoading(false)
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      setLoading(false)
      console.error("Failed to delete account:", error);
    }
  };

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

  // Add form inputs for usernameMT, passwordMT, and serverMT
  // Use the handleSubmit method on form submission

  if (!isOpen) return null;

  return (
    <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/4 xl:w-1/4 text-white ${animation}`}
      style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {loading ? (
          <>
            <div className="loading-container h-20">
              <div className="loading"></div>
            </div>
            <p className="flex justify-center">Just a moment please...</p>
          </>
        ) : (
          <>
            <h1>Edit wallet {wallet.username_mt5}</h1>
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
                    placeholder={wallet.username_mt5}
                    value={name_account}
                    onChange={(e) => setNameAccount(e.target.value)}
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
                    placeholder={wallet.username_mt5}
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
                    onChange={(e) => setServerMT(e.target.value)}
                  />
                </div>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                <div className="flex-col md:flex-row gap-2">
                <button type = "button" onClick={handleDelete} className="bg-red-500 w-full text-white rounded-lg mt-5 py-2 hover:bg-red-400 active:bg-red-600">Delete</button>
                </div>
                <div className="flex justify-between mt-2 flex-col xl:flex-row gap-2">
                  <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 active:bg-gray-800">Cancel</button>
                  <button type="submit" className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-400 active:bg-red-600">OK</button>
                </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
};

export default Wallets;
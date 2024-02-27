import React ,{ useState, useEffect} from "react";
import { FaCoins } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { FaTrashCan } from "react-icons/fa6";

import { url_serverJs, url_serverPy } from "../../config"

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
  const [showAddBot, setShowAddBot] = useState(false)
  const [showDeleteBot, setShowDeleteBot] = useState(false)
  const [countWallet, setcountWallet] = useState([])
  const [countModelName, setcountModelName] = useState('')

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [userId, setUserId] = useState('')

  const [isLoading , setIsLoading] = useState(true)

  const [loadingRefreshStates, setLoadingRefreshStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserId = await fetchUserId();
      setUserId(fetchedUserId);
      if (!fetchedUserId) return; 
      try {
        const response = await axios.get(url_serverJs + '/api/account-mt', {
          params: { user_id: fetchedUserId },
          withCredentials: true
        });
        
        const accounts = response.data
        const initialLoadingStates = accounts.reduce((acc, wallet) => {
          acc[wallet.username_mt5] = false; // Initialize loading state as false for each wallet
          return acc;
        }, {});
        console.log(initialLoadingStates)
        
        // Set the initial loading states
        setLoadingRefreshStates(initialLoadingStates);
        
        setIsDataFetched(true);
        setWallet(accounts);
      } catch (error) {
        setIsLoading(false)
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

  const handleAddBotClick = (username_mt5) => {
    const selectedWallet = wallets.find(wallet => wallet.username_mt5 === username_mt5);
    setShowAddBot(true)
    setcountWallet(selectedWallet);
  };

  const handleDeleteBotClick = (username_mt5, model_name) => {
    const selectedWallet = wallets.find(wallet => wallet.username_mt5 === username_mt5);
    setShowDeleteBot(true)
    setcountWallet(selectedWallet);
    setcountModelName(model_name)
  };

  const handleClickRefresh = async (username_mt5) => {
    const updateAccounts = []
    setLoadingRefreshStates(prev => ({ ...prev, [username_mt5]: true }));
    try {
      const selectedWallet = wallets.find(wallet => wallet.username_mt5 === username_mt5);
      console.log(username_mt5)
      const accountDetails = await axios.post(url_serverPy + '/checkaccountmt', {
        username: selectedWallet.username_mt5,
        password: selectedWallet.password_mt5,
        server: selectedWallet.server,
      });
      for (const account of wallets) {
        if (accountDetails.data.success && account.username_mt5 === username_mt5) {
          await axios.post(url_serverJs +'/api/update-detail-account-mt', {
            username_mt5 : username_mt5,
            leverage : accountDetails.data.account_info.leverage,
            company: accountDetails.data.account_info.company,
            balance: accountDetails.data.account_info.balance,
          }, {withCredentials: true})
          updateAccounts.push({
            ...account,
            leverage: accountDetails.data.account_info.leverage,
            company: accountDetails.data.account_info.company,
            balance: accountDetails.data.account_info.balance,
          })
        } else {
          updateAccounts.push({
            ...account,
          })
        }
      }
      setLoadingRefreshStates(prev => ({ ...prev, [username_mt5]: false }));
      setWallet(updateAccounts);
    } catch (error) {
      setLoadingRefreshStates(prev => ({ ...prev, [username_mt5]: false }));
      console.log("update detail account mt error", error.response.data)
      console.log("Account check failed for account :", username_mt5);
    }
  }

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
      const temp = await axios.post(url_serverJs + '/api/change-status-bot', {
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }
  
  // If not loading and wallets array is empty, show the empty message
  if (!isLoading && wallets.length === 0) {
    return (
      <div className="page-container flex flex-col mt-7 ml-auto">
        <h1 className="title text-2xl text-white ml-5">
          Accounts
        </h1>
        <div className="flex justify-between mx-5">
          <div className="flex justify-end flex-1">
            <button 
              className="rounded-lg bg-blue-600 text-white whitespace-nowrap py-1 px-2 hover:bg-blue-500 active:bg-blue-700"
              onClick={toggleModal}>
              + add wallet
            </button>
            <AddWalletModal isOpen={isModalOpen} onClose={toggleModal} setWallet={setWallet} user_id={userId}
            />
          </div>
        </div>
        <div className="text-center text-white mt-10">
          Your account MT is empty.
        </div>
      </div>
    );
  }

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
                  {loadingRefreshStates[wallet.username_mt5] ?
                    <div className="ml-2 loading-balance"></div>
                    : 
                    <h1 className="flex text-2xl ml-2">{wallet.balance}</h1>} 
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
                  <button 
                    className="text-white border border-gray-500 rounded-lg px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900"
                    onClick={() => handleClickRefresh(wallet.username_mt5)}>
                    {loadingRefreshStates[wallet.username_mt5] ? (
                      <div>Loading...</div>
                    ) : (
                      "refresh"
                    )}
                  </button>
                  <button 
                    className="text-white border border-gray-500 rounded-lg px-3 py-1 hover:bg-zinc-800 active:bg-zinc-900"
                    onClick={() => handleEditClick(wallet.username_mt5)}
                    >
                    <FaEdit/>
                  </button>
                </div>
                <div className="flex xl:justify-end">
                  <button 
                    className="text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-800 px-5 py-1 active:bg-blue-900 flex items-center" 
                    onClick={() => handleAddBotClick(wallet.username_mt5)}
                    >
                    add bot <CgAddR className="inline-block ml-1"/>
                  </button>
                </div>
              </div>
            </div>
            {wallet.bots?.map((bot, botindex) => (
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
                <div className="flex flex-row">
                  <button
                    className="text-red-500 flex justify-end mr-4 mt-1"
                    onClick={() => handleDeleteBotClick(wallet.username_mt5, bot.model_name)}
                    >
                    <FaTrashCan/>
                  </button>
                  <ToggleSwitch
                    isOn={bot.status === 'active'}
                    onToggle={() => handleToggleBotStatus(wallet.user_id, wallet.username_mt5, bot.model_name, bot.status)}
                  />
                </div>
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
        {showAddBot && 
          <AddBotsModal
            isOpen={showAddBot}
            onClose={() => setShowAddBot(false)}
            wallet={countWallet}
            setWallet={setWallet}
            user_id={userId}
            wallets={wallets}
          />
        }
        {showDeleteBot &&
          <DeleteBotModal
            isOpen={showDeleteBot}
            onClose={() => setShowDeleteBot(false)}
            user_id={userId}
            model_name={countModelName}
            username_mt5={countWallet.username_mt5}
            wallets={wallets}
            setWallet={setWallet}  
          />
        }
      </div>
  );
};

const DeleteBotModal = ({isOpen, onClose, user_id, username_mt5 ,model_name, wallets, setWallet}) => {
  const [animation, setAnimation] = useState('modal-enter');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const temp = await axios.post(url_serverJs + '/api/delete-bot-account-mt', {
        user_id: user_id,
        username_mt5: username_mt5,
        model_name: model_name,
      });
      
      const updatedWallets = wallets.map((wallet) => {
        if (wallet.username_mt5 === username_mt5) {
          return {
            ...wallet,
            bots: wallet.bots.filter((bot) => bot.model_name !== model_name),
          };
        }
        return wallet;
      });
      setWallet(updatedWallets);
      onClose()
    } catch (error) {
      console.error("Failed to delete bot:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred while deleting the bot.");
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
        <h2 className="text-lg text-white text-center mb-10">
          Are you sure you want to delete bot <span className="text-blue-500">{model_name}</span> ?
        </h2>
        {errorMessage && <div className="text-red-500 text-sm mt-2 text-center" >{errorMessage}</div>}
        <div className="flex justify-between flex-col md:flex-row gap-2">
          <button 
            className="bg-red-500 rounded-lg p-2 px-5 text-white hover:bg-red-400 active:bg-red-600" 
            onClick={onClose}>
              Close
          </button>
          <button 
            type = "submit" 
            onClick={handleSubmit}
            className="bg-blue-600 rounded-lg p-2 px-5 text-white hover:bg-blue-500 active:bg-blue-700" >
              Ok
          </button>
        </div>
      </div>
    </div>
  )
}

const AddWalletModal  = ({isOpen, onClose, setWallet, user_id}) => {
  const [accountName, setAccountName] = useState('')
  const [usernameMT, setUsernameMT] = useState('')
  const [passwordMT, setPasswordMT] = useState('')
  const [serverMT, setserverMT] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [animation, setAnimation] = useState('modal-enter')

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setIsLoading(true)

    const accountDetails = await axios.post(url_serverPy + '/checkaccountmt', {
      username: usernameMT,
      password: passwordMT,
      server: serverMT,
    });

    if (accountDetails.data.success) {
      const newAccountMT = {
        user_id : user_id,
        name_account : accountName,
        username_mt5 : usernameMT,
        password_mt5 : passwordMT,
        server : serverMT,
        leverage : accountDetails.data.account_info.leverage,
        company : accountDetails.data.account_info.company,
        balance : accountDetails.data.account_info.balance,
        bot : []
      }

      try {
        const response = await axios.post(url_serverJs + "/api/send-account-mt", 
          newAccountMT
        );

        setWallet((prevBots) => [...prevBots, newAccountMT]);
        
        setIsLoading(false)
        setAccountName('')
        setUsernameMT('')
        setPasswordMT('')
        setserverMT('')
        onClose()
      } catch (error) {
        setIsLoading(false)
        const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
        setErrorMessage(errorMsg);
      }
    } else {
      setIsLoading(false)
      console.log("can't add your account mt");
      setErrorMessage(accountDetails.data.message);
    }
  }

  const handleClose = () => {
    setAccountName('')
    setUsernameMT('')
    setPasswordMT('')
    setserverMT('')
    setAnimation('')
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

  if (isLoading) {
    return (
      <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
        <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/4 xl:w-1/4 text-white ${animation}`}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div className="loading-container h-20">
            <div className="loading"></div>
          </div>
          <p className="flex justify-center">Just a moment please...</p>
        </div>
      </div>
    )
  }

  if (!isOpen) return null
  return (
    <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/6 xl:w-1/4 max-w-4xl ${animation}`} 
        style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h1 className="text-xl text-center mt-2">Add account mt5</h1>
        <div className="flex text-white flex-col">
          <form
            className="px-5 pt-4 pb-2 rounded-lg flex-1"
            onSubmit={handleSubmit}
          >
            <div className="font-medium text-zinc-400 text-sm">
              <label 
                htmlFor="accountName"
                className="block mb-2 "
                >
                Account name
              </label>
              <input 
                type="text" 
                id="accountName"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="wallet name"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
              <label 
                htmlFor="usernameMT"
                className="block mb-2 mt-2">
                  Username MT5
              </label>
              <input 
                type="text" 
                id="usernameMT"
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
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
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
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
                className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
                placeholder="server mt5"
                required
                value={serverMT}
                onChange={(e) => setserverMT(e.target.value)}
              />
            </div>
            {errorMessage && <div className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>}
            <div className="flex justify-between mt-10 flex-col md:flex-row gap-2">
              <button 
                className="bg-red-500 rounded-lg p-2 px-5 text-white hover:bg-red-400 active:bg-red-600" 
                onClick={handleClose}>
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

  const [animation, setAnimation] = useState('modal-enter');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

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
      const accountDetails = await axios.post(url_serverPy + '/checkaccountmt', {
        username: updatedAccount.username_mt5,
        password: updatedAccount.password_mt5,
        server: updatedAccount.server,
      });
      if (accountDetails.data.success) {
        try {
          const response = await axios.post(url_serverJs + '/api/edit-account-mt', updatedAccount);
          const updatedWallets = wallets.map(wallet => {
            if (wallet.username_mt5 === updatedAccount.username_mt5) {
              return { ...wallet, ...updatedAccount };
            }
            return wallet;
          });
          setWallet(updatedWallets);
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
    setShowConfirmDelete(false)
    try {
      setLoading(true);
      const response = await axios.post(url_serverJs + '/api/delete-account-mt', {
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

  if (!isOpen) return null;

  if (showConfirmDelete) {
    return (
      <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
        <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/6 xl:w-1/4 max-w-4xl ${animation}`} 
          style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h2 className="text-lg text-white text-center mb-10">
            Are you sure you want to delete account <span className="text-blue-500">{wallet.name_account}</span> ?
          </h2>
          {errorMessage && <div className="text-red-500 text-sm mt-2 text-center" >{errorMessage}</div>}
          <div className="flex justify-between flex-col md:flex-row gap-2">
            <button 
              className="bg-red-500 rounded-lg p-2 px-5 text-white hover:bg-red-400 active:bg-red-600" 
              onClick={() => setShowConfirmDelete(false)}>
                Close
            </button>
            <button 
              type = "submit" 
              onClick={handleDelete}
              className="bg-blue-600 rounded-lg p-2 px-7 text-white hover:bg-blue-500 active:bg-blue-700" >
                Ok
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${animation === "modal-exit-active" ? "modal-background-exit" : "modal-background-enter-active"}`}>
      <div className={`bg-[#1E2226] p-4 rounded-lg shadow-lg space-y-3 w-2/4 xl:w-1/4 text-white ${animation}`}
      style={{
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
          <div className="loading-container h-20">
              <div className="loading"></div>
          </div>
          <p className="flex justify-center">Just a moment please...</p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-xl text-center mt-2">Edit Account MT <span className="text-blue-500">{wallet.name_account}</span></h1>
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
                    className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
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
                    className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
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
                    className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
                    placeholder={wallet.server}
                    value={serverMT}
                    onChange={(e) => setServerMT(e.target.value)}
                  />
                </div>
                {errorMessage && <div className="text-red-500 text-sm mt-2 text-center" >{errorMessage}</div>}
                <div className="flex-col md:flex-row gap-2">
                <button type = "button" onClick={() => setShowConfirmDelete(true)} className="bg-red-500 w-full text-white rounded-lg mt-5 py-2 hover:bg-red-400 active:bg-red-600">Delete</button>
                </div>
                <div className="flex justify-between mt-2 flex-col xl:flex-row gap-2">
                  <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 active:bg-gray-800">Cancel</button>
                  <button type="submit" className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-red-400 active:bg-red-600">OK</button>
                </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
};

const AddBotsModal = ({ isOpen, onClose, wallet, user_id, setWallet, wallets}) => {
  const [model_name, setModelName] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [lotsize, setLotSize] = useState('');
  const [status, setStatus] = useState('inactive')
  const [tpSlValues, setTpSlValues] = useState({tp:'', sl:''})

  const [animation, setAnimation] = useState("modal-enter");

  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBot = {
      model_name: model_name,
      timeframe: timeframe,
      lotsize: lotsize,
      status: status,
    };
  
    try {
      const responseInsertBot = await axios.post(url_serverJs + '/api/insert-bot-account-mt', {
        user_id: user_id,
        username_mt5: wallet.username_mt5, // Make sure this matches the expected field name in your server-side code
        bot: newBot
      });
  
      // Success case
      setErrorMessage("");
      console.log("Bot added successfully:", responseInsertBot.data.message);
  
      const updatedWallets = wallets.map((walletItem) => {
        if (walletItem.username_mt5 === wallet.username_mt5) {
          return {
            ...walletItem,
            bots: [...walletItem.bots, newBot] 
          };
        }
        return walletItem;
      });
      setWallet(updatedWallets);
      
      // Reset form fields and close modal
      setModelName('');
      setTimeframe('');
      setLotSize('');
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error
        const status = error.response ? error.response.status : null;
        const message = error.response ? error.response.data.message : error.message;
        console.error(`Error adding bot - Status: ${status}, Message: ${message}`);
        setErrorMessage(`${message}`);
      } else {
        // Non-Axios error
        console.error("An unexpected error occurred:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleClose = () => {
    setModelName('');
    setTimeframe('');
    setLotSize('');
    setAnimation("")
    onClose();
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
        <h1 className="text-xl text-center mt-2">Add bot Strategy</h1>
        <div className="flex text-white flex-col">
          <form 
            className="px-5 pt-4 pb-2 rounded-lg"
            onSubmit={handleSubmit}
          >
            <div>
              <h1 className="text-lg">General setting</h1>
            </div>
            {/* Timeframe Select Dropdown */}
            <div className="mb-4">
              <label 
                htmlFor="model_name"
                className="block mb-2 text-sm font-medium text-zinc-400">Symbol
                </label>
                <select 
                  id="model_name"
                  className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
                  required
                  value={model_name}
                  onChange={(e) => setModelName(e.target.value)}
                >
                  <option value="" className="text-blue-200" disabled selected>Select Symbol</option>
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
                  className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5"
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
                    type="number"
                    id="lot size"
                    className="bg-[#1E2226] border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg w-full p-2.5" 
                    placeholder="lot size"
                    value={lotsize}
                    onChange={(e) => setLotSize(e.target.value)}
                    required
                    />
              </div>
              {/* TP and SL Display */}
              <div className="flex-1">
                <label htmlFor="tp" className="block mb-2 text-sm font-medium text-zinc-400">Take Profit (TP)</label>
                <input
                  type="number"
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
                  type="number"
                  id="sl"
                  placeholder="0.00000"
                  className="bg-[#1E2226] border border-gray-600 text-zinc-400 text-sm rounded-lg w-full p-2.5 focus:outline-none"
                  value={tpSlValues.sl}
                  readOnly
                />
              </div>
            </div>
            {errorMessage && <div className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>}
            <div className="flex justify-between mt-10 flex-col md:flex-row gap-2">
              <button
                type="button" 
                onClick={handleClose} className="bg-red-500 hover:bg-red-400 active:bg-red-600 rounded-lg p-2 px-5">
                close
              </button>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg p-2 px-5 text-white">
                  Add bot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Wallets;
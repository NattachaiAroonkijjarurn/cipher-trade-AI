// React
import { useEffect, useState } from "react"

// Normal CSS
import "./DropDown.css"

// Axios
import axios from "axios"

// Fetch Data
import { fetchUserId } from '../../pages/fetch/fetchData';


const DropDown = ({ accountPick, onAccountSelect }) => {

    const [accounts, setAccounts] = useState([{}])
    const [userId, setUserId] = useState('')

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

    // useState to set state of DropDown and Account Choosed
    const [dropped, setDropped] = useState(false)

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

    return(
        <div className="dropdown">
            <button className="dropdown-btn" aria-label="menu button" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-menu" onClick={() => {setDropped(!dropped)}}>
                <span>{accountPick}</span>
                <span className="arrow"></span>
            </button>
            <ul className="dropdown-content" role="menu" id="dropdown-menu">
                {accounts.map((account) => (
                    <li key={account.username_mt5} onClick={() => {onAccountSelect(account.name_account)}}>
                        <p>{account.name_account}</p>
                    </li>
                ))}
            </ul>
        </div>
    );


}

export default DropDown
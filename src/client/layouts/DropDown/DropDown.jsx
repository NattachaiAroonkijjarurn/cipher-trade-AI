// React
import { useEffect, useState } from "react"

// Normal CSS
import "./DropDown.css"


const DropDown = ({ botPick, onBotSelect }) => {

    // useState to set state of DropDown and Bot Choosed
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
                <span>{botPick}</span>
                <span className="arrow"></span>
            </button>
            <ul className="dropdown-content" role="menu" id="dropdown-menu">
            <li onClick={() => { onBotSelect("Bot1"); }}><p>Bot1</p></li>
            <li onClick={() => { onBotSelect("Bot2"); }}><p>Bot2</p></li>
            <li onClick={() => { onBotSelect("Bot3"); }}><p>Bot3</p></li>
            <li onClick={() => { onBotSelect("Bot4"); }}><p>Bot4</p></li>
            </ul>
        </div>
    );


}

export default DropDown
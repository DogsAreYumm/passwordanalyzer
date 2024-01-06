import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css"
import wordslist from "./toponehundredthousandwords.txt";

let PasswordAnalyzer = () => {
    let [password, changepassword] = useState("")
    let [ischecked, changechecked] = useState(false)
    let [hasupper, changehasupper] = useState(false)
    let [haslower, changehaslower] = useState(false)
    let [hasnumbers, changehasnumbers] = useState(false)
    let [hassymbols, changehassymbols] = useState(false)
    let [secstocrack, changesecstocrack] = useState("0 seconds")
    let [passentropy, changepassentropy] = useState(0)
    let [weightedamt, changeweightedamt] = useState("0%")
    let blacklist = [];
    let [amountofblacklistedwords, changeamountofblacklistedwords] = useState(0)
    fetch(wordslist
    )
    .then((response) => response.text())
    .then((text) => {
    blacklist = text.split("\n").filter(word => word.length > 3).map(word => word.toLowerCase());
    });
    const hashespersecond = 632_000_000_000
    function checkPassword(password) {
        let cleanedPassword = password.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        let returnval = 0
        for (let i of blacklist) {
            
            if (cleanedPassword.includes(i)) {
                cleanedPassword = cleanedPassword.replace(i, "")
                returnval += 1
            } 
            
        }
        console.log(returnval)
        return [returnval, cleanedPassword];
        
    }
    function changepassstate() {
        changechecked(!ischecked)
        if (!ischecked) {
            let e = document.getElementById("thepass")
            e.type = "text"
        } else {
            let e = document.getElementById("thepass")
            e.type = "password"
        }
    }
    function changepassnstuff() {
        let newpass = document.getElementById("thepass")
        changepassword(newpass.value)
        changehasupper(/[A-Z]/.test(newpass.value))
        changehaslower(/[a-z]/.test(newpass.value))
        changehasnumbers(/[0-9]/.test(newpass.value))
        changehassymbols(/[^A-Za-z0-9]/.test(newpass.value))
        let possiblechars = 0
        let checkvalues = checkPassword(newpass.value)
        console.log(checkvalues)
        possiblechars += haslower ? 26 : 0
        possiblechars += hasupper ? 26 : 0
        possiblechars += hassymbols ? 32 : 0
        possiblechars += hasnumbers ? 10 : 0
        let localsecstocrack = Math.round((Math.pow(possiblechars, checkvalues[1].length) / hashespersecond) / 2)
        changepassentropy(Math.round(Math.log2(Math.pow(possiblechars, checkvalues[1].length))))
        changeamountofblacklistedwords(checkvalues[0])
        changesecstocrack(secstowordnumber(localsecstocrack))
        let entropyamt = (((Math.round(Math.log2(Math.pow(possiblechars, checkvalues[1].length))) / 60) * 100) / 2.857142857)
        let charsamt = 0; charsamt += (/[A-Z]/.test(newpass.value)) ? 8 : 0; charsamt += (/[a-z]/.test(newpass.value)) ? 8 : 0; charsamt += (/[0-9]/.test(newpass.value)) ? 8 : 0; charsamt += (/[^A-Za-z0-9]/.test(newpass.value)) ? 8 : 0;
        let lengthamt = (((newpass.value.length / 15) * 100) / 3.299999999999999999)
        entropyamt = (entropyamt >= 35) ? 35 : entropyamt
        charsamt = (charsamt >= 40) ? 40 : charsamt
        lengthamt = (lengthamt >= 33) ? 33 : lengthamt
        if (entropyamt == -Infinity) {entropyamt = 0}
        changeweightedamt((entropyamt + charsamt + lengthamt).toFixed(2).toString() + "%")
    }
    function secstowordnumber(x) {
        var years = Math.floor(x / (365*24*3600));
        var days = Math.floor((x % (365*24*3600)) / (3600*24));
        var hours = Math.floor((x % (3600*24)) / 3600);
        var minutes = Math.floor((x % 3600) / 60);
        var seconds = Math.floor(x % 60);

        var formattedseconds = "";
        
        if (years > 0) {
         formattedseconds += years + (years === 1 ? " year, " : " years, ");
        }
        if (days > 0) {
         formattedseconds += days + (days === 1 ? " day, " : " days, ");
        }
        if (hours > 0) {
         formattedseconds += hours + (hours === 1 ? " hour, " : " hours, ");
        }
        if (minutes > 0) {
         formattedseconds += minutes + (minutes === 1 ? " minute, " : " minutes, ");
        }
        if (seconds > 0) {
         formattedseconds += seconds + (seconds === 1 ? " second" : " seconds");
        }
        if  (formattedseconds == "") {
            return "0 seconds"
        }
        return formattedseconds;
    }
    const [text, setText] = useState('');

    const handleChange = event => {
        setText(event.target.value);
    };

    const fontSize = 20 - (text.length * 0.5);
    return (
        <>
        <div className="bigtitlediv">
            <h1 className={"bigtitle"}>Password Strength Analyzer</h1>
            <h1 className={"bigtitle"}>By: Matthew Thorne</h1>
        </div>
        <div className="bodydiv">
            <h2 className="charAmt">{password.length.toString()} chars</h2>
            <div className="passwordDiv">
                <input type={"password"} className="pass" id="thepass" placeholder="Enter Password.." onKeyUp={() => {changepassnstuff()}}></input>
                <label className="passlabel">Show Password: </label>
                <input type={"checkbox"} className="passcheck" onChange={() => {changepassstate()}}></input>
            </div>
            <div className="passwordinfodiv">
                <text className="passstats">Password Stats:</text>
                <div className="passchecker">
                    <div className="thepasscheckdivs"><text className="thepasschecktexts" style={{color: haslower ? "green" : "red"}}>Lowercase</text></div>
                    <div className="thepasscheckdivs"><text className="thepasschecktexts" style={{color: hasupper ? "green" : "red"}}>Uppercase</text></div>
                    <div className="thepasscheckdivs"><text className="thepasschecktexts" style={{color: hasnumbers ? "green" : "red"}}>Numbers</text></div>
                    <div className="thepasscheckdivs"><text className="thepasschecktexts" style={{color: hassymbols ? "green" : "red"}}>Symbols</text></div>
                </div>
                <h2 className="bruteforcetxt" style={{ fontSize: fontSize + 'px' }}>Your password would take {secstocrack} to crack.</h2>
                <h2 className="bruteforcetxt">Password Entropy: {(passentropy === -Infinity) ? "0" : passentropy} bits (Good = 60 bits)</h2>
                <h2 className="bruteforcetxt">{(password.length >= 12) ? "Your password meets the recommended length (12)" : "Your password doesn't meets the recommended length (12)"}</h2>
                <h2 className="bruteforcetxt" style={{color: (amountofblacklistedwords != 0) ? "red" : "black"}}>{(amountofblacklistedwords != 0) ? `Password has ${amountofblacklistedwords} dictionary words` : "Password has no dictionary words"}</h2>
                <h2 className="bruteforcetxt">Weighted Score: {weightedamt}</h2>
                
            </div>
            <h1 className="usefulpasstxt">Useful Password Practices:</h1>
            <div className="usefulpasstxtmaindiv">
                <div className="usefulpasstxtdiv">
                    <header className="usepasstxt1head"><h2 className="usepasstxt1title">1st Suggestion:</h2></header><h4 className="usepasstxt1body">Use numbers, special characters, and upper/lower case letters when creating your password. This widens the amount of possible passwords your attacker will have to search.</h4>
                </div>
                <div className="usefulpasstxtdiv">
                    <header className="usepasstxt1head"><h2 className="usepasstxt1title">2nd Suggestion:</h2></header><h4 className="usepasstxt1body">Do not include personal info (names, birth dates, etc) when creating your password in case your attacker knows your personal info.</h4>
                </div>
                <div className="usefulpasstxtdiv">
                    <header className="usepasstxt1head"><h2 className="usepasstxt1title">3rd Suggestion:</h2></header><h4 className="usepasstxt1body">Do not use one password for all of your accounts. If you do, if a hacker finds out your password for one site, he will be able to use it to login into all of your other accounts.</h4>
                </div>
                <div className="usefulpasstxtdiv">
                    <header className="usepasstxt1head"><h2 className="usepasstxt1title">4th Suggestion:</h2></header><h4 className="usepasstxt1body">Check <a href="https://haveibeenpwned.com">haveibeenpwned</a> every once in a while to see if your password appeared in a data breach. If it did, immediately change it.</h4>
                </div>
            </div>
            <h1 style={{color: "white", backgroundColor: "white"}}>secrettext</h1>
        </div>
        
        </>
    )
}




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PasswordAnalyzer/>);
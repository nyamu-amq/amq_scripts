// ==UserScript==
// @name         AMQ Friend Online Notifier
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  show notification when your friend is online
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
    return
}

let commandListener = new Listener("friend state change", (friend) => {
	if (friend.online) {
		popoutMessages.displayStandardMessage("",friend.name+" is online");
	}
});
commandListener.bindListener();

AMQ_addScriptData({
    name: "Friend Online Notifier",
    author: "nyamu",
    description: `
        <p>It shows notification when your friend is online.</p>
        <img src="https://i.imgur.com/ANsmKXD.png" />
        <p><s>Enjoy stalking.</s></p>
    `
});

// ==UserScript==
// @name         AMQ Friend Online Notifier
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  show notification when your friend is online
// @author       nyamu
// @match        https://animemusicquiz.com/*

// ==/UserScript==
let commandListener = new Listener("friend state change", (friend) => {
	if (friend.online) {
		popoutMessages.displayStandardMessage("",friend.name+" is online");
	}
});
commandListener.bindListener();

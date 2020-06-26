// ==UserScript==
// @name         AMQ Auto Ready
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return;
}
var isAutoReady=Cookies.get('auto_ready');
if(!isAutoReady) isAutoReady=false;

let settingChangeListener = new Listener("Room Settings Changed", (changes) => {
	setTimeout(() => { checkReady(); },1);
});
let spectatorChangeToPlayer = new Listener("Spectator Change To Player", (player) => {
	if (player.name === selfName) {
		setTimeout(() => { checkReady(); },1);
	}
});
let hostPromotionListner = new Listener("Host Promotion", (payload) => {
	setTimeout(() => { checkReady(); },1);
});

function checkReady() {
	if(!isAutoReady || !lobby.inLobby || lobby.isHost || lobby.isSpectator || lobby.isReady || quiz.gameMode === "Ranked") return;
	lobby.fireMainButtonEvent();
}

ViewChanger.prototype.changeView = (function() {
	var old=ViewChanger.prototype.changeView;
	return function() {
		old.apply(this,arguments);
		onViewChanged();
	}
})();

function onViewChanged() {
	if(viewChanger.currentView=="lobby") {
		checkReady();
	}
}

function dockeyup(event) {
	if(event.altKey && event.keyCode=='82') {
		isAutoReady=!isAutoReady;
		Cookies.set('auto_ready', isAutoReady, { expires: 365 });
		if(isAutoReady) chatSystemMessage("Enabled Auto Ready");
		else chatSystemMessage("Disabled Auto Ready");
	}
}
document.addEventListener('keyup', dockeyup, false);

function chatSystemMessage(msg) {
	if(!gameChat.isShown()) return;
	gameChat.systemMessage(msg);
}

settingChangeListener.bindListener();
spectatorChangeToPlayer.bindListener();
hostPromotionListner.bindListener();

let joinGameListener = new Listener("Join Game", (response) => {
	notifyAutoReady();
});

let spectateGameListener = new Listener("Spectate Game", (response) => {
	notifyAutoReady();
});
function notifyAutoReady() {
	if(quiz.gameMode === "Ranked") return;
	if(isAutoReady)	gameChat.systemMessage("Auto Ready is Enabled. Press [ALT+R] to disable.");
	else gameChat.systemMessage("Auto Ready is Disabled. Press [ALT+R] to enable.");
}
joinGameListener.bindListener();
spectateGameListener.bindListener();

AMQ_addScriptData({
    name: "Auto Ready",
    author: "nyamu",
    description: `
        <p>It changes your state to ready automatically when you are in lobby. Even when settings are changed. You can unready by clicking unready button manually.</p>
        <p>You can toggle it with [ALT+R]. Default is off.</p>
        <p>Dedicated to lazists.</p>
    `
});

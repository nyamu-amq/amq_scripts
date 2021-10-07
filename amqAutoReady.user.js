// ==UserScript==
// @name         AMQ Auto Ready
// @namespace    https://github.com/nyamu-amq
// @version      0.6
// @description  
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return;
}

{
	let auto_ready=Cookies.get('auto_ready');
	if(auto_ready!=undefined) {
		localStorage.setItem('auto_ready', auto_ready);
		Cookies.set('auto_ready', "", { expires: 0 });
	}
}

var isAutoReady=localStorage.getItem('auto_ready')=="true";
var isAutoSpec=false;
var isAutoStart=false;

new Listener("Room Settings Changed", (changes) => {
	setTimeout(() => { checkReady(); },1);
}).bindListener();
new Listener("Spectator Change To Player", (player) => {
	if (player.name === selfName) {
		setTimeout(() => { checkReady(); checkStart(); },1);
	}
}).bindListener();
new Listener("Host Promotion", (payload) => {
	setTimeout(() => { checkReady(); },1);
}).bindListener();

function checkReady() {
	if(!isAutoReady || !lobby.inLobby || lobby.isHost || lobby.isSpectator || lobby.isReady || quiz.gameMode === "Ranked") return;
	lobby.fireMainButtonEvent();
}

function checkStart() {
	if(!isAutoStart || !lobby.inLobby || !lobby.isHost || quiz.gameMode === "Ranked") return;
	setTimeout(() => {
		if(!checkAllPlayersReady()) return;
		lobby.fireMainButtonEvent();
	},1);
}

function checkAllPlayersReady() {
	Object.values(lobby.players).forEach((player) => {
		if(!player.ready) return false;
	});
	return true;
};

ViewChanger.prototype.changeView = (function() {
	var old=ViewChanger.prototype.changeView;
	return function() {
		old.apply(this,arguments);
		setTimeout(() => { onViewChanged(); },1);
	}
})();

function onViewChanged() {
	if(viewChanger.currentView=="lobby") {
		if(isAutoSpec) {
			if(!lobby.isSpectator) lobby.changeToSpectator(selfName)
		}
		else {
			checkReady();
			if(lobby.numberOfPlayers<2) checkStart();
		}
	}
	isAutoSpec=false;
}

function dockeyup(event) {
	if(event.altKey && event.keyCode=='82') {
		if(event.shiftKey) {
			toggleAutoSpec();
		}
		else {
			isAutoReady=!isAutoReady;
			localStorage.setItem('auto_ready', isAutoReady);
			chatSystemMessage(isAutoReady?"Enabled Auto Ready":"Disabled Auto Ready");
		}
	}
	if(event.shiftKey && event.ctrlKey && event.keyCode=='83') {
		toggleAutoStart();
	}
}
document.addEventListener('keyup', dockeyup, false);

function toggleAutoSpec() {
	if(!quiz.inQuiz) return;
	isAutoSpec=!isAutoSpec;
	chatSystemMessage(isAutoSpec?"Enabled Auto Spec":"Disabled Auto Spec");
}

function toggleAutoStart() {
	isAutoStart=!isAutoStart;
	chatSystemMessage(isAutoStart?"Enabled Auto Start":"Disabled Auto Start");
}

function chatSystemMessage(msg) {
	if(!gameChat.isShown()) return;
	gameChat.systemMessage(msg);
}

new Listener("Join Game", (response) => {
	if(response.error) return;
	notifyAutoReady();
}).bindListener();

new Listener("Spectate Game", (response) => {
	if(response.error) return;
	notifyAutoReady();
}).bindListener();

function notifyAutoReady() {
	if(quiz.gameMode === "Ranked") return;
	gameChat.systemMessage(isAutoReady?"Auto Ready is Enabled. Press [ALT+R] to disable.":"Auto Ready is Disabled. Press [ALT+R] to enable.");
	gameChat.systemMessage(isAutoStart?"Auto Start is Enabled. Press [CTRL+SHIFT+S] to disable.":"Auto Start is Disabled. Press [CTRL+SHIFT+S] to enable.");
}

new Listener("Player Ready Change",  (change) => {
	checkStart();
}).bindListener();

AMQ_addScriptData({
	name: "Auto Ready",
	author: "nyamu",
	description: `
		<p>It changes your state to ready automatically when you are in lobby. Even when settings are changed. You can unready by clicking unready button manually.</p>
		<p>You can toggle it with [ALT+R]. Default is off.</p>
		<p>Dedicated to lazists.</p>
	`
});

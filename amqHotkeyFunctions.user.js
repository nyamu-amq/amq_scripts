// ==UserScript==
// @name         AMQ Hotkey Functions
// @namespace    https://github.com/nyamu-amq
// @version      0.20
// @description  enable hotkey functions
// @description  ESC: remove zombie tooltips
// @description  TAB: move cursor focus to chat box and answer box
// @description  PgUp: increase volume
// @description  PgDn: decrease volume
// @description  Ctrl + M : toggle mute
// @description  Shift + Enter: skip
// @description  Shift + Alt + S: toggle autoskip
// @description  Shift + PgUp: move box focus to upper box
// @description  Shift + PgDn: move box focus to lower box
// @description  Shift + Home: move box focus to box 1
// @description  Shift + End: move box focus to my box
// @description  Ctrl + Left: join game in lobby. toggle ready if you joined
// @description  Ctrl + Right: change to spec in lobby if you joined
// @description  Ctrl + Up: start game if you are host and all players are ready
// @description  Ctrl + Down: start vote for returning lobby if game started and you are host
// @description  Alt + 1: show song history window
// @description  Alt + 2: show song history info window
// @author       nyamu
// @match        https://*.animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return
}

function doc_keyUp(event) {
	if(event.keyCode=='27') {
		$("[id^=tooltip]").remove(); $("[id^=popover]").remove();
	}
	else if(event.keyCode=='13' && !quiz.isSpectator && event.shiftKey) {
		quiz.skipClicked()
	}
	else if(event.keyCode=='77' && event.ctrlKey) {
		volumeController.setMuted(!volumeController.muted);
		volumeController.adjustVolume();
	}
	else if(event.keyCode=='83' && event.shiftKey && event.altKey) {
		isAutoSkip=!isAutoSkip;
		chatSystemMessage(isAutoSkip?"Enabled Auto Skip":"Disabled Auto Skip");
	}
	else if(event.keyCode=='9' && !event.altKey) {
		if(quiz.answerInput.inFocus || quiz.isSpectator) {
			quiz.setInputInFocus(false);
			$("#gcInput").focus();
		}
		else {
			$("#gcInput").blur();
			quiz.setInputInFocus(true);
			$("#qpAnswerInput").focus();
		}
	}
	else if(lobby.inLobby && event.ctrlKey && hostModal.gameMode !== 'Ranked') {
		if(event.keyCode=='37') {
			if(lobby.isSpectator) {
				let changeToListner = new Listener("Change To Player", function (succes) {
					if (!succes) {
						displayMessage("Error changing to player");
					}
					changeToListner.unbindListener();
				}.bind(lobby));
				changeToListner.bindListener();

				socket.sendCommand({
					type: "lobby",
					command: "change to player"
				});
			}
			else if(!lobby.isHost) {
				lobby.isReady = !lobby.isReady;
				socket.sendCommand({
					type: "lobby",
					command: "set ready",
					data: { ready: lobby.isReady }
				});
				lobby.updateMainButton();
			}
		}
		else if(event.keyCode=='39') {
			if(!lobby.isSpectator) {
				lobby.changeToSpectator(selfName);
			}
		}
		else if(event.keyCode=='38') {
			if(lobby.isHost && isAllPlayerReady()) {
				lobby.fireMainButtonEvent();
			}
		}
	}
	else if(quiz.inQuiz && hostModal.gameMode !== 'Ranked') {
		if(event.keyCode=='40' && event.ctrlKey) {
			if(lobby.isHost) {
				quiz.startReturnLobbyVote();
			}
		}
	}
}

function isAllPlayerReady() {
	return (lobby.numberOfPlayers>0 && lobby.numberOfPlayers==lobby.numberOfPlayersReady);
}

function doc_keyDown(event) {
	if(event.shiftKey) {
		var maxgroup=Object.keys(quiz.groupSlotMap).length;
		if(maxgroup>1) {
			var curgroup=parseInt(quiz.avatarContainer.currentGroup);
			if(event.keyCode=='33') {
				if(curgroup>1)
					SelectAvatarGroup(String(curgroup-1));
			}
			else if(event.keyCode=='34') {
				if(curgroup<maxgroup)
					SelectAvatarGroup(String(curgroup+1));
			}
			else if(event.keyCode=='35') {
				if(!quiz.isSpectator) {
					if(quiz.ownGroupSlot!=quiz.avatarContainer.currentGroup)
						SelectAvatarGroup(quiz.ownGroupSlot);
				}
			}
			else if(event.keyCode=='36') {
				if(curgroup>1)
					SelectAvatarGroup("1");
			}
		}
	}
	else if(event.altKey) {
		if(event.keyCode=='49') {
			if(songHistoryWindow.displayed)
				songHistoryWindow.hide();
			else
				songHistoryWindow.show();
		}
		else if(event.keyCode=='50') {
			if(songHistoryInfoWindow.displayed)
				songHistoryInfoWindow.hide();
			else
				songHistoryInfoWindow.show();
		}
	}
	else {
		if(event.keyCode=='33') {
			AdjustVolume(.05);
		}
		else if(event.keyCode=='34') {
			AdjustVolume(-.05);
		}
	}
}
function AdjustVolume(amount) {
	var volumetemp=Cookies.get('volume')*1;
	volumetemp=volumetemp+amount;
	volumetemp=Math.min(Math.max(volumetemp, 0), 1);
	volumeController.volume=volumetemp;
	volumeController.adjustVolume();
	volumeController.setMuted(false);
}
function SelectAvatarGroup(number) {
	quiz.avatarContainer.currentGroup = number;
	quiz.scoreboard.setActiveGroup(number);
	if (Object.keys(quiz.scoreboard.groups).length > 1) {
		quiz.scoreboard.$quizScoreboardItemContainer.stop().animate({
			scrollTop: quiz.scoreboard.groups[number].topOffset - 3
		}, 300);
	}
}

SongHistoryWindow.prototype.updatePositionOnDrag = (function(pageX, pageY) {
	var old=SongHistoryWindow.prototype.updatePositionOnDrag;
	return function() {
		old.apply(this,arguments);
		localStorage.setItem("songHistoryWindowX",songHistoryWindow.$container.position().left);
		localStorage.setItem("songHistoryWindowY",songHistoryWindow.$container.position().top);
	}
})();
SongHistoryInfoWindow.prototype.updatePositionOnDrag = (function(pageX, pageY) {
	var old=SongHistoryInfoWindow.prototype.updatePositionOnDrag;
	return function() {
		old.apply(this,arguments);
		localStorage.setItem("songHistoryInfoWindowX",songHistoryInfoWindow.$container.position().left);
		localStorage.setItem("songHistoryInfoWindowY",songHistoryInfoWindow.$container.position().top);
	}
})();
SongHistoryWindow.prototype.show = (function() {
	var old=SongHistoryWindow.prototype.show;
	return function() {
		old.apply(this,arguments);
		let left=localStorage.getItem("songHistoryWindowX");
		let top=localStorage.getItem("songHistoryWindowY");
		if(left && top) {
			songHistoryWindow.$container.css("transform", `translate(${left}px, ${top}px)`);
		}
		let width=localStorage.getItem("songHistoryWindowWidth");
		let height=localStorage.getItem("songHistoryWindowHeight");
		if(width && height) {
			songHistoryWindow.$container.css('width',`${width}px`);
			songHistoryWindow.$container.css('height',`${height}px`);
		}
	}
})();
SongHistoryInfoWindow.prototype.show = (function() {
	var old=SongHistoryInfoWindow.prototype.show;
	return function() {
		old.apply(this,arguments);
		let left=localStorage.getItem("songHistoryInfoWindowX");
		let top=localStorage.getItem("songHistoryInfoWindowY");
		if(left && top) {
			songHistoryInfoWindow.$container.css("transform", `translate(${left}px, ${top}px)`);
		}
		let width=localStorage.getItem("songHistoryInfoWindowWidth");
		let height=localStorage.getItem("songHistoryInfoWindowHeight");
		if(width && height) {
			songHistoryInfoWindow.$container.css('width',`${width}px`);
			songHistoryInfoWindow.$container.css('height',`${height}px`);
		}
	}
})();

function onSongHistoryWindowResize(){
	if(songHistoryWindow.$container.width()>475 || songHistoryWindow.$container.height()>250) {
		localStorage.setItem("songHistoryWindowWidth",songHistoryWindow.$container.width());
		localStorage.setItem("songHistoryWindowHeight",songHistoryWindow.$container.height());
	}
}
new ResizeObserver(onSongHistoryWindowResize).observe(document.querySelector('#songHistoryWindow'));

function onSongHistoryInfoWindowResize(){
	if(songHistoryInfoWindow.$container.width()>500 || songHistoryInfoWindow.$container.height()>250) {
		localStorage.setItem("songHistoryInfoWindowWidth",songHistoryInfoWindow.$container.width());
		localStorage.setItem("songHistoryInfoWindowHeight",songHistoryInfoWindow.$container.height());
	}
}
new ResizeObserver(onSongHistoryInfoWindowResize).observe(document.querySelector('#songHistoryInfoWindow'));



document.addEventListener('keyup', doc_keyUp, false);
document.addEventListener('keydown', doc_keyDown, false);

var isAutoSkip = false;
new Listener("play next song", payload => {
	if(quiz.isSpectator) return;
	setTimeout(function () {
		if(isAutoSkip) {
			quiz.skipClicked();
		}
	}, 500);
}).bindListener();

new Listener("Join Game", (response) => {
	if(response.error) return;
	notifyAutoSkip();
}).bindListener();

new Listener("Spectate Game", (response) => {
	if(response.error) return;
	notifyAutoSkip();
}).bindListener();

function notifyAutoSkip() {
	if(quiz.gameMode === "Ranked") return;
	gameChat.systemMessage(isAutoSkip?"Auto Skip is Enabled. Press [SHIFT+ALT+S] to disable.":"Auto Skip is Disabled. Press [SHIFT+ALT+S] to enable.");
}

function chatSystemMessage(msg) {
	if(!gameChat.isShown()) return;
	gameChat.systemMessage(msg);
}

AMQ_addScriptData({
	name: "Hotkey Functions",
	author: "nyamu",
	description: `
		<p>It enables some hotkey functions.</p>
		<p>[ESC] : remove zombie tooltips</p>
		<p>[TAB] : move cursor focus to chat box and answer box</p>
		<p>[PgUp] : increase volume</p>
		<p>[PgDn] : decrease volume</p>
		<p>[Ctrl + M]  : toggle mute</p>
		<p>[Shift + Enter] : skip</p>
		<p>[Shift + Alt + S] : toggle autoskip</p>
		<p>[Shift + PgUp] : move box focus to upper box</p>
		<p>[Shift + PgDn] : move box focus to lower box</p>
		<p>[Shift + Home] : move box focus to box 1</p>
		<p>[Shift + End] : move box focus to my box</p>
		<p>[Ctrl + Left] : join game in lobby. toggle ready if you joined</p>
		<p>[Ctrl + Right] : change to spec in lobby if you joined</p>
		<p>[Ctrl + Up] : start game if you are host and all players are ready</p>
		<p>[Ctrl + Down] : start vote for returning lobby if game started and you are host</p>
		<p>[Alt + 1]: show song history window</p>
		<p>[Alt + 2]: show song history info window</p>
	`
});

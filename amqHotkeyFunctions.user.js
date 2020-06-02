// ==UserScript==
// @name         AMQ Hotkey Functions
// @namespace    https://github.com/nyamu-amq
// @version      0.10
// @description  enable hotkey functions
// @description  ESC: remove zombie tooltips
// @description  TAB: move cursor focus to chat box and answer box
// @description  PgUp: increase volume
// @description  PgDn: decrease volume
// @description  Ctrl + M : toggle mute
// @description  Shift + Enter: skip
// @description  Shift + PgUp: move box focus to upper box
// @description  Shift + PgDn: move box focus to lower box
// @description  Shift + Home: move box focus to box 1
// @description  Shift + End: move box focus to my box
// @description  Ctrl + Left: join game in lobby. toggle ready if you joined. toggle queue if game started and you are spec
// @description  Ctrl + Right: change to spec in lobby if you joined
// @description  Ctrl + Up: start game if you are host and all players are ready
// @description  Ctrl + Down: start vote for returning lobby if game started and you are host
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

function doc_keyUp(event) {
	if(event.keyCode=='27') {
		$("[id^=tooltip]").remove(); $("[id^=popover]").remove();
	}
	else if(event.keyCode=='9') {
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
	else if(event.keyCode=='13' && !quiz.isSpectator && event.shiftKey) {
		quiz.skipClicked()
	}
	else if(event.keyCode=='77' && event.ctrlKey) {
		volumeController.setMuted(!volumeController.muted);
		volumeController.adjustVolume();
	}
	else if(lobby.inLobby && hostModal.gameMode !== 'Ranked') {
		if(event.keyCode=='37' && event.ctrlKey) {
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
		else if(event.keyCode=='39' && event.ctrlKey) {
			if(!lobby.isSpectator) {
				lobby.changeToSpectator(selfName);
			}
		}
		else if(event.keyCode=='38' && event.ctrlKey) {
			if(lobby.isHost && isAllPlayerReady()) {
				lobby.fireMainButtonEvent();
			}
		}
	}
	else if(quiz.inQuiz && hostModal.gameMode !== 'Ranked') {
		if(event.keyCode=='37' && event.ctrlKey) {
			if(quiz.isSpectator) {
				gameChat.joinLeaveQueue();
			}
		}
		else if(event.keyCode=='40' && event.ctrlKey) {
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

document.addEventListener('keyup', doc_keyUp, false);
document.addEventListener('keydown', doc_keyDown, false);

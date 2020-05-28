// ==UserScript==
// @name         AMQ Hotkey Functions
// @namespace    https://github.com/nyamu-amq
// @version      0.5
// @description  enable hotkey functions
// @description  ESC: remove zombie tooltips
// @description  TAB: move cursor focus to chat box and answer box
// @description  PgUp: increase volume
// @description  PgDn: decrease volume
// @description  Ctrl + M : toggle mute
// @description  Shift + Enter: skip
// @description  Shift + PgUp: move box focus to upper box
// @description  Shift + PgDn: move box focus to lower box
// @description  Shift + Home: move box focus to my box
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
}

function doc_keyDown(event) {
	if(event.shiftKey) {
		var maxgroup=Object.keys(quiz.groupSlotMap).length;
		if(maxgroup>1) {
			var curgroup=parseInt(quiz.avatarContainer.currentGroup);
			if(event.keyCode=='33') {
				if(curgroup>1)
					quiz.selectAvatarGroup(String(curgroup-1));
			}
			else if(event.keyCode=='34') {
				if(curgroup<maxgroup)
					quiz.selectAvatarGroup(String(curgroup+1));
			}
			else if(event.keyCode=='36') {
				if(!quiz.isSpectator) {
					if(quiz.ownGroupSlot!=quiz.avatarContainer.currentGroup)
						quiz.selectAvatarGroup(quiz.ownGroupSlot);
				}
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
document.addEventListener('keyup', doc_keyUp, false);
document.addEventListener('keydown', doc_keyDown, false);

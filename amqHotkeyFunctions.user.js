// ==UserScript==
// @name         AMQ Hotkey Functions
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  enable hotkey functions
// @description  ESC: remove zombie tooltips
// @description  TAB: move cursor focus to chat box and answer box
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

function doc_keyUp(event) {
	if (event.keyCode == '27') {
		$("[id^=tooltip]").remove(); $("[id^=popover]").remove();
	}
	else if (event.keyCode == '9') {
		if(quiz.answerInput.inFocus || quiz.isSpectator) {
			quiz.setInputInFocus(false);
			$("#gcInput").focus();
		}
		else {
			$("#gcInput").blur();
			quiz.setInputInFocus(true);
		}
	}
}
document.addEventListener('keyup', doc_keyUp, false);

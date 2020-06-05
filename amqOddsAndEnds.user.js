// ==UserScript==
// @name         AMQ Odds and Ends
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  odds and ends
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

if (document.getElementById('startPage')) {
    return
}

HostModal.prototype.changeSettings = function (changes) {
	if(changes['gameMode']!=undefined)
		this.gameMode=changes['gameMode'];
	Object.keys(changes).forEach(key => {
		setTimeout(() => {
			this.updateSetting(key, changes[key]);
		}, 1);
	});
};

$("#qpAnswerInput").unbind("click keypress");
$("#qpAnswerInput").keypress((event) => {
	if (event.which === 13) {
		let answer=$("#qpAnswerInput").val();
		$("#qpAnswerInput").val(translateShortcodeToUnicode(answer));
		quiz.answerInput.submitAnswer(true);
	}
});

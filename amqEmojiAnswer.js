// ==UserScript==
// @name         AMQ Emoji Answer
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  convert emoji shortcode in answer box when press enter
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

if (document.getElementById('startPage')) {
    return
}

$("#qpAnswerInput").unbind("click keypress");
$("#qpAnswerInput").keypress((event) => {
	if (event.which === 13) {
		let answer=$("#qpAnswerInput").val();
		$("#qpAnswerInput").val(translateShortcodeToUnicode(answer));
		quiz.answerInput.submitAnswer(true);
	}
});

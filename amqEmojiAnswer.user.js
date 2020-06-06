// ==UserScript==
// @name         AMQ Emoji Answer
// @namespace    https://github.com/nyamu-amq
// @version      0.2
// @description  convert emoji shortcode in answer box when press enter
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

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

AMQ_addScriptData({
    name: "Emoji Answer",
    author: "nyamu",
    description: `
        <p>It converts emoji shortcodes in answer box when press enter.</p>
        <img src="https://i.imgur.com/JXjXy7g.png" />
        <img src="https://i.imgur.com/oTWSyaN.png" />
        <p>Enjoy throwing.</p>
    `
});

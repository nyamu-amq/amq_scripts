// ==UserScript==
// @name         AMQ Emoji Answer
// @namespace    https://github.com/nyamu-amq
// @version      0.6
// @description  convert emoji shortcode in answer box when press enter
// @author       nyamu
// @match        https://*.animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
    return
}

$("#qpAnswerInput").unbind("click keypress");
$("#qpAnswerInput").keypress((event) => {
	if (event.which === 13) {
		let answer=$("#qpAnswerInput").val();
        quiz.answerInput.setNewAnswer(translateShortcodeToUnicode(answer).text);
	}
});

$("#mhRoomNameInput").keypress((event) => {
	if (event.which === 13) {
		let text=$("#mhRoomNameInput").val();
		$("#mhRoomNameInput").val(translateShortcodeToUnicode(text).text);
	}
});

AMQ_addScriptData({
    name: "Emoji Answer",
    author: "nyamu",
    description: `
        <p>It converts emoji shortcodes in answer box when press enter.</p>
        <p>type like this in answer box
        <img src="https://i.imgur.com/JXjXy7g.png" /></p>
        <p>It changes to emoji when you press enter like this
        <img src="https://i.imgur.com/oTWSyaN.png" /></p>
        <p>Enjoy throwing.</p>
    `
});

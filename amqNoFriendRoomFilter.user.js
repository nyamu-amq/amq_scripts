// ==UserScript==
// @name         AMQ No Friend Room Filter
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  add no friend room filter
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

(function() {
    if (document.getElementById('startPage')) {
        return
    }

	$("#rbMajorFilters").css("width", 370);
	$("#rbMajorFilters").css("left", -370);
	$("#rbMajorFilters").append(`<div><div class="customCheckbox"><input type="checkbox" id="rbfNoFriend"><label for="rbfNoFriend"><i class="fa fa-check" aria-hidden="true"></i></label></div><p>NoFriend</p><div>`);

	$("#rbfNoFriend").on('click', () => {
		roomBrowser.applyTileFilter();
	});

	roomBrowser.applyTileFilterToRoom = function (room) {
		var nofriend = $("#rbfNoFriend").prop('checked') && Object.keys(room._friendsInGameMap).length==0;
	    room.setHidden(nofriend || !roomFilter.testRoom(room));
		this.updateNumberOfRoomsText();
	};
})();

AMQ_addScriptData({
    name: "No Friend Room Filter",
    author: "nyamu",
    description: `
        <p>Add room filter that hide no friend room.</p>
        <p>It shows only room with your friends if it checked.</p>
        <img src="https://i.imgur.com/lCX6Py1.png" />
        <p><s>Enjoy stalking.</s></p>
    `
});

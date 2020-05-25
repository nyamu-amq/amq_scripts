// ==UserScript==
// @name         AMQ No Friend Room Filter
// @namespace    https://github.com/nyamu-amq
// @version      0.2
// @description  add no friend room filter
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

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

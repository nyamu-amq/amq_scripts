// ==UserScript==
// @name         AMQ Hightlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  apply highlight to friends in scorebox
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==



function AddFriendStyle() {
	let head = document.head;
	let style = document.createElement("style");
	head.appendChild(style);
	style.type = "text/css";
	style.appendChild(document.createTextNode(`
	.qpsPlayerName.friend {
		color: #80ff80;
		text-shadow: 0 0 10px #408040;
	}`));
}
AddFriendStyle();

viewChanger.changeView = function (newView, arg) {
	if (arg === undefined) {
		arg = {};
	}

	viewChanger.__controllers[viewChanger.currentView].closeView(arg);
	viewChanger._$loadingScreen.removeClass("hidden");
	viewChanger.__controllers[newView].openView(function () {
		viewChanger._$loadingScreen.addClass("hidden");
		viewChanger.currentView = newView;
	}.bind(viewChanger));

	$(".qpsPlayerName").each((index, elem) => {
		if(socialTab.isFriend($(elem).text()))
			$(elem).addClass("friend");
	});
};

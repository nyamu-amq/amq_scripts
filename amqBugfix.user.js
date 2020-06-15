// ==UserScript==
// @name         AMQ Bugfix
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  Fix bug that wrong game type on game settings
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

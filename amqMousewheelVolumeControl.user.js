// ==UserScript==
// @name         AMQ Mousewheel Volume Control
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  you can adjust volume with mouse wheel. it works in expand library also
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

(function() {

    if (document.getElementById('startPage')) {
        return
    }

	$("#qpOptionContainer")
		.on("wheel", volumeControl);
	$("#qpAnimeCenterContainer")
		.on("wheel", volumeControl);
	$("#qpAvatarRow")
		.on("wheel", volumeControl);
	$("#elInputContainer")
		.on("wheel", volumeControl);

	var volumetemp=Cookies.get('volume')*1;
	setElVolume(volumetemp);
})();

function volumeControl(event) {
	var volumetemp=Cookies.get('volume')*1;
	if(event.originalEvent.deltaY<0) volumetemp=volumetemp+.05;
	else volumetemp=volumetemp-.05;
	volumetemp=Math.min(Math.max(volumetemp, 0), 1);
	volumeController.volume=volumetemp;
	volumeController.adjustVolume();
	volumeController.setMuted(false);
	setElVolume(volumetemp);
}
function setElVolume(volume) {
	let elplayer = document.getElementById('elInputVideo');
	elplayer.volume=volume;
}

AMQ_addScriptData({
    name: "Mousewheel Volume Control",
    author: "nyamu",
    description: `
        <p>You can adjust volume with mouse wheel when mouse cursor is over video area or avatar area.</p>
        <p>It works in expand library also.</p>
    `
});

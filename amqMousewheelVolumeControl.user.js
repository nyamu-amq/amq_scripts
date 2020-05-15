// ==UserScript==
// @name         AMQ Mousewheel Volume Control
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  you can adjust volume with mouse wheel
// @author       nyamu
// @match        https://animemusicquiz.com/*

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
})();

function volumeControl(event) {
	var volumetemp=Cookies.get('volume')*1;
	if(event.originalEvent.deltaY<0) volumetemp=volumetemp+.05;
	else volumetemp=volumetemp-.05;
	volumetemp=Math.min(Math.max(volumetemp, 0), 1);
	volumeController.volume=volumetemp;
	volumeController.adjustVolume();
	volumeController.setMuted(false);
}
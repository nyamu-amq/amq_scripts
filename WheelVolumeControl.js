// ==UserScript==
// @name         Wheel Volume Control
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @author       nyamu
// @match        https://animemusicquiz.com/*

// ==/UserScript==

if (!window.setupDocumentDone) return;

$("#qpAnimeCenterContainer")
	.on("wheel", volumeControl);
$("#qpAvatarRow")
	.on("wheel", volumeControl);

function volumeControl(event) {
	var volumetemp=volumeController.volume;
	volumetemp+=(event.originalEvent.deltaY<0)?.05:-.05;
	volumetemp=Math.min(Math.max(volumetemp, 0), 1);
	volumeController.volume=volumetemp;
	volumeController.adjustVolume();
}

// ==UserScript==
// @name         Catbox Volume
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description
// @author       nyamu
// @match        https://files.catbox.moe/*
// @grant        none

// ==/UserScript==

let video;

(function() {
	video=document.getElementsByTagName('video')[0];
	var volumetemp=localStorage.getItem('volume')*1;
	if(!volumetemp) volumetemp=.5;
	setElVolume(volumetemp);
	document.addEventListener("wheel", volumeControl);
})();

function vol() {
    if(!video) return .5;
    return video.volume*1;
}

function volumeControl(event) {
	var volumetemp=vol();
	volumetemp=Math.min(Math.max(volumetemp+((event.deltaY<0)?.05:-.05), 0), 1);
	setElVolume(volumetemp);
}

function setElVolume(volume) {
	if(!video) return;
	video.volume=volume;
    localStorage.setItem('volume',volume);
}

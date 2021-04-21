// ==UserScript==
// @name         AMQ One Group Glow
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description  
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

if (document.getElementById('startPage')) {
    return
}

QuizScoreboard.prototype.PLAYER_NEEDED_FOR_SHOWING_CORRECT=1

// ==UserScript==
// @name         AMQ Chat Commands
// @namespace    https://github.com/nyamu-amq
// @version      0.7
// @description  enable chat commands
// @description  - commands for host in lobby
// @description  -- /t [oei] : change songtype. ex) /t oi => openings inserts. /t ei => endings inserts. /t e => endings only.
// @description  -- /n (number) : change number of songs
// @description  -- /d (number1)-(number2) : change difficulty. ex) /d 0-40 => change difficulty to 0-40
// @description  -- /random : change song selection to random
// @description  -- /watched : change song selection to watched only
// @description  -- /s (number) : change speed. amq allows one of 1, 1.5, 2, 4 only
// @description  -- /spec (someone) : send someone to spec
// @description  -- /kick (someone) : kick someone
// @description  -- /host (someone) : give someone host
// @description  - commands for host in game
// @description  -- /lb : start a vote for returning to lobby
// @description  -- /pause : pause or unpause game
// @description  - commands for everyone in lobby
// @description  -- /spec : change to spectator
// @description  -- /join : change to player
// @description  -- /queue : toggle queue when you are in lobby while game is progressing
// @description  - commands for everyone in game
// @description  -- /v (number) : change volume 0-100
// @description  -- /skip : skip current song
// @description  -- /autothrow (answer) : start throwing with answer automatically. you can stop it by /autothrow without answer
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

// don't load on login page
if (document.getElementById('startPage')) return;

var autothrow = '';
new Listener("Game Chat Message", (payload) => {
    processChatCommand(payload);
}).bindListener();
new Listener("game chat update", (payload) => {
    payload.messages.forEach(message => {
        processChatCommand(message);
    });
}).bindListener();
function processChatCommand(payload) {
    if (payload.sender !== selfName) return;
    if (payload.message.startsWith("/s ")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var settings = hostModal.getSettings();
        settings.playbackSpeed.randomOn = false;
        settings.playbackSpeed.standardValue = payload.message.substr(3) * 1;
        changeGameSettings(settings);
    }
    if (payload.message.startsWith("/t ")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var types = payload.message.substr(3).toLowerCase();
        var op = types.includes('o');
        var ed = types.includes('e');
        var ins = types.includes('i');
        if (!op && !ed && !ins) return;
        var settings = hostModal.getSettings();
        settings.songType.standardValue.openings = op;
        settings.songType.standardValue.endings = ed;
        settings.songType.standardValue.inserts = ins;
        settings.songType.advancedValue.openings = 0;
        settings.songType.advancedValue.endings = 0;
        settings.songType.advancedValue.inserts = 0;
        settings.songType.advancedValue.random = settings.numberOfSongs;
        changeGameSettings(settings);
    }
    if (payload.message.startsWith("/n ")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var numberOfSongs = payload.message.substr(3) * 1;
        if (numberOfSongs < 5) return;
        var settings = hostModal.getSettings();
        settings.numberOfSongs = numberOfSongs;
        changeGameSettings(settings);
    }
    if (payload.message.startsWith("/d ")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var difs = payload.message.substr(3).split('-');
        if (difs.length < 2) return;
        difs[0] = difs[0] * 1;
        difs[1] = difs[1] * 1;
        var settings = hostModal.getSettings();
        settings.songDifficulity.advancedOn = true;
        if (difs[0] < difs[1])
            settings.songDifficulity.advancedValue = [difs[0], difs[1]];
        else
            settings.songDifficulity.advancedValue = [difs[1], difs[0]];
        changeGameSettings(settings);
    }
    if (payload.message.startsWith("/random")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var settings = hostModal.getSettings();
        settings.songSelection.standardValue = 1;
        settings.songSelection.advancedValue['watched'] = 0;
        settings.songSelection.advancedValue['unwatched'] = 0;
        settings.songSelection.advancedValue['random'] = settings.numberOfSongs;
        changeGameSettings(settings);
    }
    if (payload.message.startsWith("/watched")) {
        if (!lobby.inLobby) return;
        if (!lobby.isHost) return;
        var settings = hostModal.getSettings();
        settings.songSelection.standardValue = 3;
        settings.songSelection.advancedValue['watched'] = settings.numberOfSongs;
        settings.songSelection.advancedValue['unwatched'] = 0;
        settings.songSelection.advancedValue['random'] = 0;
        changeGameSettings(settings);
    }
    else if (payload.message.startsWith("/v ")) {
        var volumetemp = payload.message.substr(3) * .01;
        volumetemp = Math.min(Math.max(volumetemp, 0), 100);
        volumeController.volume = volumetemp;
        volumeController.adjustVolume();
        volumeController.setMuted(false);
    }
    else if (payload.message.startsWith("/spec")) {
        if (!lobby.inLobby) return;
        if (payload.message.length > 6) {
            if (!lobby.isHost) return;
            var target = payload.message.substr(6);
            if (!checkLobby(target)) return;
            lobby.changeToSpectator(target);
        }
        else {
            lobby.changeToSpectator(selfName);
        }
    }
    else if (payload.message.startsWith("/join")) {
        if (!lobby.inLobby) return;
        socket.sendCommand({
            type: "lobby",
            command: "change to player",
        });
    }
    else if (payload.message.startsWith("/queue")) {
        if (quiz.gameMode === 'Ranked') return;
        if (!quiz.inQuiz) return;
        if (!quiz.isSpectator) return;
        gameChat.joinLeaveQueue();
    }
    else if (payload.message.startsWith("/kick ")) {
        if (!lobby.isHost) return;
        if (payload.message.length > 6) {
            var target = payload.message.substr(6);
            if (!checkLobby(target) && !checkSpec(target)) return;
            socket.sendCommand({
                type: "lobby",
                command: "kick player",
                data: { playerName: target },
            });
        }
    }
    else if (payload.message.startsWith("/host ")) {
        if (!lobby.isHost) return;
        if (payload.message.length > 6) {
            var target = payload.message.substr(6);
            if (!checkLobby(target) && !checkSpec(target)) return;
            lobby.promoteHost(target);
        }
    }
    else if (payload.message.startsWith("/skip")) {
        if (!quiz.inQuiz) return;
        quiz.skipClicked();
    }
    else if (payload.message.startsWith("/lb")) {
        if (!quiz.inQuiz) return;
        if (!quiz.isHost) return;
        quiz.startReturnLobbyVote();
    }
    else if (payload.message.startsWith("/pause")) {
        if (!quiz.inQuiz) return;
        if (!quiz.isHost) return;
        if (quiz.pauseButton.pauseOn) {
            socket.sendCommand({
                type: "quiz",
                command: "quiz unpause",
            });
        } else {
            socket.sendCommand({
                type: "quiz",
                command: "quiz pause",
            });
        }
    }
    else if (payload.message.startsWith("/inv ")) {
        if (quiz.gameMode === 'Ranked') return;
        if (!quiz.inQuiz && !lobby.inLobby) return;
        if (payload.message.length > 5) {
            socket.sendCommand({
                type: "social",
                command: "invite to game",
                data: {
                    target: payload.message.substr(5)
                }
            });
        }
    }
    else if (payload.message.startsWith("/autothrow")) {
        var index = payload.message.indexOf(' ');
        if (index > 0) autothrow = translateShortcodeToUnicode(payload.message.substr(index + 1)).text;
        else autothrow = '';
    }
    else if (payload.message.startsWith("/prof ")) {
        var index = payload.message.indexOf(' ');
        if (index > 0) {
            var username = payload.message.substr(index + 1);
            if (username.length > 0) {
                playerProfileController.loadProfileIfClosed(payload.message.substr(index + 1), $("#gameChatContainer"), {}, () => { }, false, true);
            }
        }
    }
}

let playNextSongListener = new Listener("play next song", payload => {
    if (quiz.isSpectator) return;
    if (quiz.gameMode === 'Ranked') return;
    setTimeout(function () {
        if (autothrow.length > 0) {
            quiz.skipClicked();
            $("#qpAnswerInput").val(autothrow);
            quiz.answerInput.submitAnswer(true);
        }
    }, 500);
}).bindListener();


function checkLobby(target) {
    if (!lobby.getPlayerByName(target)) return false;
    return true;
}
function checkSpec(target) {
    for (var user of gameChat.spectators) {
        if (user.name === target) return true;
    }
    return false;
}

function changeGameSettings(settings) {
    if (!settings) return;
    if (lobby.soloMode) {
        settings.roomSize = 1;
    }
    var settingChanges = {};
    Object.keys(settings).forEach((key) => {
        if (JSON.stringify(lobby.settings[key]) !== JSON.stringify(settings[key])) {
            settingChanges[key] = settings[key];
        }
    });
    if (Object.keys(settingChanges).length > 0) {
        hostModal.changeSettings(settingChanges);
        setTimeout(function () { lobby.changeGameSettings() }, 1);
    }
}

function AdjustVolume(amount) {
    var volumetemp = Cookies.get('volume') * 1;
    volumetemp = volumetemp + amount;
    volumetemp = Math.min(Math.max(volumetemp, 0), 1);
    volumeController.volume = volumetemp;
    volumeController.adjustVolume();
    volumeController.setMuted(false);
}

AMQ_addScriptData({
    name: "AMQ Chat Commands",
    author: "nyamu",
    description: `<h3><b><u> commands for host in lobby</h3></b></u>
<ul>
<li><b>/t [oei]</b> : change songtype. ex) /t oi => openings inserts. /t ei => endings inserts. /t e => endings only</li>
<li><b>/n (number)</b> : change number of songs</li>
<li><b>/d (number1)-(number2)</b> : change difficulty. ex) /d 0-40 => change difficulty to 0-40</li>
<li><b>/random</b> : change song selection to random</li>
<li><b>/watched</b> : change song selection to watched only</li>
<li><b>/s (number)</b> : change speed. amq allows one of 1, 1.5, 2, 4 only</li>
<li><b>/spec (someone)</b> : send someone to spec</li>
<li><b>/kick (someone)</b> : kick someone</li>
<li><b>/host (someone)</b> : give someone host</li>
<ul>
<h3><b><u> commands for host in game </h3></b></u>
<ul>
<li><b>/lb</b> : start a vote for returning to lobby</li>
<li><b>/pause</b> : pause or unpause game</li>
</ul>
<h3><b><u> commands for everyone in lobby </h3></b></u>
<ul>
<li><b>/spec</b> : change to spectator</li>
<li><b>/join</b> : change to player</li>
<li><b>/queue</b> : toggle queue when you are in lobby while game is progressing</li>
</ul>
<h3><b><u> commands for everyone in game </h3></b></u>
<li><b>/v (number)</b> : change volume 0-100</li>
<li><b>/skip</b> : skip current song</li>
<li><b>/autothrow (answer)</b> : start throwing with answer automatically. you can stop it by /autothrow without answer
</ul>`
});

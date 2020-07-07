// ==UserScript==
// @name         AMQ Ladder Assist
// @namespace    https://github.com/nyamu-amq
// @version      0.3
// @description  
// @author       nyamu
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @match        https://animemusicquiz.com/*
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqWindows.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return
}

let ladderWindow;
let ladderWindowTable;
let ladderWindowOpenButton;
function createLadderWindow() {
	ladderWindow = new AMQWindow({
		title: "Ladder Info",
		position: {
			x: 0,
			y: 34
		},
		width: 400,
		height: 374,
		minWidth: 400,
		minHeight: 300,
		zIndex: 1010,
		resizable: true,
		draggable: true
	});

	ladderWindow.addPanel({
		id: "ladderWindowTableContainer",
		width: 1.0,
		height: "calc(100%)",
		scrollable: {
			x: false,
			y: true
		}
	});

	ladderWindowTable = $(`<table id="ladderWindowTable" class="table floatingContainer"></table>`);
	ladderWindow.panels[0].panel.append(ladderWindowTable);

	clearTable();

	// ladderWindowOpenButton = $(`<div id="qpLadderButton" class="clickAble qpOption"><i aria-hidden="true" class="fa fa-database qpMenuItem"></i></div>`)
	// .click(function () {
	// 	if(ladderWindow.isVisible()) {
	// 		$(".rowSelected").removeClass("rowSelected");
	// 		ladderWindow.close();
	// 	}
	// 	else {
	// 		openLadderWindow();
	// 	}
	// })
	// .popover({
	// 	placement: "bottom",
	// 	content: "Ladder Info",
	// 	trigger: "hover"
	// });

	// let oldWidth = $("#qpOptionContainer").width();
	// $("#qpOptionContainer").width(oldWidth + 35);
	// $("#qpOptionContainer > div").append(ladderWindowOpenButton);
}
function clearTable() {
	ladderWindowTable.children().remove();

	let header = $(`<tr class="header"></tr>`)
	let idCol = $(`<td class="matchId"><b>ID#</b></td>`);
	let typeCol = $(`<td class="matchType"><b>Type<b></td>`);
	let opponentCol = $(`<td class="matchOpponent"><b>Opponent</b></td>`);
	let tierCol = $(`<td class="matchTier"><b>Tier</b></td>`);
	let roomCol = $(`<td class="matchSetting"><b>R</b></td>`);
	let inviteCol = $(`<td class="matchInvite"><b>I</b></td>`);
	let pingCol = $(`<td class="matchPing"><b>P</b></td>`);

	header.append(idCol);
	header.append(typeCol);
	header.append(opponentCol);
	header.append(tierCol);
	header.append(roomCol);
	header.append(inviteCol);
	header.append(pingCol);
	ladderWindowTable.append(header);
}

createLadderWindow();

var lastRequest=0;
function openLadderWindow() {
	if(Date.now()-lastRequest>10000) {
		lastRequest=Date.now();
		clearTable();
		sendRequest();
	}
	ladderWindow.open();
}
function updateLadderWindow() {
	clearTable();
	for(let data of matchData) {
		let matchRow=$(`<tr id="match`+data[0]+`" class="matchRow"></tr>`);
		let idCol = $(`<td class="matchId">`+data[0]+`</td>`);
		let typeCol = $(`<td class="matchType">`+data[1]+`</td>`);
		let opponentCol = $(`<td class="matchOpponent">`+data[3]+`</td>`);
		let tierCol = $(`<td class="matchTier">`+data[4]+`</td>`);
		let roomCol = $(`<td class="matchSetting"></td>`);
		let inviteCol = $(`<td class="matchInvite"></td>`);
		let pingCol = $(`<td class="matchPing"></td>`);

		let roomButton = $(`<div class="clickAble"><i aria-hidden="true" class="fa fa-home"></i></div>`)
		.click(function () {
			hostRoom(data[1],data[4]);
		})
		.popover({
			placement: "bottom",
			content: "Host Room or Change Settings",
			trigger: "hover"
		});
		roomCol.append(roomButton);

		let inviteButton = $(`<div class="clickAble"><i aria-hidden="true" class="fa fa-envelope"></i></div>`)
		.click(function () {
			if(isOnline(data[3])) {
				inviteUser(data[3]);
			}
		})
		.popover({
			placement: "bottom",
			content: "Invite "+data[3],
			trigger: "hover"
		});
		inviteCol.append(inviteButton);

		let pingButton = $(`<div class="clickAble"><i aria-hidden="true" class="fa fa-phone"></i></div>`)
		.click(function () {
			copyToClipboard("@"+data[2]);
		})
		.popover({
			placement: "bottom",
			content: "Copy discord id to clipboard",
			trigger: "hover"
		});
		pingCol.append(pingButton);

		matchRow.append(idCol);
		matchRow.append(typeCol);
		matchRow.append(opponentCol);
		matchRow.append(tierCol);
		matchRow.append(roomCol);
		matchRow.append(inviteCol);
		matchRow.append(pingCol);

		ladderWindowTable.append(matchRow);
	}
	let pingRow=$(`<tr class="pingRow"></tr>`);
	let pingCol=$(`<td colspan=7></td>`);
	let pingButton = $(`<div class="clickAble">Click here to copy discord id of all opponents to clipboard</div>`)
	.click(function () {
		let users=[];
		for(let data of matchData) {
			if(users.indexOf("@"+data[2])===-1) {
				users.push("@"+data[2]);
			}
		}

		copyToClipboard(users.join(" "));
	});
	pingCol.append(pingButton);
	pingRow.append(pingCol);
	ladderWindowTable.append(pingRow);

	updateOpponentOnlineState()
}
function updateOpponentOnlineState() {
	$(".matchRow").each((index,elem)=>{
		if(isOnline(matchData[index][3])) {
			$(elem).addClass("onlineOpponent");
			$(elem).removeClass("offlineOpponent");
		}
		else {
			$(elem).removeClass("onlineOpponent");
			$(elem).addClass("offlineOpponent");
		}
	})
}
function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  displayMessage("Copied to clipboard", str);
};

function getDifficulty(type, tier) {
	let settings={};
	if(type.includes('random')) {
		settings={
			"diamond":[0,100],
			"platimun":[0,100],
			"gold":[10,100],
			"silver":[20,100],
			"bronze":[30,100],
		};
	}
	else if(type.includes('list')) {
		settings={
			"diamond":[0,40],
			"platimun":[0,40],
			"gold":[0,40],
			"silver":[0,60],
			"bronze":[0,100],
		};
	}
	else if(type.includes('1000')) {
		settings={
			"diamond":[0,40],
			"platimun":[0,40],
			"gold":[0,60],
			"silver":[0,100],
			"bronze":[20,100],
		};
	}
	return settings[tier];
}
function hostRoom(type, tier) {
	if(viewChanger.currentView!=="roomBrowser" && !(lobby.inLobby && lobby.isHost) ) return;
	type=type.toLowerCase();
	tier=tier.toLowerCase();
	hostModal.selectStandard();
	let settingObject = hostModal._settingStorage._serilizer.decode("2020k11111030k000001110000000k00k051o00k012r02i0a46311002s0111111111002s0111002s01a111111111102a1111111111i61k403-11111--");
	hostModal.changeSettings(settingObject);
	setTimeout(()=>{
		hostModal.$roomName.val("IHI");
		hostModal.$privateCheckbox.prop("checked",true);
		hostModal.$passwordInput.val("ladder");

		hostModal.songDiffRangeSliderCombo.setValue(getDifficulty(type,tier));
		if(type.includes('random')) hostModal.$songPool.slider('setValue',1);
		if(type.includes('opening')) {
			hostModal.$songTypeEnding.prop("checked",false);
			hostModal.$songTypeInsert.prop("checked",false);
		}
		else if(type.includes('ending')) {
			hostModal.$songTypeOpening.prop("checked",false);
			hostModal.$songTypeInsert.prop("checked",false);
		}
		else if(type.includes('insert')) {
			hostModal.$songTypeOpening.prop("checked",false);
			hostModal.$songTypeEnding.prop("checked",false);
		}

		if(viewChanger.currentView==="roomBrowser") roomBrowser.host();
		else lobby.changeGameSettings();
	},1);
}

function isOnline(username) {
	return socialTab.allPlayerList._playerEntries.hasOwnProperty(username);
}

var matchData=[];
function sendRequest() {
	GM_xmlhttpRequest({
		method: "POST",
		url: "https://script.google.com/macros/s/AKfycbyoBo5WyPqYYGTYMBWfOpFlSJp9g3X9E6SXZghko0LGrfnj2G9T/exec",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		data: "cm=user&user="+selfName,
		onload: function (response) {
			var res=JSON.parse(response.responseText);
			matchData=res.data;
			matchData.sort(function(a,b){return a[0]*1-b[0]*1;});
			updateLadderWindow();
		},
		onerror: function (response) {
			console.log(response.responseText);
		}
	});
}

function inviteUser(playerName) {
	if (!(lobby.inLobby || quiz.inQuiz)) return;
	socket.sendCommand({
		type: "social",
		command: "invite to game",
		data: {
			target: playerName
		}
	});
}

new Listener("online user change", function (change) {
	setTimeout(() => {updateOpponentOnlineState();},1);
}).bindListener();

function dockeyup(event) {
	if(event.altKey && event.keyCode==76) {
		if (ladderWindow.isVisible()) {
			ladderWindow.close();
		}
		else {
			openLadderWindow()
		}
	}
}
document.addEventListener('keyup', dockeyup, false);

AMQ_addScriptData({
    name: "Ladder Assist",
    author: "nyamu",
    description: `
        <p>You can open and close ladder info window by pressing [ALT+L]. It receives match data from spreadsheet when it is opened. it takes few seconds. just wait.</p>
        <p>It shows your matches to play when match data is received
        <p>Green row is opponent is online, red row is opponent is offline</p>
        <p>Tier is lower one of two</p>
        <p>If you clicked 'host room or change settings' button.... If you clicked it when you are in roomlist page, it makes room with match type and tier settings. If you clicked it when you are in a room, it changes settings</p>
        <p>You can invite opponent by clicking invite button. it works when you are in a room and opponent is online</p>
        <p>It receives match data only when it is opened. If you want to receive latest match data, close and open it again</p>
    `
});
AMQ_addStyle(`
    #ladderWindowTableContainer {
        padding: 10px;
    }
    .matchRow {
        height: 30px;
    }
    .matchRow > td {
        vertical-align: middle;
        border: 1px solid black;
        text-align: center;
    }
    .matchId {
        min-width: 40px;
    }
    .matchType {
        min-width: 80px;
    }
    .matchOpponent {
        min-width: 80px;
    }
    .matchTier {
        min-width: 40px;
    }
    .matchSetting {
        min-width: 20px;
    }
    .matchInvite {
        min-width: 20px;
    }
    .matchPing {
        min-width: 20px;
    }
    .onlineOpponent {
        background-color: rgba(0, 200, 0, 0.07);
    }
    .offlineOpponent {
        background-color: rgba(255, 0, 0, 0.07);
    }
    .pingRow {
        height: 30px;
    }
    .pingRow > td {
        vertical-align: middle;
        border: 1px solid black;
        text-align: center;
    }
    #qpLadderButton {
        width: 30px;
        height: 100%;
        margin-right: 5px;
    }
`);

// ==UserScript==
// @name         AMQ Ladder Assist
// @namespace    https://github.com/nyamu-amq
// @version      0.18
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
		id: "ladderWindowPanel",
		width: 1.0,
		height: 45
	});
	ladderWindow.addPanel({
		id: "ladderWindowTableContainer",
		width: 1.0,
		height: "calc(100% - 45px)",
		position: {
			x: 0,
			y: 45
		},
		scrollable: {
			x: false,
			y: true
		}
	});

	ladderWindow.panels[0].panel
	.append($(`<button class="btn btn-primary ladderPanelButton" type="button"><i aria-hidden="true" class="fa fa-cloud-download"></i></button`)
		.click(() => {
			sendRequest();
		})
		.popover({
			placement: "bottom",
			content: "Update match data",
			trigger: "hover",
			container: "body",
			animation: false
		})
		)
	.append($(`<button class="btn btn-default ladderPanelButton" type="button"><i aria-hidden="true" class="fa fa-phone"></i></button`)
		.click(() => {
			let users=[];
			for(let data of matchData) {
				if(users.indexOf("<@"+data[2]+">")===-1) {
					users.push("<@"+data[2]+">");
				}
			}
			if(users.length>0)
				copyToClipboard(users.join(" ")+" ");
		})
		.popover({
			placement: "bottom",
			content: "Copy discord id of all opponents to clipboard",
			trigger: "hover",
			container: "body",
			animation: false
		})
		)
	.append($(`<select id="tableViewMode"></select>`)
		.append($(`<option value="pending" selected>All Pending Matches</option>`))
		.append($(`<option value="pendinglistall">Pending List All</option>`))
		.append($(`<option value="pendinglistops">Pending List Ops</option>`))
		.append($(`<option value="pendinglisteds">Pending List Eds</option>`))
		.append($(`<option value="pendinglistins">Pending List Ins</option>`))
		.append($(`<option value="pendingrandomall">Pending Random All</option>`))
		.append($(`<option value="pendingrandomops">Pending Random Ops</option>`))
		.append($(`<option value="pendingrandomeds">Pending Random Eds</option>`))
		.append($(`<option value="pendingrandomins">Pending Random Ins</option>`))
		.append($(`<option value="pendingtop1000">Pending Top1000Anime</option>`))
		.append($(`<option value="pendinglotsofsongs">Pending LotsOfSongs</option>`))
		.append($(`<option value="pending2011to2020">Pending 2011to2020</option>`))
		.append($(`<option value="pending2001to2010">Pending 2001to2010</option>`))
		.append($(`<option value="pending1944to2000">Pending 1944to2000</option>`))

		.append($(`<option value="completed">All Completed Matches</option>`))
		.append($(`<option value="completedlistall">Completed List All</option>`))
		.append($(`<option value="completedlistops">Completed List Ops</option>`))
		.append($(`<option value="completedlisteds">Completed List Eds</option>`))
		.append($(`<option value="completedlistins">Completed List Ins</option>`))
		.append($(`<option value="completedrandomall">Completed Random All</option>`))
		.append($(`<option value="completedrandomops">Completed Random Ops</option>`))
		.append($(`<option value="completedrandomeds">Completed Random Eds</option>`))
		.append($(`<option value="completedrandomins">Completed Random Ins</option>`))
		.append($(`<option value="completedtop1000">Completed Top1000Anime</option>`))
		.append($(`<option value="completedlotsofsongs">Completed LotsOfSongs</option>`))
		.append($(`<option value="completed2011to2020">Completed 2011to2020</option>`))
		.append($(`<option value="completed2001to2010">Completed 2001to2010</option>`))
		.append($(`<option value="completed1944to2000">Completed 1944to2000</option>`))
		.change(function () {
			ChangeTableMode();
		})
		)
	.append($(`<div class="ladderPanelMessage"></div>`));

	ladderWindowTable = $(`<table id="ladderWindowTable" class="table floatingContainer"></table>`);
	ladderWindow.panels[1].panel.append(ladderWindowTable);

	clearTable();
}
function checkType(type) {
	type=type.toLowerCase();
	if(strMode.includes("list")) {
		if(!type.includes("list")) return false;
	}
	else if(strMode.includes("randomtag")) {
		if(!type.includes("randomtag")) return false;
	}
	else if(strMode.includes("random")) {
		if(!type.includes("random")) return false;
	}
	else if(strMode.includes("1000")) {
		if(!type.includes("1000")) return false;
	}
	else if(strMode.includes("lotsofsongs")) {
		if(!type.includes("lotsofsongs")) return false;
	}
	else if(strMode.includes("2011to2020")) {
		if(!type.includes("2011to2020")) return false;
	}
	else if(strMode.includes("2001to2010")) {
		if(!type.includes("2001to2010")) return false;
	}
	else if(strMode.includes("1944to2000")) {
		if(!type.includes("1944to2000")) return false;
	}

	if(strMode.endsWith("ops")) {
		if(!type.includes("opening")) return false;
	}
	else if(strMode.endsWith("eds")) {
		if(!type.includes("ending")) return false;
	}
	else if(strMode.endsWith("ins")) {
		if(!type.includes("insert")) return false;
	}
	else if(strMode.endsWith("all")) {
		if(!type.includes("all")) return false;
	}

	return true;
}
function clearTable() {
	ladderWindowTable.children().remove();

	if(tableViewMode===0) {
		let header = $(`<tr class="header"></tr>`)
		let idCol = $(`<td class="matchId"><b>ID#</b></td>`);
		let typeCol = $(`<td class="matchType"><b>Type<b></td>`);
		let opponentCol = $(`<td class="matchOpponent"><b>Opponent</b></td>`);
		let tierCol = $(`<td class="matchTier"><b>Tier</b></td>`);
		let roomCol = $(`<td class="matchButtons"><b>R</b></td>`);
		let inviteCol = $(`<td class="matchButtons"><b>I</b></td>`);
		let pingCol = $(`<td class="matchButtons"><b>P</b></td>`);
		let winCol = $(`<td class="matchButtons"><b>W</b></td>`);
		let loseCol = $(`<td class="matchButtons"><b>L</b></td>`);
		let drawCol = $(`<td class="matchButtons"><b>D</b></td>`);

		header.append(idCol);
		header.append(typeCol);
		header.append(opponentCol);
		header.append(tierCol);
		header.append(roomCol);
		header.append(inviteCol);
		header.append(pingCol);
		header.append(winCol);
		header.append(loseCol);
		header.append(drawCol);
		ladderWindowTable.append(header);
	}
	else {
		let header = $(`<tr class="header"></tr>`)
		let idCol = $(`<td class="matchId"><b>ID#</b></td>`);
		let typeCol = $(`<td class="matchType"><b>Type<b></td>`);
		let opponentCol = $(`<td class="matchOpponent"><b>Opponent</b></td>`);
		let tierCol = $(`<td class="matchTier"><b>Tier</b></td>`);
		let resultCol = $(`<td class="matchResult"><b>Result</b></td>`);

		header.append(idCol);
		header.append(typeCol);
		header.append(opponentCol);
		header.append(tierCol);
		header.append(resultCol);
		ladderWindowTable.append(header);
	}
}
function updateLadderMessage(text) {
	$(".ladderPanelMessage").text(text);
}

var tableViewMode=0;
var strMode="";
function ChangeTableMode() {
	strMode=$("#tableViewMode").val().toLowerCase();
	tableViewMode=(strMode.startsWith("pending"))?0:1;
	updateLadderWindow();
}

createLadderWindow();
AllPlayersList.prototype.stopTracking=function(){};

var lastRequest=0;
function openLadderWindow() {
	if(lastRequest===0) {
		socialTab.allPlayerList.startTracking();
		clearTable();
		sendRequest();
	}
	else socialTab.allPlayerList.loadAllOnline();
	ladderWindow.open();
	updateOpponentOnlineState();
}

function updateLadderWindow() {
	if(tableViewMode===0) updatePendingTable();
	else updateCompletedTable();
}
function updatePendingTable() {
	clearTable();
	for(let data of matchData) {
		if(!checkType(data[1])) continue;
		let matchRow=$(`<tr id="match`+data[0]+`" class="matchRow"></tr>`);
		let idCol = $(`<td class="matchId">`+data[0]+`</td>`);
		let typeCol = $(`<td class="matchType">`+data[1]+`</td>`);
		let opponentCol = $(`<td class="matchOpponent">`+data[3]+`</td>`);
		let tierCol = $(`<td class="matchTier">`+data[4]+`</td>`);
		let roomCol = $(`<td class="matchButtons"></td>`);
		let inviteCol = $(`<td class="matchButtons"></td>`);
		let pingCol = $(`<td class="matchButtons"></td>`);
		let winCol = $(`<td class="matchButtons"></td>`);
		let loseCol = $(`<td class="matchButtons"></td>`);
		let drawCol = $(`<td class="matchButtons"></td>`);

		let roomButton = $(`<div class="clickAble"><i aria-hidden="true" class="fa fa-home"></i></div>`)
		.click(function () {
			hostRoom(data);
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
			copyToClipboard("<@"+data[2]+"> ");
		})
		.popover({
			placement: "bottom",
			content: "Copy discord id to clipboard",
			trigger: "hover"
		});
		pingCol.append(pingButton);

		let winButton = $(`<div class="clickAble">💪</div>`)
		.click(function () {
			copyToClipboard("m!r "+data[0]+" "+selfName);
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		winCol.append(winButton);
		let loseButton = $(`<div class="clickAble">💀</div>`)
		.click(function () {
			copyToClipboard("m!r "+data[0]+" "+data[3]);
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		loseCol.append(loseButton);
		let drawButton = $(`<div class="clickAble">😓</div>`)
		.click(function () {
			copyToClipboard("m!r "+data[0]+" draw");
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		drawCol.append(drawButton);

		matchRow.append(idCol);
		matchRow.append(typeCol);
		matchRow.append(opponentCol);
		matchRow.append(tierCol);
		matchRow.append(roomCol);
		matchRow.append(inviteCol);
		matchRow.append(pingCol);
		matchRow.append(winCol);
		matchRow.append(loseCol);
		matchRow.append(drawCol);

		ladderWindowTable.append(matchRow);
	}

	updateOpponentOnlineState()
}
function updateCompletedTable() {
	clearTable();
	for(let data of completedData) {
		if(!checkType(data[1])) continue;
		let matchRow=$(`<tr id="match`+data[0]+`" class="matchRow"></tr>`);
		let idCol = $(`<td class="matchId">`+data[0]+`</td>`);
		let typeCol = $(`<td class="matchType">`+data[1]+`</td>`);
		let opponentCol = $(`<td class="matchOpponent">`+data[2]+`</td>`);
		let tierCol = $(`<td class="matchTier">`+data[3]+`</td>`);
		let resultCol = $(`<td class="matchResult">`+data[4]+`</td>`);

		matchRow.append(idCol);
		matchRow.append(typeCol);
		matchRow.append(opponentCol);
		matchRow.append(tierCol);
		matchRow.append(resultCol);
		if(data[4].toLowerCase()===selfName.toLowerCase()) {
			matchRow.addClass("onlineOpponent");
		}
		else if(data[4].toLowerCase()===data[2].toLowerCase()) {
			matchRow.addClass("offlineOpponent");
		}

		ladderWindowTable.append(matchRow);
	}
}
function updateOpponentOnlineState() {
	if(tableViewMode!==0) return;
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

	if(type.includes('randomtag')) {
		settings={
			"diamond":[0,40],
			"platinum":[0,40],
			"gold":[0,60],
			"silver":[0,100],
			"bronze":[20,100],
		};
	}
	if(type.includes('random')) {
		settings={"diamond":[0,100],"platinum":[0,100],"gold":[10,100],"silver":[20,100],"bronze":[30,100]};
	}
	else if(type.includes('list')) {
		settings={"diamond":[0,40],"platinum":[0,40],"gold":[0,40],"silver":[0,60],"bronze":[0,100]};
	}
	else if(type.includes('1000')) {
		settings={"diamond":[0,40],"platinum":[0,40],"gold":[0,60],"silver":[0,100],"bronze":[20,100]};
	}
	else if(type.includes('lotsofsongs')) {
		settings={
			"diamond":[0,60],
			"platinum":[0,60],
			"gold":[0,60],
			"silver":[0,100],
			"bronze":[20,100],
		};
	}
	else if(type.includes('2011to2020')) {
		settings={
			"diamond":[0,40],
			"platinum":[0,40],
			"gold":[0,60],
			"silver":[0,100],
			"bronze":[20,100],
		};
	}
	else if(type.includes('2001to2010')) {
		settings={
			"diamond":[0,100],
			"platinum":[0,100],
			"gold":[10,100],
			"silver":[20,100],
			"bronze":[30,100],
		};
	}
	else if(type.includes('1944to2000')) {
		settings={
			"diamond":[0,100],
			"platinum":[0,100],
			"gold":[10,100],
			"silver":[20,100],
			"bronze":[30,100],
		};
	}
	return settings[tier];
}
function hostRoom(data) {
	var type=data[1];
	var tier=data[4];
	var matchid=data[0];
	var extra=data[5];

	if(viewChanger.currentView!=="roomBrowser" && !(lobby.inLobby && lobby.isHost) ) return;
	type=type.toLowerCase();
	tier=tier.toLowerCase();

	hostModal.setModeHostGame();
	var roomSettings={};
	roomSettings=JSON.parse(JSON.stringify(hostModal.DEFUALT_SETTINGS));
	roomSettings.roomName=`IHI #${matchid}`;
	roomSettings.privateRoom=true;
	roomSettings.password=`ladder`;
	roomSettings.roomSize=2;
	if(type.includes('random') || type.includes('2011to2020') || type.includes('2001to2010') || type.includes('1944to2000') ) {
		roomSettings.songSelection.advancedValue.watched=0;
		roomSettings.songSelection.advancedValue.unwatched=0;
		roomSettings.songSelection.advancedValue.random=20;
	}
	else {
		roomSettings.songSelection.advancedValue.watched=20;
		roomSettings.songSelection.advancedValue.unwatched=0;
		roomSettings.songSelection.advancedValue.random=0;
	}
	roomSettings.songDifficulity.advancedOn=true;
	roomSettings.songDifficulity.advancedValue=getDifficulty(type,tier);
	roomSettings.songType.standardValue.inserts=true;

	if(type.includes('opening')) {
		roomSettings.songType.standardValue.endings=false;
		roomSettings.songType.standardValue.inserts=false;
	}
	else if(type.includes('ending')) {
		roomSettings.songType.standardValue.openings=false;
		roomSettings.songType.standardValue.inserts=false;
	}
	else if(type.includes('insert')) {
		roomSettings.songType.standardValue.openings=false;
		roomSettings.songType.standardValue.endings=false;
	}
	if(type.includes('2011to2020')) {
		roomSettings.vintage.standardValue.years=[2011,2020];
	}
	else if(type.includes('2001to2010')) {
		roomSettings.vintage.standardValue.years=[2001,2010];
	}
	else if(type.includes('1944to2000')) {
		roomSettings.vintage.standardValue.years=[1944,2000];
	}
	else if(type.includes('tag')) {
		var tagid=hostModal.tagFilter.awesomepleteInstance._list.find(x=>x['name']==extra)['id'].toString();
		roomSettings.tags=[{'id':tagid,'state':1}];
	}
	hostModal.changeSettings(roomSettings);

	setTimeout(()=>{
		if(viewChanger.currentView==="roomBrowser") roomBrowser.host();
		else lobby.changeGameSettings();
	},1);
}

function arrayToLower(arr) {
	return arr.join('|').toLowerCase().split('|');
}

function isOnline(username) {
	username=username.toLowerCase();
	if($.inArray(username,arrayToLower(socialTab.onlineFriends))>-1) return true;
	return $.inArray(username,arrayToLower(Object.keys(socialTab.allPlayerList._playerEntries)))>-1;
}

var matchData=[];
var completedData=[];
function sendRequest() {
	let remainedTime=lastRequest+60000-Date.now();
	if(remainedTime>0) {
		updateLadderMessage("You can update after "+Math.ceil(remainedTime*.001)+" sec");
		return;
	}
	lastRequest=Date.now();
	updateLadderMessage("Receiving data...");

	GM_xmlhttpRequest({
		method: "POST",
		url: "https://script.google.com/macros/s/AKfycbyoBo5WyPqYYGTYMBWfOpFlSJp9g3X9E6SXZghko0LGrfnj2G9T/exec",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		data: "cm=user2&user="+selfName,
		onload: function (response) {
			var res=JSON.parse(response.responseText);
			matchData=res.data;
			matchData.sort(function(a,b){return a[0]*1-b[0]*1;});
			completedData=res.completed;
			updateLadderWindow();
			updateLadderMessage("Update completed on "+new Date().toLocaleTimeString());
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

new Listener("friend state change", function (change) {
	setTimeout(() => {updateOpponentOnlineState();},1);
}).bindListener();
new Listener("online user change", function (change) {
	setTimeout(() => {updateOpponentOnlineState();},1);
}).bindListener();
new Listener("all online users", function (change) {
	setTimeout(() => {updateOpponentOnlineState();},1);
}).bindListener();

function dockeyup(event) {
	if(event.altKey && event.keyCode==76) {
		if (ladderWindow.isVisible()) {
			ladderWindow.close();
		}
		else {
			openLadderWindow();
		}
	}
}
document.addEventListener('keyup', dockeyup, false);

AMQ_addScriptData({
	name: "Ladder Assist",
	author: "nyamu",
	description: `
	<p>This script is written to make IHI ladder game more comfortable.</p>
	<p>You can open and close ladder info window by pressing [ALT+L].</p>
	<p>Cloud button is for updating data manually. You can update by clicking it. It will receive match data from spreadsheet. Updating data takes a few seconds. just wait. It recieves data automatically when ladder window is opened first time only.</p>
	<p>It shows your matches to play when match data is received.</p>
	<p>Opponents of green rows are online, opponents of red rows are offline.</p>
	<p>Tier is lower one of two.</p>
	<p>R column button is for making room and changing settings. If you clicked it when you are outside of room, it makes room with match type and tier settings. If you clicked it when you are in a room and you are host, it changes settings.</p>
	<p>I column button is for inviting opponent. You can invite opponent by clicking it. it works when you are in a room and opponent is online.</p>
	<p>P column button is for copying opponent's discord id to clipboard. It is useful for pinging opponent.</p>
	<p>W/L/D column buttons are for copying Win/Lose/Draw report command to clipboard. It is just for copying text. It doesn't report automatically.</p>
	<p>Phone button on the left side of cloud button is for copying all opponent's discord id to clipboard. It is useful for pinging all opponents.</p>
	`
});
AMQ_addStyle(`
	#ladderWindowPanel {
		border-bottom: 1px solid #6d6d6d;
	}
	.ladderPanelButton {
		float: right;
		margin-top: 5px;
		margin-right: 7px;
		padding: 5px 7px;
	}
	#tableViewMode {
		width: 184px;
		color: black;
		float: right;
		margin-top: 5px;
		margin-right: 7px;
		padding: 5px 7px;
	}
	.ladderPanelMessage {
		width: 120px;
		margin: 3px 3px 5px 5px;
		height: 30px;
		text-overflow: ellipsis;
		float: left;
	}
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
	.matchButtons {
		min-width: 20px;
	}
	.matchResult {
		min-width: 80px;
	}
	.onlineOpponent {
		background-color: rgba(0, 200, 0, 0.07);
	}
	.offlineOpponent {
		background-color: rgba(255, 0, 0, 0.07);
	}
	#qpLadderButton {
		width: 30px;
		height: 100%;
		margin-right: 5px;
	}
`);

// ==UserScript==
// @name         AMQ Ladder Assist
// @namespace    https://github.com/nyamu-amq
// @version      0.25
// @description  
// @author       nyamu
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @match        https://animemusicquiz.com/*
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqWindows.js
// @require      https://github.com/amq-script-project/AMQ-Scripts/raw/master/gameplay/amqGetOriginalNameUtility.user.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return
}

//this function mandates the order of the elements in the "Pending" tables, reorder the lines to change the order

function pendingTableOrder(data) {
	return [
		data.idCol,
		data.typeCol,
		data.opponentCol,
		data.tierCol,
		data.roomCol,
		data.inviteCol,
		data.pingCol,
		data.winCol,
		data.loseCol,
		data.drawCol
	]
}

//this function mandates the order of the elements in the "Completed" tables, reorder the lines to change the order
function completedTableOrder(data){
	return [
		data.idCol,
		data.typeCol,
		data.opponentCol,
		data.tierCol,
		data.resultCol
	]
}

//this is the matchtypes array
//it consists of array containing three strings
//the first value is for checkType, this is a substring of the second value, but is ultimately limited by the source of data
//the second is for the selection value, which will be compared to checkType
//The third is the value displayed to the user for the selection

const matchTypesArray = [
	["list", "listall", "List All"],
	["list", "listops", "List Ops"],
	["list", "listeds", "List Eds"],
	["list", "listins", "List Ins"],
	["random", "randomall", "Random All"],
	["random", "randomops", "Random Ops"],
	["random", "randomeds", "Random Eds"],
	["random", "randomins", "Random Ins"],
	["1000", "top1000", "Top1000Anime"],
	["lotsofsongs", "lotsofsongs", "LotsOfSongs"],
	["2011to2020", "2011to2020", "2011to2020"],
	["2001to2010", "2001to2010", "2001to2010"],
	["1944to2000", "1944to2000", "1944to2000"],
	["randomtag", "randomtag", "RandomTag"],
	["tagbattle", "tagbattle", "TagBattle"],
	["movies", "movies", "Movies"]
]

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
			const users = Array.from(new Set(matchData.map(data => data[2]))).map(discordId => `<@${discordId}>`);
			if(users.length)
				copyToClipboard(users.join(" ")+" ");
		})
		.popover({
			placement: "bottom",
			content: "Copy discord id of all opponents to clipboard",
			trigger: "hover",
			container: "body",
			animation: false
		})
	);
	const tableView = $(`<select id="tableViewMode"></select>`);
	const matchTypes = matchTypesArray.map(entry => [entry[1], entry[2]]);
	const optionConstructor = (valueStart, valueNameStart) => (valueEnd, valueNameEnd) => $(`<option value="${valueStart}${valueEnd}">${valueNameStart} ${valueNameEnd}</option>`);
	tableView.append($(`<option value="pending" selected>All Pending Matches</option>`));
	matchTypes.forEach(entry => tableView.append(optionConstructor("pending", "Pending")(entry[0], entry[1])));
	tableView.append($(`<option value="completed">All Completed Matches</option>`));
	matchTypes.forEach(entry => tableView.append(optionConstructor("completed", "Completed")(entry[0], entry[1])));
	tableView.change(function () {
		ChangeTableMode();
	})


	ladderWindow.panels[0].panel
	.append(tableView)
	.append($(`<div class="ladderPanelMessage"></div>`));

	ladderWindowTable = $(`<table id="ladderWindowTable" class="table floatingContainer"></table>`);
	ladderWindow.panels[1].panel.append(ladderWindowTable);

	clearTable();
}
function checkType(type) {
	type=type.toLowerCase();
	const includesArray = matchTypesArray.map(entry => entry[0]);
	const endsWithArray = [
		["ops", "opening"],
		["eds", "ending"],
		["ins", "insert"],
		["all", "all"]
	];
	//const includesCheck = (entry => !strMode.includes(entry) || (strMode.includes(entry) && type.includes(entry)));
	//const endsWithCheck = (entry => !strMode.includes(entry[0]) || (strMode.includes(entry[0]) && type.includes(entry[1])));
	//return includesArray.every(includesCheck) && endsWithArray.every(endsWithCheck)
	for(let i = 0; i < includesArray.length; i++){
		const entry = includesArray[i]
		if(strMode.includes(entry)) {
			if(!type.includes(entry)) return false;
			else break;
		}
	}
	for(let i = 0; i < endsWithArray.length; i++){
		const [modeValue, typeValue] = endsWithArray[i]
		if(strMode.includes(modeValue)) {
			if(!type.includes(typeValue)) return false;
			else break;
		}
	}
	return true;
}


function clearTable() {
	ladderWindowTable.children().remove();
	const header = $(`<tr class="header"></tr>`)
	const idCol = $(`<td class="matchId"><b>ID#</b></td>`);
	const typeCol = $(`<td class="matchType"><b>Type<b></td>`);
	const opponentCol = $(`<td class="matchOpponent"><b>Opponent</b></td>`);
	const tierCol = $(`<td class="matchTier"><b>Tier</b></td>`);
	
	const appendHeader = entry => header.append(entry);

	if(tableViewMode === 0) {
		const matchButton = letter => $(`<td class="matchButtons"><b>${letter}</b></td>`);
		const roomCol   = matchButton("R");
		const inviteCol = matchButton("I");
		const pingCol   = matchButton("P");
		const winCol    = matchButton("W");
		const loseCol   = matchButton("L");
		const drawCol   = matchButton("D");
		pendingTableOrder({
			idCol,
			typeCol,
			opponentCol,
			tierCol,
			roomCol,
			inviteCol,
			pingCol,
			winCol,
			loseCol,
			drawCol
		}).forEach(appendHeader);
	}
	else {
		const resultCol = $(`<td class="matchResult"><b>Result</b></td>`);
		completedTableOrder({
			idCol,
			typeCol,
			opponentCol,
			tierCol,
			resultCol
		}).forEach(appendHeader);
	}

	ladderWindowTable.append(header);
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
	for(const data of matchData) {
		const [matchId, matchType, opponentDiscordId, opponentName, tier] = data
		if(!checkType(matchType)) continue;

		const matchRow = $(`<tr id="match${matchId}" class="matchRow"></tr>`);

		const idCol = $(`<td class="matchId">${matchId}</td>`);
		const typeCol = $(`<td class="matchType">${matchType}</td>`);
		const opponentCol = $(`<td class="matchOpponent">${opponentName}</td>`);
		const tierCol = $(`<td class="matchTier">${tier}</td>`);

		const matchButtonContainer = () => $(`<td class="matchButtons"></td>`);
		const clickableButton = text => $(`<div class="clickAble">${text}</div>`);

		const roomCol = matchButtonContainer();
		const roomButton = clickableButton(`<i aria-hidden="true" class="fa fa-home"></i>`)
		.click(function () {
			hostRoom(data);
		})
		.popover({
			placement: "bottom",
			content: "Host Room or Change Settings",
			trigger: "hover"
		});
		roomCol.append(roomButton);

		const inviteCol = matchButtonContainer();
		const inviteButton = clickableButton(`<i aria-hidden="true" class="fa fa-envelope"></i>`)
		.click(function () {
			if(isOnline(opponentName)) {
				inviteUser(opponentName);
			}
		})
		.popover({
			placement: "bottom",
			content: `Invite ${opponentName}`,
			trigger: "hover"
		});
		inviteCol.append(inviteButton);

		const pingCol = matchButtonContainer();
		const pingButton = clickableButton(`<i aria-hidden="true" class="fa fa-phone"></i>`)
		.click(function () {
			copyToClipboard(`<@${opponentDiscordId}> `);
		})
		.popover({
			placement: "bottom",
			content: "Copy discord id to clipboard",
			trigger: "hover"
		});
		pingCol.append(pingButton);

		const winCol = matchButtonContainer();
		const winButton = clickableButton(`💪`)
		.click(function () {
			copyToClipboard(`m!r ${matchId} ${selfOriginalname}`);
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		winCol.append(winButton);

		const loseCol = matchButtonContainer();
		const loseButton = clickableButton(`💀`)
		.click(function () {
			copyToClipboard(`m!r ${matchId} ${opponentName}`);
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		loseCol.append(loseButton);

		const drawCol = matchButtonContainer();
		const drawButton = clickableButton(`😓`)
		.click(function () {
			copyToClipboard(`m!r ${matchId} draw`);
		})
		.popover({
			placement: "bottom",
			content: "Copy report command to clipboard",
			trigger: "hover"
		});
		drawCol.append(drawButton);

		pendingTableOrder({
			idCol,
			typeCol,
			opponentCol,
			tierCol,
			roomCol,
			inviteCol,
			pingCol,
			winCol,
			loseCol,
			drawCol
		}).forEach(entry => matchRow.append(entry))

		ladderWindowTable.append(matchRow);
	}

	updateOpponentOnlineState()
}

function updateCompletedTable() {
	clearTable();
	for(const data of completedData) {
		const [matchId, matchType, opponentName, tier, winnerName] = data
		if(!checkType(matchType)) continue;
		const matchRow = $(`<tr id="match${matchId}" class="matchRow"></tr>`);
		const idCol = $(`<td class="matchId">${matchId}</td>`);
		const typeCol = $(`<td class="matchType">${matchType}</td>`);
		const opponentCol = $(`<td class="matchOpponent">${opponentName}</td>`);
		const tierCol = $(`<td class="matchTier">${tier}</td>`);
		const resultCol = $(`<td class="matchResult">${winnerName}</td>`);

		completedTableOrder({
			idCol,
			typeCol,
			opponentCol,
			tierCol,
			resultCol
		}).forEach(entry => matchRow.append(entry))

		if(winnerName.toLowerCase() === selfOriginalname.toLowerCase()) {
			matchRow.addClass("onlineOpponent");
		}
		else if(winnerName.toLowerCase() === opponentName.toLowerCase()) {
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
	var tiers={"diamond":0, "platinum":1, "gold":2, "silver":3, "bronze":4};
	var settings=JSON.parse(allSettings[type]['difficulties']);
	return settings[tiers[tier]];
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
	roomSettings=hostModal._settingStorage._serilizer.decode(allSettings[type]['settings']);
	roomSettings.roomName=`IHI #${matchid}`;
	roomSettings.privateRoom=true;
	roomSettings.password=`ladder`;
	roomSettings.roomSize=2;
	roomSettings.songDifficulity.advancedOn=true;
	roomSettings.songDifficulity.advancedValue=getDifficulty(type,tier);

	if(type.includes('randomtag')) {
		var tagid=hostModal.tagFilter.awesomepleteInstance._list.find(x=>x['name']==extra)['id'].toString();
		roomSettings.tags=[{'id':tagid,'state':1}];
	}
	hostModal.changeSettings(roomSettings);

	setTimeout(()=>{
		if(viewChanger.currentView==="roomBrowser") roomBrowser.host();
		else lobby.changeGameSettings();
		if(type.includes('tagbattle'))
            gameChat.systemMessage('TagBattle : Each player should choose one Negative tag, and then choose one Optional tag once both Negative tags have been decided.');
	},1);
}

function arrayToLower(arr) {
	return arr.map(entry => typeof entry === "string"?entry.toLowerCase():entry.toString());
}

function isOnline(username) {
	username = username.toLowerCase();
	return arrayToLower(socialTab.onlineFriends).includes(username) ||
		arrayToLower(Object.keys(socialTab.allPlayerList._playerEntries)).includes(username);
}

var receivingdata=false;
var matchData=[];
var completedData=[];
var selfOriginalname;
async function sendRequest() {
	if(receivingdata) return;
	let remainedTime=lastRequest+10000-Date.now();
	if(remainedTime>0) {
		updateLadderMessage("You can update after "+Math.ceil(remainedTime*.001)+" sec");
		return;
	}
	lastRequest=Date.now();
	updateLadderMessage("Receiving data...");
	receivingdata=true;
	if(!selfOriginalname) {
		selfOriginalname=await getOriginalName(selfName);
	}
	GM_xmlhttpRequest({
		method: "POST",
		url: "https://script.google.com/macros/s/AKfycbyhdVkXeRKdgoFsBQShG3uiA0CsOogD5ZS0o40_5ViKLN7xOIHNlL4wiA/exec",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		data: "cm=user3&user="+selfOriginalname,
		onload: function (response) {
			var res=JSON.parse(response.responseText);
			matchData=res.data;
			matchData.sort(function(a,b){return a[0]*1-b[0]*1;});
			completedData=res.completed;
			allSettings=res.settings;
			updateLadderWindow();
			updateLadderMessage("Update completed on "+new Date().toLocaleTimeString());
			receivingdata=false;
		},
		onerror: function (response) {
			updateLadderMessage("error... try again");
			console.log(response.responseText);
			receivingdata=false;
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
	if(event.altKey && event.key === "L") {
		if (ladderWindow.isVisible()) {
			ladderWindow.close();
		}
		else {
			openLadderWindow();
		}
	}
}
document.addEventListener('keyup', dockeyup, false);

var allSettings={};



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

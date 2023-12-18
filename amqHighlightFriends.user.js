// ==UserScript==
// @name         AMQ Highlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.35
// @description  Apply color to name of yourself and friends. and more
// @author       nyamu, ensorcell
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqWindows.js
// @downloadURL  https://github.com/nyamu-amq/amq_scripts/raw/master/amqHighlightFriends.user.js
// @updateURL    https://github.com/nyamu-amq/amq_scripts/raw/master/amqHighlightFriends.user.js


// ==/UserScript==

if (document.getElementById('startPage')) {
	return;
}

let colorSettingData = [
	{
		id:"smColorTable",
		rows:
		[
			{
				columns:[
					{
						width: 60,
						label: ""
					},
					{
						width: 60,
						label: "Color"
					},
					{
						width: 70,
						label: "Shadow"
					},
					{
						width: 70,
						label: "Scorebox"
					},
					{
						width: 50,
						label: "Name"
					},
					{
						width: 50,
						label: "Score"
					},
					{
						width: 50,
						label: "Level"
					},
					{
						width: 50,
						label: "Chat"
					},
					{
						width: 50,
						label: "Spec&Lobby"
					}
				]
			},
			{
				height:30,
				columns:[
					{
						label: "Self"
					},
					{
						id: "smColorSelfColor",
						type: "color"
					},
					{
						id: "smColorSelfShadow",
						type: "color"
					},
					{
						id: "smColorSelfScorebox",
						type: "checkbox"
					},
					{
						id: "smColorSelfName",
						type: "checkbox"
					},
					{
						id: "smColorSelfPoint",
						type: "checkbox"
					},
					{
						id: "smColorSelfLevel",
						type: "checkbox"
					},
					{
						id: "smColorSelfChat",
						type: "checkbox"
					},
					{
						id: "smColorSelfSpec",
						type: "checkbox"
					}
				]
			},
			{
				height:30,
				columns:[
					{
						label: "Friend"
					},
					{
						id: "smColorFriendColor",
						type: "color"
					},
					{
						id: "smColorFriendShadow",
						type: "color"
					},
					{
						id: "smColorFriendScorebox",
						type: "checkbox"
					},
					{
						id: "smColorFriendName",
						type: "checkbox"
					},
					{
						id: "smColorFriendPoint",
						type: "checkbox"
					},
					{
						id: "smColorFriendLevel",
						type: "checkbox"
					},
					{
						id: "smColorFriendChat",
						type: "checkbox"
					},
					{
						id: "smColorFriendSpec",
						type: "checkbox"
					}
				]
			}
		]
	},
	{
		id:"smSystemColorTable",
		rows:
		[
			{
				columns:
				[
					{
						width: 90,
						colspan: 2 ,
						label: "Join"
					},
					{
						width: 90,
						colspan: 2 ,
						label: "Spec"
					},
					{
						width: 90,
						colspan: 2 ,
						label: "Leave"
					}
				]
			},
			{
				height:60,
				columns:
				[
					{
						id: "smColorJoin",
						type: "checkbox"
					},
					{
						id: "smColorJoinColor",
						type: "color"
					},
					{
						id: "smColorSpec",
						type: "checkbox"
					},
					{
						id: "smColorSpecColor",
						type: "color"
					},
					{
						id: "smColorLeave",
						type: "checkbox"
					},
					{
						id: "smColorLeaveColor",
						type: "color"
					}
				]
			}
        ]
    },
    {
        id:"smDisableRankedRewardEffects",
        rows:
        [
			{
				columns:
				[
					{
						colspan: 4,
						label: "Disable Ranked Reward Effects"
					}
				]
			},
			{
				height:30,
				columns:
				[
					{
                        width: 60,
						label: "Color",
					},
					{
                        width: 60,
						label: "Glow",
					},
					{
                        width: 120,
						label: "Friend Color",
					},
					{
                        width: 120,
						label: "Friend Glow",
					},
					{
                        width: 200,
						label: "Override Ranked Color",
					}
				]
			},
			{
				height:30,
				columns:
				[
					{
						id: "smRemoveColor",
						type: "checkbox",
						val: false
					},
					{
						id: "smRemoveGlow",
						type: "checkbox",
						val: false
					},
					{
						id: "smRemoveFriendColor",
						type: "checkbox",
						val: false
					},
					{
						id: "smRemoveFriendGlow",
						type: "checkbox",
						val: false
					},
					{
						id: "smOverrideRankedColor",
						type: "checkbox",
						val: false
					}
				]
			}
		]
	}
];

var saveData = {
	"smColorSelfColor":"#80c7ff",
	"smColorFriendColor":"#80ff80",
	"smColorSelfShadow":"#228dff",
	"smColorFriendShadow":"#40ff40",
	"smColorJoinColor":"#8080ff",
	"smColorSpecColor":"#ffff80",
	"smColorLeaveColor":"#ff8080",
};

function saveSettings() {
	localStorage.setItem("highlightFriendsSettings", JSON.stringify(saveData));
}

// load settings from local storage
function loadSettings() {
// load settings, if nothing is loaded, use default settings
	let loadedSettings = localStorage.getItem("highlightFriendsSettings");
	if (loadedSettings !== null) {
		saveData = JSON.parse(loadedSettings);
	}
}
function getSaveData(key, defaultvalue) {
	if(!saveData.hasOwnProperty(key)) return defaultvalue;
	return saveData[key];
}
function setSaveData(key, value) {
	saveData[key]=value;
	saveSettings();
}

function setSavedSettingsIfCookieExists(sdkey, cookiekey) {
	let cookievalue=Cookies.get(cookiekey);
	if(!cookievalue) return false;
	saveData[sdkey]=cookievalue;
	return true;
}

function cookies2SavedData() {
	if(!setSavedSettingsIfCookieExists("smColorSelfColor","smColorSelfColor")) {
		if(!setSavedSettingsIfCookieExists("smColorSelfColor","smColorSelfName")) {
			loadSettings();
			return;
		}
	}
	if(!setSavedSettingsIfCookieExists("smColorFriendColor","smColorFriendColor")) {
		setSavedSettingsIfCookieExists("smColorFriendColor","smColorFriendName");
	}
	setSavedSettingsIfCookieExists("smColorSelfShadow","smColorSelfShadow");
	setSavedSettingsIfCookieExists("smColorFriendShadow","smColorFriendShadow");

	setSavedSettingsIfCookieExists("smColorJoinColor","smColorJoinColor");
	setSavedSettingsIfCookieExists("smColorSpecColor","smColorSpecColor");
	setSavedSettingsIfCookieExists("smColorLeaveColor","smColorLeaveColor");

	for(let table of colorSettingData) {
		for (let row of table.rows) {
			for (let column of row.columns) {
				if(column.type==="checkbox") {
					let value=Cookies.get(column.id);
					if(value!==undefined) {
						saveData[column.id]=value==="true";
						deleteCookie(column.id);
					}
				}
			}
		}
	}

	deleteCookie("smColorSelfColor");
	deleteCookie("smColorSelfName");
	deleteCookie("smColorFriendColor");
	deleteCookie("smColorFriendName");
	deleteCookie("smColorSelfShadow");
	deleteCookie("smColorFriendShadow");
	deleteCookie("smColorJoinColor");
	deleteCookie("smColorSpecColor");
	deleteCookie("smColorLeaveColor");

	saveSettings();
}

function deleteCookie(key) {
	Cookies.set(key, "", { expires: 0 });
}

cookies2SavedData();

let playerSummaryWindow;
let playerSummaryWindowTable;
let playerSummaryWindowOpenButton;
function createPlayerSummaryWindow() {
	playerSummaryWindow = new AMQWindow({
		title: "Player Summary",
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

	playerSummaryWindow.addPanel({
		id: "playerSummaryWindowTableContainer",
		width: 1.0,
		height: "calc(100%)",
		scrollable: {
			x: false,
			y: true
		}
	});

	playerSummaryWindowTable = $(`<table id="playerSummaryWindowTable" class="table floatingContainer"></table>`);
	playerSummaryWindow.panels[0].panel.append(playerSummaryWindowTable);

	clearTable();

	playerSummaryWindowOpenButton = $(`<div id="qpPlayerSummaryButton" class="clickAble qpOption"><i aria-hidden="true" class="fa fa-users qpMenuItem"></i></div>`)
		.click(function () {
			if(playerSummaryWindow.isVisible()) {
				$(".rowSelected").removeClass("rowSelected");
				playerSummaryWindow.close();
			}
			else {
				playerSummaryWindow.open();
			}
		})
		.popover({
			placement: "bottom",
			content: "Player Summary",
			trigger: "hover"
	});

	let oldWidth = $("#qpOptionContainer").width();
	$("#qpOptionContainer").width(oldWidth + 35);
	$("#qpOptionContainer > div").append(playerSummaryWindowOpenButton);
}
function clearTable() {
	playerSummaryWindowTable.children().remove();

	playerSummaryWindow.setTitle(isMassivePlayerMode()?"Friend Summary":"Player Summary");

	let header = $(`<tr class="header"></tr>`)
	let rankCol = $(`<td class="fstRank"><b>Rank</b></td>`);
	let scoreCol = $(`<td class="fstScore"><b>Score<b></td>`);
	let nameCol = $(`<td class="fstName"><b>Name</b></td>`);
	let boxCol = $(`<td class="fstBox"><b>Box</b></td>`);
	let answerCol = $(`<td class="fstAnswer"><b>Last Answer</b></td>`);

	header.append(rankCol);
	header.append(scoreCol);
	header.append(nameCol);
	header.append(boxCol);
	header.append(answerCol);
	playerSummaryWindowTable.append(header);
}

createPlayerSummaryWindow();

$(document.documentElement).keydown(function (event) {
	if (event.which === 145) {
		if (playerSummaryWindow.isVisible()) {
			playerSummaryWindow.close();
		}
		else {
			playerSummaryWindow.open();
		}
	}
});

let quizReadyListener = new Listener("quiz ready", (data) => {
	clearTable();
});

function updatePlayerRow(player) {
	let row=playerSummaryWindowTable.find("#friendScore"+player.gamePlayerId);
	let isScoreLife=(quiz.gameMode==="Battle Royale" || quiz.gameMode==="Last Man Standing");

	if(row.length==0) {
		let playerrow=$(`<tr id="friendScore`+player.gamePlayerId+`" class="friendScore clickAble"></tr>`);
		let rankCol = $(`<td class="fstRank">`+(player.position===undefined?1:player.position)+`</td>`);
		let scoreCol = $(`<td class="fstScore"></td>`);
		if(isScoreLife) {
			scoreCol.text( (player.score===undefined?hostModal.lifeSliderCombo.getValue():player.score) +
				" ("+ (player.correctGuesses===undefined?0:player.correctGuesses) +")");
		}
		else scoreCol.text(player.score===undefined?0:player.score);
		let nameCol = $(`<td class="fstName">`+quiz.players[player.gamePlayerId]._name+`</td>`);
		let boxCol = $(`<td class="fstBox">`+findBoxById(player.gamePlayerId)+`</td>`);
		let answerCol = $(`<td class="fstAnswer">`+quiz.players[player.gamePlayerId].avatarSlot.$answerContainerText.text()+`</td>`);
		playerrow.append(rankCol);
		playerrow.append(scoreCol);
		playerrow.append(nameCol);
		playerrow.append(boxCol);
		playerrow.append(answerCol);
		playerrow.click(function () {
			SelectAvatarGroup($(this).find(".fstBox").text());
		});
		playerSummaryWindowTable.append(playerrow);

		row=playerSummaryWindowTable.find("#friendScore"+player.gamePlayerId)[0];
	}
	else {
		row=row[0];
		if(player.position!==undefined) $(row).find(".fstRank").text(player.position);

		if(player.score!==undefined) $(row).find(".fstScore").text(player.score);
		if(isScoreLife) {
			$(row).find(".fstScore").text( (player.score===undefined?hostModal.lifeSliderCombo.getValue():player.score) +
				" ("+ (player.correctGuesses===undefined?0:player.correctGuesses) +")");
		}
		else $(row).find(".fstScore").text(player.score===undefined?0:player.score);

		$(row).find(".fstBox").text(findBoxById(player.gamePlayerId));
		$(row).find(".fstAnswer").text(quiz.players[player.gamePlayerId].avatarSlot.$answerContainerText.text());
	}
	if(player.correct===undefined) {
		$(row).removeClass("correctGuess");
		$(row).removeClass("incorrectGuess");
	}
	else if(player.correct===true) {
		$(row).addClass("correctGuess");
		$(row).removeClass("incorrectGuess");
	}
	else {
		$(row).removeClass("correctGuess");
		$(row).addClass("incorrectGuess");
	}
}

function findBoxById(id) {
	let object=quiz.avatarContainer._groupSlotMap;
	return Object.keys(object).find(key => object[key].indexOf(id) !==-1);
}

function isMassivePlayerMode() {
	return quiz.gameMode == "Ranked" || quiz.gameMode =="Annivesary"
}

function updateFriendTable(players) {
	setTimeout(() => {
		if(viewChanger.currentView!=="quiz") return;
		players.forEach((player) => {
			if(quiz.players[player.gamePlayerId]) {
				if(!isMassivePlayerMode() || socialTab.isFriend(quiz.players[player.gamePlayerId]._name) || quiz.players[player.gamePlayerId]._name==selfName)
					updatePlayerRow(player);
			}
		});
		let rows=playerSummaryWindowTable.find(".friendScore");
		$(rows).sort(function(a,b){
			let _a=($(a).find(".fstBox").text()*10000)+($(a).find(".fstRank").text()*1);
			let _b=($(b).find(".fstBox").text()*10000)+($(b).find(".fstRank").text()*1);
			return (_a - _b);
		}).appendTo(playerSummaryWindowTable);
	},1);
}

new Listener("Spectate Game", (data) => {
	if(!data.error) {
		if(data.quizState) {
			if(data.settings.gameMode === 'Battle Royale' && data.quizState.state === quiz.QUIZ_STATES.BATTLE_ROYAL) return;
			updateFriendTable(data.quizState.players);
		}
	}
}).bindListener();

function removeFriendFromTable(friendname) {
	if(!quiz.inQuiz) return;
	if(!isMassivePlayerMode()) return;
	let id = Object.keys(quiz.players).find(key=>quiz.players[key]._name===friendname);
	if(id!==undefined) {
		let row=playerSummaryWindowTable.find("#friendScore"+id);
		if(row!==undefined)
			row.remove();
	}
}

function removePlayerFromTable(playerid) {
	if(!quiz.inQuiz) return;
    let row=playerSummaryWindowTable.find("#friendScore"+playerid);
    if(row!==undefined)
        row.remove();
}

function removeLeftPlayer() {
	if(!quiz.inQuiz) return;

	var playeridlist=[];
	playerSummaryWindowTable.find('tr').each(function(i) {
		if(i>0) {
			playeridlist.push(Number(this.id.substring(11)));
		}
	});
	playeridlist.forEach(playerid => {
		if(playerid in quiz.players == false) {
			removePlayerFromTable(playerid);
		}
	});
}

new Listener("Game Starting", (data) => {
	updateFriendTable(Object.values(lobby.players));
}).bindListener();

new Listener("answer results", (data) => {
	setTimeout(() => {
		removeLeftPlayer();
		if(data.lateJoinPlayers) refreshColors();
		updateFriendTable(data.players);
	},1);
}).bindListener();

new Listener("player late join", (data) => {
	setTimeout(() => {
		refreshColors();
	},1);
}).bindListener();

function SelectAvatarGroup(number) {
	quiz.avatarContainer.currentGroup = number;
	quiz.scoreboard.setActiveGroup(number);
	if (Object.keys(quiz.scoreboard.groups).length > 1) {
		quiz.scoreboard.$quizScoreboardItemContainer.stop().scrollTop(quiz.scoreboard.groups[number].topOffset - 3);
	}
}


$("#settingsGraphicContainer")
	.append($("<div></div>")
		.addClass("row")
		.attr("style", "padding-top: 10px")
		.append($("<div></div>")
			.addClass("col-xs-12")
			.attr("id", "smColorSettings")
			.append($("<div></div>")
				.attr("style", "text-align: center")
				.append($("<label></label>")
					.text("ColorSettings")
				)
			)
		)
	);

$("#smColorSettings")
	.append($("<div></div>")
		.attr("id", "smColorContainer")
		.addClass("col-xs-12")
		.addClass("checkboxContainer")
		.addClass("text-center")
	);
for(let table of colorSettingData) {
	$("#smColorContainer")
		.append($("<table></table>")
			.attr("id", table.id)
	);
	for (let row of table.rows) {
		let tr=$("<tr></tr>");
		if(row.hasOwnProperty("height"))
			tr.attr("height",row.height);
		for (let column of row.columns) {
			let td=$("<td></td>");
			if(column.hasOwnProperty("width"))
				td.attr("width",column.width);
			if(column.hasOwnProperty("colspan"))
				td.attr("colspan",column.colspan);
			if(column.type=="color") {
				td.append($("<input id='" + column.id + "' type='color'>")
					.val(saveData[column.id])
				);
				td.on('change',function() {
					setTimeout(() => {
						let color=$("#"+column.id).val();
						setSaveData(column.id, color);
						ColorChanged();
					},1);
				});
			}
			else if(column.type=="checkbox") {
				let div=$('<div></div>');
				div.addClass("customCheckbox");
				let checkbox=$('<input type="checkbox" id="'+column.id+'">');
				checkbox.prop("checked", getSaveData(column.id, column.val===undefined?true:column.val));
				checkbox.click(function () {
					setTimeout(() => {
						let check=$("#"+column.id).prop("checked");
						setSaveData(column.id, check);
						ColorChanged();
					},1);
				});
				div.append(checkbox);
				div.append($('<label for="'+column.id+'"><i class="fa fa-check" aria-hidden="true"></i></label>'));
				td.append(div);
			}
			else {
				if(column.hasOwnProperty("label"))
					td.text(column.label);
			}
			tr.append(td);
		}
		$("#"+table.id).append(tr);
	}
}

function ColorChanged() {
	let selfcolor=$("#smColorSelfColor").val();
	let selfshadow=$("#smColorSelfShadow").val();
	let friendcolor=$("#smColorFriendColor").val();
	let friendshadow=$("#smColorFriendShadow").val();

	let selfscorebox=$("#smColorSelfScorebox").prop("checked");
	$(".qpsPlayerName.self").css("color", selfscorebox?selfcolor:"");
	$(".qpsPlayerName.self").css("text-shadow", selfscorebox?"0 0 10px "+selfshadow:"");
	$(".qpAvatarName.self").css("color", $("#smColorSelfName").prop("checked")?selfcolor:"");
	$(".qpAvatarLevel.self").css("color", $("#smColorSelfLevel").prop("checked")?selfcolor:"");
	$(".qpAvatarScore.self").css("color", $("#smColorSelfPoint").prop("checked")?selfcolor:"");
	$(".gcUserName.self").css("color", $("#smColorSelfChat").prop("checked")?selfcolor:"");
	$(".gcSpectatorItem.self").children("h3").css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");

	let friendscorebox=$("#smColorFriendScorebox").prop("checked");
	$(".qpsPlayerName.friend").css("color", friendscorebox?friendcolor:"");
	$(".qpsPlayerName.friend").css("text-shadow", friendscorebox?"0 0 10px "+friendshadow:"");
	$(".qpAvatarName.friend").css("color", $("#smColorFriendName").prop("checked")?friendcolor:"");
	$(".qpAvatarLevel.friend").css("color", $("#smColorFriendLevel").prop("checked")?friendcolor:"");
	$(".qpAvatarScore.friend").css("color", $("#smColorFriendPoint").prop("checked")?friendcolor:"");
	$(".gcUserName.friend").css("color", $("#smColorFriendChat").prop("checked")?friendcolor:"");
	$(".gcSpectatorItem.friend").children("h3").css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");

	$(".csmJoin").css("color", $("#smColorJoin").prop("checked")?$("#smColorJoinColor").val():"");
	$(".csmSpec").css("color", $("#smColorSpec").prop("checked")?$("#smColorSpecColor").val():"");
	$(".csmLeft").css("color", $("#smColorLeave").prop("checked")?$("#smColorLeaveColor").val():"");
}

ViewChanger.prototype.changeView = (function() {
	var old=ViewChanger.prototype.changeView;
	return function() {
		old.apply(this,arguments);
		onViewChanged();
	}
})();

function onViewChanged() {
	clearTable();
	colorScorebox();
	colorPlayers();
	colorAvatar();
	colorSpectators();
};

function colorScorebox() {
	if(!quiz.inQuiz) return;
	$(".qpsPlayerName.self").css("color", $("#smColorSelfScorebox").prop("checked")?$("#smColorSelfColor").val():"")
		.css("text-shadow", $("#smColorSelfScorebox").prop("checked")?"0 0 10px "+$("#smColorSelfShadow").val():"");
	$(".qpsPlayerName").each((index, elem) => {
		if(socialTab.isFriend($(elem).text())) {
			$(elem).addClass("friend").css("color", $("#smColorFriendScorebox").prop("checked")?$("#smColorFriendColor").val():"")
				.css("text-shadow", $("#smColorFriendScorebox").prop("checked")?"0 0 10px "+$("#smColorFriendShadow").val():"");
		}
		else if($(elem).text()!==selfName) {
			$(elem).removeClass("friend").css("color", "").css("text-shadow", "");
		}
	});
}

function colorAvatar() {
	if(!quiz.inQuiz) return;
	$(".qpAvatarName").each((index, elem) => {
		if(isSelf($(elem).text())) {
			$(elem).addClass("self")
				.css("color", $("#smColorSelfName").prop("checked")?$("#smColorSelfColor").val():"");
			let parent=$(elem).parent();
			parent.find(".qpAvatarLevelBar > .qpAvatarLevelOuter > .qpAvatarLevel")
				.addClass("self")
				.css("color", $("#smColorSelfLevel").prop("checked")?$("#smColorSelfColor").val():"");
			parent.find(".qpAvatarScoreContainer > .qpAvatarScore")
				.addClass("self")
				.css("color", $("#smColorSelfPoint").prop("checked")?$("#smColorSelfColor").val():"");
		}
		else if(isFriend($(elem).text())) {
			$(elem).addClass("friend")
				.css("color", $("#smColorFriendName").prop("checked")?$("#smColorFriendColor").val():"");
			let parent=$(elem).parent();
			parent.find(".qpAvatarLevelBar > .qpAvatarLevelOuter > .qpAvatarLevel")
				.addClass("friend")
				.css("color", $("#smColorFriendLevel").prop("checked")?$("#smColorFriendColor").val():"");
			parent.find(".qpAvatarScoreContainer > .qpAvatarScore")
				.addClass("friend")
				.css("color", $("#smColorFriendPoint").prop("checked")?$("#smColorFriendColor").val():"");
		}
		else {
			$(elem).removeClass("friend")
				.css("color", "");
			let parent=$(elem).parent();
			parent.find(".qpAvatarLevelBar > .qpAvatarLevelOuter > .qpAvatarLevel")
				.removeClass("friend")
				.css("color", "");
			parent.find(".qpAvatarScoreContainer > .qpAvatarScore")
				.removeClass("friend")
				.css("color", "");
		}
	});
}

new Listener("Game Chat Message", function (payload) {
	updateChatMessage(payload);
}).bindListener();

new Listener("game chat update", function (payload) {
	payload.messages.forEach(message => {
		updateChatMessage(message);
	});
}).bindListener();

function updateChatMessage(message) {
	if(message.sender === selfName) {
		setTimeout(() => {
			$(`#gcPlayerMessage-${message.messageId}`).find(".gcUserName")
				.addClass("self")
				.css("color", $("#smColorSelfChat").prop("checked")?$("#smColorSelfColor").val():"");
		},1);
	}
	else if (socialTab.isFriend(message.sender)) {
		setTimeout(() => {
			var gcUserName=$(`#gcPlayerMessage-${message.messageId}`).find(".gcUserName")
				.addClass("friend");
			if($("#smRemoveFriendColor").prop("checked")) gcUserName.removeClass("gcNameColor");
			if($("#smRemoveFriendGlow").prop("checked")) gcUserName.removeClass("gcNameGlow");
			if($("#smOverrideRankedColor").prop("checked") || $("#smRemoveFriendColor").prop("checked") || (!gcUserName.hasClass("gcNameColor")&&!gcUserName.hasClass("gcNameGlow")) )
				gcUserName.css("color", $("#smColorFriendChat").prop("checked")?$("#smColorFriendColor").val():"");
		},1);
	}
	else {
		setTimeout(() => {
			var gcUserName=$(`#gcPlayerMessage-${message.messageId}`).find(".gcUserName");
			if($("#smRemoveColor").prop("checked")) gcUserName.removeClass("gcNameColor");
			if($("#smRemoveGlow").prop("checked")) gcUserName.removeClass("gcNameGlow");
		},1);
	}
}

new Listener("New Spectator", function (spectator) {
	colorSpectators();
}).bindListener();

new Listener("Player Changed To Spectator", function (payload) {
	colorSpectators();
}).bindListener();

function colorSpectators(){
	if(!quiz.inQuiz && !lobby.inLobby) return;
	setTimeout(() => {$(".gcSpectatorItem").children("h3").each((index,elem)=> {
		if(isSelf($(elem).text())) {
			$(elem).parent().addClass("self")
			$(elem).css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");
		}
		else if(isFriend($(elem).text())) {
			$(elem).parent().addClass("friend")
			$(elem).css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");
		}
		else {
			$(elem).parent().removeClass("friend")
			$(elem).css("color","");
		}
	});},0);
}
function isSelf(username) {
	var s=username.indexOf('(');
	if(s>-1) {
		username=username.slice(0, s).trim();
	}
	return username===selfName;
}
function isFriend(username) {
	var s=username.indexOf('(');
	if(s>-1) {
		username=username.slice(0, s).trim();
	}
	return socialTab.isFriend(username);
}

new Listener("New Player", function(){
	colorPlayers();
}).bindListener();

new Listener("Spectator Change To Player", function(){
	colorPlayers();
}).bindListener();

function colorPlayers(){
	if(!lobby.inLobby) return;
	setTimeout(() => {$(".lobbyAvatarNameContainerInner").children("h2").each((index,elem)=> {
		if(isSelf($(elem).text())) {
			$(elem).parent().addClass("self")
			$(elem).css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");
		}
		else if(isFriend($(elem).text())) {
			$(elem).parent().addClass("friend")
			$(elem).css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");
		}
		else {
			$(elem).parent().removeClass("friend")
			$(elem).css("color", "");
		}
	});},0);
}

GameChat.prototype.systemMessage = function (title, msg) {
	let template=`
		<li{2}>
			<span>{0}</span><br>
			<div class="gcMsgIndent">{1}</div>
		</li>
	`;
	let typestr="";
	if(title.includes("started spec") || title.includes("to spec")) {
		typestr=' class="csmSpec"';
	}
	else if(title.includes("joined the") || title.includes("to player")) {
		typestr=' class="csmJoin"';
	}
	else if(title.includes("stopped spec") || title.includes("left the") || title.includes("kicked from")) {
		typestr=' class="csmLeft"';
	}
	if (!msg) {
		msg = "";
	}
	this.insertMsg(format(template, title, msg, typestr));

	$(".csmJoin").css("color", $("#smColorJoin").prop("checked")?$("#smColorJoinColor").val():"");
	$(".csmSpec").css("color", $("#smColorSpec").prop("checked")?$("#smColorSpecColor").val():"");
	$(".csmLeft").css("color", $("#smColorLeave").prop("checked")?$("#smColorLeaveColor").val():"");
};

new Listener("new friend", (friend) => {
	setTimeout(() => {
		refreshColors();
	},0);
}).bindListener();
new Listener("friend removed", (target) => {
	setTimeout(() => {
		refreshColors();
		removeFriendFromTable(target.name);
	},0);
}).bindListener();

function refreshColors() {
	colorScorebox();
	colorPlayers();
	colorAvatar();
	colorSpectators();
}



AMQ_addScriptData({
	name: "Highlight Friends",
	author: "nyamu",
	description: `
		<p>Change color of yourself and friends' text in score box and avatar box and chat.</p>
		<p>It makes it easier to find your friends in room that many users joined like ranked game.</p>
		<p>You can adjust these colors and toggle on Settings > Graphics tab.</p>
		<img src="https://i.imgur.com/ymPESKe.png" />
		<p>You can open/close Player Summary window by clicking this button.</p>
		<img src="https://i.imgur.com/ZFLFd2t.png" />
		<p>It's almost like scorebox but shows some additional infomation. When you clicked someone, it shows his/her box.</p>
		<img src="https://i.imgur.com/qEqp4wm.png" />
		<p>It shows your friends only in ranked game. It might be more useful in ranked game than normal room.</p>
		<img src="https://i.imgur.com/ZJMDBUd.png" />
		<p>Codes that applying colors to friend name on chat and lobby was provided by ensorcell. thanks a lot.</p>
		<p>Thanks a lot TheJoseph98 for providing window script and mentoring.</p>
	`
});

AMQ_addStyle(`
	#playerSummaryWindowTableContainer {
		padding: 10px;
	}
	.friendScore {
		height: 30px;
	}
	.friendScore > td {
		vertical-align: middle;
		border: 1px solid black;
		text-align: center;
	}
	.fstRank {
		min-width: 40px;
	}
	.fstScore {
		min-width: 40px;
	}
	.fstName {
		min-width: 80px;
	}
	.fstBox {
		min-width: 40px;
	}
	.fstAnswer {
		min-width: 80px;
	}
	.correctGuess {
		background-color: rgba(0, 200, 0, 0.07);
	}
	.incorrectGuess {
		background-color: rgba(255, 0, 0, 0.07);
	}
	#qpPlayerSummaryButton {
		width: 30px;
		height: 100%;
		margin-right: 5px;
	}
`);

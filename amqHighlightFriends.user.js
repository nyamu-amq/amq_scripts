// ==UserScript==
// @name         AMQ Highlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.12
// @description  Apply color to name of yourself and friends. and more
// @author       nyamu, ensorcell
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

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
						label: "Spec"
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
				height:30,
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
	}
];

var saveData = {
	"smColorSelfColor":"#80c7ff",
	"smColorFriendColor":"#80ff80",
	"smColorSelfShadow":"#228dff",
	"smColorFriendShadow":"#40ff40",
	"smColorJoinColor":"#8080ff",
	"smColorSpecColor":"#ffff80",
	"smColorLeaveColor":"#ff8080"
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

$(document.documentElement).keydown(function (event) {
    if (event.which === 145) {
        if (friendScoreWindow.isVisible()) {
            friendScoreWindow.close();
        }
        else {
            friendScoreWindow.open();
        }
    }
});

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
				checkbox.prop("checked", getSaveData(column.id, true));
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
	$(".qpAvatarNameContainer.self").css("color", $("#smColorSelfName").prop("checked")?selfcolor:"");
	$(".qpAvatarLevelText.self").css("color", $("#smColorSelfLevel").prop("checked")?selfcolor:"");
	$(".qpAvatarPointText.self").css("color", $("#smColorSelfPoint").prop("checked")?selfcolor:"");
	$(".gcUserName.self").css("color", $("#smColorSelfChat").prop("checked")?selfcolor:"");
	$(".gcSpectatorItem.self").children("h3").css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");

	let friendscorebox=$("#smColorFriendScorebox").prop("checked");
	$(".qpsPlayerName.friend").css("color", friendscorebox?friendcolor:"");
	$(".qpsPlayerName.friend").css("text-shadow", friendscorebox?"0 0 10px "+friendshadow:"");
	$(".qpAvatarNameContainer.friend").css("color", $("#smColorFriendName").prop("checked")?friendcolor:"");
	$(".qpAvatarLevelText.friend").css("color", $("#smColorFriendLevel").prop("checked")?friendcolor:"");
	$(".qpAvatarPointText.friend").css("color", $("#smColorFriendPoint").prop("checked")?friendcolor:"");
	$(".gcUserName.friend").css("color", $("#smColorFriendChat").prop("checked")?friendcolor:"");
	$(".gcSpectatorItem.friend").children("h3").css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");

	$(".csmJoin").css("color", $("#smColorJoin").prop("checked")?$("#smColorJoinColor").val():"");
	$(".csmSpec").css("color", $("#smColorSpec").prop("checked")?$("#smColorSpecColor").val():"");
	$(".csmLeft").css("color", $("#smColorLeave").prop("checked")?$("#smColorLeaveColor").val():"");
}

ViewChanger.prototype.changeView = function (newView, arg) {
	if (arg === undefined) {
		arg = {};
	}

	this.__controllers[this.currentView].closeView(arg);
	this._$loadingScreen.removeClass("hidden");
	this.__controllers[newView].openView(function () {
		this._$loadingScreen.addClass("hidden");
		this.currentView = newView;
	}.bind(this));

	$(".qpsPlayerName.self").css("color", $("#smColorSelfScorebox").prop("checked")?$("#smColorSelfColor").val():"");
	$(".qpsPlayerName.self").css("text-shadow", $("#smColorSelfScorebox").prop("checked")?"0 0 10px "+$("#smColorSelfShadow").val():"");
	$(".qpsPlayerName").each((index, elem) => {
		if(socialTab.isFriend($(elem).text())) {
			$(elem).addClass("friend").css("color", $("#smColorFriendScorebox").prop("checked")?$("#smColorFriendColor").val():"");
			$(elem).addClass("friend").css("text-shadow", $("#smColorFriendScorebox").prop("checked")?"0 0 10px "+$("#smColorFriendShadow").val():"");
		}
	});

	$(".qpAvatarNameContainer").not(".shadow").children("span").each((index, elem) => {
		if($(elem).text() === selfName) {
			let parent=$(elem).parent();
			parent.addClass("self").css("color", $("#smColorSelfName").prop("checked")?$("#smColorSelfColor").val():"");
			let parent2=parent.parent();
			parent2.find(".qpAvatarLevelText").not(".shadow").addClass("self").css("color", $("#smColorSelfLevel").prop("checked")?$("#smColorSelfColor").val():"");
			parent2.find(".qpAvatarPointText").not(".shadow").addClass("self").css("color", $("#smColorSelfPoint").prop("checked")?$("#smColorSelfColor").val():"");
		}
		else if(socialTab.isFriend($(elem).text())) {
			let parent=$(elem).parent();
			parent.addClass("friend").css("color", $("#smColorFriendName").prop("checked")?$("#smColorFriendColor").val():"");
			let parent2=parent.parent();
			parent2.find(".qpAvatarLevelText").not(".shadow").addClass("friend").css("color", $("#smColorFriendLevel").prop("checked")?$("#smColorFriendColor").val():"");
			parent2.find(".qpAvatarPointText").not(".shadow").addClass("friend").css("color", $("#smColorFriendPoint").prop("checked")?$("#smColorFriendColor").val():"");
		}
	});
	$(".gcSpectatorItem").children("h3").each((index,elem)=> {
		if($(elem).text() === selfName) {
			$(elem).parent().addClass("self");
			$(elem).css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");
		}
		else if(socialTab.isFriend($(elem).text())) {
			$(elem).parent().addClass("friend");
			$(elem).css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");
		}
	});
};

new Listener("Game Chat Message", function (payload) {
	if(payload.sender === selfName) {
		setTimeout(() => {$(".gcUserName").last().addClass("self").css("color", $("#smColorSelfChat").prop("checked")?$("#smColorSelfColor").val():"");},0);
	}
	else if (socialTab.isFriend(payload.sender)) {
		setTimeout(() => {$(".gcUserName").last().addClass("friend").css("color", $("#smColorFriendChat").prop("checked")?$("#smColorFriendColor").val():"");},0);
	}
}).bindListener()

new Listener("New Spectator", function (spectator) {
	checkSpecAndApplyColor(spectator.name);
}).bindListener();

new Listener("Player Changed To Spectator", function (payload) {
	let playerName = payload.spectatorDescription.name;
	checkSpecAndApplyColor(playerName);
}).bindListener();

function checkSpecAndApplyColor(spectator) {
	if(selfName === spectator) {
		setTimeout(() => {$(".gcSpectatorItem").children("h3").each((index,elem)=> {
			if($(elem).text() === selfName) {
				$(elem).parent().addClass("self");
				$(elem).css("color", $("#smColorSelfSpec").prop("checked")?$("#smColorSelfColor").val():"");
			}
		});},0);
	}
	if(socialTab.isFriend(spectator)) {
		setTimeout(() => {$(".gcSpectatorItem").children("h3").each((index,elem)=> {
			if(socialTab.isFriend($(elem).text())) {
				$(elem).parent().addClass("friend");
				$(elem).css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");
			}
		});},0);
	}
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

AMQ_addScriptData({
    name: "Highlight Friends",
    author: "nyamu",
    description: `
        <p>Change color of yourself and friends' text in score box and avatar box and chat.</p>
        <p>It makes it easier to find your friends in room that many users joined like ranked game.</p>
        <p>You can adjust these colors and toggle on Settings > Graphics tab.</p>
        <img src="https://i.imgur.com/ymPESKe.png" />
        <p>Codes that applying colors to friend name on chat was provided by ensorcell. thanks a lot.</p>
    `
});

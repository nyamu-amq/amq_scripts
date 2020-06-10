// ==UserScript==
// @name         AMQ Hightlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.11
// @description  Apply color to name of yourself and friends. and more
// @author       nyamu, ensorcell
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
    return;
}

{
	let selfcolor=Cookies.get("smColorSelfColor");
	if(!selfcolor) {
		selfcolor=Cookies.get("smColorSelfName");
		if(!selfcolor) {
			selfcolor="#80c7ff";
		}
		Cookies.set("smColorSelfColor", selfcolor, { expires: 365 });
	}
	let friendcolor=Cookies.get("smColorFriendColor");
	if(!friendcolor) {
		friendcolor=Cookies.get("smColorFriendName");
		if(!friendcolor) {
			friendcolor="#80ff80";
		}
		Cookies.set("smColorFriendColor", friendcolor, { expires: 365 });
	}
	let selfshadow=Cookies.get("smColorSelfShadow");
	if(!selfshadow) {
		Cookies.set("smColorSelfShadow", "#228dff", { expires: 365 });
	}
	let friendshadow=Cookies.get("smColorFriendShadow");
	if(!friendshadow) {
		Cookies.set("smColorFriendShadow", "#40ff40", { expires: 365 });
	}

	let joincolor=Cookies.get("smColorJoinColor");
	if(!joincolor)
		Cookies.set("smColorJoinColor", "#8080ff", { expires: 365 });
	let speccolor=Cookies.get("smColorSpecColor");
	if(!speccolor)
		Cookies.set("smColorSpecColor", "#ffff80", { expires: 365 });
	let leavecolor=Cookies.get("smColorLeaveColor");
	if(!leavecolor)
		Cookies.set("smColorLeaveColor", "#ff8080", { expires: 365 });
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
					.val(GetCookie(column.id,"#ffffff"))
				);
				td.on('change',function() {
					setTimeout(() => {
						let color=$("#"+column.id).val();
						Cookies.set(column.id, color, { expires: 365 });
						ColorChanged();
					},1);
				});
			}
			else if(column.type=="checkbox") {
				let div=$('<div></div>');
				div.addClass("customCheckbox");
				let checkbox=$('<input type="checkbox" id="'+column.id+'">');
				checkbox.prop("checked", GetCookie(column.id, "true")=="true");
				checkbox.click(function () {
					setTimeout(() => {
						let check=$("#"+column.id).prop("checked");
						Cookies.set(column.id, check, { expires: 365 });
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

function GetCookie(key, def) {
	let value=Cookies.get(key);
	if(value===undefined) return def;
	return value;
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
		setTimeout(() => {$(".gcUserName").each((index, elem) => {
			if($(elem).text() === selfName){
				$(elem).addClass("self").css("color", $("#smColorSelfChat").prop("checked")?$("#smColorSelfColor").val():"");
			}
		});},1);
	}
	else if (socialTab.isFriend(payload.sender)) {
		setTimeout(() => {$(".gcUserName").each((index, elem) => {
			if(socialTab.isFriend($(elem).text())){
				$(elem).addClass("friend").css("color", $("#smColorFriendChat").prop("checked")?$("#smColorFriendColor").val():"");
			}
		});},1);
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
		});},1);
	}
	if(socialTab.isFriend(spectator)) {
		setTimeout(() => {$(".gcSpectatorItem").children("h3").each((index,elem)=> {
			if(socialTab.isFriend($(elem).text())) {
				$(elem).parent().addClass("friend");
				$(elem).css("color", $("#smColorFriendSpec").prop("checked")?$("#smColorFriendColor").val():"");
			}
		});},1);
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
        <p>Codes that applying colors to friend name on chat was written by ensorcell. thanks a lot.</p>
    `
});

// ==UserScript==
// @name         AMQ Hightlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.8
// @description  Change color of yourself and friends in score box and avatar box
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

if (document.getElementById('startPage')) {
    return;
}

$("#settingsGraphicContainer")
	.append($("<div></div>")
		.addClass("row")
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

$("#smColorSettings").append($("<div id='smColorContainer' class='col-xs-12 checkboxContainer text-center'></div>"));

$("#smColorContainer").append($(`<div>Self Color<input type="color" id='smColorSelfName' value="`+GetCookie("smColorSelfName","#80c7ff")+`"}'></div>`));
$("#smColorContainer").append($(`<div>Friend Color<input type="color" id='smColorFriendName' value="`+GetCookie("smColorFriendName","#80ff80")+`"}'></div>`));

function GetCookie(key, def) {
	let value=Cookies.get(key);
	if(value===undefined) return def;
	return value;
}
$("#smColorSelfName").on('change',function() {
	let color=$("#smColorSelfName").val();
	$(".qpsPlayerName.self").css("color", color);
	$(".qpAvatarNameContainer.self").css("color", color);
	$(".qpAvatarLevelText.self").css("color", color);
	$(".qpAvatarPointText.self").css("color", color);
	Cookies.set("smColorSelfName", color, { expires: 365 });
});
$("#smColorFriendName").on('change',function() {
	let color=$("#smColorFriendName").val();
	$(".qpsPlayerName.friend").css("color", color);
	$(".qpAvatarNameContainer.friend").css("color", color);
	$(".qpAvatarLevelText.friend").css("color", color);
	$(".qpAvatarPointText.friend").css("color", color);
	Cookies.set("smColorFriendName", color, { expires: 365 });
});

AMQ_addStyle(`
	.qpsPlayerName.friend {
		color: #80ff80;
		text-shadow: 0 0 10px #408040;
	}
	.qpAvatarNameContainer.friend {
		color: #80ff80;
	}
	.qpAvatarNameContainer.self {
		color: #80c7ff;
	}
	.qpAvatarLevelText.friend {
		color: #80ff80;
	}
	.qpAvatarLevelText.self {
		color: #80c7ff;
	}
	.qpAvatarPointText.friend {
		color: #80ff80;
	}
	.qpAvatarPointText.self {
		color: #80c7ff;
	}
	#smColorContainer > div {
		width: 100px;
	}
`);

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

	$(".qpsPlayerName.self").css("color", $("#smColorSelfName").val());
	$(".qpsPlayerName").each((index, elem) => {
		if(socialTab.isFriend($(elem).text()))
			$(elem).addClass("friend").css("color", $("#smColorFriendName").val());
	});

	$(".qpAvatarNameContainer").not(".shadow").children("span").each((index, elem) => {
		if($(elem).text()==selfName) {
			$(elem).parent().addClass("self").css("color", $("#smColorSelfName").val());
			$(elem).parent().parent().find(".qpAvatarLevelText").not(".shadow").addClass("self").css("color", $("#smColorSelfName").val());
			$(elem).parent().parent().find(".qpAvatarPointText").not(".shadow").addClass("self").css("color", $("#smColorSelfName").val());
		}
		else if(socialTab.isFriend($(elem).text())) {
			$(elem).parent().addClass("friend").css("color", $("#smColorFriendName").val());
			$(elem).parent().parent().find(".qpAvatarLevelText").not(".shadow").addClass("friend").css("color", $("#smColorFriendName").val());
			$(elem).parent().parent().find(".qpAvatarPointText").not(".shadow").addClass("friend").css("color", $("#smColorFriendName").val());
		}
	});
};

AMQ_addScriptData({
    name: "Highlight Friends",
    author: "nyamu",
    description: `
        <p>Change color of yourself and friends' text in score box and avatar box.</p>
        <p>It makes it easier to find your friends in room that many users joined like ranked game.</p>
        <p>You can adjust these colors on Settings > Graphics tab.</p>
        <img src="https://i.imgur.com/tIEAL9N.png" />
    `
});

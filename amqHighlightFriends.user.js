// ==UserScript==
// @name         AMQ Hightlight Friends
// @namespace    https://github.com/nyamu-amq
// @version      0.4
// @description  apply highlight to friends in scorebox
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

if (document.getElementById('startPage')) {
    return;
}

$("#settingModal .tabContainer")
    .append($("<div></div>")
        .addClass("tab leftRightButtonTop clickAble")
        .attr("onClick", "options.selectTab('settingsCustomColorContainer', this)")
        .append($("<h5></h5>")
            .text("Colors")
        )
    );

$("#settingModal .modal-body")
    .append($("<div></div>")
        .attr("id", "settingsCustomColorContainer")
        .addClass("settingContentContainer hide")
        .append($("<div></div>")
            .addClass("row")
        )
    );
$("#settingsCustomColorContainer > .row")
    .append($("<div></div>")
        .addClass("col-xs-12")
        .attr("id", "smColorSettings")
        .append($("<div></div>")
            .attr("style", "text-align: center")
            .append($("<label></label>")
                .text("ColorSettings")
            )
        )
    );
$("#smColorSettings").append($("<div id='smColorContainer' class='col-xs-12 checkboxContainer text-center'></div>"));

$("#smColorContainer").append($(`<div>Self Name <input type="color" id='smColorSelfName' value="`+GetCookie("smColorSelfName","#80c7ff")+`"}'></div>`));
$("#smColorContainer").append($(`<div>Self Level <input type="color" id='smColorSelfLevel' value="`+GetCookie("smColorSelfLevel","#80c7ff")+`"}'></div>`));
$("#smColorContainer").append($(`<div>Friend Name <input type="color" id='smColorFriendName' value="`+GetCookie("smColorFriendName","#80ff80")+`"}'></div>`));
$("#smColorContainer").append($(`<div>Friend Level <input type="color" id='smColorFriendLevel' value="`+GetCookie("smColorFriendLevel","#80ff80")+`"}'></div>`));



options.$SETTING_TABS = $("#settingModal .tab");
options.$SETTING_CONTAINERS = $(".settingContentContainer");

function GetCookie(key, def) {
	let value=Cookies.get(key);
	if(value===undefined) return def;
	return value;
}
$("#smColorSelfName").on('change',function() {
	let color=$("#smColorSelfName").val();
	$(".qpsPlayerName.self").css("color", color);
	$(".qpAvatarNameContainer.self").css("color", color);
	Cookies.set("smColorSelfName", color, { expires: 365 });
});
$("#smColorSelfLevel").on('change',function() {
	let color=$("#smColorSelfLevel").val();
	$(".qpAvatarLevelText.self").css("color", color);
	Cookies.set("smColorSelfLevel", color, { expires: 365 });
});
$("#smColorFriendName").on('change',function() {
	let color=$("#smColorFriendName").val();
	$(".qpsPlayerName.friend").css("color", color);
	$(".qpAvatarNameContainer.friend").css("color", color);
	Cookies.set("smColorFriendName", color, { expires: 365 });
});
$("#smColorFriendLevel").on('change',function() {
	let color=$("#smColorFriendLevel").val();
	$(".qpAvatarLevelText.friend").css("color", color);
	Cookies.set("smColorFriendLevel", color, { expires: 365 });
});

function AddFriendStyle() {
	let head = document.head;
	let style = document.createElement("style");
	head.appendChild(style);
	style.type = "text/css";
	style.appendChild(document.createTextNode(`
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
	#smColorContainer > div {
		width: 100px;
	}
	`));
}
AddFriendStyle();

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
			$(elem).parent().parent().find(".qpAvatarLevelText").not(".shadow").addClass("self").css("color", $("#smColorSelfLevel").val());
		}
		else if(socialTab.isFriend($(elem).text())) {
			$(elem).parent().addClass("friend").css("color", $("#smColorFriendName").val());
			$(elem).parent().parent().find(".qpAvatarLevelText").not(".shadow").addClass("friend").css("color", $("#smColorFriendLevel").val());
		}
	});
};

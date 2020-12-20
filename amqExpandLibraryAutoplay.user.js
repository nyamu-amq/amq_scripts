// ==UserScript==
// @name         AMQ Expand Library Autoplay
// @namespace    https://github.com/nyamu-amq
// @version      0.1
// @description
// @author       nyamu
// @match        https://animemusicquiz.com/*
// @grant        none

// ==/UserScript==

if (document.getElementById('startPage')) {
	return;
}

var lastPlayedRes='720';

ExpandQuestionBox.prototype.showSong = function (animeId, animeName, songName, songArtist, songTypeName, songUploadStatus, videoExamples) {
	this.reset();
	this.$ANIME_NAME_LINK
		.attr('href', this._ANN_BASE_ENTRY_URL + animeId)
		.text(animeName);
	fitTextToContainer(this.$ANIME_NAME_LINK, this.$ANIME_NAME_CONTAINER, 24, 12);

	this.$ARTIST_NAME.text(songArtist);
	this.$SONG_NAME.text(songName);
	this.$ARTIST_NAME.data('bs.popover').options.content = songArtist;
	this.$SONG_NAME.data('bs.popover').options.content = songName;

	this.$SONG_TYPENAME.text(songTypeName);
	this.setSongSelected(true);
	this.videoExamples = videoExamples;
	this.songUploadStatus = songUploadStatus;
	this.currentExampleRes = null;
	this.$PREVIEW_VIDEO[0].autoplay=true;

	let versionApproved = false;
	let missingResolutionMap = {};
	Object.keys(songUploadStatus.open).forEach(host => {
		let hostResolutionStates = songUploadStatus.open[host];
		Object.keys(hostResolutionStates).forEach(resolution => {
			let status = hostResolutionStates[resolution];
			this.setHostStatus(this.$HOST_STATUSES[host][resolution], status);
			if (status === this._VERSION_STATES.MISSING) {
				missingResolutionMap[resolution] = true;
			} else if (status === this._VERSION_STATES.APPROVED) {
				versionApproved = true;
			}
		});
	});

	Object.keys(songUploadStatus.closed).forEach(host => {
		this.setHostStatus(this.$HOST_STATUSES[host], songUploadStatus.closed[host].status);
		if (songUploadStatus.closed[host].status === this._VERSION_STATES.APPROVED) {
			versionApproved = true;
		}
	});

	if (!versionApproved) {
		Object.keys(songUploadStatus.open).forEach(host => {
			this.songUploadStatus.open[host]['mp3'] = this._VERSION_STATES.BLOCKED;
			this.setHostStatus(this.$HOST_STATUSES[host]['mp3'], this._VERSION_STATES.BLOCKED);
		});
	}

	this.$ALL_PREVIEW_SELECTORS.removeClass('active');
	if (Object.keys(this.videoExamples).length) {
		Object.keys(this.videoExamples).forEach((key) => {
			let url = this.videoExamples[key];
			let $selector = this.$VIDEO_PREVIEW_SELECTOR[key];
			$selector.addClass('active');
			$selector.unbind('click');
			$selector.click(() => {
				lastPlayedRes=key;
				this.showVideoPreview(url, key);
			});
		});

		let initResSelected = false;
		let missingResolutionList = Object.keys(missingResolutionMap);

		missingResolutionList.some(resolution => {
			if (this.videoExamples[resolution]) {
				this.showVideoPreview(this.videoExamples[resolution], resolution);
				initResSelected = true;
				return true;
			}
		});

		if (!initResSelected) {
			let firstRes = Object.keys(this.videoExamples)[0];
			if(this.videoExamples.hasOwnProperty(lastPlayedRes)) firstRes=lastPlayedRes;
			this.showVideoPreview(this.videoExamples[firstRes], firstRes);
		}

		this.$PREVIEW_CONTAINER.removeClass('hide');
	} else {
		this.$PREVIEW_CONTAINER.addClass('hide');
	}

	this.updateSubmitButton();
};

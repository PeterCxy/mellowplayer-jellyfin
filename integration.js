var lastStatus = null;

function insertCss() {
    if (document.getElementById('mellowplayer-css') != null) return;
    
    var styleEl = document.createElement('style');
    styleEl.id = 'mellowplayer-css';
    document.head.appendChild(styleEl);
    styleEl.sheet.insertRule('.mouseIdle, .mouseIdle button, .mouseIdle select, .mouseIdle input, .mouseIdle textarea, .mouseIdle a, .mouseIdle label { cursor: unset !important; }');
}

function update() {
    insertCss();
    
    let status = {
        "playbackStatus": MellowPlayer.PlaybackStatus.STOPPED,
        "canSeek": false,
        "canGoNext": false,
        "canGoPrevious": false,
        "canAddToFavorites": false,
        "volume": 1,
        "duration": 0,
        "position": 0,
        "songId": 0,
        "songTitle": '',
        "artistName": '',
        "albumTitle": '',
        "artUrl": '',
        "isFavorite": false,
        "isDetailPage": false
    };
    let nowPlayingBar = document.getElementsByClassName('nowPlayingBar')[0];
    // For details page
    let nowPlayingPage = document.getElementsByClassName('nowPlayingPage');
    if (nowPlayingBar && nowPlayingBar.className.indexOf("hidden") == -1) {
        initPlayingStatus(status);
        updateWithNowPlayingBar(status);
    } else if (nowPlayingPage.length > 0 && nowPlayingPage[0].className.indexOf("hide") == -1) {
        initPlayingStatus(status);
        updateWithNowPlayingInfo(status);
        status['isDetailPage'] = true;
    } else {
        status['playbackStatus'] = MellowPlayer.PlaybackStatus.STOPPED;
    }
    lastStatus = status;
    return status;
}

function initPlayingStatus(status) {
    status['playbackStatus'] = MellowPlayer.PlaybackStatus.PLAYING;
    status['canSeek'] = true;
    status['canGoNext'] = true;
    status['canGoPrevious'] = true;
    status['canAddToFavorites'] = true;
}

function updateWithNowPlayingBar(status) {
    let pauseButton = document.getElementsByClassName('playPauseButton')[0];
    if (pauseButton.innerHTML.indexOf(">pause<") == -1) {
        status['playbackStatus'] = MellowPlayer.PlaybackStatus.PAUSED;
    }
        
    // Get song metadata
    let nowPlayingBarText = document.getElementsByClassName('nowPlayingBarText')[0];
    status['songTitle'] = nowPlayingBarText.childNodes[0].childNodes[0].innerText;
    status['artistName'] = nowPlayingBarText.childNodes[1].childNodes[0].innerText;
    status['artUrl'] = document.getElementsByClassName('nowPlayingImage')[0]
            .style.backgroundImage.replace('url("', "").replace('")', "");
                
    // Get play progress
    let nowPlayingBarCurrentTime = document.getElementsByClassName('nowPlayingBarCurrentTime')[0];
    let seekBar = document.getElementsByClassName('nowPlayingBarPositionSlider')[0];
    let [currentTime, totalTime] = nowPlayingBarCurrentTime.innerText.split('/');
    status['duration'] = durationToSecs(totalTime.trim());
    status['position'] = seekBar.value * status['duration'] / 100;
        
    // Get favorite status
    let favoriteButton = document.getElementsByClassName('nowPlayingBarUserDataButtons')[0].childNodes[0];
    status['isFavorite'] = favoriteButton.getAttribute("data-isfavorite") == "true";
        
    // Get volume
    let nowPlayingBarVolumeSlider = document.getElementsByClassName('nowPlayingBarVolumeSlider')[0];
    status['volume'] = nowPlayingBarVolumeSlider.value / 100;
}

// For the nowPlaying controls on playlist detail page
function updateWithNowPlayingInfo(status) {
    let pauseButton = document.getElementsByClassName('btnPlayPause')[0];
    if (pauseButton.innerHTML.indexOf(">pause<") == -1) {
        status['playbackStatus'] = MellowPlayer.PlaybackStatus.PAUSED;
    }
    
    // Get song metadata
    // We have to fetch metadata from the item in playlist rather than in controls on the top
    // because the controls on the top have title and artist concatenated with '-'
    // but some song names may contain '-'
    let activeItem = document.getElementsByClassName('playlistIndexIndicatorImage')[0].parentElement;
    status['songTitle'] = activeItem.querySelector('.listItemBody > .listItemBodyText:not(.secondary)').innerText;
    status['artistName'] = activeItem.querySelector('.listItemBody > .listItemBodyText.secondary').innerText;
    status['artUrl'] = document.getElementsByClassName('nowPlayingPageImage')[0].src;
    
    // Get play progress
    let nowPlayingTime = document.getElementsByClassName('nowPlayingTime')[0];
    let seekBar = document.getElementsByClassName('nowPlayingPositionSlider')[0];
    let [currentTime, totalTime] = nowPlayingTime.innerText.split('/');
    status['duration'] = durationToSecs(totalTime.trim());
    status['position'] = seekBar.value * status['duration'] / 100;
    
    // Get favorite status
    let favoriteButton = document.getElementsByClassName('nowPlayingPageUserDataButtons')[0].childNodes[0];
    status['isFavorite'] = favoriteButton.getAttribute("data-isfavorite") == "true";
        
    // Get volume
    let nowPlayingVolumeSlider = document.getElementsByClassName('nowPlayingVolumeSlider')[0];
    status['volume'] = nowPlayingVolumeSlider.value / 100;
}

function durationToSecs(str) {
    let [min, sec] = str.split(':');
    return Number.parseInt(min) * 60 + Number.parseInt(sec);
}

function play() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'btnPlayPause' : 'playPauseButton'
    )[0].dispatchEvent(new Event('click'));
}

function pause() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'btnPlayPause' : 'playPauseButton'
    )[0].dispatchEvent(new Event('click'));
}

function goNext() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'btnNextTrack' : 'nextTrackButton'
    )[0].dispatchEvent(new Event('click'));
}

function goPrevious() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'btnPreviousTrack' : 'previousTrackButton'
    )[0].dispatchEvent(new Event('click'));
}

function setVolume(volume) {
    let nowPlayingBarVolumeSlider = document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'nowPlayingVolumeSlider' : 'nowPlayingBarVolumeSlider'
    )[0];
    nowPlayingBarVolumeSlider.value = Math.floor(volume * 100);
    nowPlayingBarVolumeSlider.dispatchEvent(new Event('change'));
}

function addToFavorites() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'nowPlayingPageUserDataButtons' : 'nowPlayingBarUserDataButtons'
    )[0].childNodes[0]
        .dispatchEvent(new Event('click'));
}

function removeFromFavorites() {
    document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'nowPlayingPageUserDataButtons' : 'nowPlayingBarUserDataButtons'
    )[0].childNodes[0]
        .dispatchEvent(new Event('click'));
}

function seekToPosition(position) {
    let seekBar = document.getElementsByClassName(
        lastStatus['isDetailPage'] ? 'nowPlayingPositionSlider' : 'nowPlayingBarPositionSlider'
    )[0];
    seekBar.value = 100 * position / lastStatus['duration'];
    seekBar.dispatchEvent(new Event('change'));
}

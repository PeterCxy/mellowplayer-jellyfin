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
        "playbackStatus": mellowplayer.PlaybackStatus.STOPPED,
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
        "isFavorite": false
    };
    let nowPlayingBar = document.getElementsByClassName('nowPlayingBar')[0];
    if (nowPlayingBar.className.indexOf("hidden") != -1) {
        status['playbackStatus'] = mellowplayer.PlaybackStatus.STOPPED;
    } else {
        status['playbackStatus'] = mellowplayer.PlaybackStatus.PLAYING;
        status['canSeek'] = true;
        status['canGoNext'] = true;
        status['canGoPrevious'] = true;
        status['canAddToFavorites'] = true;
        
        let pauseButton = document.getElementsByClassName('playPauseButton')[0];
        if (pauseButton.innerHTML.indexOf(">pause<") == -1) {
            status['playbackStatus'] = mellowplayer.PlaybackStatus.PAUSED;
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
        status['isFavorite'] = favoriteButton.innerText.indexOf(">favorite<") == -1;
        
        // Get volume
        let nowPlayingBarVolumeSlider = document.getElementsByClassName('nowPlayingBarVolumeSlider')[0];
        status['volume'] = nowPlayingBarVolumeSlider.value / 100;
    }
    lastStatus = status;
    return status;
}

function durationToSecs(str) {
    let [min, sec] = str.split(':');
    return Number.parseInt(min) * 60 + Number.parseInt(sec);
}

function play() {
    document.getElementsByClassName('playPauseButton')[0].dispatchEvent(new Event('click'));
}

function pause() {
    document.getElementsByClassName('playPauseButton')[0].dispatchEvent(new Event('click'));
}

function goNext() {
    document.getElementsByClassName('nextTrackButton')[0].dispatchEvent(new Event('click'));
}

function goPrevious() {
    document.getElementsByClassName('previousTrackButton')[0].dispatchEvent(new Event('click'));
}

function setVolume(volume) {
    let nowPlayingBarVolumeSlider = document.getElementsByClassName('nowPlayingBarVolumeSlider')[0];
    nowPlayingBarVolumeSlider.value = Math.floor(volume * 100);
    nowPlayingBarVolumeSlider.dispatchEvent(new Event('change'));
}

function addToFavorites() {
    document.getElementsByClassName('nowPlayingBarUserDataButtons')[0].childNodes[0]
        .dispatchEvent(new Event('click'));
}

function removeFromFavorites() {
    document.getElementsByClassName('nowPlayingBarUserDataButtons')[0].childNodes[0]
        .dispatchEvent(new Event('click'));
}

function seekToPosition(position) {
    let seekBar = document.getElementsByClassName('nowPlayingBarPositionSlider')[0];
    seekBar.value = 100 * position / lastStatus['duration'];
    seekBar.dispatchEvent(new Event('change'));
}

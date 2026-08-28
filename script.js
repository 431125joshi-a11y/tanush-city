/* ==========================================================================
   TANUSH CITY MUSIC PLAYER
   ========================================================================== */


/* ==========================================================================
   PLAYLIST
   ==========================================================================

   ONLY EDIT THIS SECTION TO CHANGE THE MUSIC.

   Your files should be inside the "music" folder.

   Example:

   music/
       minecraft.mp3
       sweden.mp3
       wet-hands.mp3

   ========================================================================== */

const songs = [

    {
        title: "Minecraft",
        artist: "C418",
        file: "music/minecraft.mp3"
    },

    {
        title: "Sweden",
        artist: "C418",
        file: "music/sweden.mp3"
    },

    {
        title: "Wet Hands",
        artist: "C418",
        file: "music/wet-hands.mp3"
    },

    {
        title: "Subwoofer Lullaby",
        artist: "C418",
        file: "music/subwoofer-lullaby.mp3"
    },

    {
        title: "Aria Math",
        artist: "C418",
        file: "music/aria-math.mp3"
    },

    {
        title: "Mice on Venus",
        artist: "C418",
        file: "music/mice-on-venus.mp3"
    },

    {
        title: "Moog City",
        artist: "C418",
        file: "music/moog-city.mp3"
    },

    {
        title: "Moog City 2",
        artist: "C418",
        file: "music/moog-city-2.mp3"
    },

    {
        title: "Haggstrom",
        artist: "C418",
        file: "music/haggstrom.mp3"
    }

];


/* ==========================================================================
   ELEMENTS
   ========================================================================== */

const audio = document.getElementById("audio-player");

const playButton = document.getElementById("play-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentSongElement = document.getElementById("current-song");
const currentArtistElement = document.getElementById("current-artist");

const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");

const playlistElement = document.getElementById("playlist");
const playlistCountElement = document.getElementById("playlist-count");


/* ==========================================================================
   PLAYER STATE
   ========================================================================== */

let currentSongIndex = 0;

let isPlaying = false;

let isShuffle = false;

let isRepeat = false;


/* ==========================================================================
   INITIAL SETUP
   ========================================================================== */

function initializePlayer() {

    if (songs.length === 0) {

        currentSongElement.textContent = "No songs";

        currentArtistElement.textContent = "Playlist is empty";

        playButton.disabled = true;

        return;

    }

    playlistCountElement.textContent =
        `${songs.length} TRACK${songs.length === 1 ? "" : "S"}`;

    buildPlaylist();

    loadSong(currentSongIndex);

    audio.volume = Number(volume.value);

}


/* ==========================================================================
   LOAD SONG
   ========================================================================== */

function loadSong(index) {

    if (!songs[index]) {
        return;
    }

    currentSongIndex = index;

    const song = songs[currentSongIndex];

    audio.src = song.file;

    currentSongElement.textContent = song.title;

    currentArtistElement.textContent = song.artist;

    progress.value = 0;

    currentTimeElement.textContent = "0:00";

    durationElement.textContent = "0:00";

    updatePlaylist();

}


/* ==========================================================================
   PLAY
   ========================================================================== */

function playSong() {

    if (!songs.length) {
        return;
    }

    audio.play()
        .then(() => {

            isPlaying = true;

            updatePlayButton();

        })
        .catch(error => {

            console.error("Unable to play audio:", error);

        });

}


/* ==========================================================================
   PAUSE
   ========================================================================== */

function pauseSong() {

    audio.pause();

    isPlaying = false;

    updatePlayButton();

}


/* ==========================================================================
   PLAY / PAUSE
   ========================================================================== */

function togglePlay() {

    if (isPlaying) {

        pauseSong();

    } else {

        playSong();

    }

}


/* ==========================================================================
   PLAY BUTTON UI
   ========================================================================== */

function updatePlayButton() {

    if (isPlaying) {

        playButton.textContent = "❚❚";

        playButton.setAttribute(
            "aria-label",
            "Pause"
        );

        playButton.setAttribute(
            "title",
            "Pause"
        );

    } else {

        playButton.textContent = "▶";

        playButton.setAttribute(
            "aria-label",
            "Play"
        );

        playButton.setAttribute(
            "title",
            "Play"
        );

    }

}


/* ==========================================================================
   NEXT SONG
   ========================================================================== */

function nextSong() {

    if (!songs.length) {
        return;
    }


    if (isShuffle && songs.length > 1) {

        let newIndex;

        do {

            newIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (
            newIndex === currentSongIndex
        );

        currentSongIndex = newIndex;

    } else {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {

            currentSongIndex = 0;

        }

    }


    loadSong(currentSongIndex);

    playSong();

}


/* ==========================================================================
   PREVIOUS SONG
   ========================================================================== */

function previousSong() {

    if (!songs.length) {
        return;
    }


    /*
       If the song has already played for more than
       three seconds, pressing previous restarts it.
    */

    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }


    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex =
            songs.length - 1;

    }


    loadSong(currentSongIndex);

    playSong();

}


/* ==========================================================================
   SHUFFLE
   ========================================================================== */

function toggleShuffle() {

    isShuffle = !isShuffle;

    shuffleButton.classList.toggle(
        "active",
        isShuffle
    );

}


/* ==========================================================================
   REPEAT
   ========================================================================== */

function toggleRepeat() {

    isRepeat = !isRepeat;

    repeatButton.classList.toggle(
        "active",
        isRepeat
    );

}


/* ==========================================================================
   BUILD PLAYLIST
   ========================================================================== */

function buildPlaylist() {

    playlistElement.innerHTML = "";

    songs.forEach((song, index) => {

        const track = document.createElement("button");

        track.type = "button";

        track.className = "playlist-track";

        track.dataset.index = index;


        /* Track number */

        const number =
            document.createElement("span");

        number.className = "track-number";

        number.textContent =
            String(index + 1).padStart(2, "0");


        /* Song information */

        const details =
            document.createElement("span");

        details.className = "track-details";


        const title =
            document.createElement("strong");

        title.textContent = song.title;


        const artist =
            document.createElement("small");

        artist.textContent = song.artist;


        details.appendChild(title);

        details.appendChild(artist);


        /* Play symbol */

        const playIcon =
            document.createElement("span");

        playIcon.className = "track-play";

        playIcon.textContent = "▶";


        /* Put everything together */

        track.appendChild(number);

        track.appendChild(details);

        track.appendChild(playIcon);


        /* Click song */

        track.addEventListener(
            "click",
            () => {

                loadSong(index);

                playSong();

            }
        );


        playlistElement.appendChild(track);

    });


    updatePlaylist();

}


/* ==========================================================================
   UPDATE CURRENT PLAYLIST ITEM
   ========================================================================== */

function updatePlaylist() {

    const tracks =
        playlistElement.querySelectorAll(
            ".playlist-track"
        );


    tracks.forEach((track, index) => {

        track.classList.toggle(
            "current",
            index === currentSongIndex
        );


        const icon =
            track.querySelector(".track-play");


        if (index === currentSongIndex && isPlaying) {

            icon.textContent = "❚❚";

        } else {

            icon.textContent = "▶";

        }

    });

}


/* ==========================================================================
   FORMAT TIME
   ========================================================================== */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const remainingSeconds =
        Math.floor(seconds % 60);


    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}


/* ==========================================================================
   UPDATE PROGRESS
   ========================================================================== */

function updateProgress() {

    if (!audio.duration) {
        return;
    }


    const percentage =
        (audio.currentTime / audio.duration) * 100;


    progress.value = percentage;


    currentTimeElement.textContent =
        formatTime(audio.currentTime);


    durationElement.textContent =
        formatTime(audio.duration);

}


/* ==========================================================================
   SEEK
   ========================================================================== */

function seekSong() {

    if (!audio.duration) {
        return;
    }


    const seekTime =
        (Number(progress.value) / 100)
        * audio.duration;


    audio.currentTime = seekTime;

}


/* ==========================================================================
   VOLUME
   ========================================================================== */

function updateVolume() {

    audio.volume =
        Number(volume.value);

}


/* ==========================================================================
   SONG FINISHED
   ========================================================================== */

function songEnded() {

    /*
       Repeat the current song.
    */

    if (isRepeat) {

        audio.currentTime = 0;

        playSong();

        return;

    }


    /*
       Otherwise move to the next song.
    */

    nextSong();

}


/* ==========================================================================
   AUDIO LOADED
   ========================================================================== */

function audioLoaded() {

    durationElement.textContent =
        formatTime(audio.duration);

}


/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */


/* Play / Pause */

playButton.addEventListener(
    "click",
    togglePlay
);


/* Previous */

previousButton.addEventListener(
    "click",
    previousSong
);


/* Next */

nextButton.addEventListener(
    "click",
    nextSong
);


/* Shuffle */

shuffleButton.addEventListener(
    "click",
    toggleShuffle
);


/* Repeat */

repeatButton.addEventListener(
    "click",
    toggleRepeat
);


/* Progress */

progress.addEventListener(
    "input",
    seekSong
);


/* Volume */

volume.addEventListener(
    "input",
    updateVolume
);


/* Audio progress */

audio.addEventListener(
    "timeupdate",
    updateProgress
);


/* Audio metadata */

audio.addEventListener(
    "loadedmetadata",
    audioLoaded
);


/* Song ended */

audio.addEventListener(
    "ended",
    songEnded
);


/* When playback starts */

audio.addEventListener(
    "play",
    () => {

        isPlaying = true;

        updatePlayButton();

        updatePlaylist();

    }
);


/* When playback pauses */

audio.addEventListener(
    "pause",
    () => {

        isPlaying = false;

        updatePlayButton();

        updatePlaylist();

    }
);


/* ==========================================================================
   KEYBOARD CONTROLS
   ========================================================================== */

document.addEventListener(
    "keydown",
    event => {

        /*
           Space = Play/Pause

           Don't trigger if the user is typing
           into an input.
        */

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT"
        ) {

            event.preventDefault();

            togglePlay();

        }


        /*
           Arrow Left = Previous
        */

        if (
            event.code === "ArrowLeft" &&
            event.target.tagName !== "INPUT"
        ) {

            previousSong();

        }


        /*
           Arrow Right = Next
        */

        if (
            event.code === "ArrowRight" &&
            event.target.tagName !== "INPUT"
        ) {

            nextSong();

        }

    }
);


/* ==========================================================================
   START PLAYER
   ========================================================================== */

initializePlayer();

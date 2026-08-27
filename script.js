/* =========================================================
   TANUSH CITY RADIO
========================================================= */


/* =========================================================
   PLAYLIST
   EDIT THIS PART TO ADD / REMOVE SONGS
========================================================= */

const playlist = [

    {
        title: "Minecraft",
        artist: "C418",
        file: "assets/music/minecraft.mp3"
    },

    {
        title: "Sweden",
        artist: "C418",
        file: "assets/music/sweden.mp3"
    },

    {
        title: "Wet Hands",
        artist: "C418",
        file: "assets/music/wet-hands.mp3"
    },

    {
        title: "Subwoofer Lullaby",
        artist: "C418",
        file: "assets/music/subwoofer-lullaby.mp3"
    },

    {
        title: "Aria Math",
        artist: "C418",
        file: "assets/music/aria-math.mp3"
    },

    {
        title: "Mice on Venus",
        artist: "C418",
        file: "assets/music/mice-on-venus.mp3"
    },

    {
        title: "Moog City 2",
        artist: "C418",
        file: "assets/music/moog-city-2.mp3"
    },

    {
        title: "Moog City",
        artist: "C418",
        file: "assets/music/moog-city.mp3"
    },

    {
        title: "Haggstrom",
        artist: "C418",
        file: "assets/music/haggstrom.mp3"
    }


];


/* =========================================================
   STATE
========================================================= */

let currentTrack = 0;
let isPlaying = false;
let isShuffle = false;
let isLooping = false;

let shuffledPlaylist = [];
let shufflePosition = 0;


/* =========================================================
   DOM
========================================================= */

const audioPlayer =
    document.getElementById("audioPlayer");

const playBtn =
    document.getElementById("playBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const loopBtn =
    document.getElementById("loopBtn");

const progressBar =
    document.getElementById("progressBar");

const volumeBar =
    document.getElementById("volumeBar");

const currentTimeElement =
    document.getElementById("currentTime");

const durationElement =
    document.getElementById("duration");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const playlistElement =
    document.getElementById("playlist");

const playlistCount =
    document.getElementById("playlistCount");


/* =========================================================
   INITIALIZE
========================================================= */

function initializePlayer() {

    if (playlist.length === 0) {

        trackTitle.textContent = "No songs";

        trackArtist.textContent =
            "Add songs to the playlist";

        return;

    }

    playlistCount.textContent =
        `${playlist.length} tracks`;

    createPlaylist();

    loadTrack(0);

    audioPlayer.volume = 0.7;

}


/* =========================================================
   CREATE PLAYLIST
========================================================= */

function createPlaylist() {

    playlistElement.innerHTML = "";

    playlist.forEach((track, index) => {

        const trackElement =
            document.createElement("button");

        trackElement.type = "button";

        trackElement.className =
            "playlist-track";

        trackElement.dataset.index =
            index;


        trackElement.innerHTML = `

            <span class="track-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <span class="track-details">

                <strong>
                    ${escapeHTML(track.title)}
                </strong>

                <small>
                    ${escapeHTML(track.artist)}
                </small>

            </span>

            <span class="track-play">
                ▶
            </span>

        `;


        /*
           THIS is what lets the user
           choose the song.
        */

        trackElement.addEventListener(
            "click",
            () => {

                selectTrack(index);

            }
        );


        playlistElement.appendChild(
            trackElement
        );

    });


    updatePlaylistUI();

}


/* =========================================================
   SELECT A SONG
   ========================================================= */

function selectTrack(index) {

    if (!playlist[index]) {
        return;
    }

    currentTrack = index;

    /*
       Load the selected song.
    */

    loadTrack(index);

    /*
       Immediately start playing it.
    */

    playTrack();

}


/* =========================================================
   LOAD TRACK
========================================================= */

function loadTrack(index) {

    const track =
        playlist[index];

    if (!track) {
        return;
    }

    currentTrack = index;

    audioPlayer.src =
        track.file;

    audioPlayer.load();

    trackTitle.textContent =
        track.title;

    trackArtist.textContent =
        track.artist;

    progressBar.value = 0;

    currentTimeElement.textContent =
        "0:00";

    durationElement.textContent =
        "0:00";

    updatePlaylistUI();

}


/* =========================================================
   PLAY
========================================================= */

function playTrack() {

    if (!playlist.length) {
        return;
    }

    audioPlayer
        .play()
        .then(() => {

            isPlaying = true;

            updatePlayButton();

            updatePlaylistUI();

        })
        .catch(error => {

            console.warn(
                "Browser blocked audio:",
                error
            );

        });

}


/* =========================================================
   PAUSE
========================================================= */

function pauseTrack() {

    audioPlayer.pause();

    isPlaying = false;

    updatePlayButton();

    updatePlaylistUI();

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

playBtn.addEventListener(
    "click",
    () => {

        if (isPlaying) {

            pauseTrack();

        } else {

            playTrack();

        }

    }
);


/* =========================================================
   UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton() {

    playBtn.textContent =
        isPlaying ? "❚❚" : "▶";

}


/* =========================================================
   NEXT
========================================================= */

function nextTrack() {

    if (!playlist.length) {
        return;
    }


    if (isShuffle) {

        if (
            shufflePosition >=
            shuffledPlaylist.length - 1
        ) {

            createShuffleOrder();

        } else {

            shufflePosition++;

        }

        currentTrack =
            shuffledPlaylist[shufflePosition];

    } else {

        currentTrack++;

        if (
            currentTrack >=
            playlist.length
        ) {

            currentTrack = 0;

        }

    }


    loadTrack(currentTrack);

    playTrack();

}


/* =========================================================
   PREVIOUS
========================================================= */

function previousTrack() {

    if (!playlist.length) {
        return;
    }


    /*
       If the song has already played for
       more than 3 seconds, restart it.
    */

    if (audioPlayer.currentTime > 3) {

        audioPlayer.currentTime = 0;

        return;

    }


    if (isShuffle) {

        if (shufflePosition > 0) {

            shufflePosition--;

            currentTrack =
                shuffledPlaylist[
                    shufflePosition
                ];

        }

    } else {

        currentTrack--;

        if (currentTrack < 0) {

            currentTrack =
                playlist.length - 1;

        }

    }


    loadTrack(currentTrack);

    playTrack();

}


/* =========================================================
   BUTTONS
========================================================= */

nextBtn.addEventListener(
    "click",
    nextTrack
);

previousBtn.addEventListener(
    "click",
    previousTrack
);


/* =========================================================
   SHUFFLE
========================================================= */

shuffleBtn.addEventListener(
    "click",
    () => {

        isShuffle =
            !isShuffle;

        shuffleBtn.classList.toggle(
            "active",
            isShuffle
        );


        if (isShuffle) {

            createShuffleOrder();

        } else {

            shuffledPlaylist = [];

            shufflePosition = 0;

        }

    }
);


/* =========================================================
   CREATE SHUFFLE
========================================================= */

function createShuffleOrder() {

    shuffledPlaylist =
        playlist.map(
            (_, index) => index
        );


    for (
        let i = shuffledPlaylist.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            shuffledPlaylist[i],
            shuffledPlaylist[randomIndex]
        ] = [
            shuffledPlaylist[randomIndex],
            shuffledPlaylist[i]
        ];

    }


    /*
       Don't immediately play
       the same song.
    */

    if (
        shuffledPlaylist.length > 1 &&
        shuffledPlaylist[0] === currentTrack
    ) {

        [
            shuffledPlaylist[0],
            shuffledPlaylist[1]
        ] = [
            shuffledPlaylist[1],
            shuffledPlaylist[0]
        ];

    }


    shufflePosition = 0;

}


/* =========================================================
   LOOP
========================================================= */

loopBtn.addEventListener(
    "click",
    () => {

        isLooping =
            !isLooping;

        loopBtn.classList.toggle(
            "active",
            isLooping
        );

    }
);


/* =========================================================
   SONG FINISHED
========================================================= */

audioPlayer.addEventListener(
    "ended",
    () => {

        if (isLooping) {

            audioPlayer.currentTime = 0;

            playTrack();

        } else {

            nextTrack();

        }

    }
);


/* =========================================================
   PROGRESS
========================================================= */

audioPlayer.addEventListener(
    "timeupdate",
    () => {

        if (!audioPlayer.duration) {
            return;
        }


        const percentage =
            (
                audioPlayer.currentTime /
                audioPlayer.duration
            ) * 100;


        progressBar.value =
            percentage;


        currentTimeElement.textContent =
            formatTime(
                audioPlayer.currentTime
            );

    }
);


/* =========================================================
   DURATION
========================================================= */

audioPlayer.addEventListener(
    "loadedmetadata",
    () => {

        durationElement.textContent =
            formatTime(
                audioPlayer.duration
            );

    }
);


/* =========================================================
   SEEK
========================================================= */

progressBar.addEventListener(
    "input",
    () => {

        if (!audioPlayer.duration) {
            return;
        }


        audioPlayer.currentTime =
            (
                progressBar.value / 100
            ) *
            audioPlayer.duration;

    }
);


/* =========================================================
   VOLUME
========================================================= */

volumeBar.addEventListener(
    "input",
    () => {

        audioPlayer.volume =
            Number(volumeBar.value);

    }
);


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

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


/* =========================================================
   UPDATE PLAYLIST
========================================================= */

function updatePlaylistUI() {

    const tracks =
        playlistElement.querySelectorAll(
            ".playlist-track"
        );


    tracks.forEach(
        (trackElement, index) => {

            const isCurrent =
                index === currentTrack;


            trackElement.classList.toggle(
                "current",
                isCurrent
            );


            const indicator =
                trackElement.querySelector(
                    ".track-play"
                );


            if (indicator) {

                indicator.textContent =
                    isCurrent && isPlaying
                        ? "❚❚"
                        : "▶";

            }

        }
    );

}


/* =========================================================
   AUDIO EVENTS
========================================================= */

audioPlayer.addEventListener(
    "play",
    () => {

        isPlaying = true;

        updatePlayButton();

        updatePlaylistUI();

    }
);


audioPlayer.addEventListener(
    "pause",
    () => {

        isPlaying = false;

        updatePlayButton();

        updatePlaylistUI();

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const tag =
            event.target.tagName.toLowerCase();


        if (
            tag === "input" ||
            tag === "textarea" ||
            tag === "button"
        ) {

            return;

        }


        if (event.code === "Space") {

            event.preventDefault();

            if (isPlaying) {

                pauseTrack();

            } else {

                playTrack();

            }

        }


        if (event.code === "ArrowRight") {

            nextTrack();

        }


        if (event.code === "ArrowLeft") {

            previousTrack();

        }

    }
);


/* =========================================================
   SECURITY / TEXT ESCAPING
========================================================= */

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent =
        text;

    return element.innerHTML;

}


/* =========================================================
   START
========================================================= */

initializePlayer();

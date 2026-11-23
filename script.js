
const audio = document.getElementById("audio");

const songs = [
    {
        title: "Midnight Memories",
        artist: "Unknown Artist",
        src: "songs/song1.mp3",
        mood: "sad"
    },
    {
        title: "Song Two",
        artist: "Unknown Artist",
        src: "songs/song2.mp3",
        mood: "energetic"
    },
    {
        title: "Song Three",
        artist: "Unknown Artist",
        src: "songs/song3.mp3",
        mood: "romantic"
    }
];

let currentSong = 0;

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

const songTitle = document.getElementById("songTitle");
const artist = document.getElementById("artist");
const moodLabel = document.getElementById("moodLabel");

function loadSong(index) {
    currentSong = index;

    const song = songs[currentSong];

    audio.src = song.src;
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    moodLabel.textContent = song.mood.toUpperCase() + " MODE";

    document.body.className = song.mood;

    renderPlaylist();
}

function playSong() {
    audio.play();
    playBtn.textContent = "⏸";
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

nextBtn.addEventListener("click", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
});

prevBtn.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
});

audio.addEventListener("ended", () => {
    nextBtn.click();
});

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").textContent =
        formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;

        document.getElementById("currentTime").textContent =
            formatTime(audio.currentTime);
    }
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);

    return `${min}:${sec.toString().padStart(2, "0")}`;
}

function renderPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className = "playlist-item";

        if (index === currentSong) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <div>
                <strong>${song.title}</strong>
                <small>${song.artist}</small>
            </div>
            <span>▶</span>
        `;

        item.addEventListener("click", () => {
            loadSong(index);
            playSong();
        });

        playlist.appendChild(item);
    });
}

// Mood selection
document.querySelectorAll(".mood-btn").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".mood-btn").forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const mood = button.dataset.mood;

        const moodSongs = songs
            .map((song, index) => ({ ...song, index }))
            .filter(song => song.mood === mood);

        if (moodSongs.length > 0) {
            loadSong(moodSongs[0].index);
            playSong();
        }
    });
});

// Initial setup
audio.volume = 0.7;
loadSong(0);

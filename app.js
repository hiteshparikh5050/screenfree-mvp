/***********************
 * DEVICE STATES
 ***********************/
const STATE = {
  IDLE: "IDLE",
  ACTIVE: "ACTIVE",
  SLEEP: "SLEEP"
};

let currentState = STATE.IDLE;

/***********************
 * CARD → PLAYLIST MAP
 ***********************/
const CARD_PLAYLISTS = {
  CARD_001: [
    "audio/intro.mp3",
    "audio/story1.mp3"
  ],
  CARD_002: [
    "audio/intro.mp3",
    "audio/story1.mp3"
  ]
};

/***********************
 * AUDIO ENGINE
 ***********************/
let audio = new Audio();
let currentPlaylist = [];
let currentTrackIndex = 0;

function playCurrentTrack() {
  if (!currentPlaylist.length) return;

  audio.src = currentPlaylist[currentTrackIndex];
  audio.play().catch(() => {
    console.log("Audio waiting for user interaction");
  });
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
}

/***********************
 * UI ELEMENTS
 ***********************/
const statusEl = document.getElementById("status");
const cardSelect = document.getElementById("cardSelect");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const volumeSlider = document.getElementById("volume");

/***********************
 * UI UPDATE
 ***********************/
function updateUI() {
  if (currentState === STATE.IDLE) {
    statusEl.textContent = "Waiting for card";
    playBtn.disabled = true;
    pauseBtn.disabled = true;
    volumeSlider.disabled = true;
  }

  if (currentState === STATE.ACTIVE) {
    statusEl.textContent = "Card inserted";
    playBtn.disabled = false;
    pauseBtn.disabled = false;
    volumeSlider.disabled = false;
  }
}

/***********************
 * PLAYLIST SEQUENCING
 ***********************/
audio.addEventListener("ended", () => {
  currentTrackIndex++;

  if (currentTrackIndex < currentPlaylist.length) {
    playCurrentTrack();
  } else {
    // End of playlist → stop
    stopAudio();
    currentTrackIndex = 0;
  }
});

/***********************
 * CARD INSERT / REMOVE
 ***********************/
cardSelect.addEventListener("change", () => {
  // Card removed
  if (cardSelect.value === "") {
    stopAudio();
    audio.src = "";
    currentPlaylist = [];
    currentTrackIndex = 0;
    currentState = STATE.IDLE;
    updateUI();
    return;
  }

  // New card inserted
  stopAudio();
  currentPlaylist = CARD_PLAYLISTS[cardSelect.value] || [];
  currentTrackIndex = 0;
  currentState = STATE.ACTIVE;
  updateUI();
});

/***********************
 * CONTROLS
 ***********************/
playBtn.addEventListener("click", () => {
  if (currentState === STATE.ACTIVE) {
    playCurrentTrack();
  }
});

pauseBtn.addEventListener("click", () => {
  if (currentState === STATE.ACTIVE) {
    audio.pause();
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

/***********************
 * INITIALIZE
 ***********************/
updateUI();

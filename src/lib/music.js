import { get, writable } from "svelte/store";

const TRACK_URL = "/assets/songs/feel.mp3";

export const isPlaying = writable(false);
export const volume = writable(0.4);

let audio = null;
let context = null;
let analyser = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (audio) return audio;

  audio = new Audio(TRACK_URL);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = get(volume);

  audio.addEventListener("play", () => isPlaying.set(true));
  audio.addEventListener("pause", () => isPlaying.set(false));
  audio.addEventListener("ended", () => isPlaying.set(false));
  audio.addEventListener("error", () => isPlaying.set(false));

  volume.subscribe((value) => {
    if (audio) {
      audio.volume = Math.min(1, Math.max(0, Number(value)));
    }
  });

  return audio;
}

function initializeAnalysis(track) {
  if (context) return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return;

  context = new AudioContextClass();

  const source = context.createMediaElementSource(track);

  analyser = context.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);
  analyser.connect(context.destination);
}

export function getMusicAnalyser() {
  return analyser;
}

export async function playMusic() {
  const track = getAudio();
  if (!track) return false;

  try {
    initializeAnalysis(track);

    const resume =
      context?.state === "suspended"
        ? context.resume()
        : Promise.resolve();

    const playback = track.play();

    await Promise.all([resume, playback]);

    return true;
  } catch {
    track.pause();
    isPlaying.set(false);
    return false;
  }
}

export function toggleMusic() {
  const track = getAudio();
  if (!track) return;

  if (track.paused) {
    void playMusic();
  } else {
    track.pause();
  }
}
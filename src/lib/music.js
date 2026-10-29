import { get, writable } from "svelte/store";

const TRACK_URL = "/assets/songs/feel.mp3";

export const isPlaying = writable(false);
export const volume = writable(0.4);

let audio = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (audio) return audio;

  audio = new Audio(TRACK_URL);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = get(volume);

  audio.addEventListener("play", () => isPlaying.set(true));
  audio.addEventListener("pause", () => isPlaying.set(false));

  volume.subscribe((value) => {
    if (audio) audio.volume = value;
  });

  return audio;
}

export async function playMusic() {
  const track = getAudio();
  if (!track) return false;

  try {
    await track.play();
    return true;
  } catch {
    return false;
  }
}

export function toggleMusic() {
  const track = getAudio();
  if (!track) return;

  if (track.paused) {
    playMusic();
  } else {
    track.pause();
  }
}
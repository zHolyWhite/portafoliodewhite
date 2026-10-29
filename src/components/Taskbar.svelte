<script>
  import { onMount } from "svelte";
  import { isPlaying, toggleMusic, volume } from "../lib/music.js";

  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  let time = "";

  onMount(() => {
    const tick = () => {
      time = formatter.format(new Date());
    };

    tick();
    const interval = window.setInterval(tick, 15000);

    return () => window.clearInterval(interval);
  });
</script>

<footer class="taskbar">
  <a class="start-menu" href="#top" aria-label="Back to top">
    <span class="start-flag" aria-hidden="true"></span>
    <span>start</span>
  </a>

  <div class="taskbar-task">
    <span class="xp-title-icon" aria-hidden="true"></span>
    <span>zHolyWhite - Portfolio</span>
  </div>

  <div class="tray">
    <button
      class="tray-button"
      type="button"
      aria-label={$isPlaying ? "Pause music" : "Play music"}
      aria-pressed={$isPlaying}
      on:click={toggleMusic}
    >
      {$isPlaying ? "❚❚" : "▶"}
    </button>

    <span class="tray-track">feel</span>

    <input
      class="tray-volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
      aria-label="Volume"
      bind:value={$volume}
    />

    <time class="tray-clock">{time}</time>
  </div>
</footer>
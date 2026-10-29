<script>
  import { isPlaying, toggleMusic, volume } from "../lib/music.js";
</script>

<section class="xp-box music-widget" aria-labelledby="music-title">
  <h2 id="music-title" class="xp-box-title">Now playing</h2>

  <div class="xp-box-body">
    <div class="music-track">
      <span class="music-track-name">feel</span>
      <span class="music-track-status">
        {$isPlaying ? "Playing on repeat" : "Paused"}
      </span>
    </div>

    <div class="music-controls">
      <button
        class="music-toggle"
        type="button"
        aria-label={$isPlaying ? "Pause music" : "Play music"}
        aria-pressed={$isPlaying}
        on:click={toggleMusic}
      >
        {#if $isPlaying}
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="m8 5 11 7-11 7z" />
          </svg>
        {/if}
      </button>

      <label class="music-volume">
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          bind:value={$volume}
        />
      </label>
    </div>
  </div>
</section>
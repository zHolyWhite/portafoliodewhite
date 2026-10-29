<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { playMusic } from "../lib/music.js";

  const NAME = "zHolyWhite";
  const LOADING_MS = 1000;
  const LETTER_DELAY_MS = 90;
  const LETTER_ANIMATION_MS = 500;
  const NAME_HOLD_MS = 1000;

  const letters = Array.from(NAME);
  const cubes = Array.from({ length: 8 }, (_, index) => index);

  let phase = "loading";
  let visible = true;
  let button;
  let reducedMotion = false;

  const timers = [];

  $: if (phase === "prompt" && button) {
    button.focus({ preventScroll: true });
  }

  function schedule(callback, delay) {
    timers.push(window.setTimeout(callback, delay));
  }

  function finish() {
    visible = false;
  }

  function completeIntro() {
    delete document.documentElement.dataset.intro;
    document.documentElement.style.overflow = previousOverflow;
  }

  let previousOverflow = "";

  function start() {
    if (phase !== "prompt") return;

    void playMusic();
    phase = "name";

    const nameDuration = reducedMotion
      ? NAME_HOLD_MS
      : (letters.length - 1) * LETTER_DELAY_MS +
        LETTER_ANIMATION_MS +
        NAME_HOLD_MS;

    schedule(finish, nameDuration);
  }

  onMount(() => {
    const root = document.documentElement;

    previousOverflow = root.style.overflow;
    reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    root.dataset.intro = "playing";
    root.style.overflow = "hidden";

    schedule(() => {
      phase = "prompt";
    }, LOADING_MS);

    return () => {
      timers.forEach(window.clearTimeout);
      completeIntro();
    };
  });
</script>

{#if visible}
  <div
    class="intro"
    out:fade={{ duration: reducedMotion ? 0 : 500 }}
    on:outroend={completeIntro}
  >
    {#if phase === "loading"}
      <div class="loader" role="status" aria-label="Cargando">
        {#each cubes as cube}
          <span
            class="cube-position"
            style={`--angle: ${cube * 45}deg`}
            aria-hidden="true"
          >
            <span
              class="cube"
              style={`--pulse-delay: ${cube * 75}ms`}
            ></span>
          </span>
        {/each}
      </div>
    {:else if phase === "prompt"}
      <div class="entry">
        <button
          bind:this={button}
          class="entry-button"
          type="button"
          on:click={start}
        >
          <span class="entry-symbol" aria-hidden="true">›</span>
          <span>Rápido presiona aquí!</span>
        </button>

        <svg
          class="entry-cursor"
          viewBox="0 0 24 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 2V25L9 19L14 30L19 28L14 17H23L3 2Z"
            fill="#ffffff"
            stroke="#000000"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    {:else}
      <h1 class="intro-name" aria-label={NAME}>
        {#each letters as letter, index}
          <span
            class="intro-letter"
            style={`--letter-delay: ${index * LETTER_DELAY_MS}ms`}
            aria-hidden="true"
          >
            {letter}
          </span>
        {/each}
      </h1>
    {/if}
  </div>
{/if}

<style>
  .intro {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    min-height: 100svh;
    padding: 1.5rem;
    overflow: hidden;
    color: #ffffff;
    background: #050505;
  }

  .intro::before {
    position: absolute;
    inset: 0;
    content: "";
    pointer-events: none;
    background: repeating-linear-gradient(
      180deg,
      rgb(255 255 255 / 2%) 0,
      rgb(255 255 255 / 2%) 1px,
      transparent 1px,
      transparent 4px
    );
  }

  .loader {
    position: relative;
    width: 4rem;
    height: 4rem;
  }

  .cube-position {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    place-items: center;
    width: 0.5rem;
    height: 0.5rem;
    transform:
      translate(-50%, -50%)
      rotate(var(--angle))
      translateY(-1.5rem)
      rotate(calc(-1 * var(--angle)));
  }

  .cube {
    display: block;
    width: 100%;
    height: 100%;
    background: #ffffff;
    animation: cube-pulse 600ms linear infinite;
    animation-delay: var(--pulse-delay);
  }

  .entry {
    position: relative;
    max-width: 100%;
  }

  .entry-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    box-sizing: border-box;
    max-width: 100%;
    min-height: 3.5rem;
    padding: 0.75rem 1.5rem;
    color: #050505;
    font-family: var(--font-pixel, "Minecraft", monospace);
    font-size: clamp(1.125rem, 4.5vw, 1.4rem);
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
    cursor: pointer;
    background: #f4f4f1;
    border: 1px solid #f4f4f1;
    border-radius: 0;
    box-shadow: 5px 5px 0 rgb(255 255 255 / 20%);
    transition:
      background-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .entry-button:hover {
    background: #ffffff;
    box-shadow: 7px 7px 0 rgb(255 255 255 / 25%);
    transform: translate(-2px, -2px);
  }

  .entry-button:active {
    box-shadow: 1px 1px 0 rgb(255 255 255 / 20%);
    transform: translate(2px, 2px);
  }

  .entry-button:focus-visible {
    outline: 1px dashed #ffffff;
    outline-offset: 7px;
  }

  .entry-symbol {
    flex-shrink: 0;
    font-family: monospace;
    font-size: 1.5rem;
    line-height: 1;
    animation: arrow-nudge 1200ms ease-in-out infinite;
  }

  .entry-cursor {
    position: absolute;
    right: -0.5rem;
    bottom: -1.5rem;
    width: 1.5rem;
    height: 2rem;
    pointer-events: none;
    filter: drop-shadow(2px 2px 0 rgb(0 0 0 / 50%));
    animation: cursor-tap 1800ms ease-in-out infinite;
  }

  .intro-name {
    display: flex;
    justify-content: center;
    margin: 0;
    color: #ffffff;
    font-family: "MinecraftTen", monospace;
    font-size: clamp(1.75rem, 8vw, 4.5rem);
    font-weight: 400;
    line-height: 1.3;
    white-space: nowrap;
  }

  .intro-letter {
    display: inline-block;
    animation: letter-place 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--letter-delay);
  }

  @keyframes cube-pulse {
    0%,
    100% {
      opacity: 0.2;
    }

    50% {
      opacity: 1;
    }
  }

  @keyframes arrow-nudge {
    0%,
    100% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(4px);
    }
  }

  @keyframes cursor-tap {
    0%,
    100% {
      transform: translate(12px, 12px);
    }

    45%,
    65% {
      transform: translate(0, 0);
    }

    55% {
      transform: translate(-2px, -2px) scale(0.9);
    }
  }

  @keyframes letter-place {
    from {
      opacity: 0;
      transform: translateY(16px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cube,
    .entry-symbol,
    .entry-cursor,
    .intro-letter {
      animation: none;
    }

    .entry-button {
      transition: none;
    }

    .entry-button:hover,
    .entry-button:active {
      transform: none;
    }
  }
</style>
<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  const NAME = "zHolyWhite";
  const LETTER_DELAY_MS = 90;
  const LOADING_MS = 1000;
  const NAME_HOLD_MS = 1400;
  const STORAGE_KEY = "intro-seen";

  const letters = NAME.split("");
  const cubes = [0, 1, 2, 3, 4, 5, 6, 7];

  let phase = "loading";
  let visible = true;

  function finish() {
    visible = false;
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.documentElement.style.overflow = "";
  }

  onMount(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || sessionStorage.getItem(STORAGE_KEY)) {
      visible = false;
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const timers = [
      setTimeout(() => (phase = "name"), LOADING_MS),
      setTimeout(
        () => (phase = "exit"),
        LOADING_MS + letters.length * LETTER_DELAY_MS + NAME_HOLD_MS,
      ),
      setTimeout(finish, LOADING_MS + letters.length * LETTER_DELAY_MS + NAME_HOLD_MS + 700),
    ];

    return () => timers.forEach(clearTimeout);
  });
</script>

{#if visible}
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black"
    out:fade={{ duration: 700 }}
  >
    {#if phase === "loading"}
      <div class="relative h-16 w-16">
        {#each cubes as cube, i}
          <div
            class="cube absolute top-1/2 left-1/2 h-2.5 w-2.5 bg-black"
            style="
              transform: translate(-50%, -50%)
                rotate({(360 / cubes.length) * i}deg)
                translateY(-28px);
              animation-delay: {(i * 80) % 480}ms;
            "
          ></div>
        {/each}
      </div>
    {/if}

    {#if phase === "name" || phase === "exit"}
      <h1 class="flex flex-wrap justify-center font-minecraft text-5xl sm:text-7xl">
        {#each letters as letter, i}
          <span class="name-letter" style="animation-delay: {i * LETTER_DELAY_MS}ms">
            {letter}
          </span>
        {/each}
      </h1>
    {/if}
  </div>
{/if}

<style>
  .cube {
    animation: cube-pulse 0.6s ease-in-out infinite;
  }

  .name-letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(16px);
    animation: letter-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes cube-pulse {
    0%,
    100% {
      opacity: 0.25;
    }

    50% {
      opacity: 1;
    }
  }

  @keyframes letter-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cube {
      animation: none;
      opacity: 1;
    }

    .name-letter {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
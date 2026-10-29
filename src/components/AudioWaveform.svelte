<script>
  import { onMount } from "svelte";
  import { getMusicAnalyser, isPlaying } from "../lib/music.js";
  import { visualizer } from "../data/visualizer";

  let canvas;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 0;
    let height = 0;
    let frame = 0;
    let playing = false;
    let samples = null;

    function clear() {
      ctx.clearRect(0, 0, width, height);
    }

    function stop() {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function canAnimate() {
      return (
        playing &&
        !motionPreference.matches &&
        document.visibilityState === "visible"
      );
    }

    function draw() {
      frame = 0;
      clear();

      if (!canAnimate()) return;

      const analyser = getMusicAnalyser();

      if (analyser) {
        if (!samples || samples.length !== analyser.fftSize) {
          samples = new Uint8Array(analyser.fftSize);
        }

        analyser.getByteTimeDomainData(samples);

        ctx.strokeStyle = visualizer.color;
        ctx.globalAlpha = visualizer.opacity;
        ctx.lineWidth = visualizer.lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        const step = Math.max(1, visualizer.sampleStep);

        for (const position of visualizer.positions) {
          ctx.beginPath();

          for (let index = 0; index < samples.length; index += step) {
            const progress = index / (samples.length - 1);
            const signal = (samples[index] - 128) / 128;
            const x = progress * width;
            const y =
              height * position +
              signal * height * visualizer.amplitude;

            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        }
      }

      frame = window.requestAnimationFrame(draw);
    }

    function refresh() {
      stop();

      if (canAnimate()) {
        frame = window.requestAnimationFrame(draw);
      } else {
        clear();
      }
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      refresh();
    }

    resize();

    const unsubscribe = isPlaying.subscribe((value) => {
      playing = value;
      refresh();
    });

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", refresh);
    motionPreference.addEventListener("change", refresh);

    return () => {
      stop();
      unsubscribe();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", refresh);
      motionPreference.removeEventListener("change", refresh);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="audio-waveform"
  aria-hidden="true"
></canvas>

<style>
  .audio-waveform {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
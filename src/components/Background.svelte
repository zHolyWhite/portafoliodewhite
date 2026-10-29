<script>
  import AudioWaveform from "./AudioWaveform.svelte";
</script>

<div class="page-background" aria-hidden="true">
  <div class="background-wallpaper"></div>
  <AudioWaveform />
</div>

<style>
  .page-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    background: #e7e5e9;
  }

  .background-wallpaper {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(
        135deg,
        rgb(255 255 255 / 12%),
        rgb(233 225 242 / 18%)
      ),
      url("/assets/backgrounds/wallpaper.jpg") center / cover no-repeat;
  }
</style>
<script>
  import { onMount } from "svelte";

  const githubUsername = import.meta.env.PUBLIC_GITHUB_USERNAME?.trim();
  const discordUserId = import.meta.env.PUBLIC_DISCORD_USER_ID?.trim();

  const statuses = {
    online: "Online",
    idle: "Idle",
    dnd: "Do not disturb",
    offline: "Offline",
  };

  const activityLabels = {
    0: "Playing",
    1: "Streaming",
    2: "Listening to",
    3: "Watching",
    5: "Competing in",
  };

  let github = null;
  let discord = null;
  let githubLoading = true;
  let discordLoading = true;
  let githubError = "";
  let discordError = "";

  $: discordUser = discord?.discord_user;
  $: discordStatus = discord?.discord_status ?? "offline";
  $: activities = discord?.activities?.filter(
    (activity) => activity.type !== 4 && activity.type !== 2,
  ) ?? [];
  $: customStatus = discord?.activities?.find(
    (activity) => activity.type === 4,
  )?.state;
  $: spotify = discord?.listening_to_spotify ? discord.spotify : null;

  function discordAvatar(user) {
    if (!user) return "";

    if (user.avatar) {
      const extension = user.avatar.startsWith("a_") ? "gif" : "png";
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
    }

    const index = Number((BigInt(user.id) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  onMount(() => {
    const controller = new AbortController();
    let disposed = false;

    async function loadGithub() {
      if (!githubUsername) {
        githubError = "GitHub username is not configured.";
        githubLoading = false;
        return;
      }

      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(githubUsername)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("GitHub profile is temporarily unavailable.");
        }

        const data = await response.json();

        if (!disposed) {
          github = data;
          githubError = "";
        }
      } catch (error) {
        if (!disposed && error.name !== "AbortError") {
          githubError = error.message;
        }
      } finally {
        if (!disposed) githubLoading = false;
      }
    }

    async function loadDiscord() {
      if (!discordUserId || !/^\d+$/.test(discordUserId)) {
        discordError = "A valid Discord user ID is required.";
        discordLoading = false;
        return;
      }

      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${discordUserId}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Discord presence is temporarily unavailable.");
        }

        const payload = await response.json();

        if (!payload.success || !payload.data) {
          throw new Error("Discord presence is unavailable. Join the Lanyard server.");
        }

        if (!disposed) {
          discord = payload.data;
          discordError = "";
        }
      } catch (error) {
        if (!disposed && error.name !== "AbortError") {
          discordError = error.message;
        }
      } finally {
        if (!disposed) discordLoading = false;
      }
    }

    loadGithub();
    loadDiscord();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadDiscord();
      }
    }, 30000);

    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(interval);
    };
  });
</script>

<aside class="profile-widgets" aria-label="Social profiles">
  <article class="profile-widget">
    <header class="widget-header">
      <span class="widget-label">Discord</span>
      <span class="widget-caption">Presence</span>
    </header>

    {#if discordLoading}
      <p class="widget-message" role="status">Loading Discord...</p>
    {:else if discord}
      <a
        class="widget-profile"
        href={`https://discord.com/users/${discordUserId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="widget-avatar-wrapper">
          <img
            class="widget-avatar"
            src={discordAvatar(discordUser)}
            alt=""
            width="44"
            height="44"
            loading="lazy"
          />
          <span
            class="discord-status"
            data-status={discordStatus}
            aria-hidden="true"
          ></span>
        </div>

        <div class="widget-identity">
          <span class="widget-name">
            {discordUser.global_name || discordUser.username}
          </span>
          <span class="widget-detail">
            {statuses[discordStatus] ?? "Unknown"}
          </span>
        </div>

        <span class="widget-arrow" aria-hidden="true">↗</span>
      </a>

      {#if customStatus}
        <p class="widget-custom-status">{customStatus}</p>
      {/if}

      {#if spotify}
        <div class="widget-activity">
          <img
            class="activity-cover"
            src={spotify.album_art_url}
            alt=""
            width="40"
            height="40"
            loading="lazy"
          />

          <div class="widget-identity">
            <span class="activity-label">Listening to Spotify</span>
            <span class="activity-name">{spotify.song}</span>
            <span class="widget-detail">{spotify.artist}</span>
          </div>
        </div>
      {/if}

      {#each activities as activity}
        <div class="widget-activity">
          <div class="activity-marker" aria-hidden="true"></div>

          <div class="widget-identity">
            <span class="activity-label">
              {activityLabels[activity.type] ?? "Activity"}
            </span>
            <span class="activity-name">{activity.name}</span>

            {#if activity.details}
              <span class="widget-detail">{activity.details}</span>
            {/if}

            {#if activity.state}
              <span class="widget-detail">{activity.state}</span>
            {/if}
          </div>
        </div>
      {/each}

      {#if !spotify && activities.length === 0}
        <p class="widget-message">No public activity right now.</p>
      {/if}

      {#if discordError}
        <p class="widget-message" role="status">
          Unable to refresh presence. Showing the last update.
        </p>
      {/if}
    {:else}
      <p class="widget-message" role="status">{discordError}</p>
    {/if}
  </article>

  <article class="profile-widget">
    <header class="widget-header">
      <span class="widget-label">GitHub</span>
      <span class="widget-caption">Profile</span>
    </header>

    {#if githubLoading}
      <p class="widget-message" role="status">Loading GitHub...</p>
    {:else if github}
      <a
        class="widget-profile"
        href={`https://github.com/${encodeURIComponent(githubUsername)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          class="widget-avatar"
          src={github.avatar_url}
          alt=""
          width="44"
          height="44"
          loading="lazy"
        />

        <div class="widget-identity">
          <span class="widget-name">{github.name || github.login}</span>
          <span class="widget-detail">@{github.login}</span>
        </div>

        <span class="widget-arrow" aria-hidden="true">↗</span>
      </a>

      {#if github.bio}
        <p class="widget-bio">{github.bio}</p>
      {/if}

      <dl class="widget-stats">
        <div>
          <dt>Repositories</dt>
          <dd>{github.public_repos}</dd>
        </div>

        <div>
          <dt>Followers</dt>
          <dd>{github.followers}</dd>
        </div>

        <div>
          <dt>Following</dt>
          <dd>{github.following}</dd>
        </div>
      </dl>
    {:else}
      <p class="widget-message" role="status">{githubError}</p>
    {/if}
  </article>
</aside>
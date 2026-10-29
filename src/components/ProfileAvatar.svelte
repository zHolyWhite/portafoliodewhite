<script>
  import { onMount } from "svelte";

  const discordUserId = import.meta.env.PUBLIC_DISCORD_USER_ID?.trim();

  let avatar = "";
  let loading = true;
  let failed = false;

  function getAvatar(user) {
    if (user.avatar) {
      const extension = user.avatar.startsWith("a_") ? "gif" : "png";

      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=512`;
    }

    const index = Number((BigInt(user.id) >> 22n) % 6n);

    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  onMount(() => {
    const controller = new AbortController();
    let disposed = false;

    async function loadAvatar() {
      if (!discordUserId || !/^\d+$/.test(discordUserId)) {
        loading = false;
        failed = true;
        return;
      }

      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${discordUserId}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load Discord profile.");
        }

        const payload = await response.json();

        if (!payload.success || !payload.data?.discord_user) {
          throw new Error("Discord profile is unavailable.");
        }

        if (!disposed) {
          avatar = getAvatar(payload.data.discord_user);
        }
      } catch {
        if (!disposed) failed = true;
      } finally {
        if (!disposed) loading = false;
      }
    }

    void loadAvatar();

    return () => {
      disposed = true;
      controller.abort();
    };
  });
</script>

{#if loading}
  <div
    class="profile-avatar profile-avatar--empty"
    role="status"
    aria-label="Cargando avatar de Discord"
  >
    …
  </div>
{:else if failed || !avatar}
  <div
    class="profile-avatar profile-avatar--empty"
    aria-label="Avatar no disponible"
  >
    z
  </div>
{:else}
  <img
    class="profile-avatar"
    src={avatar}
    alt="Avatar de Discord de zHolyWhite"
    width="240"
    height="240"
    decoding="async"
    on:error={() => (failed = true)}
  />
{/if}
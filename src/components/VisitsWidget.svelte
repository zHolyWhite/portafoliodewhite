<script>
  import { onMount } from "svelte";
  import { supabase } from "../lib/supabase.js";

  const STORAGE_KEY = "portfolio-visit-session";

  let total = null;
  let error = "";

  function getSessionId() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);

      if (
        stored &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stored)
      ) {
        return stored;
      }

      const id = crypto.randomUUID();
      sessionStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch {
      return null;
    }
  }

  onMount(() => {
    let disposed = false;

    async function loadVisits() {
      if (!supabase) {
        error = "El contador todavía no está configurado.";
        return;
      }

      const sessionId = getSessionId();

      try {
        if (sessionId) {
          const result = await supabase.rpc("register_portfolio_visit", {
            p_session_id: sessionId,
          });

          if (result.error) throw result.error;

          if (!disposed) total = String(result.data);
        } else {
          const result = await supabase
            .from("portfolio_stats")
            .select("visits")
            .eq("id", 1)
            .single();

          if (result.error) throw result.error;

          if (!disposed) total = String(result.data.visits);
        }
      } catch {
        if (!disposed) {
          error = "No se pudo cargar el contador.";
        }
      }
    }

    void loadVisits();

    return () => {
      disposed = true;
    };
  });
</script>

<section class="xp-box visits-widget" aria-labelledby="visits-title">
  <h2 id="visits-title" class="xp-box-title">Visitas</h2>

  <div class="xp-box-body visits-body">
    {#if error}
      <p class="community-message" role="status">{error}</p>
    {:else}
      <p class="visits-number" aria-label="Visitas registradas">
        {total === null ? "······" : total.padStart(6, "0")}
      </p>

      <p class="visits-caption">Gracias por pasar por aquí.</p>
    {/if}
  </div>
</section>
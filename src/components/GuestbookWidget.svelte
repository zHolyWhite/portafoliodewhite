<script>
  import { onMount } from "svelte";
  import { supabase } from "../lib/supabase.js";

  const formatter = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  let notes = [];
  let name = "";
  let message = "";
  let website = "";
  let loading = true;
  let saving = false;
  let loadError = "";
  let formError = "";
  let success = "";

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : formatter.format(date);
  }

  async function submitNote() {
    if (saving) return;

    formError = "";
    success = "";

    if (!supabase) {
      formError = "El libro de visitas todavía no está configurado.";
      return;
    }

    if (website) {
      formError = "No se pudo enviar la nota.";
      return;
    }

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (cleanName.length < 2 || cleanName.length > 40) {
      formError = "Escribe un nombre de entre 2 y 40 caracteres.";
      return;
    }

    if (cleanMessage.length < 3 || cleanMessage.length > 500) {
      formError = "La nota debe tener entre 3 y 500 caracteres.";
      return;
    }

    saving = true;

    try {
      const { error } = await supabase.from("guestbook_notes").insert({
        name: cleanName,
        message: cleanMessage,
      });

      if (error) throw error;

      message = "";
      success = "Nota guardada. Aparecerá cuando sea aprobada.";
    } catch {
      formError = "No se pudo guardar la nota. Inténtalo de nuevo.";
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    let disposed = false;

    async function loadNotes() {
      if (!supabase) {
        loadError = "El libro de visitas todavía no está configurado.";
        loading = false;
        return;
      }

      try {
        const { data, error } = await supabase
          .from("guestbook_notes")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;

        if (!disposed) notes = data ?? [];
      } catch {
        if (!disposed) {
          loadError = "No se pudieron cargar las notas.";
        }
      } finally {
        if (!disposed) loading = false;
      }
    }

    void loadNotes();

    return () => {
      disposed = true;
    };
  });
</script>

<section class="xp-box guestbook-widget" aria-labelledby="guestbook-title">
  <h2 id="guestbook-title" class="xp-box-title">Deja una nota</h2>

  <div class="xp-box-body">
    <div class="guestbook-notes">
      {#if loading}
        <p class="community-message" role="status">Cargando notas...</p>
      {:else if loadError}
        <p class="community-message" role="status">{loadError}</p>
      {:else if notes.length === 0}
        <p class="community-message">Todavía no hay notas publicadas.</p>
      {:else}
        {#each notes as note (note.id)}
          <article class="guestbook-note">
            <header class="guestbook-note-header">
              <span class="guestbook-author">{note.name}</span>
              <time datetime={note.created_at}>
                {formatDate(note.created_at)}
              </time>
            </header>

            <p>{note.message}</p>
          </article>
        {/each}
      {/if}
    </div>

    <form class="guestbook-form" on:submit|preventDefault={submitNote}>
      <label class="guestbook-field">
        <span>Nombre</span>
        <input
          type="text"
          bind:value={name}
          minlength="2"
          maxlength="40"
          autocomplete="nickname"
          placeholder="Tu nombre o alias"
          required
        />
      </label>

      <label class="guestbook-field">
        <span>Tu nota</span>
        <textarea
          bind:value={message}
          minlength="3"
          maxlength="500"
          rows="4"
          placeholder="Deja algo por aquí..."
          required
        ></textarea>
      </label>

      <label class="guestbook-trap" aria-hidden="true">
        Website
        <input
          type="text"
          bind:value={website}
          tabindex="-1"
          autocomplete="off"
        />
      </label>

      <div class="guestbook-form-footer">
        <span class="guestbook-counter">{message.length}/500</span>

        <button
          class="guestbook-submit"
          type="submit"
          disabled={saving || !supabase}
        >
          {saving ? "Guardando..." : "Enviar"}
        </button>
      </div>

      <p class="guestbook-moderation">
        Las notas se revisan antes de publicarse.
      </p>

      {#if formError}
        <p class="community-message" role="alert">{formError}</p>
      {/if}

      {#if success}
        <p class="community-message" role="status">{success}</p>
      {/if}
    </form>
  </div>
</section>
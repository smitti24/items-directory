<script lang="ts">
  import { invalidateAll } from "$app/navigation"
  import type { PageProps } from "./$types"
  import ItemGrid from "$lib/components/ItemGrid.svelte"
  import StatusPanel from "$lib/components/StatusPanel.svelte"

  let { data }: PageProps = $props()

  function retry(): void {
    void invalidateAll()
  }
</script>

<svelte:head>
  <title>Items Directory</title>
</svelte:head>

<main class="mx-auto max-w-5xl px-6 py-12">
  <p class="text-sm font-medium tracking-wide text-zinc-500 uppercase">Mr D take-home</p>
  <h1 class="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">Items Directory</h1>
  <p class="mt-2 text-zinc-600">Catalog price. Live prices land in a later phase.</p>

  <section class="mt-8">
    {#if data.ok}
      {#if data.items.length === 0}
        <StatusPanel
          variant="empty"
          title="No items found"
          message="Nothing in the catalog matches this page."
        />
      {:else}
        <ItemGrid items={data.items} />
        <p class="mt-6 text-sm text-zinc-500">
          Page {data.page} of {data.totalPages} · {data.total} items
        </p>
      {/if}
    {:else}
      <StatusPanel
        variant="error"
        title="Catalog unavailable"
        message={data.message}
        actionLabel="Retry"
        onaction={retry}
      />
    {/if}
  </section>
</main>

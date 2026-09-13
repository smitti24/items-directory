<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import { page } from "$app/state"
  import { onDestroy } from "svelte"
  import type { PageProps } from "./$types"
  import ItemGrid from "$lib/components/ItemGrid.svelte"
  import StatusPanel from "$lib/components/StatusPanel.svelte"
  import { debounce } from "$lib/utils/debounce"

  const SEARCH_DEBOUNCE_MS: number = 300

  let { data }: PageProps = $props()

  const urlQ: string = $derived(page.url.searchParams.get("q") ?? "")
  let draftQ: string = $state(page.url.searchParams.get("q") ?? "")

  $effect((): void => {
    draftQ = urlQ
  })

  const runSearch: ReturnType<typeof debounce<[string]>> = debounce((value: string): void => {
    const href: string = value === "" ? "/" : `/?${new URLSearchParams({ q: value }).toString()}`
    void goto(href, { replaceState: true, keepFocus: true, noScroll: true })
  }, SEARCH_DEBOUNCE_MS)

  onDestroy((): void => {
    runSearch.cancel()
  })

  function onSearchInput(event: Event): void {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement
    draftQ = target.value
    runSearch(draftQ)
  }

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

  <label class="mt-8 block max-w-xl">
    <span class="mb-1 block text-sm font-medium text-zinc-700">Search</span>
    <input
      type="search"
      class="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
      placeholder="Name, merchant or tag"
      value={draftQ}
      oninput={onSearchInput}
    />
  </label>

  <section class="mt-8">
    {#if data.ok}
      {#if data.items.length === 0}
        <StatusPanel
          variant="empty"
          title="No items found"
          message="Nothing in the catalog matches this search."
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

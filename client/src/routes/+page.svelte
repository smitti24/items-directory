<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import { page } from "$app/state"
  import { onDestroy } from "svelte"
  import { CATEGORIES, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SORT } from "@items-directory/shared"
  import type { PageProps } from "./$types"
  import { catalogHref } from "$lib/catalog-href"
  import type { CatalogQuery } from "$lib/catalog-href"
  import ItemGrid from "$lib/components/ItemGrid.svelte"
  import StatusPanel from "$lib/components/StatusPanel.svelte"
  import { debounce } from "$lib/utils/debounce"

  const SEARCH_DEBOUNCE_MS: number = 300
  const selectClass: string = "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"

  const sortChoices: { value: string; label: string }[] = [
    { value: "popularity:desc", label: "Popularity" },
    { value: "name:asc", label: "Name A–Z" },
    { value: "name:desc", label: "Name Z–A" },
    { value: "price:asc", label: "Catalog price: low to high" },
    { value: "price:desc", label: "Catalog price: high to low" }
  ]

  let { data }: PageProps = $props()

  const q: string = $derived(page.url.searchParams.get("q") ?? "")
  const category: string = $derived(page.url.searchParams.get("category") ?? "")
  const sort: string = $derived(page.url.searchParams.get("sort") ?? DEFAULT_SORT)
  const order: string = $derived(page.url.searchParams.get("order") ?? DEFAULT_ORDER)
  const currentPage: number = $derived(
    Number(page.url.searchParams.get("page") ?? DEFAULT_PAGE) || DEFAULT_PAGE
  )
  const sortValue: string = $derived(`${sort}:${order}`)

  let draftQ: string = $state(page.url.searchParams.get("q") ?? "")

  $effect((): void => {
    draftQ = q
  })

  const runSearch: ReturnType<typeof debounce<[string]>> = debounce((value: string): void => {
    go(hrefFrom({ q: value, page: DEFAULT_PAGE }), true)
  }, SEARCH_DEBOUNCE_MS)

  onDestroy((): void => {
    runSearch.cancel()
  })

  function hrefFrom(overrides: Partial<CatalogQuery>): string {
    return catalogHref({
      q,
      category,
      sort,
      order,
      page: currentPage,
      ...overrides
    })
  }

  function go(href: string, replaceState: boolean): void {
    void goto(href, { replaceState, keepFocus: true, noScroll: true })
  }

  function onSearchInput(event: Event): void {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement
    draftQ = target.value
    runSearch(draftQ)
  }

  function onCategoryChange(event: Event): void {
    const target: HTMLSelectElement = event.currentTarget as HTMLSelectElement
    go(hrefFrom({ category: target.value, page: DEFAULT_PAGE }), false)
  }

  function onSortChange(event: Event): void {
    const target: HTMLSelectElement = event.currentTarget as HTMLSelectElement
    const [nextSort, nextOrder]: string[] = target.value.split(":")
    go(
      hrefFrom({
        sort: nextSort ?? DEFAULT_SORT,
        order: nextOrder ?? DEFAULT_ORDER,
        page: DEFAULT_PAGE
      }),
      false
    )
  }

  function onPageChange(nextPage: number): void {
    go(hrefFrom({ page: nextPage }), false)
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
  <p class="mt-2 text-zinc-600">Search the catalog. Cards show live price and delivery when a Quote is available.</p>

  <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <label class="block sm:col-span-2 lg:col-span-1">
      <span class="mb-1 block text-sm font-medium text-zinc-700">Search</span>
      <input
        type="search"
        class="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
        placeholder="Name, merchant or tag"
        value={draftQ}
        oninput={onSearchInput}
      />
    </label>
    <label class="block">
      <span class="mb-1 block text-sm font-medium text-zinc-700">Category</span>
      <select class={selectClass} value={category} onchange={onCategoryChange}>
        <option value="">All categories</option>
        {#each CATEGORIES as option (option)}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </label>
    <label class="block">
      <span class="mb-1 block text-sm font-medium text-zinc-700">Sort</span>
      <select class={selectClass} value={sortValue} onchange={onSortChange}>
        {#each sortChoices as choice (choice.value)}
          <option value={choice.value}>{choice.label}</option>
        {/each}
      </select>
    </label>
  </div>

  {#if sort === "price"}
    <p class="mt-3 text-sm text-zinc-500">Sorted on catalog price. Live prices may differ.</p>
  {/if}

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
      {#if data.totalPages > 1}
        <nav class="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            class="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:text-zinc-400"
            disabled={data.page <= 1}
            onclick={(): void => onPageChange(data.page - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            class="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:text-zinc-400"
            disabled={data.page >= data.totalPages}
            onclick={(): void => onPageChange(data.page + 1)}
          >
            Next
          </button>
        </nav>
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

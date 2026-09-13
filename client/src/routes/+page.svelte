<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation"
  import { navigating, page } from "$app/state"
  import { onDestroy } from "svelte"
  import {
    CATEGORIES,
    DEFAULT_ORDER,
    DEFAULT_PAGE,
    DEFAULT_SORT
  } from "@items-directory/shared"
  import type { PageProps } from "./$types"
  import { catalogHref } from "$lib/catalog-href"
  import type { CatalogQuery } from "$lib/catalog-href"
  import ItemGrid from "$lib/components/ItemGrid.svelte"
  import StatusPanel from "$lib/components/StatusPanel.svelte"
  import { debounce } from "$lib/utils/debounce"

  const SEARCH_DEBOUNCE_MS: number = 300
  const skeletonSlots: number[] = [0, 1, 2, 3, 4, 5]

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
  const isBusy: boolean = $derived(navigating.to !== null)
  const showSkeletons: boolean = $derived(isBusy && !(data.ok && data.items.length > 0))
  const emptyQuery: string = $derived(q === "" ? "this search" : `“${q}”`)

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

  function clearFilters(): void {
    go(
      catalogHref({
        q: "",
        category: "",
        sort,
        order,
        page: DEFAULT_PAGE
      }),
      false
    )
  }

  function retry(): void {
    void invalidateAll()
  }
</script>

<svelte:head>
  <title>Items Directory</title>
</svelte:head>

<main class="flex flex-col gap-8">
  <header>
    <p class="mb-2 text-[12px] font-bold tracking-[0.1em] text-mrd-ink-400 uppercase">Mr D take-home</p>
    <h1 class="mb-2 text-[32px] font-extrabold tracking-tight text-mrd-ink-900">Items Directory</h1>
    <p class="m-0 text-mrd-ink-500">
      Search the catalog. Cards show availability, price, and delivery estimate when a Quote is
      available.
    </p>
  </header>

  <div
    class="grid grid-cols-1 items-end gap-3 min-[721px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
  >
    <label class="flex min-w-0 flex-col gap-2">
      <span class="text-[13px] font-semibold text-mrd-ink-700">Search</span>
      <input
        type="search"
        class="h-[46px] w-full rounded-pill border border-mrd-line-strong bg-mrd-surface px-4 font-medium text-mrd-ink-900 placeholder:font-normal placeholder:text-mrd-ink-400 hover:border-mrd-ink-400 focus:border-mrd-sky focus:shadow-[0_0_0_3px_rgba(110,207,245,0.55)] focus:outline-none"
        placeholder="Name, merchant or tag"
        value={draftQ}
        oninput={onSearchInput}
      />
    </label>
    <label class="flex min-w-0 flex-col gap-2">
      <span class="text-[13px] font-semibold text-mrd-ink-700">Category</span>
      <select
        class="select-chevron h-[46px] w-full cursor-pointer rounded-pill border border-mrd-line-strong bg-mrd-surface px-4 pr-8 font-medium text-mrd-ink-900 hover:border-mrd-ink-400 focus:border-mrd-sky focus:shadow-[0_0_0_3px_rgba(110,207,245,0.55)] focus:outline-none"
        value={category}
        onchange={onCategoryChange}
      >
        <option value="">All categories</option>
        {#each CATEGORIES as option (option)}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </label>
    <label class="flex min-w-0 flex-col gap-2">
      <span class="text-[13px] font-semibold text-mrd-ink-700">Sort</span>
      <select
        class="select-chevron h-[46px] w-full cursor-pointer rounded-pill border border-mrd-line-strong bg-mrd-surface px-4 pr-8 font-medium text-mrd-ink-900 hover:border-mrd-ink-400 focus:border-mrd-sky focus:shadow-[0_0_0_3px_rgba(110,207,245,0.55)] focus:outline-none"
        value={sortValue}
        onchange={onSortChange}
      >
        {#each sortChoices as choice (choice.value)}
          <option value={choice.value}>{choice.label}</option>
        {/each}
      </select>
    </label>
  </div>

  {#if sort === "price"}
    <p class="m-0 text-mrd-ink-500">Sorted on catalog price. Live prices may differ.</p>
  {/if}

  <section class="flex flex-col gap-8">
    {#if showSkeletons}
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {#each skeletonSlots as slot (slot)}
          <article
            class="flex flex-col gap-2 rounded-lg border border-mrd-line bg-mrd-surface p-4 shadow-card"
            aria-hidden="true"
          >
            <div class="skeleton" style="width:35%;height:12px"></div>
            <div class="skeleton" style="width:70%;height:20px"></div>
            <div class="skeleton" style="width:45%;height:14px"></div>
            <div class="skeleton" style="width:30%;height:26px;margin-top:16px"></div>
          </article>
        {/each}
      </div>
    {:else if data.ok}
      {#if data.items.length === 0}
        <StatusPanel
          variant="empty"
          title="No items found"
          message="No results for {emptyQuery}."
          actionLabel="Clear filters"
          onaction={clearFilters}
        />
      {:else}
        <ItemGrid items={data.items} highlight={q} busy={isBusy} />
      {/if}
      {#if data.totalPages > 0}
        <nav class="flex items-center justify-between gap-4">
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-pill border border-mrd-line-strong bg-mrd-surface px-6 text-[13px] font-bold text-mrd-ink-900 hover:border-mrd-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={data.page <= 1}
            onclick={(): void => onPageChange(data.page - 1)}
          >
            Previous
          </button>
          <p class="text-[13px] text-mrd-ink-500" role="status">
            Page {data.page} of {data.totalPages} · {data.total} items
          </p>
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-pill border border-mrd-line-strong bg-mrd-surface px-6 text-[13px] font-bold text-mrd-ink-900 hover:border-mrd-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
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

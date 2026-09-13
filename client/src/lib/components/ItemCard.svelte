<script lang="ts">
  import type { Item } from "@items-directory/shared"
  import { formatRand } from "$lib/format-price"

  type ItemCardProps = {
    item: Item
    highlight: string
  }

  let { item, highlight }: ItemCardProps = $props()

  const cardClass: string =
    "flex flex-col gap-2 rounded-lg border border-mrd-line bg-mrd-surface p-4 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
  const badgeClass: string =
    "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[12px] font-bold before:size-1.5 before:rounded-full before:bg-current before:content-['']"
  const priceClass: string = "text-[22px] font-extrabold tracking-tight text-mrd-ink-900"
  const stalePriceClass: string = "text-[22px] font-extrabold tracking-tight text-mrd-ink-400"

  function tagIsMatch(tag: string): boolean {
    const tokens: string[] = highlight
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token: string): boolean => token.length > 0)

    const word: string = tag.toLowerCase()
    return tokens.some((token: string): boolean => word.startsWith(token))
  }
</script>

<article class={cardClass}>
  <span class="text-[12px] font-bold tracking-[0.08em] text-mrd-ink-400 uppercase">
    {item.category}
  </span>
  <h3 class="m-0 text-[17px] font-bold tracking-tight text-mrd-ink-900">{item.name}</h3>
  <span class="text-[13px] text-mrd-ink-500">{item.merchant}</span>
  <div class="mt-auto flex flex-wrap items-center gap-2 pt-3">
    {#if item.quote?.status === "available"}
      <span class={priceClass}>{formatRand(item.quote.price)}</span>
      <span class="{badgeClass} bg-mrd-green-50 text-mrd-green-600">Available</span>
      <span class="text-[13px] font-semibold text-mrd-ink-500">{item.quote.etaMinutes} min</span>
    {:else if item.quote?.status === "sold_out"}
      <span class={stalePriceClass}>{formatRand(item.basePrice)}</span>
      <span class="{badgeClass} bg-mrd-page text-mrd-ink-500">Sold out</span>
    {:else}
      <span class={stalePriceClass}>{formatRand(item.basePrice)}</span>
      <span class="{badgeClass} bg-mrd-amber-50 text-mrd-amber-600">Price unavailable</span>
    {/if}
  </div>
  <div class="flex flex-wrap gap-1">
    {#each item.tags as tag (tag)}
      <span
        class={tagIsMatch(tag)
          ? "rounded-pill bg-mrd-sky-100 px-2.5 py-1 text-[12px] font-semibold text-mrd-ink-900"
          : "rounded-pill bg-mrd-page px-2.5 py-1 text-[12px] font-semibold text-mrd-ink-500"}
      >
        {tag}
      </span>
    {/each}
  </div>
</article>

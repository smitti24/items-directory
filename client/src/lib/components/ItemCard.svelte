<script lang="ts">
  import type { Item } from "@items-directory/shared"
  import { formatRand } from "$lib/format-price"

  type ItemCardProps = {
    item: Item
  }

  let { item }: ItemCardProps = $props()
</script>

<article class="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
  <div class="space-y-2 p-4">
    <p class="text-xs font-medium tracking-wide text-zinc-500 uppercase">{item.category}</p>
    <h2 class="text-base font-semibold text-zinc-900">{item.name}</h2>
    <p class="text-sm text-zinc-600">{item.merchant}</p>
    {#if item.quote?.status === "available"}
      <p class="text-sm font-medium text-zinc-900">{formatRand(item.quote.price)}</p>
      <p class="text-sm text-zinc-500">Available · {item.quote.etaMinutes} min</p>
    {:else if item.quote?.status === "sold_out"}
      <p class="text-sm font-medium text-red-700">Sold out</p>
    {:else}
      <p class="text-sm text-zinc-600">{formatRand(item.basePrice)}</p>
    {/if}
    <ul class="flex flex-wrap gap-1">
      {#each item.tags as tag (tag)}
        <li class="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{tag}</li>
      {/each}
    </ul>
  </div>
</article>

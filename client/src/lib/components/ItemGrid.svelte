<script lang="ts">
  import type { Item } from "@items-directory/shared"
  import ItemCard from "./ItemCard.svelte"

  type ItemGridProps = {
    items: Item[]
    highlight: string
  }

  let { items, highlight }: ItemGridProps = $props()
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
  {#each items as item (item.id)}
    <ItemCard {item} {highlight} />
  {/each}
</div>

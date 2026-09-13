<script lang="ts">
  import type { CatalogItem } from "@items-directory/shared"
  import ItemCard from "./ItemCard.svelte"

  type ItemGridProps = {
    items: CatalogItem[]
  }

  let { items }: ItemGridProps = $props()
</script>

<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each items as item (item.id)}
    <li>
      <ItemCard {item} />
    </li>
  {/each}
</ul>

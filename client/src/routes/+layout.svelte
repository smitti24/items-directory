<script lang="ts">
  import type { Snippet } from "svelte"
  import favicon from "$lib/assets/favicon.svg"
  import "./layout.css"

  type LayoutProps = {
    children: Snippet
  }

  let { children }: LayoutProps = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

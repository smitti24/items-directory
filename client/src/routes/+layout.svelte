<script lang="ts">
  import type { Snippet } from "svelte"
  import favicon from "$lib/assets/favicon.svg"
  import logo from "$lib/assets/mr-d.png"
  import "./layout.css"

  type LayoutProps = {
    children: Snippet
  }

  let { children }: LayoutProps = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="flex items-center gap-4 border-b border-mrd-line bg-mrd-surface px-6 py-3 text-mrd-ink-900">
  <span class="text-[17px] font-extrabold tracking-tight">Items Directory</span>
  <img src={logo} alt="Mr D" class="ml-auto h-10 w-10 rounded-sm" />
</header>

<div class="mx-auto max-w-[1120px] px-6 py-8 pb-12">
  {@render children()}
</div>

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

<header class="flex items-center gap-4 border-b border-mrd-line bg-mrd-surface px-6 py-3 text-mrd-ink-900">
  <span
    class="inline-flex items-center gap-2 text-[17px] font-extrabold tracking-tight before:size-[22px] before:rounded-[7px] before:bg-mrd-sky before:content-['']"
  >
    Items Directory
  </span>
  <span class="ml-auto text-[13px] text-mrd-ink-500">Search & discovery</span>
</header>

<div class="mx-auto max-w-[1120px] px-6 py-8 pb-12">
  {@render children()}
</div>

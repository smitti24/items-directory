<script lang="ts">
  type StatusVariant = "empty" | "error"

  type StatusPanelProps = {
    variant: StatusVariant
    title: string
    message: string
    actionLabel?: string
    onaction?: () => void
  }

  let { variant, title, message, actionLabel, onaction }: StatusPanelProps = $props()

  const ghostBtnClass: string =
    "inline-flex h-11 items-center justify-center rounded-pill px-6 text-[13px] font-bold text-mrd-sky-700 hover:bg-mrd-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
</script>

{#if variant === "empty"}
  <div class="rounded-lg border border-mrd-line bg-mrd-surface px-6 py-12 text-center text-mrd-ink-500">
    <p class="font-bold text-mrd-ink-900">{title}</p>
    <p>{message}</p>
    {#if actionLabel !== undefined && onaction !== undefined}
      <button type="button" class={ghostBtnClass} onclick={onaction}>
        {actionLabel}
      </button>
    {/if}
  </div>
{:else}
  <div
    class="flex items-start gap-3 rounded-md border border-mrd-line border-l-4 border-l-mrd-red-600 bg-mrd-surface px-4 py-3 text-[13px] text-mrd-ink-700"
    role="status"
  >
    <span>
      <span class="font-bold text-mrd-ink-900">{title}</span>
      {message}
      {#if actionLabel !== undefined && onaction !== undefined}
        <button type="button" class={ghostBtnClass} onclick={onaction}>
          {actionLabel}
        </button>
      {/if}
    </span>
  </div>
{/if}

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
</script>

<div
  class="rounded-xl border px-5 py-6 {variant === 'error'
    ? 'border-red-200 bg-red-50'
    : 'border-zinc-200 bg-zinc-50'}"
>
  <h2 class="text-base font-semibold text-zinc-900">{title}</h2>
  <p class="mt-1 text-sm text-zinc-600">{message}</p>
  {#if actionLabel !== undefined && onaction !== undefined}
    <button
      type="button"
      class="mt-4 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
      onclick={onaction}
    >
      {actionLabel}
    </button>
  {/if}
</div>

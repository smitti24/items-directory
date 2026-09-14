export type Debounced = {
  run: (value: string) => void
  cancel: () => void
}

export function debounce(fn: (value: string) => void, waitMs: number): Debounced {
  let timer: number = 0

  function run(value: string): void {
    clearTimeout(timer)
    timer = window.setTimeout((): void => {
      fn(value)
    }, waitMs)
  }

  function cancel(): void {
    clearTimeout(timer)
  }

  return { run, cancel }
}

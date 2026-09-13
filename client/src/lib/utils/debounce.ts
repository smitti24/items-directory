export type Debounced<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number
): Debounced<TArgs> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const run: Debounced<TArgs> = (...args: TArgs): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
    }

    timer = setTimeout((): void => {
      timer = undefined
      fn(...args)
    }, waitMs)
  }

  run.cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  return run
}

import type { PageLoad } from "./$types"
import { fetchItemPage } from "$lib/api/items"
import type { ItemsLoadResult } from "$lib/api/items"

export const load: PageLoad = async ({ fetch }): Promise<ItemsLoadResult> => {
  return fetchItemPage(fetch)
}

import type { Customer, CustomerData } from './api/customers'
import useCommerceCustomer from './commerce/use-customer'
import type { HookFetcher } from './commerce/utils/types'
import type { SwrOptions } from './commerce/utils/use-data'

const defaultOpts = {
  url: '/api/bigcommerce/customers',
  method: 'GET',
}

export type { Customer }

export const fetcher: HookFetcher<Customer | null> = async (
  options,
  _,
  fetch
) => {
  // Use a dummy base as we only care about the relative path
  const url = new URL(options?.url ?? defaultOpts.url, 'http://a')
  const data = await fetch<CustomerData | null>({
    ...defaultOpts,
    ...options,
    url: (options?.base || '') + url.pathname,
  })
  return data?.customer ?? null
}

export function extendHook(
  customFetcher: typeof fetcher,
  swrOptions?: SwrOptions<Customer | null>
) {
  const useCustomer = () => {
    return useCommerceCustomer(defaultOpts, [], customFetcher, {
      revalidateOnFocus: false,
      ...swrOptions,
    })
  }

  useCustomer.extend = extendHook

  return useCustomer
}

export default extendHook(fetcher)

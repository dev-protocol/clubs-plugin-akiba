/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { ExchangerateRateAPIResponse } from '../types'

const cache = new Map<string, Promise<ExchangerateRateAPIResponse>>()
export const ExchangeRateAPICache = async (endpoint: string) => {
	const fromCache = cache.get(endpoint)
	if (fromCache) return fromCache

	const api = fetch(endpoint).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch exchange rate: ${res.statusText}`)
		}
		return res.json() as Promise<ExchangerateRateAPIResponse>
	})
	cache.set(endpoint, api)
	return api
}

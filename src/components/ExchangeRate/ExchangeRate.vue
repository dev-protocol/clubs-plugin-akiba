<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ExchangerateRateAPIResponse } from '../../types'
import { ExchangeRateAPICache } from '../../utils/api-store'

const { PUBLIC_EXCHANGE_RATE_API_KEY } = import.meta.env

const {
	amount,
	from,
	to,
	multiplier = 1.02,
	prefix,
	postfix,
	loadingClass,
} = defineProps<{
	amount: number
	from: keyof ExchangerateRateAPIResponse['conversion_rates']
	to: keyof ExchangerateRateAPIResponse['conversion_rates']
	multiplier?: number
	prefix?: string
	postfix?: string
	loadingClass?: string
}>()

const exchangedAmount = ref<number>()

onMounted(async () => {
	const data = await ExchangeRateAPICache(
		`https://v6.exchangerate-api.com/v6/${PUBLIC_EXCHANGE_RATE_API_KEY}/latest/${to}`,
	)
	exchangedAmount.value =
		(amount / data.conversion_rates[from]) * (multiplier ?? 1)
})
</script>

<template>
	<span v-if="exchangedAmount !== undefined">
		{{ prefix ?? '' }}{{ exchangedAmount.toFixed(2) }}{{ postfix ?? '' }}
	</span>
	<span
		v-else
		class="inline-block animate-pulse rounded-md bg-gray-300 text-transparent"
		:class="loadingClass"
		>.</span
	>
</template>

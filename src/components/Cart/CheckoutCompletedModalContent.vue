<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { i18nFactory } from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'

const props = defineProps<{
	detail?: any
	onClose?: () => void
}>()

// i18n 初期化
const i18nBase = i18nFactory(Strings)
const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
})
</script>

<template>
	<div class="max-w-md rounded-xl bg-white p-6 text-black shadow">
		<div class="mb-3 flex items-center gap-3">
			<svg
				class="h-6 w-6 text-green-600"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M9 12l2 2 4-4"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
				/>
			</svg>
			<h3 class="text-lg font-bold">{{ i18n('CheckoutCompletedTitle') }}</h3>
		</div>
		<p class="text-sm text-gray-700">
			{{ i18n('CheckoutCompletedMessage') }}
		</p>
		<div
			v-if="props.detail?.orderId || props.detail?.order_id"
			class="mt-2 text-xs text-gray-600"
		>
			{{ i18n('OrderID') }}:
			{{ props.detail?.orderId ?? props.detail?.order_id }}
		</div>

		<div class="mt-4 text-right">
			<button
				type="button"
				class="rounded bg-black px-4 py-2 text-white"
				@click="props.onClose?.()"
			>
				{{ i18n('Close') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { i18nFactory } from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'

import { computed } from 'vue'

const props = defineProps<{
	detail?: any
	onClose?: () => void
}>()

const images = computed(() => {
	const list: string[] = []
	const d: any = props.detail ?? {}

	const pushIf = (v?: unknown) => {
		if (typeof v === 'string' && v) list.push(v)
	}

	if (Array.isArray(d.items)) {
		d.items.forEach((it: any) =>
			pushIf(
				it?.image ??
					it?.itemImageSrc ??
					it?.props?.itemImageSrc ??
					it?.props?.itemImage ??
					it?.props?.image,
			),
		)
	}
	if (Array.isArray(d.passportItems)) {
		d.passportItems.forEach((it: any) =>
			pushIf(
				it?.props?.itemImageSrc ??
					it?.itemImageSrc ??
					it?.props?.itemImage ??
					it?.props?.image ??
					it?.image,
			),
		)
	}
	if (Array.isArray(d.bundledPassportItems)) {
		d.bundledPassportItems.forEach((it: any) =>
			pushIf(
				it?.props?.itemImageSrc ??
					it?.itemImageSrc ??
					it?.props?.itemImage ??
					it?.props?.image ??
					it?.image,
			),
		)
	}

	if (Array.isArray(d.images)) {
		d.images.forEach((src: any) => pushIf(src))
	}

	pushIf(d?.passportItem?.props?.itemImageSrc)
	pushIf(d?.itemImageSrc ?? d?.image)

	return Array.from(new Set(list)).slice(0, 6)
})

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

		<!-- 購入アイテム画像 -->
		<div v-if="images.length" class="mt-4">
			<div
				class="grid gap-2"
				:class="{
					'grid-cols-1': images.length === 1,
					'grid-cols-2': images.length === 2,
					'grid-cols-3': images.length >= 3,
				}"
			>
				<img
					v-for="(src, idx) in images"
					:key="src + '-' + idx"
					:src="src"
					alt="Purchased item"
					class="mx-auto h-24 w-24 rounded border object-cover"
				/>
			</div>
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

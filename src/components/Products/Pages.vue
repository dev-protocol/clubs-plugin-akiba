<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlobalConfig, Product } from '../../types.ts'
import type { CheckoutItemPassportOffering } from '@devprotocol/clubs-plugin-passports'
import { Media } from '@devprotocol/clubs-plugin-passports/vue'
import { CartButton } from '@devprotocol/clubs-plugin-payments/components'
import {
	bytes32Hex,
	i18nFactory,
	markdownToHtml,
	ProseTextInherit,
} from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'
import Clip from '../Clips/Clip.vue'
import List from './List.vue'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	product: CheckoutItemPassportOffering
	products: Product[]
	bundledProducts: Product[]
	base: string
}

const {
	langs: _langs,
	globalConfig,
	product,
	products,
	bundledProducts,
	base,
} = defineProps<Props>()

const langs = ref(_langs)

const i18n = computed(() =>
	i18nFactory({ ...product.props.offering.i18n, ...Strings })(langs.value),
)
const descriptionHtml = computed(() => {
	return markdownToHtml(i18n.value('description'))
})
const price = computed(() => {
	const yen = product.props.fiat?.price.yen
	const unpriced = product.props.notForSale
	return {
		currency: yen && !unpriced ? '￥' : undefined,
		price: yen && !unpriced ? yen : undefined,
	}
})
const setsIncludingThis = computed(() => {
	return products.filter((item) =>
		(item.product.props.offering.bundle ?? []).find(
			(payl) => bytes32Hex(payl) === product.payload,
		),
	)
})

onMounted(() => {
	langs.value = [...navigator.languages]
})
</script>

<template>
	<div
		class="grid grid-cols-1 gap-6 lg:grid-cols-[calc(60%-calc(var(--spacing)_*_6_/_2))_calc(40%-calc(var(--spacing)_*_6_/_2))]"
	>
		<div class="flex justify-between lg:col-span-2">
			<img :src="globalConfig.logo" alt="Logo" class="max-w-80" />
		</div>

		<div class="flex flex-col gap-3">
			<Media
				:item="product.props.passportItem"
				video-class="w-full max-w-full object-cover aspect-square"
				class="rounded"
			/>
			<div
				v-if="
					product.props.offering.previewImages &&
					product.props.offering.previewImages.length > 0
				"
				class="grid grid-cols-3 gap-3"
			>
				<Media
					v-for="value in product.props.offering.previewImages"
					:item="{ itemAssetType: 'image-link', itemAssetValue: value }"
				/>
			</div>
		</div>

		<div class="flex flex-col gap-5">
			<h1>
				<span class="text-xl font-bold">{{ i18n('name') }}</span>
			</h1>
			<div class="text-sky-800">
				<span>{{ price.currency }}</span
				><span class="text-2xl font-bold">{{ price.price }}</span>
			</div>
			<span
				class="[&_button]:rounded-full! [&_button]:text-xl! lg:[&_button]:text-3xl!"
			>
				<CartButton :base="base" :payload="product.payload" :quantity="1" />
			</span>
			<h2 class="-mb-3">
				<span class="text-sm font-bold text-gray-500">{{
					i18n('Description')
				}}</span>
			</h2>
			<span class="text-gray-700">
				<div v-html="descriptionHtml" :class="ProseTextInherit"></div>
			</span>
			<span class="text-gray-500">
				<div
					v-html="i18n('Copyrights')"
					:class="ProseTextInherit"
					class="text-xs"
				></div>
			</span>
		</div>

		<div
			v-if="bundledProducts && bundledProducts.length > 0"
			class="grid content-start gap-2.5 rounded-xl bg-teal-50 p-3 lg:col-span-2 lg:gap-5 lg:p-8"
		>
			<span class="text-xl font-bold text-teal-500 lg:text-3xl"
				>{{ i18n('BundledProducts') }}:</span
			>
			<List
				:products="bundledProducts"
				:langs="langs"
				:exclude-link-when-not-available="true"
			/>
		</div>

		<div
			v-if="setsIncludingThis && setsIncludingThis.length > 0"
			class="grid content-start gap-2.5 rounded-xl bg-neutral-100 p-3 lg:col-span-2 lg:gap-5 lg:p-8"
		>
			<span class="text-xl font-bold text-neutral-500 lg:text-3xl"
				>{{ i18n('SetsIncludingThis') }}:</span
			>
			<List :products="setsIncludingThis" :langs="langs" />
		</div>

		<div
			v-if="products && products.length > 0"
			class="grid gap-2.5 rounded-xl border border-neutral-300 p-3 lg:col-span-2 lg:gap-5 lg:p-8"
		>
			<span class="text-xl font-bold text-neutral-500 lg:text-3xl"
				>{{ i18n('AllProducts') }}:</span
			>
			<List :products="products" :langs="langs" />
		</div>
	</div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
	CategoriesConfig,
	GlobalConfig,
	Product,
	ProductsConfig,
} from '../../types.ts'
import type { CheckoutItemPassportOffering } from '@devprotocol/clubs-plugin-passports'
import { Media } from '@devprotocol/clubs-plugin-passports/vue'
import { CartButton } from '@devprotocol/clubs-plugin-payments/components'
import {
	bytes32Hex,
	ClubsI18nLocale,
	i18nFactory,
	markdownToHtml,
	ProseTextInherit,
} from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'
import List from './List.vue'
import Bg from '../../assets/bg_sticker.png'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	productsConfig?: ProductsConfig
	product: CheckoutItemPassportOffering
	products: Product[]
	bundledProducts: Product[]
	group: Product[]
	categories?: CategoriesConfig
	base: string
}

const {
	langs: _langs,
	globalConfig,
	productsConfig,
	product,
	products,
	bundledProducts,
	group,
	base,
} = defineProps<Props>()

const langs = ref(_langs)

const i18n = computed(() =>
	i18nFactory({ ...product.props.offering.i18n, ...Strings })(langs.value),
)
const i18nInstant = (locale: ClubsI18nLocale) =>
	i18nFactory({ i: locale })(langs.value)('i')
const bgImage = ref(`url(${productsConfig?.productBg ?? Bg.src})`)
const completed = ref(false)
const isNotForSale = computed(() => product.props.notForSale)
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
const gridWidth = computed(() => {
	return (product.props.passportItem.appearance?.grid?.w ?? 1) * 2
})
const gridHeight = computed(() => {
	return (product.props.passportItem.appearance?.grid?.h ?? 1) * 2
})

const onCartButtonComplete = () => {
	completed.value = true
}

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
			<div
				class="grid grid-cols-6 grid-rows-6 rounded"
				:class="{
					'bg-center bg-repeat':
						(productsConfig?.productBgType ?? 'tile') === 'tile',
					'bg-cover bg-center': productsConfig?.productBgType === 'fill',
				}"
				:style="{ '--image': bgImage, backgroundImage: 'var(--image)' }"
			>
				<Media
					v-if="(product.props.offering.bundle ?? []).length === 0"
					:item="product.props.passportItem"
					video-class="w-full max-w-full object-cover aspect-square"
					class="rounded drop-shadow-sm"
					:class="{
						'col-span-2 col-start-3': gridWidth === 2,
						'col-span-4 col-start-2': gridWidth === 4,
						'col-span-6': gridWidth === 6,
						'row-span-2 row-start-3': gridHeight === 2,
						'row-span-4 row-start-2': gridHeight === 4,
						'row-span-6': gridHeight === 6,
					}"
				/>
				<Media
					v-else
					:item="product.props.passportItem"
					video-class="w-full max-w-full object-cover aspect-square"
					class="col-span-6 row-span-6 rounded"
				/>
			</div>
			<div
				v-if="
					product.props.offering.previewImages &&
					product.props.offering.previewImages.length > 0
				"
				class="grid grid-cols-3 gap-3"
			>
				<Media
					v-for="value in product.props.offering.previewImages"
					:item="{
						itemAssetType: 'image-link',
						itemAssetValue:
							typeof value === 'string' ? value : i18nInstant(value),
					}"
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
			<div v-if="group && group.length > 0">
				<ul class="flex gap-2">
					<li v-for="(item, i) in group" :key="i" class="flex-grow">
						<a
							:href="`/products/${item.id}`"
							class="block h-full w-full rounded-xl border py-2 text-center ring-4 transition-shadow"
							:class="{
								'border-sky-600 ring-sky-600/70 hover:ring-sky-800/70':
									product.payload === item.product.payload,
								'border-gray-300 ring-transparent hover:ring-sky-600/30':
									product.payload !== item.product.payload,
							}"
						>
							{{
								i18nInstant(
									item.product.props.offering.i18n.groupVar ??
										item.product.props.offering.i18n.name,
								)
							}}
						</a>
					</li>
				</ul>
			</div>
			<span
				class="[&_button]:rounded-full! [&_button]:text-xl! lg:[&_button]:text-3xl!"
			>
				<CartButton
					v-if="!isNotForSale && !completed"
					:base="base"
					:payload="product.payload"
					:quantity="1"
					:on-complete="onCartButtonComplete"
				/>
				<button
					v-if="isNotForSale"
					class="hs-button is-large is-fullwidth is-filled"
					disabled
				>
					{{ i18n('NotForSale') }}
				</button>
				<a
					v-if="completed"
					class="block rounded-full bg-green-500 px-6 py-3 text-center text-xl font-bold text-white lg:text-3xl"
					:href="`${base}/cart`"
				>
					{{ i18n('ProceedToCheckout') }}
				</a>
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
				:categories="categories"
				:base="base"
			/>
		</div>

		<div
			v-if="setsIncludingThis && setsIncludingThis.length > 0"
			class="grid content-start gap-2.5 rounded-xl bg-neutral-100 p-3 lg:col-span-2 lg:gap-5 lg:p-8"
		>
			<span class="text-xl font-bold text-neutral-500 lg:text-3xl"
				>{{ i18n('SetsIncludingThis') }}:</span
			>
			<List
				:products="setsIncludingThis"
				:langs="langs"
				:categories="categories"
				:base="base"
			/>
		</div>

		<div
			v-if="products && products.length > 0"
			class="grid gap-2.5 rounded-xl border border-neutral-300 p-3 lg:col-span-2 lg:gap-5 lg:p-8"
		>
			<span class="text-xl font-bold text-neutral-500 lg:text-3xl"
				>{{ i18n('AllProducts') }}:</span
			>
			<List
				:products="products"
				:langs="langs"
				:categories="categories"
				:base="base"
			/>
		</div>
	</div>
</template>

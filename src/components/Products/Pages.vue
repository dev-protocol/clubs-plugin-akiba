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
	i18nFactory,
	markdownToHtml,
	ProseTextInherit,
} from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'
import Bg from '../../assets/bg_sticker.png'
import { i18nWith } from '../../utils/i18n.ts'
import ImageI18N from '../Image/ImageI18N.vue'
import { Reason } from '@devprotocol/clubs-plugin-passports/constants'
import { SKIN } from '../../utils/filtering-clips.ts'

type Props = {
	langs: string[]
	globalConfig: GlobalConfig
	productsConfig?: ProductsConfig
	product: CheckoutItemPassportOffering
	group: Product[]
	categories?: CategoriesConfig
	base: string
}

const {
	langs: _langs,
	globalConfig,
	productsConfig,
	product,
	group,
	base,
} = defineProps<Props>()

const langs = ref(_langs)

const i18n = computed(() =>
	i18nFactory({ ...product.props.offering.i18n, ...Strings })(langs.value),
)
const i18nInstant = i18nWith(langs.value)
const bgImage = ref(`url(${productsConfig?.productBg ?? Bg.src})`)
const completed = ref(false)
const isNotForSale = computed(
	() => product.props.notForSale || product.props.available === false,
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
const isSkin = computed(() =>
	SKIN.includes(product.props.passportItem.itemAssetType),
)
const gridWidth = computed(() => {
	return (product.props.passportItem.appearance?.grid?.w ?? 1) * 2
})
const gridHeight = computed(() => {
	return (product.props.passportItem.appearance?.grid?.h ?? 1) * 2
})
const isUnreleased = computed(() => {
	return (
		product.props.available === false &&
		product.props.reason === Reason.Unreleased
	)
})
const itemOffering = computed(() => ({
	...product.props.offering,
	...product.props.passportItem,
}))

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
			<ImageI18N
				:src="globalConfig.logo"
				alt="Logo"
				class="max-w-80"
				:langs="langs"
			/>
		</div>

		<div class="flex flex-col gap-3">
			<div
				class="rounded"
				:class="{
					'grid grid-cols-6 grid-rows-6': !isSkin,
					'bg-center bg-repeat':
						(productsConfig?.productBgType ?? 'tile') === 'tile',
					'bg-cover bg-center': productsConfig?.productBgType === 'fill',
				}"
				:style="{ '--image': bgImage, backgroundImage: 'var(--image)' }"
			>
				<Media
					v-if="(product.props.offering.bundle ?? []).length === 0"
					:item="itemOffering"
					:langs="langs"
					video-class="w-full max-w-full object-cover aspect-square"
					class="rounded drop-shadow-[0_2px_1px_rgb(0_0_0/_0.5)]"
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
					:langs="langs"
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
				><span class="text-2xl font-bold">{{
					isUnreleased ? '-' : price.price
				}}</span>
			</div>
			<div v-if="group && group.length > 0">
				<ul class="flex gap-2">
					<li v-for="(item, i) in group" :key="i" class="flex-grow">
						<a
							:href="`${base}/products/${item.id}`"
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
					{{ i18n('NotForSale', [product.props.reason]) }}
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
	</div>
</template>

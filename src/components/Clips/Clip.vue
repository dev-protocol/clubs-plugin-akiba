<script setup lang="ts">
import { defineProps, onMounted, ref, computed } from 'vue'
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color'
import type { ComposedCheckoutOptions } from '@devprotocol/clubs-plugin-passports'
import { bytes32Hex, i18nFactory } from '@devprotocol/clubs-core'

import Modal from '../Home/Modal.vue'
import ModalContent from './ModalContent.vue'
import { Media } from '@devprotocol/clubs-plugin-passports/vue'

import {
	BGM,
	DIGITAL_CARD,
	SKIN,
	SHORT_CLIP,
	SHORT_VOICE,
	VIDEO,
	getTagName,
	MEDIATYPE_IMAGE,
} from '../../utils/filtering-clips.ts'
import { Strings } from '../../i18n/index.ts'
import type { Product } from '../../types.ts'
import { i18nWith } from '../../utils/i18n.ts'
import { Reason } from '@devprotocol/clubs-plugin-passports/constants'

type Props = {
	composedItem: { payload: string; props: ComposedCheckoutOptions }
	bundledProducts?: Product[]
	groupedProducts?: Product[]
	displayShortDescription?: boolean
	imageBackground?: string
	class?: string
	langs?: string[]
	base: string
}

const {
	composedItem,
	displayShortDescription = false,
	class: className,
	imageBackground,
	langs: _langs = ['en'],
	base,
} = defineProps<Props>()

const isDiscountActive = ref(false)
const mounted = ref<boolean>()
const langs = ref(_langs)
const i18nInstant = i18nWith(langs.value)
const i18nBase = i18nFactory(
	composedItem.props.offering.i18n ?? { name: {}, description: {} },
)
const i18nBaseAkiba = i18nFactory(Strings)
const i18n = ref(i18nBase(['en']))
const i18nAkiba = ref<ReturnType<typeof i18nBaseAkiba>>(i18nBaseAkiba(['en']))

const bgImage = ref(
	imageBackground &&
		!SKIN.includes(composedItem.props.passportItem.itemAssetType)
		? `url(${imageBackground})`
		: undefined,
)

const discountStart = computed(() => {
	return composedItem.props.discount?.start_utc
})

const discountEnd = computed(() => {
	return composedItem.props.discount?.end_utc
})

const shortDescription = computed(() => {
	return displayShortDescription
		? i18n.value('description').slice(0, 120)
		: undefined
})

const image = computed(() => {
	return MEDIATYPE_IMAGE.includes(composedItem.props.passportItem.itemAssetType)
		? composedItem.props.passportItem.itemAssetValue
		: SKIN.includes(composedItem.props.passportItem.itemAssetType)
			? composedItem.props.itemImageSrc
			: composedItem.props.itemImageSrc
})

const tag = computed(() => {
	return composedItem.props.passportItem.itemAssetType
})

const cat = computed(() => {
	return getTagName(composedItem.props)
})

const title = computed(() => {
	return i18n.value('name') ?? composedItem.props.itemName
})

const price = computed(() => {
	return composedItem.props.fiat?.price.yen
})

const currency = computed(() => {
	return '¥'
})

const discountCurrency = computed(() => {
	return '¥'
})

const discountPrice = computed(() => {
	return composedItem.props.discount?.price?.yen
})

const payload = computed(() => {
	return bytes32Hex(composedItem.payload)
})

const isUnreleased = computed(() => {
	return (
		composedItem.props.available === false &&
		composedItem.props.reason === Reason.Unreleased
	)
})

const isNotForSale = computed(() => {
	return composedItem.props.notForSale
})

const isSetOnly = computed(() => {
	return (
		composedItem.props.available === false &&
		composedItem.props.reason === Reason.SetSaleOnly
	)
})

if (discountStart.value && discountEnd.value) {
	const now = new Date().getTime()
	isDiscountActive.value = discountStart.value < now && now < discountEnd.value
}

// modal visibility
const modalVisible = ref(false)

// open modal
const modalOpen = () => {
	// TODO: Remove this modal
	// modalVisible.value = true
}

// close modal
const modalClose = () => {
	modalVisible.value = false
}

const color = ref<FastAverageColorResult>()

onMounted(async () => {
	mounted.value = true
	langs.value = [...navigator.languages]
	i18n.value = i18nBase(langs.value)
	i18nAkiba.value = i18nBaseAkiba(langs.value)

	if (SKIN.includes(tag.value)) {
		const fac = new FastAverageColor()
		color.value = await fac.getColorAsync(image.value || '').catch((e) => {
			console.error(e)
			return undefined
		})
	}
})
</script>

<style scoped>
.gradation {
	position: relative;
}

.gradation::before {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: linear-gradient(0deg, v-bind(color?.hex) 25%, transparent 50%);
}
</style>

<template>
	<a
		:href="`${base}/products/${composedItem.payload.slice(composedItem.payload.length - 8)}`"
		class="flex flex-col gap-1 overflow-hidden rounded border border-gray-300 bg-white p-1 md:gap-2 md:p-2"
		:class="{
			'bg-white':
				DIGITAL_CARD.includes(tag) || BGM.includes(tag) || VIDEO.includes(tag),
			'gradation bg-cover bg-center bg-no-repeat': SKIN.includes(tag),
			[className ?? '']: className,
		}"
		:style="{
			backgroundImage: SKIN.includes(tag) ? `url(${image})` : '',
		}"
		:data-payload="payload"
		@click.stop="modalOpen"
	>
		<div
			class="relative overflow-hidden rounded"
			:style="
				bgImage
					? { '--image': bgImage, backgroundImage: 'var(--image)' }
					: undefined
			"
		>
			<Media
				:key="composedItem.props.passportItem.itemAssetValue"
				:item="composedItem.props.passportItem"
				:langs="langs"
				class="drop-shadow-[0_2px_1px_rgb(0_0_0/_0.5)]"
				:videoClass="`rounded-md w-full max-w-full object-cover aspect-square pointer-events-none`"
			/>
			<div
				v-if="SKIN.includes(tag)"
				class="aspect-square w-full object-cover"
				role="presentation"
			/>
		</div>
		<div class="z-10 flex flex-col gap-1">
			<div class="flex flex-wrap gap-1">
				<div
					class="w-fit rounded px-1.5 py-1 text-xs"
					:class="{
						'bg-[#00F329] text-black': DIGITAL_CARD.includes(tag),
						'bg-[#DB00FF] text-white': SKIN.includes(tag),
						'bg-[#FF5C00] text-white': BGM.includes(tag),
						'bg-[#FF003C] text-white': VIDEO.includes(tag),
						'bg-[#4200FF] text-white': SHORT_CLIP.includes(tag),
						'bg-[#00D4FF] text-black': SHORT_VOICE.includes(tag),
						'bg-[#964910] text-black': cat === 'Set',
					}"
				>
					{{ i18nAkiba(getTagName(composedItem.props)) }}
				</div>
				<div
					v-if="isUnreleased"
					class="rounded bg-neutral-500 px-1.5 py-1 text-xs text-white"
				>
					{{ i18nAkiba('NotForSale', [Reason.Unreleased]) }}
				</div>
				<div
					v-if="isSetOnly"
					class="rounded bg-yellow-500 px-1.5 py-1 text-xs text-black"
				>
					{{ i18nAkiba('NotForSale', [Reason.SetSaleOnly]) }}
				</div>
			</div>
			<div v-if="groupedProducts?.length" class="flex items-center gap-1">
				<span v-if="groupedProducts.length > 1" class="text-xs text-blue-400">{{
					i18nAkiba('Size', [String(groupedProducts.length)])
				}}</span>
				<span
					v-for="(groupedProduct, i) in groupedProducts"
					:key="groupedProduct.id"
					class="max-w-30 truncate overflow-hidden rounded border border-black/10 px-1 py-0.5 text-xs text-ellipsis"
					:class="{
						'border-blue-500 text-blue-500':
							groupedProduct.product.payload === composedItem.payload,
						'border-blue-300 text-zinc-400':
							groupedProduct.product.payload !== composedItem.payload,
					}"
				>
					{{
						i18nInstant(
							groupedProduct.product.props.offering.i18n.groupVar ?? {
								en: `${i + 1}`,
							},
						)
					}}
				</span>
			</div>
			<h3
				class="overflow-hidden font-bold text-nowrap text-ellipsis"
				:class="{
					'text-base':
						DIGITAL_CARD.includes(tag) ||
						BGM.includes(tag) ||
						VIDEO.includes(tag),
					'text-white': SKIN.includes(tag) && color?.isDark,
					'text-black': SKIN.includes(tag) && color?.isLight,
				}"
			>
				{{ title }}
			</h3>
			<div
				class="flex w-full flex-col justify-start gap-0 text-sm"
				:class="{
					'text-gray-800':
						DIGITAL_CARD.includes(tag) ||
						BGM.includes(tag) ||
						VIDEO.includes(tag),
					'text-white': SKIN.includes(tag) && color?.isDark,
					'text-black': SKIN.includes(tag) && color?.isLight,
				}"
				style="--tw-text-opacity: 0.6"
			>
				<p
					v-if="isDiscountActive"
					class="flex gap-1 overflow-hidden text-nowrap text-ellipsis"
				>
					<span class="text-right" :class="{ 'font-bold': isDiscountActive }">
						{{ discountPrice }}
					</span>

					<span class="text-right" :class="{ 'font-bold': isDiscountActive }">
						{{ discountCurrency }}
					</span>
				</p>
				<p
					class="flex gap-1 overflow-hidden text-nowrap text-ellipsis"
					:class="{
						'line-through': isDiscountActive,
					}"
				>
					<span
						class="text-right text-[inherit]"
						:class="{ 'text-sm': isDiscountActive }"
					>
						{{ currency }}
					</span>

					<span
						class="text-right text-[inherit]"
						:class="{
							'text-sm': isDiscountActive,
							'text-gray-300': isUnreleased || isNotForSale,
						}"
					>
						{{ isUnreleased || isNotForSale ? '-' : price }}
					</span>
				</p>
			</div>
			<p
				v-if="shortDescription"
				class="line-clamp-2 overflow-hidden text-sm text-ellipsis text-gray-500"
			>
				{{ shortDescription }}
			</p>
		</div>
		<Modal
			v-if="mounted"
			:is-visible="modalVisible"
			:modal-content="ModalContent"
			:attrs="{
				composedItem: composedItem,
			}"
			@close-event="modalClose"
		/>
	</a>
</template>

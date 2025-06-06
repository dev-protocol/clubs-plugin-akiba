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

type Props = {
	composedItem: { payload: string; props: ComposedCheckoutOptions }
	class?: string
}

const { composedItem, class: className } = defineProps<Props>()

const isDiscountActive = ref(false)
const mounted = ref<boolean>()
const i18nBase = i18nFactory(
	composedItem.props.offering.i18n ?? { name: {}, description: {} },
)
const i18nBaseAkiba = i18nFactory(Strings)
const i18n = ref(i18nBase(['en']))
const i18nAkiba = ref<ReturnType<typeof i18nBaseAkiba>>(i18nBaseAkiba(['en']))

const discountStart = computed(() => {
	return composedItem.props.discount?.start_utc
})

const discountEnd = computed(() => {
	return composedItem.props.discount?.end_utc
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

if (discountStart.value && discountEnd.value) {
	const now = new Date().getTime()
	isDiscountActive.value = discountStart.value < now && now < discountEnd.value
}

// modal visibility
const modalVisible = ref(false)

// open modal
const modalOpen = () => {
	modalVisible.value = true
}

// close modal
const modalClose = () => {
	modalVisible.value = false
}

const color = ref<FastAverageColorResult>()

onMounted(async () => {
	mounted.value = true
	i18n.value = i18nBase(navigator.languages)
	i18nAkiba.value = i18nBaseAkiba(navigator.languages)

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
	<div
		class="flex flex-col gap-1 overflow-hidden rounded border border-gray-300 p-1 shadow md:gap-2 md:p-2"
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
		<div class="relative overflow-hidden rounded">
			<Media
				:key="composedItem.props.passportItem.itemAssetValue"
				:item="composedItem.props.passportItem"
				:videoClass="`rounded-md w-full max-w-full object-cover aspect-square pointer-events-none`"
			/>
			<div
				v-if="SKIN.includes(tag)"
				class="aspect-square w-full object-cover"
				role="presentation"
			/>
		</div>
		<div class="z-10 flex flex-col gap-1">
			<div
				class="w-fit rounded px-1.5 py-1 text-xs"
				:class="{
					'bg-[#00F329] text-black': DIGITAL_CARD.includes(tag),
					'bg-[#DB00FF] text-white': SKIN.includes(tag),
					'bg-[#FF5C00] text-white': BGM.includes(tag),
					'bg-[#FF003C] text-white': VIDEO.includes(tag),
					'bg-[#4200FF] text-white': SHORT_CLIP.includes(tag),
					'bg-[#00D4FF] text-black': SHORT_VOICE.includes(tag),
				}"
			>
				{{ i18nAkiba(getTagName(tag)) }}
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
						:class="{ 'text-sm': isDiscountActive }"
					>
						{{ price }}
					</span>
				</p>
			</div>
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
	</div>
</template>
